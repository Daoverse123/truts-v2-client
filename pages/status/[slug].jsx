import React, { useEffect, useState } from "react";
import styles from "./status.module.scss";
import Link from "next/link";
import Head from "next/head";
import openNewTab from "../../utils/openNewTab";
import ConfettiGenerator from "confetti-js";
import left_arrow from "../../assets/left-arrow.png";

import Button from "../../components/Button";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

import Success from "../../components/Success";

function Index({ type: preType, target, xp, m_id }) {
  const [type, settype] = useState(preType);

  let couponQuery = useQuery(
    ["coupon", m_id],
    async () => {
      if (m_id != process.env.M_ID) {
        return true;
      }
      let data = await axios.get(
        `${process.env.P_API}/mission/${m_id}/special-claim`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.status == 201) {
        settype("coupon");
      }
      return data.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (m_id == "64a3f796920d2c12f87a94bf") {
      settype("milan");
    }
    if (m_id == "64a930c0480c4167548e6ca0") {
      settype("token2049");
    }
  }, []);

  if (!couponQuery.isSuccess) {
    return (
      <div className={styles.loaderCon}>
        <span className={styles.loader}></span>
        <p>Loading Please Wait</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.statusPage}>
        <Head>
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
        </Head>
        <Nav />
        <div style={{ margin: "0" }} className={styles.mainCon}>
          <div className={styles.breadCrum}>
            {/* <img src={left_arrow.src} alt="" /> */}
            {/* <Link href={`/`}>
              <span>
                <p>Add review for</p>
                <h3>{"Test"}</h3>
              </span>
            </Link> */}
          </div>
          {type == "milan" && <MilanMission xp={xp} />}
          {type == "token2049" && <Token2049 xp={xp} />}

          {type == "coupon" && <MissionCoupon data={couponQuery} xp={xp} />}
          {type == "mission" && <Success xp={xp} />}
          {type == "not-member" && (
            <ErrorState
              message={
                "Oops! need to be a member of the Community to post the Review"
              }
              slug={target}
            />
          )}
          {type == "duplicate-review" && (
            <ErrorState
              message={
                "Oops! Review already exists on this community by this User "
              }
              slug={target}
            />
          )}
          {type == "community-listed-success" && (
            <SuccessStateListDAO
              message={
                "Thank you for submitting the application to list your Community. Now sit back and relax. If we need more information, we will reach out to you. Otherwise, you are all set and you will see your DAO listed in a day or two :) "
              }
              slug={target}
            />
          )}
          {type == "community-listed-failed" && (
            <ErrorStateListDAO
              message={
                "Sorry, something went wrong. Can you please try again :)"
              }
              slug={target}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  let { slug: type, xp, m_id } = ctx.query;
  console.log(ctx);
  let target = ctx.req.cookies["target"];
  return {
    props: {
      type,
      xp: xp || "",
      target: target || "",
      m_id: m_id || "",
    },
  };
}

//Thank you for submitting the application to list your Community. Now sit back and relax. If we need more information, we will reach out to you. Otherwise, you are all set and you will see your DAO listed in a day or two :)

const MissionCoupon = ({ xp, data }) => {
  useEffect(() => {
    const confettiSettings = {
      target: "my-canvas",
      start_from_edge: true,
      rotate: true,
      max: 250,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
      confetti.render();
    }, 1000);

    return () => confetti.clear();
  }, []);

  let code = data.data.data.coupon.code;
  return (
    <div className={styles.missionSuccess}>
      <canvas id="my-canvas"></canvas>
      <div className={styles.content}>
        <div className={styles.topText}>
          <h3>Congratulations!🎉</h3>
          <p className={styles.subText}>You earned</p>
        </div>

        <div className={styles.xpCoupon}>
          {/* <img className={styles.goldStack} src="/gold-coin-stack.png" alt="" /> */}
          <h1>{20 + "% OFF"}</h1>
          {/* <img className={styles.xpText} src="/xp-text.png" alt="" /> */}
        </div>
        <div className={styles.text}>
          <h4 className={styles.desc}>
            Congratulations on completing the mission! 🎉 You&apos;ve unlocked a
            20% discount code to claim your very own Unstoppable Domain. Step
            into the unstoppable world of web3 and make your mark with a unique
            domain name. Claim your domain now and start your web3 journey! ✨
          </h4>

          <div className={styles.coupon}>
            {code}
            <img
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Coupon Copied !", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
              src="/copy_blue.svg"
              alt=""
            />
          </div>

          <button
            onClick={() => {
              openNewTab("https://unstoppabledomains.com/");
              toast.success("Coupon Copied !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }}
          >
            Get Unstoppable Domain
          </button>
        </div>
      </div>
    </div>
  );
};

const MilanMission = ({ xp, data }) => {
  useEffect(() => {
    const confettiSettings = {
      target: "my-canvas",
      start_from_edge: true,
      rotate: true,
      max: 250,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
      confetti.render();
    }, 1000);

    return () => confetti.clear();
  }, []);

  let code = "TRUTS";
  return (
    <div className={styles.missionSuccess}>
      <canvas id="my-canvas"></canvas>
      <div className={styles.content}>
        <div className={styles.topText}>
          <h3>Congratulations!🎉</h3>
          <p className={styles.subText}>You earned</p>
        </div>

        <div className={styles.xpCoupon}>
          {/* <img className={styles.goldStack} src="/gold-coin-stack.png" alt="" /> */}
          <h1>{50 + "% OFF"}</h1>
          {/* <img className={styles.xpText} src="/xp-text.png" alt="" /> */}
        </div>
        <div className={styles.text}>
          <h4 className={styles.desc}>
            Congratulations on completing the mission! 🎉 <br></br> You’ve
            earned a 50% discount code for Eth Milan tickets and {xp} Truts XP.
            Take off to Italy and have a blast at the conference ✨
          </h4>

          <div className={styles.coupon}>
            {code}
            <img
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://www.eventbrite.it/e/biglietti-ethmilan-619763779147?discount=TRUTS"
                );
                toast.success("Coupon Copied !", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
              src="/copy_blue.svg"
              alt=""
            />
          </div>

          <button
            onClick={() => {
              openNewTab(
                "https://www.eventbrite.it/e/biglietti-ethmilan-619763779147?discount=TRUTS"
              );
              // toast.success("Coupon Copied !", {
              //   position: "top-right",
              //   autoClose: 5000,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   progress: undefined,
              //   theme: "light",
              // });
            }}
          >
            Redeem Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Token2049 = ({ xp, data }) => {
  useEffect(() => {
    const confettiSettings = {
      target: "my-canvas",
      start_from_edge: true,
      rotate: true,
      max: 250,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
      confetti.render();
    }, 1000);

    return () => confetti.clear();
  }, []);

  let code = "TRUTS";
  let link = "https://www.payment.token2049.com/?promo=TRUTS";
  return (
    <div className={styles.missionSuccess}>
      <canvas id="my-canvas"></canvas>
      <div className={styles.content}>
        <div className={styles.topText}>
          <h3>Congratulations!🎉</h3>
          <p className={styles.subText}>You earned</p>
        </div>

        <div className={styles.xpCoupon}>
          {/* <img className={styles.goldStack} src="/gold-coin-stack.png" alt="" /> */}
          <h1>{10 + "% OFF"}</h1>
          {/* <img className={styles.xpText} src="/xp-text.png" alt="" /> */}
        </div>
        <div className={styles.text}>
          <h4 className={styles.desc}>
            Congratulations on completing the mission! 🎉 <br></br> You’ve
            earned a 10% discount code for Token2049 tickets and {xp} Truts XP.
            Take off to Singapore and have a blast at the conference ✨
          </h4>

          <div className={styles.coupon}>
            {code}
            <img
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Coupon Copied !", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
              src="/copy_blue.svg"
              alt=""
            />
          </div>

          <button
            onClick={() => {
              openNewTab(link);
              // toast.success("Coupon Copied !", {
              //   position: "top-right",
              //   autoClose: 5000,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   progress: undefined,
              //   theme: "light",
              // });
            }}
          >
            Redeem Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Mission = ({ xp }) => {
  useEffect(() => {
    const confettiSettings = {
      target: "my-canvas",
      start_from_edge: true,
      rotate: true,
      max: 250,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
      confetti.render();
    }, 1000);

    return () => confetti.clear();
  }, []);
  return (
    <div className={styles.missionSuccess}>
      <canvas id="my-canvas"></canvas>
      <div className={styles.content}>
        <div className={styles.topText}>
          <h3>Congratulations!🎉</h3>
          <p className={styles.subText}>You earned</p>
        </div>

        <div className={styles.xp}>
          <img className={styles.goldStack} src="/gold-coin-stack.png" alt="" />
          <h1>{xp}</h1>
          <img className={styles.xpText} src="/xp-text.png" alt="" />
        </div>
        <div className={styles.text}>
          <h4 className={styles.desc}>
            Congratulations! You`ve earned {xp} XP by completing the Mission!
            Your XP points are your gateway to exciting rewards on Truts, More
            on this soon...
          </h4>
          <button
            onClick={() => {
              window.history.go(-2);
            }}
          >
            Explore Missions
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessStateListDAO = ({ message }) => {
  return (
    <div className={styles.response}>
      <lottie-player
        src="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json"
        background="transparent"
        speed="1"
        style={{ width: "50%", height: "100%", marginBottom: "30px" }}
        autoplay
      ></lottie-player>
      <span className={styles.message}>
        <p>{message}</p>
        <Button
          onClick={() => {
            openNewTab("https://discord.truts.xyz/");
          }}
          label={"Join Truts Community"}
        />
      </span>
    </div>
  );
};

const ErrorState = ({ slug, message }) => {
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
        <p>{message}</p>

        <Button
          onClick={() => {
            window.history.go(-2);
          }}
          label={"Try Again"}
        />
      </span>
    </div>
  );
};

const ErrorStateListDAO = ({ slug, message }) => {
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
        <p>{message}</p>
        <Link href={`/discover`}>
          <Button label={"Try Again"} />
        </Link>
      </span>
    </div>
  );
};

export default Index;
