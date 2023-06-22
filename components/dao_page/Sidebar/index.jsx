import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.scss";
import Link from "next/link";

//utils
import numFormatter from "../../../utils/numFormatter";
import openNewTab from "../../../utils/openNewTab";
import discord_white from "../../../assets/icons/twitter_white.svg";
import twitter_white from "../../../assets/icons/discord_white.svg";
import copy_icon from "../../../assets/icons/copy_icon.svg";
import eth_chain_icon from "../../../assets/icons/eth_chain_icon.svg";
import sol_chain_icon from "../../../assets/icons/sol_chain_icon.svg";
import near_chain_icon from "../../../assets/icons/near_chain_icon.svg";
import matic_chain_icon from "../../../assets/icons/matic_chain_icon.svg";
import web_white from "../../../assets/icons/web_white.svg";

import chainIconMap from "../../../components/chainIconMap.json";

let getChainIcon = (chain) => {
  return (
    <Link href={`/discover?chain=${chain}`}>
      <span
        style={{
          backgroundColor: `${chainIconMap[chain].color}`,
          cursor: "pointer",
        }}
        className={styles.chain_tag}
      >
        <img src={chainIconMap[chain].icon} alt="" />
        {chainIconMap[chain].ticker}
      </span>
    </Link>
  );
};

const Sidebar = ({ dao_data }) => {
  console.log(dao_data);

  let key_label_map = {
    "Community Vibes": "resonate_vibes_rate",
    "Onboarding Experience": "onboarding_exp",
    "Having a Voice": "opinions_matter",
    "Organizational Structure": "great_org_structure",
    "Recommendation to a friend": "friend_recommend",
    "Incentives for Members": "great_incentives",
  };

  let DialComp = ({ label, range }) => {
    return (
      <div className={styles.dialCon}>
        <p className={styles.label}>{label}</p>
        <span className={styles.barCon}>
          <span className={styles.bar}>
            <div style={{ width: `${range}%` }} className={styles.range}></div>
          </span>
          <p>{`${range}` / 10}</p>
        </span>
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.socials}>
        <button
          onClick={() => {
            openNewTab("/partner.html");
          }}
          className={styles.long_btn + " " + styles.partner}
          style={{ gridArea: "a" }}
        >
          🤝 Partner with Us
        </button>
        <button
          style={{ gridArea: "b" }}
          className={styles.twitter_soc}
          onClick={() => {
            openNewTab(dao_data.socials_map["TWITTER"].link);
          }}
        >
          <img src={twitter_white.src} alt="" />
          {numFormatter(dao_data.socials_map["TWITTER"].meta.count)}
        </button>
        {dao_data.categories.includes("Investors") ? (
          <button
            style={{ gridArea: "c" }}
            className={styles.discord_soc}
            onClick={() => {
              openNewTab(`mailto:${dao_data?.email}`);
            }}
          >
            <img src={"/email.png"} alt="" style={{ filter: "unset" }} />

            {/* {numFormatter(dao_data?.discord_members)} */}
          </button>
        ) : (
          <button
            className={styles.discord_soc}
            onClick={() => {
              openNewTab(dao_data.socials_map["DISCORD"].link);
            }}
          >
            <img src={discord_white.src} alt="" />
            {numFormatter(dao_data.socials_map["DISCORD"].meta.count)}
          </button>
        )}
        <button
          onClick={() => {
            openNewTab(dao_data.socials_map["WEBSITE"].link);
          }}
          className={styles.web_soc}
          style={{ gridArea: "d" }}
        >
          {<img src={web_white.src} />}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `https://www.truts.xyz/community/${dao_data.slug}`
            );
            document.querySelector("#copy_2").src = "/copy_after.png";
          }}
          className={styles.long_btn}
        >
          truts.xyz/community/{dao_data.slug}
          <img
            id="copy_2"
            style={{ filter: "invert(0 )" }}
            src={copy_icon.src}
            alt=""
          />
        </button>
      </div>
      <span className={styles.chain_con}>
        <p>Chain</p>
        <span className={styles.chain_icons}>
          {dao_data.chains.map((ele) => {
            return getChainIcon(ele);
          })}
        </span>
      </span>
      <div className={styles.dialSec}>
        <DialComp
          label={"Community Vibes"}
          range={Math.ceil(dao_data.reviews.meta["resonate_vibes_rate"])}
        />
        <DialComp
          label={"Onboarding Experience"}
          range={Math.ceil(dao_data.reviews.meta["onboarding_exp"])}
        />
        <DialComp
          label={"Organizational Structure"}
          range={Math.ceil(dao_data.reviews.meta["great_org_structure"])}
        />
        <DialComp
          label={"Incentives for Members"}
          range={Math.ceil(dao_data.reviews.meta["great_org_structure"])}
        />
        <DialComp
          label={"Having a Voice"}
          range={Math.ceil(dao_data.reviews.meta["opinions_matter"])}
        />
        <DialComp
          label={"Recommendation to a friend"}
          range={Math.ceil(dao_data.reviews.meta["friend_recommend"])}
        />
      </div>
    </div>
  );
};

// "friend_recommend": 85,
// "great_incentives": 84.51612903225806,
// "great_org_structure": 83.29032258064517,
// "onboarding_exp": 84.35483870967742,
// "opinions_matter": 81.7741935483871,
// "resonate_vibes_rate": 87.03225806451613

const textLimiter = (name) => {
  if (name.length > 30) {
    return name.slice(0, 30) + "...";
  }
  return name;
};

export default Sidebar;
