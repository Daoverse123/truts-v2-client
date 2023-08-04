import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

import styles from "./daoform.module.scss";
import axios from "axios";
import fuzzy from "fuzzy.js";
import Head from "next/head";

//components
import Nav from "./../../components/Nav";
import Footer from "./../../components/Footer";
import Button from "./../../components/Button";
import WalletConnect from "../../components/WalletConnect";

//assets
import closeIcon from "../../assets/icons/close_icon.svg";
import { set } from "lodash";

// const CATEGORY_LIST = [
//   "DAO",
//   "Media",
//   "Investment",
//   "Ordinals",
//   "Service",
//   "Grant",
//   "Social",
//   "DAO Tool",
//   "Defi",
//   "CeFi",
//   "TradeFi",
//   "BlockFi",
//   "Lending",
//   "Yield Aggregator",
//   "Stablecoin",
//   "NFT",
//   "Metaverse",
//   "Art",
//   "Music",
//   "NFT Marketplace",
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
//   "Marketing Tool",
//   "Public Good",
//   "Education",
//   "Chain",
// ];

const CHAIN_LIST_FIX = {
  "multi-chain": "Multi Chain",
  aptos: "Aptos",
  "arbitrum-one": "Arbitrum",
  avalanche: "Avalanche",
  "binance-smart-chain": "Binance Smart Chain",
  cardano: "Cardano",
  ethereum: "Ethereum",
  near: "Near",
  "polygon-pos": "Polygon",
  solana: "Solana",
  tezos: "Tezos",
  sui: "Sui",
  telos: "Telos",
  bitcoin: "Bitcoin",
  okc: "OKC",
  mantle: "Mantle",
  "optimistic-ethereum": "optimism",
};

const API = process.env.API;
{
  /* 
opensea_link: { type: String },
magiceden_link: { type: String }, */
}
let CATEGORY_LIST = [];
function DaoForm({ categoriesList, chainList }) {
  CATEGORY_LIST = categoriesList.map((ele) => ele.category);
  let CHAIN_LIST_MAP = {};
  chainList.forEach((ele) => {
    let key = ele.chain;
    if (key in CHAIN_LIST_FIX) {
      key = CHAIN_LIST_FIX[key];
    }
    key = key[0].toUpperCase() + key.slice(1);
    CHAIN_LIST_MAP[key] = ele.chain;
  });

  const [walletConnectVisible, setwalletConnectVisible] = useState(false);
  const [state, setState] = useState({
    name: "",
    oneliner: "",
    description: "",
    slug: "",
    categories: "",
    chains: "",
    socials: "",
    discord_link: "",
    twitter_link: "",
    website_link: "",
    mirror_link: "",
  });

  //console.log(state)

  const submitForm = async (e) => {
    e.preventDefault();

    if (state.categories.length < 1) {
      return alert("Please add applicable categories for your Community.");
    }
    if (state.chains.length < 1) {
      return alert("Please add Chains relevant to your Community.");
    }
    if (state.oneliner.length < 5) {
      return alert(
        "Please add more details in One Line Statement for your Community. Atleast 5 characters required."
      );
    }
    if (state.description.length < 50) {
      return alert(
        "Please add more details in Community Description. Atleast 50 characters required."
      );
    }

    console.log("state :>> ", {
      ...state,
      chains: state.chains.map((ch) => CHAIN_LIST_MAP[ch]),
    });
    try {
      let res = await axios.post(
        `${process.env.P_API}/listing`,
        {
          ...state,
          chains: state.chains.map((ch) => CHAIN_LIST_MAP[ch]),
          socials: {
            TWITTER: state.twitter_link,
            DISCORD: state.discord_link,
            WEBSITE: state.website_link,
          },
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status == 201) {
        console.log("redirect");
        window.location.href = "./status/community-listed-success";
      } else {
        console.log("redirect");
        window.location.href = "./status/community-listed-failed";
      }
    } catch (er) {
      console.log(er);
    }
  };

  let disableForm = { pointerEvents: "none", opacity: "0.4" };
  const [formDisabled, setformDisabled] = useState(true);

  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token") != "" &&
      localStorage.getItem("token") != "null" &&
      localStorage.getItem("token") != "undefined" &&
      localStorage.getItem("token") != null
    ) {
      setformDisabled(false);
    } else {
      setformDisabled(true);
    }
  }, []);

  const [value, setDesc] = useState("**Hello world!!!**");

  return (
    <>
      <div className={styles.daoPage}>
        <Head>
          <title>Truts</title>
          <meta
            name="description"
            content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav isFloating isStrech />
        <WalletConnect
          setwalletConnectVisible={setwalletConnectVisible}
          walletConnectVisible={walletConnectVisible}
        />
        <div>
          {formDisabled && <SignupPrompt />}

          <form
            style={formDisabled ? disableForm : {}}
            onSubmit={submitForm}
            className={styles.daoForm}
          >
            <h1 className={styles.title}>
              Application for Listing your Community on Truts
            </h1>
            <p className={styles.subtitle}>
              Please fill the following details of your Community to apply for
              your page on Truts.
            </p>

            <label htmlFor="">
              <p>What`s the Name of your Community?*</p>
              <input
                placeholder="Community Name"
                required
                value={state.name}
                onChange={(e) => {
                  setState((s) => {
                    s.name = e.target.value;
                    return { ...s };
                  });
                }}
                type="text"
              />
            </label>

            <label htmlFor="">
              <p>Add a One Line Statement for your Community.*</p>
              <textarea
                required
                value={state.oneliner}
                onChange={(e) => {
                  setState((s) => {
                    s.oneliner = e.target.value;
                    return { ...s };
                  });
                }}
                placeholder="Please keep it within 1 to 2 lines."
                rows={5}
                type="text"
              />
            </label>

            <CategotyCon state={state} setState={setState} />
            <ChainSelectCon
              CHAIN_LIST_MAP={CHAIN_LIST_MAP}
              state={state}
              setState={setState}
            />

            <span
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "25px",
              }}
              data-color-mode="light"
              htmlFor=""
            >
              <p>
                Add a brief Description for your Community.* (Markdown enabled)
              </p>
              <MDEditor
                height={400}
                value={state.description}
                onChange={(e) => {
                  setState((s) => {
                    s.description = e;
                    return { ...s };
                  });
                }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </span>
            {/* 
            <label htmlFor="">
              <p>Add a brief Description for your Community.*</p>
              <textarea
                required
                value={state.description}
                onChange={(e) => {
                  setState((s) => {
                    s.description = e.target.value;
                    return { ...s };
                  });
                }}
                placeholder="Even though there is no word limit but please do keep it short and brief :)"
                rows={15}
                type="text"
              />
            </label> */}

            <span className={styles.linkRow}>
              <label htmlFor="">
                <p>Discord Link:*</p>
                <input
                  required
                  value={state.discord_link}
                  onChange={(e) => {
                    setState((s) => {
                      s.discord_link = e.target.value;
                      return { ...s };
                    });
                  }}
                  placeholder="https://discord.com/invite/..."
                  type="text"
                />
              </label>

              <label htmlFor="">
                <p>Twitter Link:*</p>
                <input
                  required
                  value={state.twitter_link}
                  onChange={(e) => {
                    setState((s) => {
                      s.twitter_link = e.target.value;
                      return { ...s };
                    });
                  }}
                  placeholder="https://twitter.com/..."
                  type="text"
                />
              </label>
            </span>

            <span className={styles.linkRow}>
              <label htmlFor="">
                <p>Website Link:*</p>
                <input
                  required
                  value={state.website_link}
                  onChange={(e) => {
                    setState((s) => {
                      s.website_link = e.target.value;
                      return { ...s };
                    });
                  }}
                  placeholder="https://samplesite.xyz"
                  type="text"
                />
              </label>

              <label htmlFor="">
                <p>Blog Link:</p>
                <input
                  value={state.mirror_link}
                  onChange={(e) => {
                    setState((s) => {
                      s.mirror_link = e.target.value;
                      return { ...s };
                    });
                  }}
                  placeholder="https://samplesite.xyz/blog"
                  type="text"
                />
              </label>
            </span>
            <Button label={"Submit"} />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );

  function SignupPrompt() {
    return (
      <div className={styles.signUp}>
        <p>Sign in or sign up to add your community.</p>
        <button
          onClick={() => {
            //location.href = "/?signup=true";
            window.showSignupPrompt && window.showSignupPrompt();
          }}
        >
          Login/Sign Up
        </button>
      </div>
    );
  }
}

const CategotyCon = ({ state, setState }) => {
  let initialSuggestion = CATEGORY_LIST.map((term) => {
    return { term };
  });
  const [selectedItems, setselectedItems] = useState([]);
  const [inputText, setinputText] = useState("");
  const [active, setactive] = useState(0);
  const [suggestionList, setsuggestionList] = useState(initialSuggestion);
  const [suggestionVisible, setsuggestionVisible] = useState(false);
  //console.log(suggestionList)

  useEffect(() => {
    setState((s) => {
      s.categories = selectedItems;
      return { ...s };
    });
  }, [selectedItems]);

  let GenerateSuggestion = () => {
    setsuggestionList(() => {
      return [
        ...initialSuggestion
          .map((ele) => {
            return fuzzy(ele.term, inputText);
          })
          .sort((a, b) => b.score - a.score)
          .filter((ele) => {
            if (selectedItems.includes(ele.term)) {
              return false;
            }
            return true;
          }),
      ];
    });
  };

  useEffect(() => {
    GenerateSuggestion();
  }, [selectedItems]);

  useEffect(() => {
    if (active != 0) {
      setinputText(suggestionList[active - 1].term);
    } else {
      setinputText("");
    }
  }, [active]);

  useEffect(() => {
    if (selectedItems.length > 3) {
      setselectedItems((ele) => {
        ele.pop();
        return [...ele];
      });
    }
  }, [selectedItems]);

  let focusStyle = { background: "#eeeff2" };

  //console.log(inputText)

  return (
    <>
      <label
        htmlFor=""
        className={styles.customInputelm}
        key={JSON.stringify(selectedItems)}
      >
        <p>What categories does your Community belong to? (max 3 categories)</p>
        {true && (
          <div className={styles.slectedTags}>
            <p className={styles.p}>Selected Categories:</p>

            {selectedItems.map((ele, i) => {
              return (
                <span
                  onClick={() => {
                    setselectedItems(selectedItems.filter((itm) => itm != ele));
                    setinputText("");
                  }}
                  key={ele + i}
                  className={styles.tag}
                >
                  {ele} <img src={closeIcon.src} alt="" />{" "}
                </span>
              );
            })}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter Categories"
          value={inputText}
          onChange={(e) => {
            // console.log("changr")
            setinputText(e.target.value);
            setactive(0);
          }}
          onKeyDown={(e) => {
            //  console.log(e.key)
            if (e.key == "ArrowDown") {
              if (active > suggestionList.length - 1) {
                setactive(0);
              }
              setactive((a) => a + 1);
            } else if (e.key == "ArrowUp") {
              if (active < 1) {
                return null;
              }
              setactive((a) => a - 1);
            } else if (e.key == "Enter") {
              setselectedItems(() => {
                let elm = new Set(selectedItems);
                elm.add(inputText.trim());
                return [...elm];
              });
            } else {
              GenerateSuggestion();
            }
          }}
          onFocusCapture={() => {
            //  console.log("focus")
            setsuggestionVisible(true);
          }}
          onBlur={() => {
            setsuggestionVisible(false);
          }}
        />

        {
          <div id="suggestionBox" className={styles.suggestionBox}>
            {suggestionList.map((s, i) => {
              return (
                <span
                  onClick={() => {
                    setselectedItems(() => {
                      let elm = new Set(selectedItems);
                      elm.add(s.term.trim());
                      return [...elm];
                    });
                  }}
                  style={active == i + 1 ? focusStyle : {}}
                  key={s.term + i + inputText}
                  className={styles.suggestion}
                >
                  {s.term}
                </span>
              );
            })}
          </div>
        }
      </label>
    </>
  );
};

const ChainSelectCon = ({ state, setState, CHAIN_LIST_MAP }) => {
  let initialSuggestion = Object.keys(CHAIN_LIST_MAP).map((term) => {
    return { term };
  });
  const [selectedItems, setselectedItems] = useState([]);
  const [inputText, setinputText] = useState("");
  const [active, setactive] = useState(0);
  const [suggestionList, setsuggestionList] = useState(initialSuggestion);
  const [suggestionVisible, setsuggestionVisible] = useState(false);
  // console.log(suggestionList)

  useEffect(() => {
    setState((s) => {
      s.chains = selectedItems;
      return { ...s };
    });
  }, [selectedItems]);

  let GenerateSuggestion = () => {
    setsuggestionList(() => {
      return [
        ...initialSuggestion
          .map((ele) => {
            return fuzzy(ele.term, inputText);
          })
          .sort((a, b) => b.score - a.score)
          .filter((ele) => {
            if (selectedItems.includes(ele.term)) {
              return false;
            }
            return true;
          }),
      ];
    });
  };

  useEffect(() => {
    GenerateSuggestion();
  }, [selectedItems]);

  useEffect(() => {
    if (active != 0) {
      setinputText(suggestionList[active - 1].term);
    } else {
      setinputText("");
    }
  }, [active]);

  useEffect(() => {
    if (selectedItems.length > 3) {
      setselectedItems((ele) => {
        ele.pop();
        return [...ele];
      });
    }
  }, [selectedItems]);

  let focusStyle = { background: "#eeeff2" };

  return (
    <>
      <label
        htmlFor=""
        className={styles.customInputelm}
        key={JSON.stringify(selectedItems)}
      >
        <p>Select the Blockchain your community is based on (max 3)</p>
        {true && (
          <div className={styles.slectedTags}>
            <p className={styles.p}>Selected Chains:</p>

            {selectedItems.map((ele, i) => {
              return (
                <span
                  onClick={() => {
                    setselectedItems(selectedItems.filter((itm) => itm != ele));
                    setinputText("");
                  }}
                  key={ele + i}
                  className={styles.tag}
                >
                  {ele} <img src={closeIcon.src} alt="" />{" "}
                </span>
              );
            })}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter Chains"
          value={inputText}
          onChange={(e) => {
            //console.log("changr")
            setinputText(e.target.value);
            setactive(0);
          }}
          onKeyDown={(e) => {
            //console.log(e.key)
            if (e.key == "ArrowDown") {
              if (active > suggestionList.length - 1) {
                setactive(0);
              }
              setactive((a) => a + 1);
            } else if (e.key == "ArrowUp") {
              if (active < 1) {
                return null;
              }
              setactive((a) => a - 1);
            } else if (e.key == "Enter") {
              setselectedItems(() => {
                let elm = new Set(selectedItems);
                if (Object.keys(CHAIN_LIST_MAP).includes(inputText.trim())) {
                  elm.add(inputText.trim());
                }
                return [...elm];
              });
            } else {
              GenerateSuggestion();
            }
          }}
          onFocus={() => {
            setsuggestionVisible(true);
          }}
          onBlur={() => {
            setsuggestionVisible(false);
          }}
        />

        {
          <div id="suggestionBox" className={styles.suggestionBox}>
            {suggestionList.map((s, i) => {
              return (
                <span
                  onClick={() => {
                    setselectedItems(() => {
                      let elm = new Set(selectedItems);
                      elm.add(s.term.trim());
                      return [...elm];
                    });
                  }}
                  style={active == i + 1 ? focusStyle : {}}
                  key={s.term + i + inputText}
                  className={styles.suggestion}
                >
                  {s.term}
                </span>
              );
            })}
          </div>
        }
      </label>
    </>
  );
};

export async function getServerSideProps(ctx) {
  let res = await Promise.all([
    axios.get(`${process.env.P_API}/listing/categories`),
    axios.get(`${process.env.P_API}/listing/chains`),
  ]);

  return {
    props: {
      categoriesList: res[0].data.data.result,
      chainList: res[1].data.data.result,
    },
  };
}

export default DaoForm;
