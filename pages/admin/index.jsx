import React, { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import axios from "axios";
import fuzzy from "fuzzy.js";
import Head from "next/head";
import { create } from "zustand";

//components
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import WalletConnect from "../../components/WalletConnect";
import UnverifiedList from "./UnverifiedList";
import Socials from "./Socials";

//assets
import closeIcon from "../../assets/icons/close_icon.svg";

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

let CATEGORY_LIST = [];

const isLoggerIn = () => {
  return (
    localStorage.getItem("token") &&
    localStorage.getItem("token") != "" &&
    localStorage.getItem("token") != "null" &&
    localStorage.getItem("token") != "undefined" &&
    localStorage.getItem("token") != null
  );
};

const useAdminStore = create((set) => ({
  selected: "",
  setSelected: (selected) =>
    set((s) => {
      if (selected) {
        return { ...s, selected };
      }
    }),
  name: "",
  oneliner: "",
  description: "",
  slug: "",
  categories: null,
  chains: null,
  socials: "",
  discord_link: "",
  twitter_link: "",
  website_link: "",
  mirror_link: "",
  cover: null,
  logo: null,
  setState: (sp) =>
    set((state) => {
      return { ...state, ...sp };
    }),
}));

function DaoForm({ categoriesList, chainList, unverifiedList }) {
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

  let disableForm = { pointerEvents: "none", opacity: "0.4" };
  const [formDisabled, setformDisabled] = useState(true);

  let state = useAdminStore((s) => s);
  let setState = useAdminStore().setState;

  console.log(state);

  useEffect(() => {
    if (isLoggerIn()) {
      setformDisabled(false);
    } else {
      setformDisabled(true);
      setTimeout(() => {
        window.showSignupPrompt();
      }, 1000);
    }
  }, []);

  let idListingMap = {};
  unverifiedList.forEach((ele) => {
    idListingMap[ele._id] = ele;
  });

  useEffect(() => {
    if (state.selected) {
      let { name, oneliner, description, slug, categories, chains, socials } =
        idListingMap[state.selected];

      console.log(idListingMap[state.selected]);

      setState({
        name,
        oneliner,
        description,
        slug,
        categories,
        chains,
        socials,
      });
    }
  }, [state.selected]);

  let saveDetails = async () => {
    let data = {
      name: state.name,
      oneliner: state.oneliner,
      description: state.description,
      slug: state.slug,
      categories: JSON.stringify(state.categories),
      chains: JSON.stringify(state.chains.map((ele) => CHAIN_LIST_MAP[ele])),
    };

    if (state.cover) {
      data.cover = state.cover;
    }
    if (state.logo) {
      data.logo = state.logo;
    }

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    console.log(formData);

    let res = await axios.patch(
      `${process.env.P_API}/listing/${state.selected}`,
      formData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          contentType: "multipart/form-data",
        },
      }
    );
    if (res.status == 200 || res.status == 201) {
      alert("Details Saved");
    } else {
      alert("Error Occured");
    }
  };

  const approveCommunity = async () => {
    let res = await axios.post(
      `${process.env.P_API}/listing/verify`,
      {
        listingID: state.selected,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      alert("Community Approved");
    }
  };

  const [isAdmin, setisAdmin] = useState(false);

  const checkAdmin = async () => {
    let user = await axios.get(`${process.env.P_API}/user`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    if (user.status == 200 && user.data.data.user.isSuperAdmin) {
      setisAdmin(true);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  if (!isAdmin) {
    return <p>You are not an admin</p>;
  }

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
        {!state.selected ? (
          <UnverifiedList list={unverifiedList} />
        ) : (
          <div>
            {formDisabled && <SignupPrompt />}
            <form
              style={formDisabled ? disableForm : {}}
              className={styles.daoForm}
              onSubmit={(e) => {
                e.preventDefault();
                saveDetails();
              }}
            >
              <h1 className={styles.title}>Selected : {state.name}</h1>
              <p className={styles.subtitle}>
                slug : {state.slug} | Id : {state.selected}
              </p>
              <div className={styles.images}>
                <span className={styles.imgCon}>
                  <div className={styles.upNav}>
                    <h1>Cover</h1>
                    <input
                      type="file"
                      onChange={(e) => {
                        let img_src = URL.createObjectURL(e.target.files[0]);
                        document.getElementById("cover").src = img_src;
                        setState({ cover: e.target.files[0] });
                      }}
                    />
                  </div>

                  <img
                    label={"cover"}
                    id="cover"
                    className={styles.cover}
                    src={idListingMap[state.selected].photo.cover.secure_url}
                    alt=""
                  />
                </span>
                <span className={styles.imgCon}>
                  <div className={styles.upNav}>
                    <h1>Logo</h1>
                    <input
                      label={"logo"}
                      type="file"
                      onChange={(e) => {
                        let img_src = URL.createObjectURL(e.target.files[0]);
                        document.getElementById("logo").src = img_src;
                        setState({ logo: e.target.files[0] });
                      }}
                    />
                  </div>
                  <img
                    id={"logo"}
                    className={styles.logo}
                    src={idListingMap[state.selected].photo.logo.secure_url}
                    alt=""
                  />
                </span>
              </div>

              <label htmlFor="">
                <p>What`s the Name of your Community?*</p>
                <input
                  placeholder="Community Name"
                  required
                  value={state.name}
                  onChange={(e) => {
                    setState({ name: e.target.value });
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
                    setState({ oneliner: e.target.value });
                  }}
                  placeholder="Please keep it within 1 to 2 lines."
                  rows={5}
                  type="text"
                />
              </label>

              {state.chains && state.categories && (
                <>
                  <CategotyCon state={state} setState={setState} />
                  <ChainSelectCon
                    CHAIN_LIST_MAP={CHAIN_LIST_MAP}
                    state={state}
                    setState={setState}
                  />
                </>
              )}

              <label htmlFor="">
                <p>Add a brief Description for your Community.*</p>
                <textarea
                  required
                  value={state.description}
                  onChange={(e) => {
                    setState({ description: e.target.value });
                  }}
                  placeholder="Even though there is no word limit but please do keep it short and brief :)"
                  rows={15}
                  type="text"
                />
              </label>

              {/* listing/649d7993d55e4c860835f0dd/social */}

              {/* <label htmlFor="">
              <p>Discord Link:*</p>
              <input
                required
                value={state.discord_link}
                onChange={(e) => {
                  setState({ discord_link: e.target.value });
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
                  setState({ twitter_link: e.target.value });
                }}
                placeholder="https://twitter.com/..."
                type="text"
              />
            </label> */}

              <div className={styles.approve}>
                <Button label={"Save Details"} />
                <button
                  onClick={() => {
                    approveCommunity();
                  }}
                  type="button"
                  className={styles.approveBtn}
                >
                  Approve Community
                </button>
              </div>
            </form>
            <Socials />
          </div>
        )}
        <Nav isFloating isStrech />
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
    setState({ categories: selectedItems });
  }, [selectedItems]);

  useEffect(() => {
    if (state.categories) {
      setselectedItems([...state.categories]);
    }
  }, []);

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
    setState({ chains: selectedItems });
  }, [selectedItems]);

  useEffect(() => {
    if (state.chains) {
      let chains = state.chains.map((ele) => {
        if (ele in CHAIN_LIST_FIX) {
          return CHAIN_LIST_FIX[ele];
        }
        return ele[0].toUpperCase() + ele.slice(1);
      });
      setselectedItems(chains);
    }
  }, []);

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

export { useAdminStore };
export default DaoForm;

export async function getServerSideProps(ctx) {
  let res = await Promise.all([
    axios.get(`${process.env.P_API}/listing/categories`),
    axios.get(`${process.env.P_API}/listing/chains`),
    axios.get(`${process.env.P_API}/listing/verify`),
  ]);

  return {
    props: {
      categoriesList: res[0].data.data.result,
      chainList: res[1].data.data.result,
      unverifiedList: res[2].data.data.result,
    },
  };
}
