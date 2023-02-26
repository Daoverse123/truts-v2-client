import styles from "./missions.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Mission from "../../components/Mission";
import axios from "axios";
import Head from "next/head";

const SortComp = ({ state, dispatch }) => {
  return (
    <span className={styles.sortComp}>
      <span className={styles.divider} />
      <span className={styles.option}>
        <p>Sort by</p>
      </span>
      <span className={styles.typesOption}>
        <p>Alphabetical Order</p>
        <input type={"checkbox"} />
      </span>
      <span className={styles.typesOption}>
        <p>Participants</p>
        <input type={"checkbox"} />
      </span>
      <span className={styles.divider} />
    </span>
  );
};

let P_API = process.env.P_API;

const Missions = ({ data }) => {
  return (
    <>
      <Head>
        <title>Truts | Missions</title>
        <meta
          name="description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <link rel="icon" href="/favicon.png" />

        <meta property="og:url" content="https://www.truts.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Truts" />
        <meta
          property="og:description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <meta property="og:image" content="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="truts.xyz" />
        <meta property="twitter:url" content="https://www.truts.xyz" />
        <meta name="twitter:title" content="Truts" />
        <meta
          name="twitter:description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <meta name="twitter:image" content="/favicon.png" />
      </Head>
      <Nav isFloating />
      <div className={styles.missions}>
        <div className={styles.sideNav}>
          <h1 className={styles.title}>Missions</h1>
          <SortComp />
        </div>
        <h1 className={styles.titleMain}>Missions</h1>
        <div className={styles.mainContent}>
          {data.missions.map((ele, idx) => {
            return <Mission data={ele} key={idx + "m"} />;
          })}
        </div>
      </div>
    </>
  );
};

const fetchMissions = async () => {
  let res = await axios.get(`${P_API}/mission`);
  return res.data.data;
};

export async function getServerSideProps() {
  let missions = await fetchMissions();

  return {
    props: {
      data: missions,
    },
  };
}

export default Missions;
