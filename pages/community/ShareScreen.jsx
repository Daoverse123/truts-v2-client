import React, { useEffect, useRef, useState } from "react";
import gradstarFilled from "../../assets/icons/star_filled_gradient.svg";
import gradstarBlank from "../../assets/icons/star_blank_gradient.svg";
import styles from "./sharescreen.module.scss";
import html2canvas from "html2canvas";
import axios from "axios";
const P_API = process.env.P_API;

function generateTweet(text, url) {
  var encodedText = encodeURIComponent(text);
  var encodedURL = encodeURIComponent(url);
  var tweetURL =
    "https://twitter.com/intent/tweet?text=" +
    encodedText +
    "&url=" +
    encodedURL;

  // Open the tweet dialog in a new window or tab
  window.open(tweetURL);
}

function ShareScreen({
  slug,
  reviewData,
  closeModal,
  reviewId,
  text,
  address,
  username,
  daoName,
  rating,
  profileImg,
  twitter_link,
}) {
  const captureElementRef = useRef(null);
  const [imgPreview, setimgPreview] = useState("");
  const [loading, setloading] = useState(true);

  const captureAndConvert = async () => {
    const element = captureElementRef.current;
    const canvas = await html2canvas(element);

    const ctx = canvas.getContext("2d");
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width / window.devicePixelRatio;
    scaledCanvas.height = canvas.height / window.devicePixelRatio;
    const scaledCtx = scaledCanvas.getContext("2d");
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    const base64Image = scaledCanvas.toDataURL("image/png");
    console.log(base64Image); // You can use this base64 image as needed
    setimgPreview(base64Image);
    if (base64Image) {
      try {
        let res = await axios.post(`${P_API}/review/${reviewId}/og`, {
          image: base64Image,
        });
        if (res.status === 201) {
          console.log("success");
          setloading(false);
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    captureAndConvert();
  }, []);

  return (
    <div className={styles.sharescreen}>
      <div className={styles.modal}>
        <p
          onClick={() => {
            closeModal();
          }}
          className={styles.closeIcon}
        >
          ✕
        </p>
        <h1>Share Review</h1>
        {/* <p>Tweet about it</p> */}
        <span style={{ position: "absolute", top: "-9999em", left: "-9999em" }}>
          <div ref={captureElementRef} className={styles.share}>
            <RecentReview
              username={username}
              daoName={daoName}
              address={address}
              text={text}
              rating={rating}
              profileImg={profileImg}
            />
          </div>
        </span>
        {/* Image Preview */}
        {imgPreview && (
          <img className={styles.imgPreview} src={imgPreview} alt="" />
        )}
        {!loading && (
          <button
            onClick={() => {
              generateTweet(
                `Check out this review shared about @${
                  twitter_link.split("/")[twitter_link.split("/").length - 1]
                } at @trutsxyz, the best discovery platform for web3!

Try it for yourself and share your experiences today #TrutsReview

WAGMI
`,
                `${window.location.origin}/community/${slug}/${reviewId}`
              );
            }}
          >
            Tweet
          </button>
        )}
        {loading && <button disabled>Generating Image...</button>}
      </div>
    </div>
  );
}

function limitText(count, text) {
  if (!text) return text;
  if (text.length < count) return text;
  let snippedText = text.substring(0, count);
  return snippedText + "...";
}

let GradStarRating = ({ rating, showCount, color, count }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((ele) => {
          let starSrc = ele <= rating ? gradstarFilled.src : gradstarBlank.src;
          return <img alt="" key={"s" + ele} src={starSrc} />;
        })}
      </span>
      {showCount && <p className={styles.rating_count}>({count})</p>}
    </div>
  );
};

function RecentReview({
  text,
  address,
  username,
  daoName,
  rating,
  profileImg,
}) {
  return (
    <div className={styles.recentReview}>
      <div className={styles.user}>
        <img src={`/api/image-proxy?url=${profileImg}` || "/blue.png"} alt="" />
        <span>
          <h1>{address}</h1>
          <p>@{username}</p>
        </span>
      </div>
      <span className={styles.rating}>
        <h1>{daoName}</h1>
        <GradStarRating rating={rating} />
      </span>
      <div className={styles.desc}>
        <p>
          <img src="/quotes.svg" alt="" />
          {limitText(280, text)}
        </p>
      </div>
    </div>
  );
}

export default ShareScreen;
