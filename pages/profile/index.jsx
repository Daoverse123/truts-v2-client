import React, { useState, useEffect } from "react";
import styles from "./profile.module.scss";
import chainIconMap from "../../components/chainIconMap.json";
import ContentLoader, { Facebook } from "react-content-loader";
import addLoader from "../../utils/addLoader";
import Head from "next/head";
//components
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import DAOCard from "../../components/DAOCard";

//assets
import discord_icon from "../../assets/icons/twitter_white.svg";
import twitter_icon from "../../assets/icons/discord_white.svg";
import downArrow from "../../assets/icons/down_arrow.svg";
import eth_icon from "../../assets/icons/eth-icon.png";
import gradient_star_filled from "../../assets/icons/star_gradient.svg";
import gradient_star_blank from "../../assets/icons/star_gradient_blank.svg";
import down_arrow from "../../assets/icons/down_arrow.svg";
import thumbs_up from "../../assets/icons/thumbs_up.svg";
import thumbs_down from "../../assets/icons/thumbs_down.svg";
import share from "../../assets/icons/share_icon.svg";
import tip from "../../assets/icons/tip_icon.svg";
import loader from "../../assets/mini-loader.gif";
import twitter_blue from "../../assets/icons/twitter_icon_blue.png";
import axios from "axios";
import Link from "next/link";
import openNewTab from "../../utils/openNewTab";

let Placeholder =
  "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";
const NavSec = ({ elements, selected, setSelected }) => {
  //'Contributions'
  // 'Assets'
  return (
    <ul className={styles.navSec}>
      {["Communities", "Reviews", "Missions", "Assets", "Referral"].map(
        (ele, i) => {
          return (
            <li
              className={selected == ele ? styles.selected : null}
              onClick={() => {
                setSelected(ele);
              }}
              key={ele + i}
            >
              {
                <p>
                  {ele}{" "}
                  {ele != "Assets" &&
                    ele != "Referral" &&
                    Object.keys(elements).length >= 3 &&
                    `(${elements[ele.toLowerCase()] || "0"})`}
                </p>
              }
            </li>
          );
        }
      )}
    </ul>
  );
};

const P_API = process.env.P_API;

const fetchWalletAssets = async (data, setter) => {
  let key = data.wallets.address;
  let [tokenData, nftData] = await Promise.all([
    axios.get(`api/get-chain-assets?key=${key}&type=token`),
    axios.get(`api/get-chain-assets?key=${key}&type=nft`),
  ]);
  console.log(nftData);
  setter((data) => {
    return {
      ...data,
      tokenData: tokenData.data.assets,
      nftData: nftData.data.assets,
    };
  });
};

const fetchUserData = async (setter) => {
  let option = {
    headers: {
      Authorization: window.localStorage.getItem("token"),
    },
  };

  let user_res = await axios.get(`${P_API}/user`, option);
  let main_user_data = user_res.data.data.user;
  if (user_res.status == 200) {
    setter(main_user_data);
    main_user_data.isCompleted && fetchWalletAssets(main_user_data, setter);
  } else {
    alert("Auth error");
  }
  let user_data = await Promise.all([
    (async () => {
      if (!("discord" in main_user_data)) {
        return { status: 500 };
      }
      let res = await axios.get(
        `${P_API}/user/${main_user_data.wallets.address}/reviews`,
        option
      );
      return res;
    })(),
    (async () => {
      if (!("discord" in main_user_data)) {
        return { status: 500 };
      }
      let res = await axios.get(`${P_API}/user/guilds`, option);
      return res;
    })(),
    (async () => {
      if (!("discord" in main_user_data)) {
        return { status: 500 };
      }
      let res = await axios.get(`${P_API}/user/completed-mission`, option);
      return res;
    })(),
    (async () => {
      if (!("discord" in main_user_data)) {
        return { status: 500 };
      }
      let res = await axios.get(`${P_API}/user/truts-xp`, option);
      return res;
    })(),
    (async () => {
      if (!("discord" in main_user_data)) {
        return { status: 500 };
      }
      let res = await axios.get(`${P_API}/user/referral`, option);
      return res;
    })(),
  ]);

  let data = {};
  if (user_data[0].status == 200) {
    data = { ...data, reviews: user_data[0].data.data.reviews };
  }
  if (user_data[1].status == 200) {
    data = { ...data, daos: user_data[1].data.data.listings };
  }
  if (user_data[2].status == 200) {
    data = { ...data, missions: user_data[2].data.data.missions };
  }
  if (user_data[3].status == 200) {
    data = { ...data, xp: user_data[3].data.data };
  }
  if (user_data[4].status == 200) {
    data = { ...data, referral: user_data[4].data.data.referral };
  }

  setter((state) => {
    return { ...state, ...data };
  });
};

const Loader = () => {
  return (
    <div className={styles.loader}>
      <lottie-player
        src="https://assets4.lottiefiles.com/packages/lf20_kqpwfbbz.json"
        background="transparent"
        speed="1"
        style={{
          width: "100%",
          height: "100%",
          marginBottom: "30px",
        }}
        autoplay
        loop
      ></lottie-player>
    </div>
  );
};

function Profile() {
  const [selectedNav, setSelectedNav] = useState("Reviews");
  const [userData, setuserData] = useState({});
  const [token, settoken] = useState(null);

  useEffect(() => {
    fetchUserData(setuserData);
    settoken(localStorage.getItem("token"));
  }, []);

  const [elements, setelements] = useState({});

  useEffect(() => {
    let counts = {};
    if ("missions" in userData) {
      counts["missions"] = userData["missions"].length;
    }
    if ("reviews" in userData) {
      counts["reviews"] = userData["reviews"].length;
    }
    if ("daos" in userData) {
      counts["communities"] = userData["daos"].length;
    }
    setelements({ ...counts });
  }, [userData]);

  return (
    <>
      <Head>
        <script
          defer
          src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        ></script>
      </Head>

      {/* <OnBoardForm /> */}

      <Nav isStrech={true} isFloating />
      {/* <ProfileLogin /> */}
      <div className={styles.profilePage}>
        <div className={styles.profileHeader + addLoader(!("_id" in userData))}>
          <img
            className={styles.profileImg}
            src={userData.photo?.secure_url || "/profile-old.png"}
            alt=""
          />
          <div className={styles.data}>
            {"xp" in userData && (
              <span className={styles.xpLevel}>
                <span className={styles.levelCount}>
                  <h3>Level {userData.xp.level.currentLevel}</h3>
                  <p>{userData.xp.level.xpForNextLevel} to next XP</p>
                </span>
                <div className={styles.progressBard}>
                  <span
                    style={{
                      width: `${userData.xp.level.precentToNextLevel}%`,
                    }}
                  ></span>
                </div>
              </span>
            )}
            <h1 className={styles.name}>
              {userData.name ||
                ("wallets" in userData
                  ? minimizeWallet(userData.wallets.address)
                  : "Username")}
            </h1>
            {userData.bio ? (
              <p className={styles.bio}>{userData.bio}</p>
            ) : (
              <p style={{ color: "grey" }} className={styles.bio}>
                Write a amazing bio introducing yourself.....
              </p>
            )}
            <div className={styles.tabs}>
              {"tags" in userData && userData.tags.length > 0 ? (
                userData.tags.map((tgs) => {
                  return (
                    <div key={"id" + tgs?.name} className={styles.tab}>
                      {tgs?.name}
                    </div>
                  );
                })
              ) : (
                <div
                  onClick={() => {
                    location.href = "/edit-profile";
                  }}
                  style={{ opacity: 0.6, cursor: "pointer" }}
                  className={styles.tab}
                >
                  {"Add Tags"}
                </div>
              )}
            </div>
            <div className={styles.walletTabs}>
              {"wallets" in userData ? (
                <div
                  id="w"
                  data-tooltip-content="hello world"
                  onClick={(e) => {
                    copyToClipBoard(userData.wallets.address);
                  }}
                  style={{
                    background: chainIconMap["ethereum"].color,
                    borderColor: chainIconMap["ethereum"].color,
                  }}
                  className={styles.tab}
                >
                  <img src={chainIconMap["ethereum"].icon} alt="" />
                  {minimizeWallet(userData.wallets.address)}
                </div>
              ) : (
                <div
                  onClick={() => {
                    location.href = "/edit-profile";
                  }}
                  style={{
                    background: chainIconMap["ethereum"].color,
                    borderColor: chainIconMap["ethereum"].color,
                  }}
                  className={styles.tab}
                >
                  {/* <img src={chainIconMap["ethereum"].icon} alt="" /> */}
                  Connect Wallet
                </div>
              )}
            </div>
          </div>

          <div className={styles.socialIcon}>
            <img src={twitter_icon.src} alt="" />
            <img src={discord_icon.src} alt="" />
          </div>

          {token && (
            <img
              className={styles.editProfile}
              src="/edit-profile.png"
              alt=""
              onClick={() => {
                location.href = "/edit-profile";
              }}
            />
          )}
        </div>
        <NavSec
          elements={elements}
          selected={selectedNav}
          setSelected={setSelectedNav}
        />
        {userData.isCompleted && (
          <div className={styles.mainContent}>
            {selectedNav == "Communities" && "daos" in userData ? (
              <Communites_temp {...{ userData }} />
            ) : (
              selectedNav == "Communities" && <Loader />
            )}
            {selectedNav == "Missions" && "missions" in userData ? (
              <Xp {...{ userData }} />
            ) : (
              selectedNav == "Missions" && <Loader />
            )}
            {selectedNav == "Reviews" && "reviews" in userData ? (
              <Reviews {...{ userData }} />
            ) : (
              selectedNav == "Reviews" && <Loader />
            )}
            {selectedNav == "Assets" && "daos" in userData ? (
              <TokenNftCon {...{ userData }} />
            ) : (
              selectedNav == "Assets" && <Loader />
            )}
            {selectedNav == "Referral" && "referral" in userData ? (
              <Referral {...{ userData }} />
            ) : (
              selectedNav == "Refferal" && <Loader />
            )}
          </div>
        )}

        {"isCompleted" in userData && !userData.isCompleted && (
          <>
            <div
              className={
                styles.completeProfilePrompt + addLoader(!("_id" in userData))
              }
            >
              <span>
                <h1>Complete Your profile to get complete access to Truts</h1>
                <ul>
                  <li>
                    <img
                      src={
                        "email" in userData
                          ? "assets/tick.png"
                          : "assets/wrong.png"
                      }
                      alt=""
                    />{" "}
                    Email Id
                  </li>
                  <li>
                    <img
                      src={
                        "wallets" in userData
                          ? "assets/tick.png"
                          : "assets/wrong.png"
                      }
                      alt=""
                    />{" "}
                    Connect Wallet
                  </li>
                  <li>
                    <img
                      src={
                        "discord" in userData
                          ? "assets/tick.png"
                          : "assets/wrong.png"
                      }
                      alt=""
                    />{" "}
                    Connect Discord
                  </li>
                </ul>
              </span>
              <Link href={"/edit-profile"}>
                <button>Complete Profile</button>
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

const minimizeWallet = (wt) => {
  return wt.slice(0, 5) + "..." + wt.slice(-5);
};

const Reviews = ({ userData }) => {
  return (
    <>
      {/* <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Last Review On</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>12.07</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Total No. of Reviews</h3>
                    <p>till Date</p>
                    <h1>128</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>Updated 1m ago</p>
                    <h1>XYZ</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>Updated 1m ago</p>
                    <h1>XYZ</h1>
                </div>
            </div> */}
      <div key={"x"} className={styles.reviewCon + " " + styles.appear}>
        {"reviews" in userData &&
          userData.reviews.map((ele, idx) => {
            return (
              <ReviewComp userData={userData} key={"re" + idx} data={ele} />
            );
          })}
      </div>
    </>
  );
};

const ReviewComp = ({ data, userData }) => {
  let dao_name = data.listing.name;
  let image = data.listing.photo.logo.secure_url;
  let review = data.comment;
  let rating = data.rating;
  return (
    <>
      <div className={styles.reviewComp}>
        <div className={styles.userInfo}>
          <img
            className={styles.profilePic}
            src={image || "/profile.jpg"}
            alt=""
          />
          <span>
            <p className={styles.address}>{dao_name}</p>
            <StarComp size={"s"} rating={rating} />
          </span>
        </div>
        <div className={styles.review_desc}>{review}</div>
        {/* {(isTextLarge) && <p

                    className={styles.showmore}>
                    {(isreadMore) ? "show less" : "read more"}
                </p>} */}
        <div className={styles.bottom_nav}>
          <span className={styles.iconText}>
            <img src={thumbs_up.src} alt="" />
            <p>{data.vote.up}</p>
          </span>
          <span className={styles.iconText}>
            <img src={thumbs_down.src} alt="" />
            <p>{data.vote.down}</p>
          </span>
          <span className={styles.iconText}>
            <img src={share.src} alt="" />
            <p>share</p>
          </span>
          <span className={styles.iconText}>
            <img src={tip.src} alt="" />
            {/* <p>$400</p> */}
          </span>
        </div>
        <span className={styles.divider} />
      </div>
    </>
  );
};

const StarComp = ({ rating, size }) => {
  let filter_style = styles.starComp;
  if (size == "s") {
    filter_style = styles.starComp + " " + styles.starComp_small;
  }
  return (
    <span className={filter_style}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= parseInt(rating)) {
          return <img key={i} src={gradient_star_filled.src} alt="" />;
        } else {
          return <img key={i} src={gradient_star_blank.src} alt="" />;
        }
      })}
    </span>
  );
};

const Communites_temp = ({ userData }) => {
  return (
    <div className={styles.communities_list + " " + styles.appear}>
      {userData.daos.map((ele, idx) => {
        let data = {
          dao_name: ele?.name,
          twitter_link: ele?.twitter.link,
          twitter_followers: ele?.twitter.count,
          discord_link: ele?.discord.link,
          discord_members: ele?.discord.count,
          average_rating: ele?.ratings.average,
          review_count: ele?.ratings.count,
          slug: ele.slug,
          dao_cover: ele?.image.cover.url,
          website_link: ele?.website,
        };
        return <DAOCard key={"d" + idx} data={data} />;
      })}
    </div>
  );
};

const TokenNftCon = ({ userData }) => {
  const [selectedTab, setselectedTab] = useState("NFTS");
  console.log(selectedTab);

  return (
    <>
      {/* <div className={styles.statCards + " " + styles.appear}>
        <div className={styles.stat}>
          <h3>Value of Assets</h3>
          <p>till Date</p>
          <h1 style={{ color: "#44AC21" }}>$3.4K</h1>
        </div>
        <div className={styles.stat}>
          <h3>Avg Floor Price</h3>
          <p>for all NFTs</p>
          <h1>1.2ETH</h1>
        </div>
        <div className={styles.stat}>
          <h3>Most Precious NFT</h3>
          <p>till date</p>
          <h1>BAYC</h1>
        </div>
        <div className={styles.stat}>
          <h3>No. of NFTs</h3>
          <p>Updated 1m ago</p>
          <h1>46</h1>
        </div>
      </div> */}
      <section className={styles.tokenNftSec + " " + styles.appear}>
        <div className={styles.tokenSwitch}>
          <button
            onClick={() => {
              setselectedTab("NFTS");
            }}
            className={
              selectedTab == "NFTS"
                ? styles.btnSwitchSelected
                : styles.btnSwitch
            }
          >
            NFTs
          </button>
          <button
            onClick={() => {
              setselectedTab("TOKENS");
            }}
            className={
              selectedTab == "TOKENS"
                ? styles.btnSwitchSelected
                : styles.btnSwitch
            }
          >
            Tokens
          </button>
        </div>
        {selectedTab == "NFTS" && <Nfts userData={userData} />}
        {selectedTab == "TOKENS" && <Tokens userData={userData} />}
      </section>
    </>
  );
};

const Nfts = ({ userData }) => {
  const Nft = ({ data }) => {
    return (
      <div className={styles.nftCon}>
        <img
          src={data.tokenImage || "/grad.jpg"}
          className={styles.cover}
          alt=""
        />
        <div className={styles.info}>
          <h3>{limit(25, data.title)}</h3>
          <p>Last Price</p>
          <span className={styles.price}>
            <img src={eth_icon.src} alt="" />
            <h4>10.01</h4>
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.nfts}>
        {"nftData" in userData &&
          userData.nftData.map((ele, idx) => {
            return <Nft key={"nft" + idx} data={ele} />;
          })}
      </div>
    </>
  );
};

let limit = (lt, name) => {
  if (name?.length > lt) {
    return name.slice(0, lt) + "...";
  }
  return name;
};

const Tokens = ({ userData }) => {
  const Token = ({ data }) => {
    return (
      <div className={styles.token}>
        <img
          className={styles.tokenLogo}
          src={data.logo || "/blue.png"}
          alt=""
        />
        <span className={styles.topLine}>
          <span className={styles.tokenName}>
            {limit(10, data.symbol)} <p>{limit(10, data.name)}</p>
          </span>
          <h3>$1,238</h3>
        </span>
        <span className={styles.bottomLine}>
          <p>$36,500</p>
          <p>0.05</p>
        </span>
      </div>
    );
  };

  // logo : "https://static.alchemyapi.io/images/assets/5617.png"
  // name :"UMA"
  // symbol :"UMA"
  // tokenAddress :"0x04fa0d235c4abf4bcf4787af4cf447de572ef828"
  // tokenBalance :628.3984457034

  return (
    <>
      <div className={styles.tokens}>
        {"tokenData" in userData &&
          userData.tokenData.map((ele, id) => {
            return <Token key={"tkn" + id} data={ele} />;
          })}
      </div>
    </>
  );
};

const XpChip = ({ status }) => {
  return (
    <div className={styles.xpChipWrapper}>
      <div className={styles.xpChip}>
        <img src={twitter_blue.src} alt="" />
        <span>
          <h1>
            Connect your twitter<span>Task Owner</span>{" "}
          </h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </span>
        <button>300 XP</button>
      </div>
      {status && (
        <span className={styles.status}>
          <div className={styles.progress}>
            <span className={styles.progressInner}></span>
          </div>
          <p>60% Completed</p>
        </span>
      )}
    </div>
  );
};

const Xp = ({ userData }) => {
  const [selectedTab, setselectedTab] = useState("COMPLETED");

  return (
    <section className={styles.XpSec}>
      {userData.missions.map((ele) => {
        return <Mission data={ele} key={ele._id} />;
      })}
    </section>
  );
};

const Mission = ({ data }) => {
  return (
    <div
      className={styles.mission}
      onClick={() => {
        openNewTab(`/mission/${data._id}`);
      }}
    >
      <div className={styles.content}>
        <p className={styles.daoName}>{data.community.name}</p>
        <h2 className={styles.missionName}>{data.name}</h2>
        <div className={styles.tags}>
          {data.tags.map((tg) => {
            return (
              <Tag
                key={tg._id}
                title={tg.name}
                color={`rgba(${tg.color.rgba[0]}, ${tg.color.rgba[1]}, ${tg.color.rgba[2]})`}
                src={tg.logo.secure_url}
              />
            );
          })}
        </div>
        <p className={styles.missionDesc}>{limit(90, data.description)}</p>
      </div>
      <span className={styles.xpCount}>
        <img src="/xpCoin.png" alt="" />
        <p>{data.trutsXP} XP</p>
      </span>
    </div>
  );
};

let stageColors = [
  "rgb(212,171,133)",
  "rgb(255,178,102)",
  "rgb(217,217,217)",
  "rgb(255,231,102)",
  "rgb(255,231,102)",
];

let tiers = ["COPPER", "BRONZE", "SILVER", "GOLD", "DIAMOND"];

const Referral = ({ userData }) => {
  let { referral } = userData;

  const [link, setlink] = useState("");

  useEffect(() => {
    setlink(`${location.origin}/?ref=${userData.wallets.address}`);
  }, []);

  return (
    <div className={styles.referral}>
      <div className={styles.linkBox}>
        <div className={styles.linkInfo}>
          <img src="/profiles/people.png" alt="" />
          <h1>My referral link</h1>
          <p>
            Share your unique referral link to invite your friends to get access
            to Truts Profiles and earn 50 XP Points for each referral.{" "}
          </p>
        </div>
        <div className={styles.link}>
          <p
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
          >
            {limitCenter(20, 5, link)}
          </p>
          <img
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
            src="/profiles/link.png"
            alt=""
          />
        </div>
      </div>
      <div className={styles.stages}>
        <span className={styles.topBar}>
          <span className={styles.title}>
            <h1>Copper</h1>
            <p>Current referral</p>
          </span>
          {/* <button className={styles.topRightBtn}>Claim rewards</button> */}
        </span>
        <div className={styles.milestones}>
          {tiers.map((ele, idx) => {
            return (
              <span
                style={
                  ele == referral?.tier?.teir
                    ? {
                        backgroundColor: stageColors[idx],
                        color: "white",
                      }
                    : {}
                }
                className={styles.stone}
                key={ele + "m"}
              >
                {idx + 1}
              </span>
            );
          })}
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <img src="/referral/people-grey.png" alt="" />
            <h3>Total referrals done</h3>
            <p>{referral.useCount}</p>
          </div>
          <div className={styles.stat}>
            <img src="/referral/graph.png" alt="" />
            <h3>Current XP Multiplier</h3>
            <p>{referral.multiplier}</p>
          </div>
          <div className={styles.stat}>
            <img src="/referral/cup.png" alt="" />
            <h3>XP Earned</h3>
            <p>{referral.xpEarned}</p>
          </div>
        </div>
        {/* <button className={styles.bottomBtn}>Claim rewards</button> */}
      </div>
    </div>
  );
};

let limitCenter = (s, e, name) => {
  return name.slice(0, s) + "..." + name.slice(-e);
};

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

const copyToClipBoard = (txt) => {
  navigator.clipboard.writeText(txt);
};

export default Profile;
