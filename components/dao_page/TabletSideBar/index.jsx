import styles from "./tabletSideBar.module.scss";
import Link from "next/link";
import React, { useState, useEffect } from "react";

//utils
import numFormatter from "../../../utils/numFormatter";
import openNewTab from "../../../utils/openNewTab";

//assets
import discord_white from "../../../assets/icons/twitter_white.svg";
import twitter_white from "../../../assets/icons/discord_white.svg";
import eth_chain_icon from "../../../assets/icons/eth_chain_icon.svg";
import sol_chain_icon from "../../../assets/icons/sol_chain_icon.svg";
import near_chain_icon from "../../../assets/icons/near_chain_icon.svg";
import matic_chain_icon from "../../../assets/icons/matic_chain_icon.svg";
import binance_smart_chain from "../../../assets/icons/bsc_chain_icon.svg";
import globe_white from "../../../assets/icons/web_white.svg";

const TabletSideBar = ({ dao_data, chainMap }) => {
  let chainIconMap = chainMap;
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

  let getChainIcon = (chain) => {
    return (
      <Link href={`/discover?chain=${chain}`}>
        <span
          style={{ backgroundColor: `${chainIconMap[chain].color}` }}
          className={styles.chain_tag}
        >
          <img src={chainIconMap[chain].icon} alt="" />
          {chainIconMap[chain].ticker}
        </span>
      </Link>
    );
  };

  return (
    <div className={styles.tabletSideBar}>
      <span className={styles.partnerRow}>
        <div className={styles.btn_row}>
          <button
            onClick={() => {
              openNewTab(dao_data.socials_map["TWITTER"]?.link);
            }}
            className={styles.soc_btn}
            style={{ background: "#1DA1F2" }}
          >
            <img src={twitter_white.src} alt="" />
            {numFormatter(dao_data.socials_map["TWITTER"]?.meta?.count)}
          </button>
          {dao_data.categories.includes("Investors") ? (
            <button
              onClick={() => {
                openNewTab(`mailto:${dao_data?.email}`);
              }}
              className={styles.soc_btn}
              style={{ background: "#4962FE" }}
            >
              <img
                style={{ margin: "unset", filter: "invert(100%)" }}
                src={"/email.png"}
                alt=""
              />
              {/* {numFormatter(dao_data?.discord_members)} */}
            </button>
          ) : (
            <button
              onClick={() => {
                openNewTab(dao_data.socials_map["DISCORD"]?.link);
              }}
              className={styles.soc_btn}
              style={{ background: "#4962FE" }}
            >
              <img src={discord_white.src} alt="" />
              {numFormatter(dao_data.socials_map["DISCORD"]?.meta?.count)}
            </button>
          )}
          <button
            onClick={() => {
              openNewTab(dao_data.socials_map["WEBSITE"]?.link);
            }}
            className={styles.soc_btn}
            style={{ background: "#121212" }}
          >
            <img style={{ marginRight: "0" }} src={globe_white.src} alt="" />
          </button>
        </div>
        <button
          onClick={() => {
            openNewTab("/partner.html");
          }}
          className={styles.partnerBtn}
        >
          🤝 Partner with Us
        </button>
      </span>
      <div className={styles.tablet_dial_sec}>
        <div className={styles.chain_row}>
          <p>Chain</p>
          <span className={styles.chain_icons}>
            {dao_data.chains.map((ele) => {
              return getChainIcon(ele);
            })}
          </span>
        </div>
        <div className={styles.dialSectablet}>
          <span>
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
          </span>
          <span>
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
          </span>
        </div>
      </div>
    </div>
  );
};

export default TabletSideBar;
