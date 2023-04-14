import React, { useState, useEffect } from "react";
import styles from "./addReview.module.scss";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import openNewTab from "../../utils/openNewTab";
import { useSignMessage } from "wagmi";

const Chains = ["Ethereum", "Solana"];

//assets
import left_arrow from "../../assets/left-arrow.png";
import star_blank_gradient from "../../assets/icons/star_blank_gradient.svg";
import star_filled_gradient from "../../assets/icons/star_filled_gradient.svg";

//components
import Button from "../../components/Button";
import Nav from "../../components/Nav";
import WalletConnect from "../../components/WalletConnect";

const API = process.env.API;
const P_API = process.env.P_API;
const status = { READY: "READY", LOADING: "LOADING", ERROR: "ERROR" };

function AddReview({ id, slug }) {
  const fetchUser = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      let dependency = await axios.get(
        `${process.env.P_API}/user/profile/status`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (dependency.status == 200) {
        let status_data = dependency.data.data.user;
        if (!status_data.discord) {
          let url = encodeURIComponent(`${location.pathname.replace("/", "")}`);
          location.href = `/connect/DISCORD_ACCOUNT/${url}`;
        }
      }
    } else {
      alert("Please Log-in before reviewing");
      location.href = "/?signup=true";
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [reviewForm, setreviewForm] = useState({
    dao_name: "",
    guild_id: "",
    rating: 0,
    review_desc: "",
  });

  console.log(reviewForm);

  const dialValueSetter = (key, value) => {
    setreviewForm((rf) => {
      rf[key] = value;
      return { ...rf };
    });
  };

  const starCompSetter = (value) => {
    setreviewForm((rf) => {
      rf["rating"] = value;
      return { ...rf };
    });
  };

  const [tc, settc] = useState(false);
  const [pageState, setpageState] = useState(status.READY);

  const postReview = async () => {
    if (!tc) {
      return alert("Please check the terms and conditions");
    } else if (reviewForm.rating == 0) {
      return alert("Rate your experience cannot be empty");
    } else if (reviewForm.review_desc.length <= 30) {
      return alert(
        "Please tell us your experience and review in more than 30 letters."
      );
    }
    let jwt = localStorage.getItem("token");
    try {
      let res = await axios.post(
        `${P_API}/review`,
        {
          listingID: id,
          comment: reviewForm.review_desc,
          rating: reviewForm.rating,
          meta: {
            resonate_vibes_rate: reviewForm.resonate_vibes_rate,
            onboarding_exp: reviewForm.onboarding_exp,
            opinions_matter: reviewForm.opinions_matter,
            great_org_structure: reviewForm.great_org_structure,
            friend_recommend: reviewForm.friend_recommend,
            great_incentives: reviewForm.great_incentives,
          },
        },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );
      if (res.status == 201) {
        location.href = "/add-review/status?type=success";
      }
    } catch (error) {
      let err_res = error.response.status;
      if (err_res == 403) {
        location.href = "/status/not-member";
      }
      if (err_res == 409) {
        location.href = "/status/duplicate-review";
      }
      if (err_res == 404 || err_res == 500) {
        setpageState(status.ERROR);
      }
    }
  };

  return (
    <>
      <div className={styles.reviewPage}>
        <Head>
          <title>Truts</title>
          <meta
            name="description"
            content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
          />
          <link rel="icon" href="/favicon.png" />

          <script
            defer
            src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
          ></script>
          <link
            href="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json"
            rel="preload"
          ></link>
          <link
            href="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json"
            rel="preload"
          ></link>
          <link
            href="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json"
            rel="preload"
          ></link>
          <link href={star_blank_gradient.src} rel="preload"></link>
          <link href={star_filled_gradient.src} rel="preload"></link>
        </Head>
        <Nav />
        <div className={styles.mainCon}>
          <div
            className={styles.breadCrum}
            onClick={() => {
              window.history.go(-1);
            }}
          >
            <img src={left_arrow.src} alt="" />

            <span>
              <h3>Back</h3>
            </span>
          </div>

          {pageState == status.LOADING && <LoadingState />}
          {pageState == status.ERROR && <ErrorState slug={slug} />}

          {pageState == status.READY && (
            <form className={styles.reviewForm}>
              <div className={styles.field}>
                <h3 className={styles.label}>Rate your experience</h3>
                <StartComponent setter={starCompSetter} />
              </div>
              <div className={styles.field}>
                <h3 className={styles.label}>Tell us about your experience</h3>
                <textarea
                  onChange={(e) => {
                    setreviewForm((rf) => {
                      rf["review_desc"] = e.target.value;
                      return { ...rf };
                    });
                  }}
                  placeholder="Please be mindful of your words when reviewing. Be honest, helpful and provide constructive criticism"
                  className={styles.desc_input}
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <h1 className={styles.title}>
                Please rate the following experiences
              </h1>
              <div className={styles.dialsCon}>
                <SliderComp
                  label={"Do you resonate with the vibes in the Community?"}
                  setter={dialValueSetter}
                />
                <SliderComp
                  label={
                    "How would you rate the Community onboarding experience?"
                  }
                  setter={dialValueSetter}
                />
                <SliderComp
                  label={
                    "Do you believe your opinions matter in the Community?"
                  }
                  setter={dialValueSetter}
                />
                <SliderComp
                  label={
                    "Do you think that Community has great organizational structure?"
                  }
                  setter={dialValueSetter}
                />
                <SliderComp
                  label={"Would you recommed this Community to your friend?"}
                  setter={dialValueSetter}
                />
                <SliderComp
                  label={
                    "Do you think there are great incentives for Community members?"
                  }
                  setter={dialValueSetter}
                />
              </div>
              <div className={styles.tc}>
                <input
                  onChange={() => {
                    settc(!tc);
                  }}
                  className={styles.checkbox}
                  type="checkbox"
                />
                <p>
                  I confirm this review is about my own genuine experience. I am
                  eligible to post this review, and have not been offered any
                  incentive or payment to post a review for this company.
                </p>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  postReview();
                }}
                label={"Submit Review"}
              />
            </form>
          )}
        </div>
      </div>
    </>
  );
}

const StartComponent = ({ setter }) => {
  const [rating, setrating] = useState(0);
  const [selector, setselector] = useState(0);

  useEffect(() => {
    setter(rating);
  }, [rating]);

  return (
    <span
      className={styles.starComponent}
      onMouseLeave={() => {
        setselector(0);
      }}
    >
      {[1, 2, 3, 4, 5].map((r) => {
        if (r <= selector || r <= rating) {
          return (
            <img
              onMouseEnter={() => {
                setselector(r);
              }}
              onClick={() => {
                setrating(r);
              }}
              key={r + "star" + "filled"}
              src={star_filled_gradient.src}
              alt=""
            />
          );
        } else {
          return (
            <img
              onMouseEnter={() => {
                setselector(r);
              }}
              onClick={() => {
                setrating(r);
              }}
              key={r + "star" + "blank"}
              src={star_blank_gradient.src}
              alt=""
            />
          );
        }
      })}
    </span>
  );
};

function SliderComp({ setter, label }) {
  const [sliderValue, setsliderValue] = useState(50);

  useEffect(() => {
    console.log(label);
    setter(questionMap[label], sliderValue);
    console.log(questionMap[label]);
  }, [sliderValue]);

  return (
    <span>
      <h4 className={styles.dialLabel}>{label}</h4>
      <div className={styles.slider}>
        <span className={styles.sliderComp}>
          <div className={styles.sliderBarBg}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
              return <span key={"marker" + i} className={styles.marker}></span>;
            })}
          </div>
          <div
            style={{ width: `${Math.min(sliderValue, 97)}%` }}
            className={styles.sliderBar}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={sliderValue}
            onChange={(e) => {
              setsliderValue(parseInt(e.target.value));
            }}
          />
        </span>
        <p className={styles.value}>{sliderValue / 10}</p>
      </div>
    </span>
  );
}

const ethSign = async (msg, signMessageAsync) => {
  try {
    let res = await signMessageAsync();
    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const solSign = async (msg) => {
  const getProvider = () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }
    //window.open('https://phantom.app/', '_blank');
  };

  const provider = getProvider(); // see "Detecting the Provider"
  const resp = await provider.connect();
  const message = msg;
  const encodedMessage = new TextEncoder().encode(message);
  console.log("sign message");
  try {
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    return signedMessage;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const LoadingState = () => {
  return (
    <div className={styles.response}>
      <lottie-player
        src="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json"
        background="transparent"
        speed="1"
        style={{ width: "75%", height: "100%" }}
        loop
        autoplay
      ></lottie-player>
      <span className={styles.message}>
        Hang on a sec! We are submitting your review.
      </span>
    </div>
  );
};

const ErrorState = ({ slug }) => {
  return (
    <div className={styles.response}>
      <lottie-player
        src="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json"
        background="transparent"
        speed="1"
        style={{ width: "60%", height: "100%", marginBottom: "30px" }}
        loop
        autoplay
      ></lottie-player>
      <span className={styles.message}>
        <p>Sorry, something went wrong. Can you please try again :)</p>
        <Link href={`/dao/${slug}`}>
          <Button label={"Try Again"} />
        </Link>
      </span>
    </div>
  );
};

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
  let { id } = ctx.query;
  let target = ctx.req.cookies["target"];
  return { props: { id, slug: target } };
}

const questionMap = {
  "Do you resonate with the vibes in the Community?": "resonate_vibes_rate",
  "How would you rate the Community onboarding experience?": "onboarding_exp",
  "Do you believe your opinions matter in the Community?": "opinions_matter",
  "Do you think that Community has great organizational structure?":
    "great_org_structure",
  "Would you recommed this Community to your friend?": "friend_recommend",
  "Do you think there are great incentives for Community members?":
    "great_incentives",
};

export default AddReview;
