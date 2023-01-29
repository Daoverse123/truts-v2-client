import React, { useEffect, useState } from "react";
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
const CATEGORY_LIST = [
  "DAO",
  "Media",
  "Investment",
  "Service",
  "Grant",
  "Social",
  "DAO Tool",
  "Defi",
  "CeFi",
  "TradeFi",
  "BlockFi",
  "Lending",
  "Yield Aggregator",
  "Stablecoin",
  "NFT",
  "Metaverse",
  "Art",
  "Music",
  "NFT Marketplace",
  "Utilities",
  "Analytics",
  "Payment",
  "Oracle",
  "Games",
  "Infrastructure",
  "Wallet",
  "Indexer",
  "Storage",
  "Identity",
  "Exchange",
  "Community",
  "Guild",
  "Marketing Tool",
  "Public Good",
  "Education",
];

const CHAIN_LIST_MAP = {
  Arbitrum: "arbitrum-one",
  Avalanche: "avalanche",
  "Binance Smart Chain": "binance-smart-chain",
  Cardano: "cardano",
  Ethereum: "ethereum",
  Near: "near",
  Polygon: "polygon-pos",
  Solana: "solana",
  Tezos: "tezos",
  Sui: "sui",
  Bitcoin: "bitcoin",
};
let categoriesWithId = CATEGORY_LIST.map((name, id) => {
  return { id, name };
});
const API = process.env.API;
{
  /* 
opensea_link: { type: String },
magiceden_link: { type: String }, */
}
function DaoForm() {
  const [walletConnectVisible, setwalletConnectVisible] = useState(false);
  const [state, setState] = useState({
    dao_name: "",
    dao_category: "",
    dao_mission: "",
    description: "",
    discord_link: "",
    twitter_link: "",
    website_link: "",
    additional_link: "",
    mirror_link: "",
    submitter_discord_id: "",
    submitter_public_address: "",
    chain: "",
    treasury: "",
    opensea_link: "",
    magiceden_link: "",
  });

  //console.log(state)

  const submitForm = async (e) => {
    e.preventDefault();
    let ws = JSON.parse(localStorage.getItem("wallet_state"));
    let address;

    if (state.dao_category.length < 1) {
      return alert("Please add applicable categories for your Community.");
    }
    if (state.chain.length < 1) {
      return alert("Please add Chains relevant to your Community.");
    }
    if (state.dao_mission.length < 5) {
      return alert(
        "Please add more details in One Line Statement for your Community. Atleast 5 characters required."
      );
    }
    if (state.description.length < 50) {
      return alert(
        "Please add more details in Community Description. Atleast 50 characters required."
      );
    }

    // try {
    //     address = ws.address;
    // }
    // catch (er) {
    //     console.log(er)
    //     return setwalletConnectVisible(true);
    // }
    // console.log('address :', address)

    try {
      let res = await axios.post(`${API}/dao/create-new-dao-v2`, {
        ...state,
        chain: state.chain.map((ch) => CHAIN_LIST_MAP[ch]),
        submitter_public_address: address,
      });
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

  return (
    <>
      <div className={styles.daoPage}>
        <Head>
          <title>Truts</title>
          <meta
            name="description"
            content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <Nav isFloating isStrech />
        <WalletConnect
          setwalletConnectVisible={setwalletConnectVisible}
          walletConnectVisible={walletConnectVisible}
        />
        <form onSubmit={submitForm} className={styles.daoForm}>
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
              value={state.dao_name}
              onChange={(e) => {
                setState((s) => {
                  s.dao_name = e.target.value;
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
              value={state.dao_mission}
              onChange={(e) => {
                setState((s) => {
                  s.dao_mission = e.target.value;
                  return { ...s };
                });
              }}
              placeholder="Please keep it within 1 to 2 lines."
              rows={5}
              type="text"
            />
          </label>

          <CategotyCon state={state} setState={setState} />
          <ChainSelectCon state={state} setState={setState} />

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
          </label>

          <label htmlFor="">
            <p>Add your Treasury address: (if exists)</p>
            <input
              value={state.treasury}
              onChange={(e) => {
                setState((s) => {
                  s.treasury = e.target.value;
                  return { ...s };
                });
              }}
              placeholder="0xceft......etf"
              type="text"
            />
          </label>

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

          <label htmlFor="">
            <p>Additional Link:</p>
            <input
              value={state.additional_link}
              onChange={(e) => {
                setState((s) => {
                  s.additional_link = e.target.value;
                  return { ...s };
                });
              }}
              type="text"
              placeholder="Additional Link"
            />
          </label>
          {/* 
                    opensea_link: { type: String },
                     magiceden_link: { type: String }, */}
          <label htmlFor="">
            <p>OpenSea Link: (if applicable)</p>
            <input
              value={state.opensea_link}
              onChange={(e) => {
                setState((s) => {
                  s.opensea_link = e.target.value;
                  return { ...s };
                });
              }}
              type="text"
              placeholder="https://opensea.io/collection/..."
            />
          </label>
          <label htmlFor="">
            <p>MagicEden Link: (if applicable)</p>
            <input
              value={state.magiceden_link}
              onChange={(e) => {
                setState((s) => {
                  s.magiceden_link = e.target.value;
                  return { ...s };
                });
              }}
              type="text"
              placeholder="https://magiceden.io/marketplace/..."
            />
          </label>

          <label htmlFor="">
            <p>Submitter`s Discord ID*</p>
            <input
              required
              value={state.submitter_discord_id}
              onChange={(e) => {
                setState((s) => {
                  s.submitter_discord_id = e.target.value;
                  return { ...s };
                });
              }}
              type="text"
              placeholder="Example: sampleuser#8493"
            />
          </label>
          <Button label={"Submit"} />
        </form>
      </div>
      <Footer />
    </>
  );
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
      s.dao_category = selectedItems;
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

const ChainSelectCon = ({ state, setState }) => {
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
      s.chain = selectedItems;
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

export default DaoForm;
