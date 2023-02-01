import React, { useEffect, useState } from "react";
import styles from "./page_mission.module.scss";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import axios from "axios";
import openNewTab from "../../utils/openNewTab";

const API = process.env.API;
const P_API = process.env.P_API;

const Tag = ({ src, color, title }) => {
  return (
    <div
      className={styles.tag}
      style={{ outlineColor: color, background: color.replace(")", ",0.1)") }}
    >
      <img src={src} alt=" " />
      <p style={{ color: color }}>{title}</p>
    </div>
  );
};

let STATUS = {
  COMPLETED: "completed",
  CURRENT: "current",
  DISABLED: "disabled",
};

function Index({ mission }) {
  const [status, setstatus] = useState(null);

  let fetchTaskStatus = async () => {
    try {
      let res = await axios.get(`${P_API}/mission/${mission._id}/my-status`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setstatus(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTaskStatus();
  }, []);

  let getTaskStatus = (id) => {
    try {
      if (status.attemptedMission.tasks[id] == "COMPLETE") {
        return STATUS.COMPLETED;
      }
      if (status.attemptedMission.tasks[id] == "INCOMPLETE") {
        return STATUS.CURRENT;
      }
    } catch (error) {}
    return STATUS.DISABLED;
  };

  let claimMission = async () => {
    try {
      let res = await axios.get(`${P_API}/mission/${mission._id}/claim`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (res.status == 200) {
        location.href = "/status/mission";
      }
    } catch (error) {}
  };

  const [claimReady, setclaimReady] = useState(false);
  console.log(claimReady);
  useEffect(() => {
    if (status) {
      let flag = true;
      Object.values(status.attemptedMission.tasks).forEach((ele) => {
        console.log(ele);
        if (ele == "INCOMPLETE") {
          flag = false;
        }
      });
      setclaimReady(flag);
    }
  }, [status]);

  return (
    <>
      <Nav isFloating />
      <div className={styles.missionPage}>
        <h3 className={styles.subtitle}>
          <img src="/missions/arrow.png" /> Back
        </h3>
        <div className={styles.missionHead}>
          <img
            className={styles.profileImg}
            src={mission.community.dao_logo || "/blue.png"}
            alt=""
          />
          <div className={styles.content}>
            <h2 className={styles.sub}>{mission.community.dao_name}</h2>
            <h1 className={styles.title}>{limitText(40, mission.name)}</h1>
            <p className={styles.desc}>{limitText(120, mission.description)}</p>
            <div className={styles.bottomNav}>
              <div className={styles.tags}>
                {mission.tags.map((tgs, idx) => {
                  return (
                    <Tag
                      key={"tgs" + idx}
                      src={"/missions/bounty.png"}
                      color={"rgb(203, 56, 240)"}
                      title={tgs.name}
                    />
                  );
                })}
              </div>
              <div className={styles.profilesCompleted}>
                <img src="/profile.png" alt="" />
                <img style={{ left: "-7px" }} src="/profile.png" alt="" />
                <img style={{ left: "-14px" }} src="/profile.png" alt="" />
                <p>+ 123 completed</p>
              </div>
            </div>
          </div>
          <span className={styles.xp}>
            <p>Rewards</p>
            <span className={styles.xpCount}>
              <img src="/missions/coin.png" alt="" />
              <h1>{mission.communityXP} XP</h1>
            </span>
          </span>
        </div>
        {status && (
          <>
            <h3 className={styles.subtitle}>Tasks to Perform</h3>
            <div className={styles.tasksCon}>
              {mission.tasks.map((tsk, idx) => {
                return (
                  <Task
                    key={"tsk" + idx}
                    no={idx + 1}
                    data={tsk}
                    status={getTaskStatus(tsk._id)}
                    mission_id={mission._id}
                    refreshMissionStatus={fetchTaskStatus}
                  />
                );
              })}
            </div>
            {claimReady ? (
              <button onClick={claimMission} className={styles.mainBtnClaim}>
                Claim Mission
              </button>
            ) : (
              <button className={styles.mainBtnDisabled}>Claim Mission</button>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

function Task({ status, no, data, mission_id, refreshMissionStatus }) {
  let taskStatus = styles.taskDisabled;
  const [loading, setloading] = useState(false);

  if (status === STATUS.CURRENT) {
    taskStatus = "";
  }
  if (status === STATUS.COMPLETED) {
    taskStatus = styles.taskCompleted;
  }

  const startTask = () => {
    openNewTab(data.redirect_url);
  };

  const verifyTask = async () => {
    try {
      setloading(true);
      let res = await axios.get(
        `${P_API}/mission/${mission_id}/task-verify/${data._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (res.status == 200) {
        await refreshMissionStatus();
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.task + " " + taskStatus}>
      <span className={styles.count}>{no}</span>
      <div className={styles.textCont}>
        <h1>{data.name}</h1>
        <p>{limitText(100, data.description)}</p>
      </div>
      {status == STATUS.COMPLETED ? (
        <button>
          Verified <img src="/missions/tick.png" alt="" />
        </button>
      ) : (
        <span className={styles.taskNav}>
          <button
            className={styles.startBtn}
            onClick={() => {
              startTask();
            }}
          >
            Start
          </button>
          {!loading ? (
            <button
              onClick={() => {
                verifyTask();
              }}
            >
              Verify
            </button>
          ) : (
            <button>
              Verify <img src="/white-loader.gif" alt="" />
            </button>
          )}
        </span>
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  let mission_id = ctx.query.slug[0];
  let res = await axios.get(`${P_API}/mission/${mission_id}`);
  return {
    props: {
      mission: res.data.data.mission,
    },
  };
};

function limitText(count, text) {
  if (text.length < count) return text;
  let snippedText = text.substring(0, count);
  return snippedText + "...";
}

export default Index;
