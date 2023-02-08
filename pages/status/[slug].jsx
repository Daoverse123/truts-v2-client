import React, { useEffect } from "react";
import styles from "./status.module.scss";
import Link from "next/link";
import Head from "next/head";
import openNewTab from "../../utils/openNewTab";
import ConfettiGenerator from "confetti-js";
import left_arrow from "../../assets/left-arrow.png";

import Button from "../../components/Button";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

function Index({ type, target }) {
  console.log(type);

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
          {/* <div className={styles.breadCrum}>
          <img src={left_arrow.src} alt="" />
          <Link href={`/`}>
            <span>
              <p>Add review for</p>
              <h3>{"Test"}</h3>
            </span>
          </Link>
        </div> */}{" "}
          <Mission />
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
  let { slug: type } = ctx.query;
  let target = ctx.req.cookies["target"];
  return {
    props: {
      type,
      target: target || "",
    },
  };
}

//Thank you for submitting the application to list your Community. Now sit back and relax. If we need more information, we will reach out to you. Otherwise, you are all set and you will see your DAO listed in a day or two :)

const Mission = () => {
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
          <h1>300</h1>
          <img className={styles.xpText} src="/xp-text.png" alt="" />
        </div>
        <div className={styles.text}>
          <h4 className={styles.desc}>
            Congratulations! You`ve earned 300 Xp by completing the Mission!
            Your XP points are your gateway to exciting rewards on Truts, More
            on this soon...
          </h4>
          <button
            onClick={() => {
              let slug = localStorage.getItem("mission-callback");
              if (slug) {
                return (location.href = `/dao/${slug}`);
              }
              location.href = `/`;
            }}
          >
            Explore Truts
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
          label={"Join Community"}
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
        <Link href={`/dao/${slug}`}>
          <Button label={"Try Again"} />
        </Link>
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
