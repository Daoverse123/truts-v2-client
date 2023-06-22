import React, { useEffect, useState, useReducer } from "react";
import styles from "./discover.module.scss";
import axios from "axios";
import DoubleSlider from "double-slider";
import { useMediaQuery } from "react-responsive";
import Head from "next/head";
import { removeDuplicates } from "remove-duplicates-from-an-array-of-object";
import { useRouter } from "next/router";

//components
import Nav from "../../components/Nav";
import DAOCard from "../../components/DAOCard";
import Button from "../../components/Button";
import Footer from "../../components/Footer";

//assets
import downArrow from "../../assets/icons/down_arrow.svg";
import star_blank_gradient from "../../assets/icons/star_blank_gradient.svg";
import star_filled_gradient from "../../assets/icons/star_filled_gradient.svg";
import close_btn from "../../assets/icons/close_icon.svg";
import { useQuery } from "react-query";
import { create } from "zustand";

let sideNavTabs = {
  Categories: "",
  "Network Chains": "",
  Ratings: "",
  "Discord Member Count": "",
  "Twitter Follower Count": "",
};

// CONSTANTS
const API = process.env.API;
//const CATEGORY_LIST = ['All', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Legal', `NEAR Ecosystem`]

let discordFollowers = {
  "0 to 5K": { min: 0, max: 5000 },
  "5K to 15K": { min: 0, max: 15000 },
  "15K & 30k": { min: 15000, max: 30000 },
  "30K & 50k": { min: 30000, max: 50000 },
  "50K & 100k": { min: 50000, max: 100000 },
  "100k+": { min: 100000, max: Infinity },
};

let twitterFollowers = {
  "0 to 20k": { min: 0, max: 20000 },
  "20K to 50K": { min: 20000, max: 50000 },
  "50K to 100k": { min: 50000, max: 100000 },
  "100K+": { min: 50000, max: Infinity },
};

const filterStore = create((set) => ({
  chains: [],
  categories: [],
  rating: [],
  twitter_followers: undefined,
  discord_members: undefined,
  rating_sort: -1,
  pageMultiplier: 1,
  loadMore: () => {
    set((state) => {
      state.pageMultiplier = state.pageMultiplier + 1;
      return { ...state };
    });
  },
  setRatingSort: (data) => {
    set((state) => {
      state.rating_sort = data;
      return { ...state };
    });
  },
  addChain: (data) => {
    set((state) => {
      state.chains = [...state.chains, data];
      return { ...state };
    });
  },
  removeChain: (data) => {
    set((state) => {
      if (data == "all") {
        state.chains = [];
        return { ...state };
      }
      state.chains = state.chains.filter((ele) => ele != data);
      return { ...state };
    });
  },
  addCategories: (data) => {
    set((state) => {
      state.categories = [...state.categories, data];
      return { ...state };
    });
  },
  removeCategories: (data) => {
    set((state) => {
      if (data == "all") {
        state.categories = [];
        return { ...state };
      }
      state.categories = state.categories.filter((ele) => ele != data);
      return { ...state };
    });
  },
  addtwitter: (data) => {
    set((state) => {
      state.twitter_followers = data;
      return { ...state };
    });
  },
  removetwitter: (data) => {
    set((state) => {
      state.twitter_followers = undefined;
      return { ...state };
    });
  },
  addDiscord: (data) => {
    set((state) => {
      state.discord_members = data;
      return { ...state };
    });
  },
  removeDiscord: (data) => {
    set((state) => {
      state.discord_members = undefined;
      return { ...state };
    });
  },
  addRating: (data) => {
    set((state) => {
      state.rating = [...state.rating, data];
      return { ...state };
    });
  },
  removeRating: (data) => {
    set((state) => {
      if (data == "all") {
        state.rating = [];
        return { ...state };
      }
      state.rating = state.rating.filter((ele) => ele != data);
      return { ...state };
    });
  },
}));

function Discover({ chainList, categoriesList, selected_chain }) {
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });

  const [filtersVisible, setfiltersVisible] = useState(false);

  const router = useRouter();

  const [collapseState, setcollapseState] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  let {
    rating_sort,
    chains,
    categories,
    twitter_followers,
    discord_members,
    rating,
    pageMultiplier,
    loadMore,
    addChain,
  } = filterStore();

  useEffect(() => {
    if (selected_chain) {
      addChain(selected_chain);
    }
  }, []);

  let queryRes = useQuery({
    queryKey: [
      "list",
      chains,
      categories,
      twitter_followers,
      discord_members,
      rating_sort,
      pageMultiplier,
    ],
    queryFn: async (data) => {
      let chains = data.queryKey[1];
      let categories = data.queryKey[2];
      let twitter_followers = data.queryKey[3];
      let discord_members = data.queryKey[4];
      let rating_sort = data.queryKey[5];
      let pageMultiplier = data.queryKey[6];

      let params = {
        limit: 150 * pageMultiplier,
        sort: `{ "count": -1 ,"rating" : ${rating_sort} }`,
      };

      let filter = {};
      if (categories.length > 0) {
        filter.categories = categories;
      }
      if (chains.length > 0) {
        filter.chains = chains;
      }
      if (twitter_followers) {
        let range = {};
        let { min, max } = twitterFollowers[twitter_followers];
        if (max != Infinity) {
          range.lte = max;
        }
        range.gte = min;
        filter["meta.twitter_followers"] = range;
      }
      if (discord_members) {
        let range = {};
        let { min, max } = discordFollowers[discord_members];
        if (max != Infinity) {
          range.lte = max;
        }
        range.gte = min;
        filter["meta.discord_members"] = range;
      }

      if (Object.keys(filter).length > 0) {
        params.filter = JSON.stringify(filter);
      }

      let res = await axios.get(`${process.env.P_API}/listing`, { params });
      return res.data.data;
    },
  });

  console.log(queryRes);

  useEffect(() => {
    setfiltersVisible(!isMobile);
  }, [isMobile]);

  return (
    <>
      <Head>
        <title>Truts | Discover</title>
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
      <div className={styles.discoverPage}>
        <Nav isFloating />
        <h1 className={styles.title}>Our Wall of Communities</h1>
        <div className={styles.mainCon}>
          {filtersVisible && (
            <div className={styles.sideNav}>
              <span className={styles.mobileFilterHeadder}>
                <img
                  onClick={() => {
                    //setfiltersVisible(false);
                  }}
                  src={close_btn.src}
                  alt=""
                />
                <p>Filters</p>
              </span>
              <h1 className={styles.sideBarTitle}>Communities</h1>
              <SortComp />
              {Object.keys(sideNavTabs).map((ele, i) => {
                return (
                  <>
                    <span
                      onClick={() => {
                        setcollapseState((sc) => {
                          sc[i] = !sc[i];
                          return { ...sc };
                        });
                      }}
                      className={styles.option}
                      key={i + "sd"}
                    >
                      <p>{ele}</p>
                      <img src={downArrow.src} alt="" />
                    </span>
                    <GetSection
                      {...{ chainList }}
                      {...{ categoriesList }}
                      key={i + "gsd"}
                      label={ele}
                      idx={i}
                      collapseState={collapseState}
                    />
                    <span key={i + "dv"} className={styles.divider} />
                  </>
                );
              })}
            </div>
          )}
          {!queryRes.isSuccess && (
            <span className={styles.loading}>
              <img src="/loading.gif" alt="" />
            </span>
          )}
          <div className={styles.gallery}>
            <div className={styles.daoList}>
              {queryRes.isSuccess &&
                queryRes.data.result
                  .filter((ft) => {
                    if (rating.length == 0) {
                      return true;
                    }
                    let averageRating = Math.ceil(ft.average_rating);
                    if (rating.includes(averageRating)) {
                      return true;
                    }
                    return false;
                  })
                  .map((ele, idx) => {
                    return <DAOCard data={ele} key={"card" + idx} />;
                  })}
            </div>

            {queryRes.isSuccess && (
              <Button
                onClick={() => {
                  loadMore();
                }}
                label={"show more"}
              />
            )}
          </div>
        </div>

        <div
          onClick={() => {
            setfiltersVisible(true);
          }}
          className={styles.mobileFilterNav}
        >
          <button>Filters</button>
        </div>
      </div>
      <div style={{ paddingTop: "100px", background: "#F7F7F7" }}>
        <Footer />
      </div>
    </>
  );
}

//ssr
export async function getServerSideProps(ctx) {
  let res = await Promise.all([
    axios.get(`${process.env.P_API}/listing/categories`),
    axios.get(`${process.env.P_API}/listing/chains`),
  ]);

  let selected_chain = undefined;

  if (ctx?.query?.chain) {
    selected_chain = ctx?.query?.chain;
  }

  return {
    props: {
      categoriesList: res[0].data.data.result,
      chainList: res[1].data.data.result,
      selected_chain: selected_chain || "",
    },
  };
}

//push .. .
const SortComp = () => {
  let { setRatingSort, rating_sort } = filterStore();
  return (
    <span className={styles.sortComp}>
      <span className={styles.option}>
        <p>Sort by</p>
      </span>
      <span className={styles.typesOption}>
        <p>Ratings: High to Low</p>
        <input
          type={"checkbox"}
          checked={rating_sort == -1}
          onClick={(e) => {
            if (e.target.checked) {
              setRatingSort(-1);
            }
          }}
        />
      </span>
      <span className={styles.typesOption}>
        <p>Ratings: Low to High</p>
        <input
          type={"checkbox"}
          checked={rating_sort == 1}
          onClick={(e) => {
            if (e.target.checked) {
              setRatingSort(1);
            }
          }}
        />
      </span>
      <span className={styles.divider} />
    </span>
  );
};

const GetSection = ({
  label,
  idx,
  collapseState,
  state,
  dispatch,
  catCount,
  chainCount,
  chainList,
  categoriesList,
}) => {
  if (label == Object.keys(sideNavTabs)[0] && collapseState[0]) {
    return (
      <TypesOfCommunities
        state={state}
        dispatch={dispatch}
        catCount={catCount}
        {...{ categoriesList }}
      />
    );
  }
  if (label == Object.keys(sideNavTabs)[1] && collapseState[1]) {
    return (
      <NetworkChains
        visible={true}
        state={state}
        dispatch={dispatch}
        chainCount={chainCount}
        {...{ chainList }}
      />
    );
  }
  if (label == Object.keys(sideNavTabs)[2] && collapseState[2]) {
    return <RatingComp visible={true} state={state} dispatch={dispatch} />;
  }
  if (label == Object.keys(sideNavTabs)[3] && collapseState[3]) {
    return <DiscordMembers visible={true} state={state} dispatch={dispatch} />;
  }
  if (label == Object.keys(sideNavTabs)[4] && collapseState[4]) {
    return (
      <TwitterFollowers visible={true} state={state} dispatch={dispatch} />
    );
  } else {
    return <></>;
  }
};

const TypesOfCommunities = ({ categoriesList }) => {
  let { addCategories, removeCategories, categories } = filterStore();

  return (
    <div className={styles.typesOfCommunities}>
      <p
        className={styles.reset}
        onClick={() => {
          removeCategories("all");
        }}
      >
        Reset
      </p>
      {categoriesList.map((ele, i) => {
        return (
          <span key={i + ele} className={styles.typesOption}>
            <p>
              {ele.category}
              {` (${ele.count})`}
            </p>
            <input
              checked={categories.includes(ele.category)}
              onChange={(e) => {
                if (e.target.checked) {
                  addCategories(ele.category);
                } else {
                  removeCategories(ele.category);
                }
              }}
              type={"checkbox"}
            />
          </span>
        );
      })}
    </div>
  );
};

const TwitterFollowers = () => {
  let { addtwitter, removetwitter, twitter_followers } = filterStore();

  return (
    <div className={styles.typesOfCommunities}>
      <p
        className={styles.reset}
        onClick={() => {
          removetwitter("all");
        }}
      >
        Reset
      </p>
      {Object.keys(twitterFollowers).map((ele, i) => {
        return (
          <span key={i + ele} className={styles.typesOption}>
            <p>{ele}</p>
            <input
              checked={ele == twitter_followers}
              onChange={(e) => {
                if (e.target.checked) {
                  addtwitter(ele);
                } else {
                  removetwitter(ele);
                }
              }}
              type={"checkbox"}
            />
          </span>
        );
      })}
    </div>
  );
};

const DiscordMembers = () => {
  let { addDiscord, removeDiscord, discord_members } = filterStore();

  return (
    <div className={styles.typesOfCommunities}>
      <p
        className={styles.reset}
        onClick={() => {
          removeDiscord("all");
        }}
      >
        Reset
      </p>
      {Object.keys(discordFollowers).map((ele, i) => {
        return (
          <span key={i + ele} className={styles.typesOption}>
            <p>{ele}</p>
            <input
              checked={ele == discord_members}
              onChange={(e) => {
                if (e.target.checked) {
                  addDiscord(ele);
                } else {
                  removeDiscord(ele);
                }
              }}
              type={"checkbox"}
            />
          </span>
        );
      })}
    </div>
  );
};

const NetworkChains = ({ chainList }) => {
  let { addChain, removeChain, chains } = filterStore();

  return (
    <div className={styles.typesOfCommunities}>
      <p
        className={styles.reset}
        onClick={() => {
          removeChain("all");
        }}
      >
        Reset
      </p>
      {chainList.map((ele, i) => {
        return (
          <span key={i + ele} className={styles.typesOption}>
            {/* <p>{ele}</p> */}

            <p>
              {chainMapCheck(ele.chain)} {`(${ele.count})`}
            </p>

            <input
              checked={chains.includes(ele.chain)}
              onChange={(e) => {
                if (e.target.checked) {
                  addChain(ele.chain);
                } else {
                  removeChain(ele.chain);
                }
              }}
              type={"checkbox"}
            />
          </span>
        );
      })}
    </div>
  );
};

const RatingComp = ({ state }) => {
  let { rating, addRating, removeRating } = filterStore();

  console.log(rating);

  const StarComp = ({ count }) => {
    return (
      <span className={styles.starComp}>
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= count) {
            return <img key={i + "s"} src={star_filled_gradient.src} alt="" />;
          } else {
            return <img key={i + "s"} src={star_blank_gradient.src} alt="" />;
          }
        })}
        <input
          checked={rating.includes(count)}
          type={"checkbox"}
          onChange={(e) => {
            if (e.target.checked) {
              addRating(count);
            } else {
              removeRating(count);
            }
          }}
        />
      </span>
    );
  };

  return (
    <div className={styles.ratingComp}>
      {[0, 1, 2, 3, 4, 5].reverse().map((i) => {
        return <StarComp key={i + "star"} count={i} />;
      })}
    </div>
  );
};

export default Discover;

// const CATEGORY_LIST = [
//   "DAO",
//   "Media",
//   "Investors",
//   "Service",
//   "Grant",
//   "Social",
//   "DAO tool",
//   "Defi",
//   "CeFi",
//   "TradeFi",
//   "BlockFi",
//   "Lending",
//   "Yield aggregator",
//   "Stablecoin",
//   "NFT",
//   "Metaverse",
//   "Art",
//   "Music",
//   "NFT marketplace",
//   "Utilities",
//   "Analytics",
//   "Payment",
//   "Oracle",
//   "Games",
//   "Infrastructure",
//   "Wallet",
//   "Indexer",
//   "Storage",
//   "Identity",
//   "Exchange",
//   "Community",
//   "Guild",
//   "Marketing tool",
//   "Public Good",
//   "Education",
//   "Investment",
//   "Tools",
//   "Protocol",
//   "Product",
//   "Investors",
//   "Collector",
//   "DApps",
//   "Node Providers",
// ];

let chainMap = {
  all: "All",
  avalanche: "Avalanche",
  "arbitrum-one": "Arbitrum",
  "binance-smart-chain": "Binance Smart Chain",
  cardano: "Cardano",
  cosmos: "Cosmos",
  ethereum: "Ethereum",
  flow: "Flow",
  near: "Near",
  "polygon-pos": "Polygon",
  solana: "Solana",
  sei: "Sei",
  syscoin: "Syscoin",
  telos: "Telos",
  tezos: "Tezos",
  "harmony-shard-0": "Harmony",
  "optimistic-ethereum": "Optimism",
  "metis-andromeda": "Metis",
};

const chainMapCheck = (chain) => {
  try {
    if (Object.keys(chainMap).includes(chain)) {
      let name = chainMap[chain];
      return name;
    }
    return capitalizeFirstLetter(chain);
  } catch (error) {}
  return capitalizeFirstLetter(chain);
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
