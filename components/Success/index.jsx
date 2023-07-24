import React, { useEffect, useState, useCallback } from "react";
import styles from "./success.module.scss";
import { useQuery } from "react-query";
import Mission from "../Mission";
import axios from "axios";
import Button from "../Button";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

function Succes({ xp }) {
  let data = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      let missions = axios.get(`${process.env.P_API}/mission?page=1&limit=3`);
      let xp = await axios.get(`${process.env.P_API}/user/truts-xp`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      let res = await Promise.all([missions, xp]);

      return {
        missions: res[0].data.data.result,
        xp: res[1].data.data,
      };
    },
  });

  if (data.isLoading || !data.isSuccess) return <div></div>;

  let user = JSON.parse(localStorage.getItem("user-server"));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ParticlesCon />
        <div className={styles.profile}>
          <img src={`${user.photo.secure_url}`} alt="" />
          <div>
            <p>{user.name}</p>
            <p className={styles.gradient}>| @{user.username}</p>
          </div>
        </div>
        <p className={styles.copy}>
          Congratulations, you`ve earned {xp} XP for completing the mission!
        </p>
        <Level xp={xp} level={data.data.xp} />
        <h2 className={styles.ltext}>Continue with more missions</h2>
        <div className={styles.missionCon}>
          {data.isSuccess &&
            data.data.missions.map((ms) => {
              return <Mission key={ms._id} data={ms} />;
            })}
        </div>
        <span
          className={styles.nav}
          style={{
            zIndex: 100,
          }}
        >
          <Button
            onClick={() => {
              location.href = "/missions";
            }}
            label="Explore Missions"
          />
        </span>
      </div>
    </div>
  );
}

const Level = ({ xp, level }) => {
  const [viewXp, setviewXp] = useState(
    parseInt(level.totalTrutsXP) - parseInt(xp)
  );

  let barTotal =
    parseInt(level.totalTrutsXP) + parseInt(level.level.xpForNextLevel);

  useEffect(() => {
    setTimeout(() => {
      setviewXp(parseInt(level.totalTrutsXP));
    }, 1000);
  }, []);

  return (
    <div className={styles.progress}>
      <h1>Level {level.level.currentLevel}</h1>
      <div className={styles.bar}>
        <div className={styles.progressOutter}>
          <div
            style={{
              width: `${(viewXp / barTotal) * 100}%`,
            }}
            className={styles.progressInner}
          ></div>
        </div>
        <div className={styles.xp}>
          <p>
            {`${viewXp}`}/{`${barTotal}`}
          </p>
          <p className={styles.gradientText}>+{xp} XPs</p>
        </div>
      </div>
    </div>
  );
};

const ParticlesCon = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await container;
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    />
  );
};

let options = {
  fullScreen: {
    enable: false,
  },
  emitters: [
    {
      position: {
        x: 0,
        y: 0,
      },
      rate: {
        quantity: 15,
        delay: 0.3,
      },
      particles: {
        move: {
          direction: "top",
          outModes: {
            top: "none",
            left: "none",
            default: "destroy",
          },
        },
      },
    },
    {
      position: {
        x: 0,
        y: 30,
      },
      rate: {
        quantity: 100,
        delay: 3,
      },
      particles: {
        move: {
          direction: "top-right",
          outModes: {
            top: "none",
            left: "none",
            default: "destroy",
          },
        },
      },
    },
    {
      position: {
        x: 100,
        y: 30,
      },
      rate: {
        quantity: 100,
        delay: 3,
      },
      particles: {
        move: {
          direction: "top-left",
          outModes: {
            top: "none",
            right: "none",
            default: "destroy",
          },
        },
      },
    },
  ],
  particles: {
    color: {
      value: ["#ffffff", "#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"],
    },
    move: {
      decay: 0.05,
      direction: "top",
      enable: true,
      gravity: {
        enable: true,
      },
      outModes: {
        top: "none",
        default: "destroy",
      },
      speed: {
        min: 10,
        max: 50,
      },
    },
    number: {
      value: 0,
    },
    opacity: {
      value: 1,
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: "random",
      animation: {
        enable: true,
        speed: 30,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 30,
      },
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
      animation: {
        enable: true,
        startValue: "min",
        count: 1,
        speed: 16,
        sync: true,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -7,
        max: 7,
      },
    },
    shape: {
      type: ["circle", "square", "triangle", "polygon"],
      options: {
        polygon: [
          {
            sides: 5,
          },
          {
            sides: 6,
          },
        ],
      },
    },
  },
};

export default Succes;
