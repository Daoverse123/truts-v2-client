import React from "react";
import styles from "./card.module.scss";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";

// ASSETS
import verified from "./../../assets/icons/verified.svg";
import star from "./../../assets/icons/star_white.svg";
import globe from "./../../assets/icons/Globe_grey.svg";
import twitter from "./../../assets/icons/Twitter_grey.svg";
import discord from "./../../assets/icons/Discord_grey.svg";

export default function DAOCard({ data: source_data }) {
  let socials_map = {};
  source_data.socials.forEach((ele) => {
    socials_map[ele.platform] = ele;
  });
  source_data.socials_map = socials_map;

  let data = source_data;

  let name = data.name;
  if (name.length > 20) {
    name = data.name.slice(0, 20) + "...";
  }

  // h 114 w 313
  return (
    <Link href={`/community/${data.slug}`}>
      <div className={styles.card}>
        {name.length > 20 && <ReactTooltip backgroundColor={"#747c90"} />}
        <div className={styles.cover}>
          <img
            src={data.photo.cover.secure_url}
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.src =
                "https://upload.wikimedia.org/wikipedia/commons/e/e3/Pink_tints_and_shades.svg";
            }}
          />
        </div>
        <div className={styles.info}>
          <span className={styles.title}>
            {data.name.length > 20 ? (
              <h1 id={"w1" + name} data-tip={data.name}>
                {name}
              </h1>
            ) : (
              <h1>{name}</h1>
            )}
            <img src={verified.src} alt="" />
          </span>
          <div className={styles.review_stats}>
            <div className={styles.ratingBox}>
              <span>{addDecimal(data.rating)}</span>
              <img src={star.src} alt="" />
            </div>
            <span className={styles.review_count}>
              {data.review_count} reviews
            </span>
          </div>
          <div className={styles.social_icons}>
            <span className={styles.icon}>
              <img
                src={globe.src}
                alt=""
                onClick={(e) => {
                  data.socials_map["WEBSITE"]?.link &&
                    openNewTab(data.socials_map["WEBSITE"].link);
                  e.stopPropagation();
                }}
              />
            </span>
            <span className={styles.icon}>
              <img
                src={twitter.src}
                alt=""
                onClick={(e) => {
                  data.socials_map["TWITTER"]?.link &&
                    openNewTab(data.socials_map["TWITTER"].link);
                  e.stopPropagation();
                }}
              />
              <p
                onClick={(e) => {
                  data.socials_map["TWITTER"]?.link &&
                    openNewTab(data.socials_map["TWITTER"].link);
                  e.stopPropagation();
                }}
              >
                {data.socials_map["TWITTER"]?.meta
                  ? numFormatter(data.socials_map["TWITTER"].meta.count)
                  : "n/a"}
              </p>
            </span>
            <span className={styles.icon}>
              <img
                src={discord.src}
                alt=""
                onClick={(e) => {
                  data.socials_map["DISCORD"]?.link &&
                    openNewTab(data.socials_map["DISCORD"].link);
                  e.stopPropagation();
                }}
              />
              <p
                onClick={(e) => {
                  data.socials_map["DISCORD"]?.link &&
                    openNewTab(data.socials_map["DISCORD"].link);
                  e.stopPropagation();
                }}
              >
                {data.discord_members
                  ? numFormatter(data.discord_members)
                  : "n/a"}
              </p>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function limitText(text) {
  if (text.length < 18) return text;
  let snippedText = text.substring(0, 18);
  return snippedText + "...";
}

function numFormatter(num) {
  if (!num) return "n/a";
  if (isNaN(num)) return "n/a";

  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
}

const openNewTab = (url) => {
  if (url.length < 1) return;
  let a = document.createElement("a");
  a.target = "_blank";
  a.href = url;
  a.click();
};

const addDecimal = (num) => {
  if (!num) return "0.0";
  let str = `${num}`;
  if (str.length > 1) {
    return Math.round(num * 10) / 10;
  } else {
    return str + ".0";
  }
};
