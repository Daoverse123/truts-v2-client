import React from "react";
import styles from "./spinner.module.scss";

import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

function Success({ reward, setvisible }) {
  console.log(reward);
  let description = reward.meta.description;

  let icon_url = reward.meta.icon_url;

  let text = reward.meta.text;

  let title = reward.meta.title;

  return (
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
      <div className={styles.confetti}>
        <ParticlesCon />
      </div>
      <div className={styles.successtitle}>
        <span className={styles.logo}>
          <img src="/favicon.png" alt="" />
        </span>

        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className={styles.reward}>
        <img src={icon_url || "/xpCoin.png"} alt="" />
        <h1>{text}</h1>
      </div>
    </div>
  );
}

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

export default Success;
