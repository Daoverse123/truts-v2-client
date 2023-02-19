import styles from "./missions.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Mission from "../../components/Mission";
import axios from "axios";

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
          {data.missions.map((ele, idx) => {
            return <Mission data={ele} key={idx + "m"} />;
          })}
          {data.missions.map((ele, idx) => {
            return <Mission data={ele} key={idx + "m"} />;
          })}
          {data.missions.map((ele, idx) => {
            return <Mission data={ele} key={idx + "m"} />;
          })}
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
