import React, { useEffect, useRef, useState } from "react";
import styles from "./spinner.module.scss";
import { useQuery } from "react-query";
import Countdown from "react-countdown";

//Components
import Wheel from "./Wheel";
import Success from "./Success";

import axios from "axios";

function Spinner({ setvisible }) {
  const [spinCount, setspinCount] = useState(0);
  const [reward, setreward] = useState(null);
  const [claimPage, setclaimPage] = useState(false);

  let SIZE = 300;

  let WheelApi = useQuery({
    queryKey: ["wheel"],
    queryFn: async () => {
      let res = await axios.get(`${process.env.P_API}/wheel`);
      if (res.status === 200) {
        return res.data.data.wheel.rewards;
      } else {
        //throw error
        new Error("Wheel Error", res.status);
      }
    },
  });

  let SpinAbility = useQuery({
    queryKey: ["spinAbility", spinCount],
    queryFn: async () => {
      let token = localStorage.getItem("token");
      if (!token) return new Error("No Token");
      let res = await axios.get(`${process.env.P_API}/wheel/my-status`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        return res.data.data.spin;
      } else {
        //throw error
        new Error("Wheel Error", res.status);
      }
    },
  });

  //Make Spin Request
  const makeSpinRequest = async () => {
    let token = localStorage.getItem("token");
    if (!token) return new Error("No Token");
    let res = await axios.get(`${process.env.P_API}/wheel/spin`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (res.status === 200) {
      let slot = res.data.data.reward.slot;
      setspinCount(spinCount + 1);
      setTimeout(() => {
        setreward(res.data.data.reward);
      }, 3500);
      spinWheel(slot);
    } else {
      //throw error
      new Error("Wheel Error", res.status);
    }
  };

  const spinWheel = (idx) => {
    const wheelRef = document.querySelector("#spinWheel");

    wheelRef.style.transition = "all cubic-bezier(1, 1.46, 0.71, 0.83) 3s";

    wheelRef.style.transform = `rotate(${0}deg)`;
    switch (idx) {
      case 1:
        return (wheelRef.style.transform = `rotate(${720 + 70}deg)`);
      case 2:
        return (wheelRef.style.transform = `rotate(${720 + 20}deg)`);
      case 3:
        return (wheelRef.style.transform = `rotate(${720 - 20}deg)`);
      case 4:
        return (wheelRef.style.transform = `rotate(${720 - 60}deg)`);
      case 5:
        return (wheelRef.style.transform = `rotate(${720 + 360 - 110}deg)`);
      case 6:
        return (wheelRef.style.transform = `rotate(${720 + 360 - 160}deg)`);
      case 7:
        return (wheelRef.style.transform = `rotate(${720 + 360 - 200}deg)`);
      case 8:
        return (wheelRef.style.transform = `rotate(${720 + 360 - 250}deg)`);
    }
  };

  useEffect(() => {
    if (reward) {
      setclaimPage(true);
    }
  }, [reward]);

  if (WheelApi.isLoading || !WheelApi.isSuccess) {
    return <div>Loading...</div>;
  }

  let canSpin =
    SpinAbility.isLoading || !SpinAbility.isSuccess
      ? false
      : SpinAbility.data.ability;

  return (
    <div className={styles.spinnerPage}>
      {claimPage ? (
        <Success setvisible={setvisible} reward={reward} />
      ) : (
        <>
          <div className={styles.spinner}>
            <div
              onClick={() => {
                setvisible(false);
              }}
              className={styles.back}
            >
              <img src="/missions/arrow.png" alt="" />
              <p>Back</p>
            </div>
            <div className={styles.title}>
              <span className={styles.logo}>
                <img src="/favicon.png" alt="" />
              </span>
              <span>
                <h1>Spin the Wheel</h1>
                <p>
                  {
                    "Check in everyday to stand a chance to\n win XPs and Rewards Daily."
                  }
                </p>
              </span>
            </div>
            {/* progress */}
            <StreakProgress spinCount={spinCount} />
            <div
              style={{
                display: "flex",
                width: `${SIZE}px`,
                height: `${SIZE}px`,
                minWidth: `${SIZE}px`,
                minHeight: `${SIZE}px`,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                id="spinWheel"
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background:
                    "linear-gradient(90deg, #5E1ED1 0%, #3065F3 100%)",
                  transform: "rotate(0deg)",
                }}
                className={styles.wheel}
              >
                <Wheel wheelData={WheelApi.data} />
              </div>
              <div className={styles.pointer}>
                <img src="/favicon.png" />
                <span className={styles.arrow}></span>
              </div>
            </div>
            <div className={styles.bottomNav}>
              {canSpin && (
                <button
                  disabled={!canSpin}
                  className={styles.spinButton}
                  onClick={() => {
                    makeSpinRequest();
                  }}
                >
                  Spin
                </button>
              )}
              {SpinAbility.isSuccess && !canSpin && (
                <Timer
                  spinCount={spinCount}
                  nextSpin={SpinAbility.data.nextSpin}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const StreakProgress = ({ spinCount }) => {
  //current streak
  const [showInfo, setshowInfo] = useState(false);
  let currentStreak = useQuery({
    queryKey: ["current-streak", spinCount],
    queryFn: async () => {
      let token = localStorage.getItem("token");
      if (!token) return new Error("No Token");
      let res = await axios.get(`${process.env.P_API}/wheel/my-streak`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        return res.data.data;
      } else {
        //throw error
        new Error("Wheel Error", res.status);
      }
    },
  });

  if (currentStreak.isLoading || !currentStreak.isSuccess) {
    return <div>Loading...</div>;
  }
  let streakCount = currentStreak.data.record.count;
  let streakMapping = currentStreak.data.mapping;
  let targetDays = Object.keys(streakMapping).find((ele) => {
    return parseInt(ele) >= streakCount;
  });

  return (
    <div className={styles.streak}>
      <span className={styles.progressText}>
        <p>
          🔥
          <span className={styles.grad}>{streakCount}</span>/{targetDays} Days
          Streak ({streakMapping[targetDays].reward.name})
        </p>
        <div
          onMouseEnter={() => {
            setshowInfo(true);
          }}
          onMouseLeave={() => {
            setshowInfo(false);
          }}
          className={styles.infoPane}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className={styles.infoImage}
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
          {showInfo && (
            <div className={styles.infoText}>
              <h1>Streak Rewards</h1>
              <h2>
                Earn XPs for at every stage. See the checkpoints below to
                understand more. These XPs will be added to your account.
              </h2>
              {Object.keys(streakMapping).map((ele) => {
                return (
                  <p>
                    {ele} days - {streakMapping[ele].reward.name}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </span>

      <div className={styles.progressBar}>
        <span
          style={{
            width: `${(parseInt(streakCount) / targetDays) * 100}%`,
          }}
          className={styles.progressInner}
        ></span>
      </div>
    </div>
  );
};

const Timer = ({ nextSpin, spinCount }) => {
  let date = new Date(nextSpin);
  let localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  let isLoggedIn = localStorage.getItem("token") ? true : false;

  if (!isLoggedIn)
    return (
      <span
        style={spinCount > 0 ? { opacity: 0 } : {}}
        className={styles.timer}
      >
        <button
          onClick={() => {
            window.showSignupPrompt();
          }}
          className={styles.spinButton}
        >
          Login
        </button>
      </span>
    );
  return (
    <span style={spinCount > 0 ? { opacity: 0 } : {}} className={styles.timer}>
      <p>Next Spin Count Down</p>
      <Countdown date={date} />
    </span>
  );
};

const SpinnerPage = () => {
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    if (location.hash === "#spinner") {
      setvisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      location.hash = "#spinner";
      //disable scroll on body
      document.body.style.overflow = "hidden";
    } else {
      location.hash = "";
      //enable scroll on body
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  if (visible) return <Spinner setvisible={setvisible} />;

  return (
    <img
      className={styles.spinIcon}
      src="/spinner.png"
      onClick={() => setvisible(true)}
    />
  );
};
export default SpinnerPage;
