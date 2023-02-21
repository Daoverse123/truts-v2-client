import React, { useEffect, useRef, useState } from "react";
import styles from "./page_mission.module.scss";
import { toast } from "react-toastify";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import axios from "axios";
import openNewTab from "../../utils/openNewTab";
import Link from "next/link";
import ToolTip from "../../components/ToolTip";

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

const fetchCompleted = async (id, setter) => {
  let res = await axios.get(`${P_API}/mission/${id}/completed-by`);
  if (res.status == 200) {
    setter(res.data.data.completedBy);
  }
};

function Index({ mission }) {
  const [status, setstatus] = useState(null);
  const [completed, setcompleted] = useState(null);
  let fetchTaskStatus = async () => {
    try {
      let res = await axios.get(`${P_API}/mission/${mission._id}/my-status`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setstatus(res.data.data);
      fetchCompleted(mission._id, setcompleted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    fetchTaskStatus();
  }, []);

  console.log(completed);

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
        location.href = `/status/mission?xp=${mission.listingXP}`;
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

  const [backBtn, setbackBtn] = useState("");
  useEffect(() => {
    setbackBtn(localStorage.getItem("mission-callback"));
  }, []);

  return (
    <>
      <Nav isFloating />
      <div className={styles.missionPage}>
        <h3 className={styles.subtitle}>
          <span
            onClick={() => {
              window.history.go(-1);
            }}
            className={styles.back}
          >
            <img src="/missions/arrow.png" /> Back
          </span>

          <ToolTip
            init={"Copy Mission Link"}
            post={"Mission Link Copied !"}
            copyLink={`https://truts.xyz/mission/${mission._id}`}
            bottom={true}
          >
            <span className={styles.share}>
              Share <img src="/missions/sharesvg.svg" />
            </span>
          </ToolTip>
        </h3>

        <div className={styles.missionHead}>
          <img
            className={styles.profileImg}
            src={mission.listing.dao_logo || "/blue.png"}
            alt=""
          />
          <div className={styles.content}>
            <h2 className={styles.sub}>{mission.listing.dao_name}</h2>
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
                {completed &&
                  completed.map((ele, idx) => {
                    if (idx > 5) {
                      return null;
                    }
                    return (
                      <img
                        style={{ left: `${idx * -6}px` }}
                        key={idx}
                        src={ele.user.photo.secure_url}
                        alt=""
                      />
                    );
                  })}

                {completed && completed.length > 0 && (
                  <p style={{ marginLeft: `-${completed.length * 4}px` }}>
                    + {completed.length} Completed
                  </p>
                )}
              </div>
            </div>
          </div>
          <span className={styles.xp}>
            <p>Rewards</p>
            <span className={styles.xpCount}>
              <img src="/missions/coin.svg" alt="" />
              <h1>{mission.listingXP} XP</h1>
            </span>
          </span>
        </div>
        {!status && (
          <>
            <h3 className={styles.subtitle}>Tasks to Perform</h3>
            <div className={styles.tasksCon}>
              {mission.tasks.map((tsk, idx) => {
                return (
                  <ShowTask
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
            <button
              onClick={() => {
                location.href = "/?signup=true";
              }}
              className={styles.mainBtnDisabled}
            >
              Login/Sign-up to Complete the Mission
            </button>
          </>
        )}

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
            {claimReady && !status.attemptedMission.isCompleted ? (
              <button onClick={claimMission} className={styles.mainBtnClaim}>
                Claim Mission
              </button>
            ) : (
              <button className={styles.mainBtnDisabled}>
                {status.attemptedMission.isCompleted
                  ? "Mission Claimed"
                  : "Claim Mission"}
              </button>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

function ShowTask({ no, data, mission_id }) {
  let taskStatus = styles.taskDisabled;
  const [loading, setloading] = useState(false);

  return (
    <div className={styles.task + " " + taskStatus}>
      <span className={styles.count}>{no}</span>
      <div className={styles.textCont}>
        <h1>{data.name}</h1>
        <p>{limitText(100, data.description)}</p>
      </div>
    </div>
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
      setloading(false);
      console.log("error");
      toast.error("Please make sure to complete the task and verify again!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      startTask();
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
