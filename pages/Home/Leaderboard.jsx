import styles from "./leaderboard.module.scss";
import { useState } from "react";

import gradstarFilled from "../../assets/icons/star_filled_gradient.svg";
import gradstarBlank from "../../assets/icons/star_blank_gradient.svg";

import discordIcon from "../../assets/icons/discord_white.svg";
import twitterIcon from "../../assets/icons/twitter_white.svg";
import webIcon from "../../assets/icons/web_white.svg";
import { useQuery } from "react-query";
import axios from "axios";
import openNewTab from "../../utils/openNewTab";

let entryColor = {
  1: {
    bg: "url('/leaderboard/gold.svg')",
    grad: "linear-gradient(90deg, rgba(225, 171, 75, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
    color: "#E1AB4B",
  },
  2: {
    bg: "url('/leaderboard/silver.svg')",
    grad: "linear-gradient(90deg, rgba(181, 181, 181, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
    color: "#B5B5B5",
  },
  3: {
    bg: "url('/leaderboard/bronze.svg')",
    grad: "linear-gradient(90deg, rgba(181, 100, 77, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
    color: "#B5644D",
  },
};

const UserEntry = ({ idx, data }) => {
  console.log(data);
  return (
    <span
      className={styles.boardEntry}
      onClick={() => {
        openNewTab(`/profile/${data.user.username}`);
      }}
      style={{
        background: entryColor[idx]?.grad,
        cursor: "pointer",
      }}
    >
      <span
        style={{ background: entryColor[idx]?.color || "transparent" }}
        className={styles.leftStick}
      ></span>
      <div className={styles.boardEntryCon}>
        <span
          style={{
            background: entryColor[idx]?.bg || "url('/leaderboard/rest.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className={styles.count}
        >
          {idx}
        </span>
        <img
          className={styles.userProfile}
          style={{ borderRadius: "100%", background: "white" }}
          src={data.user.photo.secure_url}
          alt=""
        />
        <span className={styles.userDetails}>
          <h2>{data.user.name}</h2>
          <p>@{data.user.username}</p>
        </span>
        <div className={styles.xp}>
          <h3>{data.totalXP} XP</h3>
          <img src="/xpCoin.svg" alt="" />
        </div>
      </div>
    </span>
  );
};

const CommunityEntry = ({ idx, data }) => {
  return (
    <span
      onClick={() => {
        openNewTab(`/community/${data.slug}`);
      }}
      className={styles.boardEntry}
      style={{
        background: entryColor[idx]?.grad,
        cursor: "pointer",
      }}
    >
      <span
        style={{ background: entryColor[idx]?.color || "transparent" }}
        className={styles.leftStick}
      ></span>
      <div className={styles.boardEntryCon}>
        <span
          style={{
            background: entryColor[idx]?.bg || "url('/leaderboard/rest.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className={styles.count}
        >
          {idx}
        </span>
        <span className={styles.mobRating}>
          <div className={styles.commName}>{data.dao_name}</div>
          <GradStarRating
            rating={data.average_rating}
            showCount={true}
            count={data.review_count}
          />
        </span>

        <div className={styles.rating}>
          <GradStarRating
            rating={data.average_rating}
            showCount={true}
            count={data.review_count}
          />
        </div>
        <div className={styles.socials}>
          <img
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              openNewTab(data.discord_link);
              e.stopPropagation();
            }}
            src={twitterIcon.src}
            alt=""
          />
          <img
            style={{ cursor: "pointer" }}
            onClick={() => {
              openNewTab(data.twitter_link);
              e.stopPropagation();
            }}
            src={discordIcon.src}
            alt=""
          />
          <img
            style={{ cursor: "pointer" }}
            onClick={() => {
              openNewTab(data.website_link);
              e.stopPropagation();
            }}
            src={webIcon.src}
            alt=""
          />
        </div>
      </div>
    </span>
  );
};

const Leaderboard = () => {
  const [selectedBtn, setselectedBtn] = useState("community");

  let community = useQuery({
    queryKey: ["community"],
    queryFn: async () => {
      let res = await axios.get(`${process.env.API}/dao/leaderboard`);
      return res.data;
    },
  });

  let users = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      let res = await axios.get(
        `${process.env.P_API}/public/users/leaderboard`
      );
      return res.data.data;
    },
  });

  if (!(community.isSuccess && users.isSuccess)) {
    return (
      <span className={styles.loader}>
        <img src="/white-loader.gif" alt="" />
      </span>
    );
  }

  console.log(users.data.leaderboard);

  return (
    <div className={styles.leaderboard}>
      <h1 className={styles.sec_title}>Leaderboard</h1>

      <span className={styles.selector}>
        <button
          onClick={() => {
            setselectedBtn("community");
          }}
          className={selectedBtn == "community" ? styles.selected : {}}
        >
          Community Leaderboard
        </button>
        <button
          onClick={() => {
            setselectedBtn("user");
          }}
          className={selectedBtn == "user" ? styles.selected : {}}
        >
          User Leaderboard
        </button>
      </span>
      {selectedBtn == "user" && (
        <div className={styles.board}>
          {users.data.leaderboard.map((ele, idx) => {
            return (
              <UserEntry data={ele} key={idx + "ent-user"} idx={idx + 1} />
            );
          })}
        </div>
      )}
      {selectedBtn == "community" && (
        <div className={styles.board}>
          {community.data.map((ele, idx) => {
            return (
              <CommunityEntry key={idx + "ent-comm"} data={ele} idx={idx + 1} />
            );
          })}
        </div>
      )}
    </div>
  );
};

let GradStarRating = ({ rating, showCount, count }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((ele) => {
          let starSrc = ele <= rating ? gradstarFilled.src : gradstarBlank.src;
          return <img alt="" key={"s" + ele} src={starSrc} />;
        })}
      </span>
      {showCount && <p className={styles.rating_count}>({count})</p>}
    </div>
  );
};

export default Leaderboard;
