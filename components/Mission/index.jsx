import React, { useEffect, useState } from "react";
import styles from "./compMission.module.scss";
import Link from "next/link";
import axios from "axios";

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

let defaultChip = { color: "", status: false, text: "", iconSrc: "" };
let date = {
  color: "red",
  status: true,
  text: "3 days left",
  iconSrc: "/missions/date.png",
};

const getChipType = () => {
  return defaultChip;
};

let P_API = process.env.P_API;

export default function Component({ min, data, isCompleted }) {
  let chip = getChipType();

  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        borderColor: "color" in chip ? chip.color : "",
      }}
      className={styles.mission + " " + (min ? styles.missionMin : "")}
    >
      {chip.status && (
        <div className={styles.timeChip}>
          <img src={chip.iconSrc} alt="" />
          <p>3 days left</p>
        </div>
      )}
      <Link href={`/mission/${data._id}`}>
        <span className={styles.topCon + " " + (isCompleted && styles.blur)}>
          <img
            src={data.listing.photo.logo.secure_url || "/blue.png"}
            alt=""
            className={styles.profileImg}
          />
          <h2>{limitText(20, data.listing.name)}</h2>
          <h1>{limitText(20, data.name)}</h1>
          <p>{limitText(55, data.description)}</p>
          <div className={styles.tags}>
            {data.tags.map((tgs, idx) => {
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
        </span>
      </Link>
      {!isCompleted ? (
        <div className={styles.xpCon}>
          <img src="/missions/coin.png" alt="" />
          <p>{data.listingXP} XP</p>
          <img src="/missions/save.png" alt="" />
          <img src="/missions/share.png" alt="" />
        </div>
      ) : (
        <div className={styles.xpCon + " " + styles.missionCompleted}>
          <p>Completed</p> <img src="/missions/tick.png" alt="" />
        </div>
      )}
    </div>
  );
}

function limitText(count, text) {
  if (text.length < count) return text;
  let snippedText = text.substring(0, count);
  return snippedText + "...";
}
