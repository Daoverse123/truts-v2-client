import React, { useState, useEffect } from "react";
import styles from "./profile.module.scss";
import chainIconMap from "../../components/chainIconMap.json";
import addLoader from "../../utils/addLoader";
import Head from "next/head";

//components
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import DAOCard from "../../components/DAOCard";

//assets

import eth_icon from "../../assets/icons/eth-icon.png";
import gradient_star_filled from "../../assets/icons/star_gradient.svg";
import gradient_star_blank from "../../assets/icons/star_gradient_blank.svg";
import thumbs_up from "../../assets/icons/thumbs_up.svg";
import thumbs_down from "../../assets/icons/thumbs_down.svg";
import share from "../../assets/icons/share_icon.svg";
import tip from "../../assets/icons/tip_icon.svg";
import twitter_blue from "../../assets/icons/twitter_icon_blue.png";
import axios from "axios";
import Link from "next/link";
import openNewTab from "../../utils/openNewTab";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { chain } from "wagmi";

const levelsMap = [
  { xpForNextLevel: 0 },
  { xpForNextLevel: 500 },
  { xpForNextLevel: 1500 },
  { xpForNextLevel: 3000 },
  { xpForNextLevel: 5000 },
  { xpForNextLevel: 7000 },
  { xpForNextLevel: 9000 },
  { xpForNextLevel: 12000 },
  { xpForNextLevel: 15000 },
  { xpForNextLevel: 20000 },
];

let Placeholder =
  "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";
const NavSec = ({ elements, selected, setSelected, privateProfile }) => {
  //'Contributions'
  // 'Assets'

  let tabs = ["Communities", "Reviews", "Missions", "Assets"];

  if (privateProfile) {
    tabs.push("Referral");
  }

  return (
    <ul className={styles.navSec}>
      {tabs.map((ele, i) => {
        return (
          <li
            id={"tab-" + ele}
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
      })}
    </ul>
  );
};

const P_API = process.env.P_API;

const fetchWalletAssets = async (data, setter) => {
  let key = data.wallets.address;
  let [tokenData, nftData] = await Promise.all([
    axios.get(`/api/get-chain-assets?key=${key}&type=token`),
    axios.get(`/api/get-chain-assets?key=${key}&type=nft`),
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
  try {
    let user_res = await axios.get(`${P_API}/user`, option);
    let main_user_data = user_res.data.data.user;
    if (user_res.status == 200) {
      setter(main_user_data);
      main_user_data.isCompleted &&
        "wallets" in main_user_data &&
        fetchWalletAssets(main_user_data, setter);
    } else {
      alert("Auth error");
      console.log(error);
      location.href = "/?signup=true";
    }

    if (!main_user_data.isCompleted) {
      return 0;
    }

    let user_data = await Promise.all([
      (async () => {
        if (!("discord" in main_user_data)) {
          return { status: 500 };
        }
        let res = await axios.get(
          `${P_API}/user/${main_user_data.username}/reviews`,
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
        if (!("wallets" in main_user_data)) {
          return { status: 200 };
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
      data = { ...data, referral: user_data[4]?.data?.data?.referral };
    }

    setter((state) => {
      return { ...state, ...data };
    });
  } catch (error) {
    console.log(error);
    location.href = "/?signup=true";
  }
};

const fetchPublicUserData = async (setter, slug) => {
  let option = {
    headers: {},
  };
  try {
    let user_res = await axios.get(`${P_API}/public/user/${slug}`, option);
    let main_user_data = user_res.data.data.user;
    if (user_res.status == 200) {
      setter(main_user_data);
      main_user_data.isCompleted &&
        "wallets" in main_user_data &&
        fetchWalletAssets(main_user_data, setter);
    } else {
      alert("Auth error");
      console.log(error);
      location.href = "/?signup=true";
    }

    if (main_user_data.isCompleted) {
      let user_data = await Promise.all([
        (async () => {
          if (!("discord" in main_user_data)) {
            return { status: 500 };
          }
          let res = await axios.get(
            `${P_API}/public/user/${main_user_data.username}/reviews`,
            option
          );
          return res;
        })(),
        (async () => {
          if (!("discord" in main_user_data)) {
            return { status: 500 };
          }
          let res = await axios.get(
            `${P_API}/public/user/${slug}/guilds`,
            option
          );
          return res;
        })(),
        (async () => {
          if (!("discord" in main_user_data)) {
            return { status: 500 };
          }
          let res = await axios.get(
            `${P_API}/public/user/${slug}/completed-mission`,
            option
          );
          return res;
        })(),
        (async () => {
          if (!("discord" in main_user_data)) {
            return { status: 500 };
          }
          let res = await axios.get(
            `${P_API}/public/user/${slug}/truts-xp`,
            option
          );
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

      setter((state) => {
        return { ...state, ...data };
      });
    }
  } catch (error) {
    console.log(error);
    location.href = "/?signup=true";
  }
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

function Profile({ slug }) {
  const [selectedNav, setSelectedNav] = useState("Reviews");
  const [userData, setuserData] = useState({});
  const [token, settoken] = useState(null);
  const [privateProfile, setprivateProfile] = useState(false);

  console.log(userData);

  useEffect(() => {
    if (localStorage.getItem("token") && slug == "private") {
      fetchUserData(setuserData);
      setprivateProfile(true);

      settoken(localStorage.getItem("token"));
    } else if (slug.length > 1) {
      fetchPublicUserData(setuserData, slug);
    }
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

  let getChain = (chain) => {
    if (chain == "SOL") {
      return "solana";
    }
    if (chain == "NEAR") {
      return "near";
    }
    if (chain == "FLOW") {
      return "flow";
    }
    return "ethereum";
  };

  return (
    <>
      <Head>
        <script
          defer
          src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        ></script>

        <title>Truts</title>
        <meta
          name="description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <link rel="icon" href="/favicon.png" />

        <meta property="og:url" content="https://www.truts.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Truts" />
        <meta
          property="og:description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <meta property="og:image" content="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="truts.xyz" />
        <meta property="twitter:url" content="https://www.truts.xyz" />
        <meta name="twitter:title" content="Truts" />
        <meta
          name="twitter:description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <meta name="twitter:image" content="/favicon.png" />
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
                  <h3>
                    <span style={{ color: "black" }}>
                      Level {userData.xp.level.currentLevel}{" "}
                    </span>
                    - {userData.xp.totalTrutsXP} XP
                  </h3>

                  <p>
                    {userData.xp.totalTrutsXP}/
                    {parseInt(userData.xp.level.xpForNextLevel) +
                      parseInt(userData.xp.totalTrutsXP)}
                  </p>
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
              {"twitter" in userData && (
                <div
                  key={"twitter"}
                  className={styles.socialIcons}
                  onClick={() => {
                    openNewTab(
                      `https://twitter.com/${userData.twitter.username}`
                    );
                  }}
                >
                  <img src={`/socials/TWITTER.png`} alt="" />
                </div>
              )}
              {"discord" in userData && (
                <div
                  key={"twitter"}
                  className={styles.socialIcons}
                  onClick={() => {
                    openNewTab(
                      `https://discordapp.com/users/${userData.discord.id}`
                    );
                  }}
                >
                  <img src={`/socials/Discord.png`} alt="" />
                </div>
              )}
              {"socials" in userData && userData.socials.length > 0 ? (
                userData.socials.map((tgs) => {
                  return (
                    <div
                      key={"id" + tgs?.platform}
                      className={styles.socialIcons}
                      onClick={() => {
                        openNewTab(tgs?.link);
                      }}
                    >
                      <img src={`/socials/${tgs?.platform}.png`} alt="" />
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
                <TooltipCustom init={"Copy Address"} post={"Copied !"}>
                  <div
                    onClick={(e) => {
                      copyToClipBoard(userData.wallets.address);
                    }}
                    style={{
                      background:
                        chainIconMap[getChain(userData.wallets.chain)].color,
                      borderColor:
                        chainIconMap[getChain(userData.wallets.chain)].color,
                    }}
                    className={styles.tab}
                  >
                    <img
                      src={chainIconMap[getChain(userData.wallets.chain)].icon}
                      alt=""
                    />
                    {minimizeWallet(userData.wallets.address)}
                  </div>
                </TooltipCustom>
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
            {/* <img src={twitter_icon.src} alt="" /> */}
            {/* <img src={discord_icon.src} alt="" /> */}
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
          privateProfile={privateProfile}
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
                          ? "/assets/tick.png"
                          : "/assets/wrong.png"
                      }
                      alt=""
                    />{" "}
                    Email Id
                  </li>
                  <li>
                    <img
                      src={
                        "username" in userData
                          ? "/assets/tick.png"
                          : "/assets/wrong.png"
                      }
                      alt=""
                    />{" "}
                    Username
                  </li>
                  <li>
                    <img
                      src={
                        "discord" in userData
                          ? "/assets/tick.png"
                          : "/assets/wrong.png"
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
        <p className={styles.info}>
          {/* 🛈 Your web3 communities all listed in one place. Explore, engage and
          earn with your communities on Truts */}
        </p>
        {/* <p className={styles.ifo}>Reviews on Communities as a Member</p> */}
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
        {false && (
          <div className={styles.bottom_nav}>
            <span className={styles.iconText}>
              {/* <img src={thumbs_up.src} alt="" /> */}
              <p>Upvotes </p>
              <p>: {data.vote.up}</p>
            </span>
            <span className={styles.iconText}>
              {/* <img src={thumbs_down.src} alt="" /> */}
              <p>Downvotes </p>
              <p>: {data.vote.down}</p>
            </span>
            {/* <span className={styles.iconText}>
            <img src={share.src} alt="" />
            <p>share</p>
          </span> */}
            {/* <span className={styles.iconText}>
            <img src={tip.src} alt="" />
            <p>$400</p>
          </span> */}
          </div>
        )}
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
    <div className={styles.reviewWrapper}>
      <p className={styles.info}>
        🛈 Your web3 communities all listed in one place. Explore, engage and
        earn with your communities on Truts
      </p>
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
          {/* <p>Last Price</p> */}
          {/* <span className={styles.price}>
            <img src={eth_icon.src} alt="" />
            <h4>10.01</h4>
          </span> */}
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
            {limit(10, data.symbol)} <p></p>
          </span>
          <h3></h3>
        </span>
        <span className={styles.bottomLine}>
          <p>{limit(10, data.name)}</p>
          <p></p>
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
        <p className={styles.daoName}>{data.listing.name}</p>
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
        <img src="/xpCoin.svg" alt="" />
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
    try {
      setlink(`${location.origin}/?ref=${userData.wallets.address}`);
    } catch (error) {}
  }, []);

  if (!referral) {
    return (
      <div className={styles.referral}>
        <p className={styles.info}>
          ⚠️ Please Connect your Wallet to enable Referral !
        </p>
      </div>
    );
  }

  return (
    <div className={styles.referral}>
      <div className={styles.linkBox}>
        <div className={styles.linkInfo}>
          <img src="/profiles/people.png" alt="" />
          <h1>My Referral link</h1>
          <p>
            Share your unique referral link to invite your friends to get access
            to Truts and earn 500 XP Points for each referral.{" "}
          </p>
        </div>
        <div className={styles.link}>
          <p>{limitCenter(20, 5, link)}</p>
          <TooltipCustom init={"Copy Link"} post={"Copied !"}>
            <img
              onClick={() => {
                navigator.clipboard.writeText(link);
              }}
              src="/profiles/link.png"
              alt=""
            />
          </TooltipCustom>
        </div>
      </div>
      <div className={styles.stages}>
        <span className={styles.topBar}>
          <span className={styles.title}>
            <h1>{referral?.tier?.teir.toLowerCase()}</h1>
            <p>Current Referral Rank</p>
          </span>
          {/* <button className={styles.topRightBtn}>Claim rewards</button> */}
        </span>
        <div className={styles.milestones}>
          {tiers.map((ele, idx) => {
            return (
              <TooltipReferral data={ele} key={ele + "mt"}>
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
              </TooltipReferral>
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

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
  console.log(ctx.query);
  let { slug } = ctx.query;
  // Fetch data from external API

  return { props: { slug: slug } };
}

const TooltipCustom = ({ init, post, children }) => {
  const [clicked, setclicked] = useState(false);

  return (
    <div
      onMouseLeave={() => {
        setclicked(false);
      }}
      className={styles.customToolTip}
      onClick={() => {
        setclicked(true);
      }}
    >
      <div
        style={
          clicked ? { background: "rgba(68, 172, 33, 1)", color: "white" } : {}
        }
        className={styles.content}
      >
        {clicked ? post : init}
      </div>
      {children}
    </div>
  );
};

const TooltipReferral = ({ data, children }) => {
  const teirs = {
    COPPER: { multiplier: 1.0, useCountForNextTeir: 5, pos: "right" },
    BRONZE: { multiplier: 1.1, useCountForNextTeir: 15, pos: "right" },
    SILVER: { multiplier: 1.3, useCountForNextTeir: 30, pos: "left" },
    GOLD: { multiplier: 1.5, useCountForNextTeir: 50, pos: "left" },
    DIAMOND: { multiplier: 1.7, useCountForNextTeir: 0, pos: "left" },
  };
  return (
    <div className={styles.customToolTipReferral}>
      <div
        style={
          teirs[data].pos == "right" ? {} : { transform: "translateX(-85%)" }
        }
        className={styles.content}
      >
        <span className={styles.titles} onChange={() => {}}>
          <h1>{`${data.toLowerCase()} tier`} </h1>
          <p>{teirs[data].multiplier}x Multiplier</p>
        </span>
        <p className={styles.desc}>
          Referrals to advance to next tier: {teirs[data].useCountForNextTeir}
        </p>
      </div>
      {children}
    </div>
  );
};

export default Profile;
