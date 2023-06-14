import React, { useState, useEffect, useRef } from "react";
import styles from "./og.module.scss";
import html2canvas from "html2canvas";

import gradstarFilled from "../../assets/icons/star_filled_gradient.svg";
import gradstarBlank from "../../assets/icons/star_blank_gradient.svg";
import down_arrow from "../../assets/icons/down_arrow.svg";
import thumbs_up from "../../assets/icons/thumbs_up.svg";
import thumbs_down from "../../assets/icons/thumbs_down.svg";
import share from "../../assets/icons/share_icon.svg";
import tip from "../../assets/icons/tip_icon.svg";
import { useQuery } from "react-query";
import axios from "axios";

import domtoimage from "dom-to-image";

function limitText(count, text) {
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
  const captureElementRef = useRef(null);

  const captureAndConvert = () => {
    const element = captureElementRef.current;

    html2canvas(element).then((canvas) => {
      const base64Image = canvas.toDataURL("image/png");
      console.log(base64Image); // You can use this base64 image as needed
    });
  };

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

function Og({ data }) {
  console.log(data);
  const captureElementRef = useRef(null);

  const captureAndConvert = () => {
    const element = captureElementRef.current;

    html2canvas(element).then((canvas) => {
      const base64Image = canvas.toDataURL("image/png");
      console.log(base64Image); // You can use this base64 image as needed
    });
  };

  return (
    <div ref={captureElementRef} id="page" className={styles.con}>
      <span className={styles.bg}></span>
      <RecentReview
        i={0}
        profileImg={data.review.user?.photo?.secure_url}
        rating={data.review.rating}
        address={data.review.user?.name}
        username={data.review.user?.username || data.review.user?.name}
        daoName={data.review.listing?.dao_name}
        text={data.review.comment}
      />
      <button
        style={{ zIndex: 100 }}
        onClick={() => {
          captureAndConvert();
        }}
      >
        Save
      </button>
    </div>
  );
}

function newGradient() {
  var c1 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  var c2 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  c1.rgb = "rgb(" + c1.r + "," + c1.g + "," + c1.b + ")";
  c2.rgb = "rgb(" + c2.r + "," + c2.g + "," + c2.b + ")";
  return "radial-gradient(at top left, " + c1.rgb + ", " + c2.rgb + ")";
}

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
  let data = await axios.get(
    `${process.env.P_API}/review/6488412f8739960edc76ab94`
  );

  return { props: { data: data.data.data || "" } };
}

export default Og;
