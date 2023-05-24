import styles from "./missions.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Mission from "../../components/Mission";
import axios from "axios";
import Head from "next/head";
import { useQuery } from "react-query";

import Footer from "../../components/Footer";
import { create } from "zustand";

const filterStore = create((set) => ({
  sortState: "",
  setSortState: (sort) => set((state) => ({ ...state, sortState: sort })),
}));

const SortComp = ({ state, dispatch }) => {
  //Sort types
  // ALPHA
  // XP_HIGH
  // XP_LOW

  let setSortState = filterStore().setSortState;
  let sort = filterStore().sortState;
  console.log(sort);

  return (
    <span className={styles.sortComp}>
      <span className={styles.divider} />
      <span className={styles.option}>
        <p>Sort by</p>
      </span>
      <span className={styles.typesOption}>
        <p>Alphabetical Order</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("ALPHA");
            }
          }}
          checked={sort == "ALPHA"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.typesOption}>
        <p>XP : High to Low</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("XP_HIGH");
            }
          }}
          checked={sort == "XP_HIGH"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.typesOption}>
        <p>XP : Low to High</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("XP_LOW");
            }
          }}
          checked={sort == "XP_LOW"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.divider} />
    </span>
  );
};

let P_API = process.env.P_API;

const Missions = ({ data }) => {
  let completedMissions = useQuery({
    queryKey: ["completed-missions"],
    queryFn: async () => {
      let option = {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      };
      let res = await axios.get(`${P_API}/user/completed-mission`, option);

      return res.data.data.missions;
    },
  });

  let sort = filterStore().sortState;

  let getSortParam = (sort) => {
    if (sort == "XP_HIGH") {
      return `{ "listingXP": -1 }`;
    }
    if (sort == "XP_LOW") {
      return `{ "listingXP": 1 }`;
    }
    if (sort == "ALPHA") {
      return `{ "name": 1 }`;
    }
    return "";
  };

  let mission = useQuery({
    queryKey: ["missions", sort],
    queryFn: async (key) => {
      let sortParms = getSortParam(key.queryKey[1]);
      let res = await axios.get(
        `${P_API}/mission?page=1&limit=999&sort=${sortParms}`
      );
      return res.data.data.result;
    },
  });

  let missionData =
    mission.isFetched && completedMissions.isFetched
      ? mission.data.map((ele) => {
          let isCompleted = false;
          for (let i = 0; i < completedMissions.data.length; i++) {
            if (completedMissions.data[i]._id == ele._id) {
              isCompleted = true;
            }
          }
          return { ...ele, isCompleted };
        })
      : [];

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
          {missionData.map((ele, idx) => {
            return (
              <Mission
                isCompleted={ele.isCompleted}
                data={ele}
                key={idx + "m" + ele.name}
              />
            );
          })}
        </div>
      </div>
      <div style={{ paddingTop: "100px" }}>
        <Footer />
      </div>
    </>
  );
};

export default Missions;
