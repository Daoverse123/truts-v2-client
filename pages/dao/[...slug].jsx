import React, { useState, useEffect } from "react";
import styles from "../dao/dao.module.scss";
import Footer from "../../components/Footer";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";

//utils
import openNewTab from "../../utils/openNewTab";

//components
import Button from "../../components/Button";
import Nav from "../../components/Nav";
import WalletConnect from "../../components/WalletConnect";
import TippingFlow from "../../components/TippingFlow";
import Mission from "../../components/Mission";

//local components
import Sidebar from "../../components/dao_page/Sidebar";
import TabletSideBar from "../../components/dao_page/TabletSideBar";

//assets
import gradient_star_filled from "../../assets/icons/star_gradient.svg";
import gradient_star_blank from "../../assets/icons/star_gradient_blank.svg";
import down_arrow from "../../assets/icons/down_arrow.svg";
import thumbs_up from "../../assets/icons/thumbs_up.svg";
import thumbs_down from "../../assets/icons/thumbs_down.svg";
import share from "../../assets/icons/share_icon.svg";
import tip from "../../assets/icons/tip_icon.svg";
import loader from "../../assets/mini-loader.gif";

const API = process.env.API;
const P_API = process.env.P_API;

const getMissionStatus = async (data, setmissions) => {
  console.log(data);
  let jwt = localStorage.getItem("token");
  if (!jwt) {
    setmissions(data);
    return false;
  }
  let res = await Promise.all(
    data.missions.map((ele) => {
      return (async () => {
        let res = await axios.get(`${P_API}/mission/${ele._id}/my-status`, {
          headers: {
            Authorization: jwt,
          },
        });
        if (res.status == 200) {
          return {
            ...ele,
            isCompleted: res.data.data.attemptedMission.isCompleted,
          };
        }
        return ele;
      })();
    })
  );
  setmissions({ missions: res });
};

const fetchReviews = async (id, setter) => {
  let jwt = localStorage.getItem("token");
  let url = `${P_API}/public/listing/${id}/reviews`;
  let headers = {};

  if (jwt) {
    url = `${P_API}/listing/${id}/reviews`;
    headers = {
      headers: {
        Authorization: jwt,
      },
    };
  }
  try {
    let res = await axios.get(url, headers);
    if (res.status == 200) {
      setter((ele) => {
        ele = { reviews: [...res.data.data.reviews], loading: false };
        return { ...ele };
      });
    }
  } catch (error) {
    let res = await axios.get(`${P_API}/public/listing/${id}/reviews`);
    if (res.status == 200) {
      setter((ele) => {
        ele = { reviews: [...res.data.data.reviews], loading: false };
        return { ...ele };
      });
    }
  }
};

function Dao({ dao_data, rid, slug }) {
  const [selected, setSelected] = useState("Reviews");
  //console.log(dao_data);
  const [walletConnectVisible, setwalletConnectVisible] = useState(false);
  const [tippingFlowVisible, settippingFlowVisible] = useState(false);
  const [review_details, setreview_details] = useState({
    address: "",
    chain: "",
  });

  let tipReviewInfo = { review_details, setreview_details };

  const [missions, setmissions] = useState([]);
  const [reviews, setreviews] = useState({ reviews: [], loading: true });

  const fetchMissions = async () => {
    try {
      let res = await axios.get(`${P_API}/mission?listingID=${dao_data._id}`);
      await getMissionStatus(res.data.data, setmissions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchReviews(dao_data._id, setreviews);
    localStorage.setItem("mission-callback", slug);
  }, [slug]);

  return (
    <>
      <TippingFlow
        tipReviewInfo={tipReviewInfo}
        tippingFlowVisible={tippingFlowVisible}
        settippingFlowVisible={settippingFlowVisible}
      />
      <div className={styles.dao}>
        <Head>
          <title>{dao_data.dao_name}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link rel="preload" as="image" href="/verified.png"></link>
          <link rel="icon" href="/favicon.png" />
          <meta
            name="description"
            content={dao_data.dao_mission || dao_data.description}
          />

          {rid.length > 0 && (
            <>
              <meta
                property="og:url"
                content={`https://www.truts.xyz/dao/${dao_data.slug}`}
              />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={dao_data.dao_name} />
              <meta
                property="og:description"
                content={dao_data.dao_mission || dao_data.description}
              />
              <meta
                property="og:image"
                content={`https://www.truts.xyz/api/fetchcard?rid=${rid}`}
              />

              <meta name="twitter:card" content="summary_large_image" />
              <meta property="twitter:domain" content="truts.xyz" />
              <meta
                property="twitter:url"
                content={`https://www.truts.xyz/dao/${dao_data.slug}`}
              />
              <meta name="twitter:title" content={dao_data.dao_name} />
              <meta
                name="twitter:description"
                content={dao_data.dao_mission || dao_data.description}
              />
              <meta
                name="twitter:image"
                content={`https://www.truts.xyz/api/fetchcard?rid=${rid}`}
              />
            </>
          )}

          <script
            defer
            src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
          ></script>
          <link
            href="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json"
            rel="preload"
          ></link>
          <link
            href="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json"
            rel="preload"
          ></link>
          <link
            href="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json"
            rel="preload"
          ></link>
        </Head>
        <WalletConnect
          setwalletConnectVisible={setwalletConnectVisible}
          walletConnectVisible={walletConnectVisible}
        />

        <Nav isFloating />
        <InfoSec dao_data={dao_data} />
        <NavSec selected={selected} setSelected={setSelected} />
        {selected == "Reviews" && (
          <div className={styles.content}>
            <div className={styles.main}>
              <TabletSideBar dao_data={dao_data} />
              <ReviewsSec
                dao_id={dao_data._id}
                rid={rid}
                slug={slug}
                setreview_details={setreview_details}
                reviews={reviews}
                setwalletConnectVisible={setwalletConnectVisible}
                settippingFlowVisible={settippingFlowVisible}
                key={slug}
              />
            </div>
            <Sidebar dao_data={dao_data} />
          </div>
        )}
        {selected == "Missions" && <Missions key={slug} missions={missions} />}
        {selected == "Insights" && (
          <div className={styles.content}>
            <img
              className={styles.coming_soon}
              src={
                "https://media.tenor.com/koVlM3TmNy4AAAAd/itll-be-coming-very-soon-kyle-thomas-harvey.gif"
              }
            />
          </div>
        )}
        {selected == "Ecosystem" && (
          <div className={styles.content}>
            <img
              className={styles.coming_soon}
              src={
                "https://media.tenor.com/koVlM3TmNy4AAAAd/itll-be-coming-very-soon-kyle-thomas-harvey.gif"
              }
            />
          </div>
        )}
        {selected == "Leaderboard" && (
          <div className={styles.content}>
            <Leaderboard />
          </div>
        )}
        {selected == "Members" && (
          <div className={styles.content}>
            <img
              className={styles.coming_soon}
              src={
                "https://media.tenor.com/koVlM3TmNy4AAAAd/itll-be-coming-very-soon-kyle-thomas-harvey.gif"
              }
            />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

const NavSec = ({ selected, setSelected }) => {
  return (
    <ul className={styles.navSec}>
      {["Reviews", "Missions", "Insights", "Ecosystem", "Members"].map(
        (ele, i) => {
          return (
            <li
              className={selected == ele ? styles.selected : {}}
              onClick={() => {
                setSelected(ele);
              }}
              key={ele + i}
            >
              {ele}
            </li>
          );
        }
      )}
    </ul>
  );
};

const InfoSec = ({ dao_data }) => {
  let {
    dao_name,
    review_count,
    dao_category,
    dao_cover,
    average_rating,
    slug,
  } = dao_data;

  let info = dao_data.dao_mission + "\n" + dao_data.description;

  const [showmore, setshowmore] = useState(false);

  return (
    <div className={styles.infoSec}>
      <h1 className={styles.title}>{dao_name}</h1>
      <p style={{ whiteSpace: "pre-wrap" }} className={styles.desc}>
        {info.length < 200
          ? info
          : showmore
          ? info
          : info.slice(0, 218) + "..."}
      </p>
      {info.length > 200 && (
        <p
          className={styles.showmore}
          onClick={() => {
            setshowmore(!showmore);
          }}
          style={{ marginTop: "-10px", marginBottom: "12.35px" }}
        >
          {showmore ? "show less" : "read more"}
        </p>
      )}
      <div className={styles.cta}>
        <span className={styles.reviewInfo}>
          <span className={styles.ratingCon}>
            <StarComp rating={average_rating} />
            <p>{review_count} reviews</p>
          </span>
          <div className={styles.categoryCon}>
            {[...new Set(dao_category)].map((cat, idx) => {
              return (
                <Link key={cat + idx} href={`/discover?category=${cat}`}>
                  <span className={styles.category}>{cat}</span>
                </Link>
              );
            })}
          </div>
        </span>
        {dao_data.discord_link.length > 0 && (
          <Button
            label={"Join Community"}
            onClick={() => {
              openNewTab(dao_data.discord_link);
            }}
          />
        )}
        <Button
          onClick={() => {
            setCookie("target", slug);
            // window.location.href = `${API}/auth/discord`;
            window.location.href = `/add-review?id=${dao_data._id}`;
          }}
          type={"secondary"}
          label={"Write a Review"}
        />
      </div>
      <img alt="" className={styles.cover} src={dao_cover} />
    </div>
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

const Filter = ({ selectedFilter, setselectedFilter }) => {
  return (
    <span className={styles.filter}>
      {selectedFilter}
      <img src={down_arrow.src} alt="" />
      <ul className={styles.filterOptions}>
        <li
          onClick={() => {
            setselectedFilter("Newest");
          }}
        >
          Newest
        </li>
        <li
          onClick={() => {
            setselectedFilter("Oldest");
          }}
        >
          Oldest
        </li>
      </ul>
    </span>
  );
};

let entryColor = {
  1: {
    bg: "url('/leaderboard/gold.svg')",
    grad: "linear-gradient(90deg, rgba(225, 171, 75, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
  },
  2: {
    bg: "url('/leaderboard/silver.svg')",
    grad: "linear-gradient(90deg, rgba(181, 181, 181, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
  },
  3: {
    bg: "url('/leaderboard/bronze.svg')",
    grad: "linear-gradient(90deg, rgba(181, 100, 77, 0.2) 1.94%, rgba(255, 255, 255, 0.2) 33.28%)",
  },
};

const Entry = ({ idx }) => {
  return (
    <span
      className={styles.boardEntry}
      style={{
        background: entryColor[idx]?.grad,
      }}
    >
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
        <img className={styles.userProfile} src="/blue.png" alt="" />
        <span className={styles.userDetails}>
          <h2>random user 1 </h2>
          <p>2 mins ago</p>
        </span>
        <div className={styles.xp}>
          <h3>30 XP</h3>
          <img src="/xpCoin.svg" alt="" />
        </div>
      </div>
    </span>
  );
};

const Leaderboard = () => {
  return (
    <div className={styles.leaderboard}>
      <h1 className={styles.title}>Community Contributors</h1>
      <div className={styles.board}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele) => {
          return <Entry key={ele + "ent"} idx={ele} />;
        })}
      </div>
    </div>
  );
};

const ReviewsSec = ({
  reviews,
  setwalletConnectVisible,
  settippingFlowVisible,
  setreview_details,
  slug,
  rid,
  dao_id,
}) => {
  const [selectedFilter, setselectedFilter] = useState("Newest");

  const [selectedReview, setselected] = useState(null);

  useEffect(() => {
    if (rid) {
      reviews.forEach((element) => {
        if (element._id == rid) {
          setselected(element);
        }
      });
    }
  }, []);

  if (reviews.loading) {
    return (
      <div className={styles.reviewSec}>
        <img className={styles.loader} src="/white-loader.gif" alt="" />
      </div>
    );
  }

  if (!reviews.loading && reviews.reviews.length <= 0) {
    return (
      <div className={styles.banner}>
        <div className={styles.content}>
          <h1>Be the First to Review</h1>
          <p>Review this Community to earn Truts XP</p>
          <button
            onClick={() => {
              window.location.href = `/add-review?id=${dao_id}`;
            }}
          >
            {/* <img src="/missions/btn-img.svg" alt="" /> */}
            Add Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewSec}>
      {/* <div className={styles.info}>
                <h2>What is it?</h2>
                <p>{dao_data.dao_mission}</p>
                <p>{dao_data.description}</p>
            </div> */}
      <span className={styles.reviewFilter}>
        <Button
          onClick={() => {
            setCookie("target", slug);
            // window.location.href = `${API}/auth/discord`;
            window.location.href = `/add-review?id=${dao_id}`;
          }}
          label={"Write a Review"}
          type={"secondary"}
        />
        <Filter
          selectedFilter={selectedFilter}
          setselectedFilter={setselectedFilter}
        />
      </span>
      <div className={styles.reviewCon}>
        {selectedReview && rid && (
          <ReviewComp
            selected={true}
            setreview_details={setreview_details}
            settippingFlowVisible={settippingFlowVisible}
            setwalletConnectVisible={setwalletConnectVisible}
            review={selectedReview}
            key={"r" + "selected"}
          />
        )}
        {selectedFilter == "Newest"
          ? reviews.reviews
              .map((review, idx) => {
                if (review._id == rid) {
                  //filter selected rid
                  return null;
                }
                return (
                  <ReviewComp
                    setreview_details={setreview_details}
                    settippingFlowVisible={settippingFlowVisible}
                    setwalletConnectVisible={setwalletConnectVisible}
                    review={review}
                    key={"r" + idx}
                  />
                );
              })
              .reverse()
          : reviews.map((review, idx) => {
              if (review._id == rid) {
                //filter selected rid
                return null;
              }
              return (
                <ReviewComp
                  setreview_details={setreview_details}
                  settippingFlowVisible={settippingFlowVisible}
                  setwalletConnectVisible={setwalletConnectVisible}
                  review={review}
                  key={"r" + idx}
                />
              );
            })}
      </div>
    </div>
  );
};

const ReviewComp = ({
  review,
  setwalletConnectVisible,
  settippingFlowVisible,
  setreview_details,
  selected,
}) => {
  const [isreadMore, setisreadMore] = useState(false);
  const [rateReviewLoading, setrateReviewLoading] = useState(false);
  const [voteState, setvoteState] = useState({
    vote: review.vote,
    userVote: review.voteState,
  });

  let isTextLarge = review.comment.length >= 400;

  const getReviewDesc = () => {
    if (isTextLarge && !isreadMore) {
      return review.comment.slice(0, 400) + "...";
    }
    return review.comment;
  };

  const intiateTip = () => {
    let chainMap = {
      Ethereum: "eth",
      Solana: "sol",
      near: "near",
    };

    function inverse(obj) {
      var retobj = {};
      for (var key in obj) {
        retobj[obj[key]] = key;
      }
      return retobj;
    }

    setreview_details({
      address: review.oldData.public_address,
      chain: review.chain,
    });
    let wallet_state = JSON.parse(localStorage.getItem("wallet_state"));
    if (wallet_state) {
      console.log("Review chainMap ", review.chain);
      let chain = review.chain || "eth";
      if (chainMap[wallet_state.chain] != chain) {
        alert(
          `Current review can only be tipped via ${
            inverse(chainMap)[chain]
          } based Wallets \nPlease connect ${
            inverse(chainMap)[chain]
          } wallet to continue`
        );
        return setwalletConnectVisible(true);
      }

      settippingFlowVisible(true);
    } else {
      return setwalletConnectVisible(true);
    }
  };

  const rateReviewHandler = async (rating) => {
    setrateReviewLoading(true);
    let vote = rating;
    if (
      voteState.userVote &&
      "action" in voteState.userVote &&
      voteState.userVote.action.length > 1
    ) {
      vote = "UNVOTE";
    }
    let res = await axios.post(
      `${P_API}/review/${review._id}/vote`,
      {
        action: vote,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status == 201 || res.status == 200) {
      setrateReviewLoading(false);

      setvoteState((vs) => {
        vs.vote = res.data.data.review.vote;
        vs.userVote = res.data.data.vote;
        return { ...vs };
      });
    }
  };

  let userInfo = {
    name: review.user.name || "Anon",
    username: review.user.username || null,
  };

  if (userInfo.name.length > 15) {
    userInfo.name = userInfo.name.slice(0, 15) + "...";
  }

  let profile_img = "/profile-old.png";

  if (review?.user?.photo?.secure_url) {
    profile_img = review?.user?.photo?.secure_url;
  }

  return (
    <>
      <div
        className={styles.reviewComp}
        style={selected ? { border: "2px solid #3065f3" } : {}}
      >
        <div className={styles.userInfo}>
          <img className={styles.profilePic} src={profile_img} alt="" />
          <span>
            {userInfo.username ? (
              <p className={styles.address}>
                {userInfo.name}
                <span>@{userInfo.username}</span>
              </p>
            ) : (
              <p className={styles.address}>{userInfo.name}</p>
            )}
            <StarComp size={"s"} rating={review.rating} />
          </span>
        </div>
        <div className={styles.review_desc}>{getReviewDesc()}</div>
        {isTextLarge && (
          <p
            onClick={() => {
              setisreadMore(!isreadMore);
            }}
            className={styles.showmore}
          >
            {isreadMore ? "show less" : "read more"}
          </p>
        )}
        <div className={styles.bottom_nav}>
          <span
            className={styles.iconText}
            onClick={() => {
              rateReviewHandler("UP_VOTE");
            }}
          >
            <img src={rateReviewLoading ? loader.src : thumbs_up.src} alt="" />
            <p>{voteState.vote.up}</p>
          </span>
          <span
            className={styles.iconText}
            onClick={() => {
              rateReviewHandler("DOWN_VOTE");
            }}
          >
            <img
              src={rateReviewLoading ? loader.src : thumbs_down.src}
              alt=""
            />
            <p>{voteState.vote.down}</p>
          </span>
          {/* <span className={styles.iconText}  >
                        <img src={share.src} alt="" />
                        <p>share</p>
                    </span> */}
          <span className={styles.iconText} onClick={intiateTip}>
            <img src={tip.src} alt="" />
            {/* <p>$400</p> */}
          </span>
        </div>
        <span className={styles.divider} />
      </div>
    </>
  );
};

function Missions({ missions }) {
  console.log(missions);
  return (
    <div className={styles.content}>
      <div className={styles.stack}>
        {"missions" in missions && missions.missions.length > 0 && (
          <section className={styles.missions}>
            {missions.missions.map((ele, idx) => {
              return (
                <Mission
                  key={"msn" + idx}
                  min={true}
                  data={ele}
                  isCompleted={ele.isCompleted}
                />
              );
            })}
          </section>
        )}
        {"missions" in missions && (
          <div className={styles.banner}>
            <div className={styles.content}>
              <h1>
                <img src="/logo.svg" alt="" />
                Missions
              </h1>
              <p>
                Are you a community owner? Engage the community by launching
                missions. Click the button below to get started.
              </p>
              <button
                onClick={() => {
                  location.href = "/launch-missions.html";
                }}
              >
                <img src="/missions/btn-img.svg" alt="" />
                Launch Missions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function setCookie(name, value) {
  let days = 1;
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
  //console.log(ctx.query);
  let { slug } = ctx.query;
  // Fetch data from external API
  if (!slug) return null;
  let res = await fetchData(slug[0]);
  console.log(res);
  let rid = slug[1] || "";
  // Pass data to the page via props

  return { props: { dao_data: { ...res }, rid: rid, slug: slug[0] } };
}

const fetchData = async (slug) => {
  console.log("slug :", slug);
  try {
    const res = await axios.get(`${P_API}/listing/${slug}`);
    if (res.status == 200) {
      return JSON.parse(JSON.stringify(res.data.data.listing));
    } else {
      alert("DAO NOT FOUND");
    }
  } catch (er) {
    console.log(er);
  }
  return null;
};

function newGradient() {
  var c1 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  var c2 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  c1.rgb = "rgb(" + c1.r + "," + c1.g + "," + c1.b + ")";
  c2.rgb = "rgb(" + c2.r + "," + c2.g + "," + c2.b + ")";
  return "radial-gradient(at top left, " + c1.rgb + ", " + c2.rgb + ")";
}

export default Dao;
