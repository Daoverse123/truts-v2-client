import React, { useEffect } from "react";
import styles from "./success.module.scss";
import { useQuery } from "react-query";
import Mission from "../Mission";
import axios from "axios";
import Button from "../Button";
import ConfettiGenerator from "confetti-js";

function Succes() {
  let missions = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      let res = await axios.get(`${process.env.P_API}/mission?page=1&limit=3`);
      return res.data.data.result;
    },
  });

  useEffect(() => {
    const confettiSettings = {
      target: "my-canvas",
      start_from_edge: true,
      rotate: true,
      max: 350,
      size: 0.8,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
      confetti.render();
    }, 1000);

    return () => confetti.clear();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <canvas id="my-canvas"></canvas>
        <div className={styles.profile}>
          <img src="/blue.png" alt="" />
          <div>
            <p>John Swaroop</p>
            <p className={styles.gradient}>| @john</p>
          </div>
        </div>
        <p className={styles.copy}>
          Congratulations, you`ve earned 200 XP for completing the mission!
        </p>
        <Level />
        <h2 className={styles.ltext}>Continue with more missions</h2>
        <div className={styles.missionCon}>
          {missions.isSuccess &&
            missions.data.map((ms) => {
              return <Mission key={ms._id} data={ms} />;
            })}
        </div>
        <span className={styles.nav}>
          <Button label="Explore Missions" />
        </span>
      </div>
    </div>
  );
}

const Level = () => {
  return (
    <div className={styles.progress}>
      <h1>Level 15</h1>
      <div className={styles.bar}>
        <div className={styles.progressOutter}>
          <div className={styles.progressInner}></div>
        </div>
        <div className={styles.xp}>
          <p>1000/1500</p>
          <p className={styles.gradientText}>+200 XPs</p>
        </div>
      </div>
    </div>
  );
};

export default Succes;
