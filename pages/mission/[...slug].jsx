import React, { useEffect, useRef, useState } from "react";
import styles from "./page_mission.module.scss";
import { toast } from "react-toastify";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import axios from "axios";
import openNewTab from "../../utils/openNewTab";
import Link from "next/link";
import ToolTip from "../../components/ToolTip";
import countBasedLength from "../../utils/countBasedLength";
import Head from "next/head";
import { useQuery } from "react-query";
import WalletConnect from "../../components/WalletConnect_mission_overlay";
import { create } from "zustand";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

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

let claimMission = async (mission) => {
  try {
    let res = await axios.get(`${P_API}/mission/${mission._id}/claim`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status == 200) {
      let xp = res.data.data.attemptedMission.listingXP;
      try {
        let userData = localStorage.getItem("user-server");
        if (userData) {
          userData = JSON.parse(userData);
        }
        let chain = userData?.wallets?.chain;
        if (location.href.includes("daoplanet") && chain == "NEAR") {
          location.href = "https://shard.dog/DAODenverIsNEAR";
        } else {
          location.href = `/status/mission?xp=${xp}&m_id=${mission._id}`;
        }
      } catch (error) {
        location.href = `/status/mission?xp=${xp}&m_id=${mission._id}`;
      }
    }
  } catch (error) {}
};

function Index({ mission }) {
  console.log(mission);

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

  useEffect(() => {
    fetchTaskStatus();
  }, []);

  const [claimReady, setclaimReady] = useState(false);
  console.log(claimReady);
  useEffect(() => {
    if (status && mission.type == "TASKS") {
      console.log(status);
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

  const [backBtn, setbackBtn] = useState("");
  useEffect(() => {
    setbackBtn(localStorage.getItem("mission-callback"));
  }, []);

  return (
    <>
      <Head>
        <title>{mission.name}</title>
        <meta name="description" content={mission.description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/assets/tick.png" as="image"></link>
        <meta property="og:url" content="https://www.truts.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Truts" />
        <meta property="og:description" content={mission.description} />
        <meta property="og:image" content="/favicon.png" />
        <link rel="preload" as="image" href="/quiz_placeholder.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="truts.xyz" />
        <meta property="twitter:url" content="https://www.truts.xyz" />
        <meta name="twitter:title" content="Truts" />
        <meta name="twitter:description" content={mission.description} />
        <meta name="twitter:image" content="/favicon.png" />
      </Head>
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

        <div className={styles.bg}>
          <div className={styles.missionHead}>
            <img
              style={{
                zIndex: "100",
                cursor: "pointer",
              }}
              onClick={() => {
                openNewTab(
                  `${location.origin}/community/${mission.listing.slug.trim()}`
                );
              }}
              className={styles.profileImg}
              src={mission.listing?.photo?.logo.secure_url || "/blue.png"}
              alt=""
            />
            <div className={styles.content}>
              <h2
                style={{
                  zIndex: "100",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openNewTab(
                    `${
                      location.origin
                    }/community/${mission.listing.slug.trim()}`
                  );
                }}
                className={styles.sub}
              >
                {mission.listing.name}
              </h2>
              <h1 className={styles.title}>{limitText(40, mission.name)}</h1>
              <p className={styles.desc}>
                {limitText(120, mission.description)}
              </p>
              <div className={styles.bottomNav}>
                <div className={styles.tags}>
                  {mission.tags.map((tgs, idx) => {
                    let color = tgs.color.rgba;
                    color = `rgb(${color[0]},${color[1]},${color[2]})`;
                    return (
                      <Tag
                        key={"tgs" + idx}
                        src={tgs.logo.secure_url}
                        color={color}
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
                          src={ele.user?.photo?.secure_url}
                          alt=""
                        />
                      );
                    })}

                  {completed && completed.length > 0 && (
                    <p
                      style={{ marginLeft: countBasedLength(completed.length) }}
                    >
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
        </div>
        {/* Not Logged in */}
        {mission.type == "TASKS" && (
          <>
            {!status && (
              <>
                <h3 className={styles.subtitle}>Tasks to Perform</h3>

                <div className={styles.signUp}>
                  <p>Sign in or Sign up to access the Missions.</p>
                  <button
                    onClick={() => {
                      //location.href = "/?signup=true";
                      window.showSignupPrompt && window.showSignupPrompt();
                    }}
                  >
                    Login/Sign Up
                  </button>
                </div>

                <div className={styles.tasksCon}>
                  {mission.tasks
                    .sort((a, b) => a.stepNum - b.stepNum)
                    .map((tsk, idx) => {
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
            {/* Logged in */}
            {status && (
              <>
                <h3 className={styles.subtitle}>Tasks to Perform</h3>
                <div className={styles.tasksCon}>
                  {mission.tasks
                    .sort((a, b) => a.stepNum - b.stepNum)
                    .map((tsk, idx) => {
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
                  <button
                    onClick={() => {
                      claimMission(mission);
                    }}
                    className={styles.mainBtnClaim}
                  >
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
          </>
        )}
        {mission.type == "QUIZ" && (
          <>
            <Quiz mission={mission} />
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

  let dependency = useQuery({
    queryKey: ["dependency", mission_id, data._id],
    queryFn: async (query) => {
      let m_id = query.queryKey[1];
      let t_id = query.queryKey[2];
      try {
        let res = await axios.get(
          `${process.env.P_API}/mission/${m_id}/task-dependency-check/${t_id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        return res.data.data;
      } catch (er) {
        console.log(er);
        throw er;
      }
    },
  });

  const [walletConnectVisible, setwalletConnectVisible] = useState(false);

  const NavStatus = () => {
    //wait
    if (!dependency.isSuccess) {
      return <>load</>;
    }

    //Completed task
    if (status == STATUS.COMPLETED) {
      return (
        <button>
          Verified <img src="/missions/tick.png" alt="" />
        </button>
      );
    }

    //Missing dependency live
    if (!dependency.data.dependencyStatus[0].satisfied) {
      return (
        <>
          <WalletConnect
            isLogin={true}
            walletConnectVisible={walletConnectVisible}
            setwalletConnectVisible={setwalletConnectVisible}
            particularChain={
              dependency.data.dependencyStatus[0].dependency.split("_")[0]
            }
            setupdateCounter={(c) => {
              location.reload();
            }}
          />
          <span className={styles.missingDependency}>
            <button
              onClick={() => {
                let dc = dependency.data.dependencyStatus[0].dependency;
                if (dc == "EVM_WALLET" || dc == "SOL_WALLET") {
                  return setwalletConnectVisible(true);
                }
                let url = encodeURIComponent(
                  `${location.pathname.replace("/", "")}`
                );

                location.href = `/connect/${dependency.data.dependencyStatus[0].dependency}?redirect=${url}`;
              }}
            >
              {
                dependencyMap[dependency.data.dependencyStatus[0].dependency]
                  .btn
              }
            </button>
            <p>
              {
                dependencyMap[dependency.data.dependencyStatus[0].dependency]
                  .msg
              }
            </p>
          </span>
        </>
      );
    }

    //Loading task
    if (loading) {
      return (
        <span className={styles.taskNav}>
          <button
            className={styles.startBtn}
            onClick={() => {
              startTask();
            }}
          >
            Start
          </button>
          <button>
            Verify <img src="/white-loader.gif" alt="" />
          </button>
        </span>
      );
    }

    return (
      <>
        <span className={styles.taskNav}>
          <button
            className={styles.startBtn}
            onClick={() => {
              startTask();
            }}
          >
            Start
          </button>
          <button
            onClick={() => {
              verifyTask();
            }}
          >
            Verify
          </button>
        </span>
      </>
    );
  };

  return (
    <div className={styles.task + " " + taskStatus}>
      <span className={styles.count}>{no}</span>
      <div className={styles.textCont}>
        <h1>{data.name}</h1>
        <p>{limitText(100, data.description)}</p>
      </div>
      <NavStatus />
    </div>
  );
}

let dependencyMap = {
  DISCORD_ACCOUNT: {
    msg: "*Connect your Discord account to unlock this task*",
    btn: "Connect Discord",
  },
  TWITTER_ACCOUNT: {
    msg: "*Connect your Twitter account to unlock this task*",
    btn: "Connect Twitter",
  },
  EVM_WALLET: {
    msg: "*Connect your EVM wallet to unlock this task*",
    btn: "Connect EVM wallet",
  },
  SOL_WALLET: {
    msg: "*Connect your Solana wallet to unlock this task*",
    btn: "Connect SOL wallet",
  },
};

export const getServerSideProps = async (ctx) => {
  let mission_id = ctx.query.slug[0];
  if (mission_id == "daoplanet") {
    mission_id = "63fa5f2467a56d9329d84b3a";
  }
  if (mission_id == "646889a2b16f108d31b4ab4d") {
    return {
      redirect: {
        permanent: false,
        destination: "/mission/btcpizzaday",
      },
    };
  }

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

//Quiz state
const useQuizStore = create((set) => ({
  quiz: {},
  initTrue: false,
  qNo: 0,
  maxQNo: 0,
  setQno: (data) =>
    set((state) => {
      state.qNo = data;
      state.maxQNo = data;
      return { ...state };
    }),
  sequenceStatus: [],
  setSequence: (data) =>
    set((state) => {
      state.sequenceStatus = data;
      return { ...state };
    }),
  qMove: (move) => qMove(set, move),
  registerAnswer: (answer) => registerAnswer(set, answer),
  initQuiz: (data) =>
    set((state) => {
      state.quiz = data;
      state.initTrue = true;
      return { ...state };
    }),
}));

const qMove = (set, move) => {
  set((state) => {
    if (move) {
      if (state.qNo < Object.keys(state.quiz).length - 1) {
        if (
          state.qNo + 1 > state.maxQNo &&
          state.sequenceStatus[state.qNo] == "UNANSWERED"
        ) {
          console.log("Block");
        } else {
          state.qNo = state.qNo + 1;
        }
      }
    } else {
      if (state.qNo >= 1) {
        state.qNo = state.qNo - 1;
      }
    }
    return { ...state };
  });
};

const registerAnswer = (set, answer) => {
  // answer = {m_id,q_id,answer}

  return set((state) => {
    console.log(state);
    let prev = [];
    if (state.quiz[answer.q_id].type == "MCQ") {
      if (
        state.quiz[answer.q_id].answerByUser &&
        state.quiz[answer.q_id].answerByUser.includes(answer.answer)
      ) {
        //deselect the option
        state.quiz[answer.q_id].answerByUser = state.quiz[
          answer.q_id
        ].answerByUser.filter((elm) => elm != answer.answer);
        return { ...state };
      }
      //if mcq get previous answer else get empty array
      prev = state.quiz[answer.q_id].answerByUser || [];
    }
    // add answer to existing answers
    state.quiz[answer.q_id].answerByUser = [...prev, answer.answer];
    state.quiz[answer.q_id].status = "LOADING";
    return { ...state };
  });
};

const Quiz = ({ mission }) => {
  let quizStore = useQuizStore();
  let quiz = mission.questions;
  let question = quiz[quizStore.qNo];
  let status = useQuery(["quiz-status", mission], async (query) => {
    let m = query.queryKey[1];
    let res = await axios.get(`${P_API}/mission/${m._id}/my-status`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status == 200) {
      return res.data.data;
    } else {
      throw new Error("status undefined");
    }
  });

  useEffect(() => {
    // init quiz state
    if (status.isSuccess) {
      let questionState = status.data.attemptedMission.questions;
      initData(questionState);
    }
  }, [status.isSuccess]);

  useEffect(() => {
    if (question.type == "SLIDE" && status.isSuccess) {
      quizStore.registerAnswer({
        m_id: mission._id,
        q_id: question._id,
        answer: 0,
      });
    }
  }, [question.type, status.isSuccess]);

  const initData = (questionState) => {
    let sequenceStatus = [];
    quiz.forEach((q, idx) => {
      console.log(q);
      if (questionState[q._id]) {
        questionState[q._id].type = q.type;
        sequenceStatus.push(questionState[q._id].status);
      }
    });
    quizStore.setSequence(sequenceStatus);
    quizStore.initQuiz(questionState);

    //Set Current question
    //Check for First unswered question
    let idx = sequenceStatus.indexOf("UNANSWERED");

    if (idx == 0) {
      quizStore.setQno(0);
    } else if (idx == -1) {
      quizStore.setQno(sequenceStatus.length - 1);
    } else {
      setTimeout(() => {
        quizStore.setQno(idx);
      }, 0);
    }
  };

  const updateData = (questionState) => {
    let sequenceStatus = [];
    quiz.forEach((q, idx) => {
      if (questionState[q._id]) {
        questionState[q._id].type = q.type;
        sequenceStatus.push(questionState[q._id].status);
      }
    });
    quizStore.setSequence(sequenceStatus);
    quizStore.initQuiz(questionState);

    //Set Current question
    //Check for First unswered question
    let idx = sequenceStatus.indexOf("UNANSWERED");

    if (idx == 0) {
      quizStore.setQno(0);
    } else if (idx == -1) {
      quizStore.setQno(sequenceStatus.length - 1);
    } else {
      setTimeout(() => {
        quizStore.setQno(idx);
      }, 1500);
    }
  };

  if (!status.isSuccess || !quizStore.initTrue) {
    return (
      <>
        {" "}
        <div className={styles.signUp}>
          <p>Sign in or Sign up to access the Missions.</p>
          <button
            onClick={() => {
              location.href = "/?signup=true";
            }}
          >
            Login/Sign Up
          </button>
        </div>
        <img
          style={{ marginBottom: "100px", width: "100%", maxWidth: "1080px" }}
          src="/quiz_placeholder.svg"
          alt=""
        />
      </>
    );
  }

  console.log(quizStore);

  const Option = ({ data, no }) => {
    let status = quizStore.quiz[question._id];

    if (status.status == "LOADING") {
      let user_ans = [];
      if (typeof status.answerByUser == "object") {
        user_ans = status.answerByUser;
      } else {
        user_ans = [status.answerByUser];
      }

      if (user_ans.includes(no)) {
        let opt_style = styles.option + " " + styles.loading;

        return (
          <span
            onClick={() => {
              quizStore.registerAnswer({
                m_id: mission._id,
                q_id: question._id,
                answer: no,
              });
            }}
            className={opt_style}
          >
            {data.prompt}
          </span>
        );
      }

      return (
        <span
          onClick={() => {
            quizStore.registerAnswer({
              m_id: mission._id,
              q_id: question._id,
              answer: no,
            });
          }}
          className={styles.option}
        >
          {data.prompt}
        </span>
      );
    }

    if (status.status == "ANSWERED") {
      let user_ans = [];
      let correct_ans = [];
      if (typeof status.answerByUser == "object") {
        user_ans = status.answerByUser;
      } else {
        user_ans = [status.answerByUser];
      }
      //correctAnswer
      if (typeof status.correctAnswer == "object") {
        correct_ans = status.correctAnswer;
      } else {
        correct_ans = [status.correctAnswer];
      }

      const getStyle = () => {
        //User anwer state
        let opt_style = styles.option;
        if (user_ans.includes(no)) {
          if (status.isCorrect) {
            opt_style = styles.option + " " + styles.right;
          } else {
            opt_style = styles.option + " " + styles.wrong;
          }
        }
        return opt_style;
      };

      return (
        <span className={getStyle()}>
          {data.prompt}
          {correct_ans.includes(no) && (
            <img src="/assets/tick.png" className={styles.correct}></img>
          )}
        </span>
      );
    }

    if (status.status == "UNANSWERED") {
      return (
        <span
          onClick={() => {
            quizStore.registerAnswer({
              m_id: mission._id,
              q_id: question._id,
              answer: no,
            });
          }}
          className={styles.option}
        >
          {data.prompt}
        </span>
      );
    }
  };

  const submitAnswer = async () => {
    let res = await axios.post(
      `${process.env.P_API}/mission/${mission._id}/question-answer/${question._id}`,
      {
        answer: quizStore.quiz[question._id].answerByUser,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status == 200) {
      updateData(res.data.data.attemptedMission.questions);
    }
  };

  const getAnswerCount = () => {
    let count = 0;
    Object.values(quizStore.quiz).forEach((ele) => {
      if (ele.isCorrect) {
        count = count + 1;
      }
    });
    return count;
  };

  const isQuizComplete = () => {
    let ans = 0;
    Object.values(quizStore.quiz).forEach((ele) => {
      if (ele.status == "ANSWERED") {
        ans = ans + 1;
      }
    });
    return Object.values(quizStore.quiz).length == ans;
  };

  const getCompletedCountPercent = () => {
    let ans = 0;
    Object.values(quizStore.quiz).forEach((ele) => {
      if (ele.status == "ANSWERED") {
        ans = ans + 1;
      }
    });
    return Math.ceil((ans / quiz.length) * 100);
  };

  let markdown = question.prompt;

  return (
    <div className={styles.quiz} key={"question-no " + quizStore.qNo}>
      <h3 className={styles.subtitle}>
        Quiz completed {getCompletedCountPercent()}%
      </h3>
      <div className={styles.progress}>
        <span
          style={{
            width: `${getCompletedCountPercent()}%`,
          }}
          className={styles.innerProgress}
        ></span>
      </div>
      {question.type == "SLIDE" ? (
        <div className={styles.qWrapperSlide}>
          <div className={styles.qCon}>
            <div
              className={styles.markdown}
              data-color-mode="light"
              key={"overview"}
            >
              {Boolean(EditerMarkdown) && <EditerMarkdown source={markdown} />}
            </div>
            <div className={styles.qNav}>
              <span className={styles.ansCount}>
                <span className={styles.qArrows}>
                  <button
                    onClick={() => {
                      quizStore.qMove(false);
                    }}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => {
                      quizStore.qMove(true);
                    }}
                  >
                    {">"}
                  </button>
                </span>
                <p>Correct Answers : </p>
                <h1>
                  <span
                    key={"ans-no " + quizStore.qNo}
                    style={{ color: "green" }}
                  >
                    {getAnswerCount()}
                  </span>
                  /{quiz.length}
                </h1>
              </span>
              {!isQuizComplete() ? (
                <button
                  disabled={
                    quizStore.quiz[question._id].status == "ANSWERED" ||
                    !quizStore.quiz[question._id].answerByUser ||
                    quizStore.quiz[question._id].answerByUser.length <= 0
                  }
                  onClick={() => {
                    submitAnswer();
                  }}
                  className={styles.submit}
                >
                  Continue
                </button>
              ) : (
                <button
                  disabled={status.data.attemptedMission.isCompleted}
                  onClick={() => {
                    claimMission(mission);
                  }}
                  className={styles.submit}
                >
                  Claim Mission
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.qWrapper}>
          <div className={styles.qCon}>
            <>
              <h3 className={styles.title}>{question.prompt}</h3>
              <div className={styles.tags}>
                {question.type == "SCQ" ? (
                  <Tag
                    key={"qt"}
                    color={"rgb(130,71,229)"}
                    title={"Single Answer Question"}
                    src={"/single_answer.svg"}
                  />
                ) : (
                  <Tag
                    key={"qt"}
                    color={"rgb(230,0,122)"}
                    title={"Multi Answer Question"}
                    src={"/mult_answer.svg"}
                  />
                )}
              </div>
            </>

            <div className={styles.qList}>
              {question.options.map((ele, idx) => {
                return <Option key={idx + "option"} data={ele} no={idx + 1} />;
              })}
            </div>
            <div className={styles.qNav}>
              <span className={styles.ansCount}>
                <span className={styles.qArrows}>
                  <button
                    onClick={() => {
                      quizStore.qMove(false);
                    }}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => {
                      quizStore.qMove(true);
                    }}
                  >
                    {">"}
                  </button>
                </span>
                <p>Correct Answers : </p>
                <h1>
                  <span
                    key={"ans-no " + quizStore.qNo}
                    style={{ color: "green" }}
                  >
                    {getAnswerCount()}
                  </span>
                  /{quiz.length}
                </h1>
              </span>
              {!isQuizComplete() ? (
                <button
                  disabled={
                    quizStore.quiz[question._id].status == "ANSWERED" ||
                    !quizStore.quiz[question._id].answerByUser ||
                    quizStore.quiz[question._id].answerByUser.length <= 0
                  }
                  onClick={() => {
                    submitAnswer();
                  }}
                  className={styles.submit}
                >
                  Submit
                </button>
              ) : (
                <button
                  disabled={status.data.attemptedMission.isCompleted}
                  onClick={() => {
                    claimMission(mission);
                  }}
                  className={styles.submit}
                >
                  Claim Mission
                </button>
              )}
            </div>
          </div>
          <span className={styles.xp}>
            <p>Rewards</p>
            <span className={styles.xpCount}>
              <img src="/missions/coin.svg" alt="" />
              <h1>{question.listingXP} XP</h1>
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

function compareArrays(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays
  const sortedArr1 = arr1.sort();
  const sortedArr2 = arr2.sort();

  // Compare the sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export default Index;
