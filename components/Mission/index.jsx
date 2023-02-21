import React, { useEffect, useState } from "react";
import styles from "./compMission.module.scss";
import Link from "next/link";
import axios from "axios";
import Tooltip from "../../components/ToolTip";
import countBasedLength from "../../utils/countBasedLength";

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

const fetchCompleted = async (id, setter) => {
  let res = await axios.get(`${P_API}/mission/${id}/completed-by`);
  if (res.status == 200) {
    setter(res.data.data.completedBy);
  }
};

export default function Component({ min, data, isCompleted }) {
  let chip = getChipType();

  const [completed, setcompleted] = useState(null);

  useEffect(() => {
    fetchCompleted(data._id, setcompleted);
  }, []);

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
          <p
            style={{
              marginLeft: countBasedLength(completed.length),
            }}
          >
            + {completed.length} Completed
          </p>
        )}
      </div>
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
          <img src="/missions/coin.svg" alt="" />
          <p>{data.listingXP} XP</p>
          {/* <img src="/missions/save.png" alt="" /> */}
          <Tooltip
            init={"Copy Mission Link"}
            post={"Mission Link Copied !"}
            copyLink={`https://truts.xyz/mission/${data._id}`}
          >
            <img src="/missions/share.png" alt="" />
          </Tooltip>
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
