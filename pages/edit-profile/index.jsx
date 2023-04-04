import React, { useState, useEffect } from "react";
import styles from "./edit-profile.module.scss";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import Button from "../../components/Button";
import axios from "axios";
import WalletConnect from "../../components/WalletConnect_editprofile";
import WalletConnect_change from "../../components/WalletConnect_editprofile_change";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Head from "next/head";
import authorizeTwitterURI from "../../utils/twitter-url";
import isValidUsername from "is-valid-username";
import chainIconMap from "../../components/chainIconMap.json";
import {
  useMutation,
  useQuery,
  invalidateQueries,
  refetchQueries,
  useQueryClient,
} from "@tanstack/react-query";

let Placeholder = "/profile-old.png";
let twitter_auth_aur = authorizeTwitterURI();

const P_API = process.env.P_API;
let options = ["Profile", "Socials", "Wallets"];
const fetchUserDetails = async (setter) => {
  let jwt = localStorage.getItem("token");
  let intrests = await axios.get(`${P_API}/user/intrest-tag`, {
    headers: {
      Authorization: jwt,
    },
  });

  try {
    let res = await axios.get(`${P_API}/user`, {
      headers: {
        Authorization: jwt,
      },
    });
    console.log(res);
    if (res.status == 200) {
      setter(res.data.data.user, intrests.data.data.tags);
    } else {
      alert("Invalid Auth");
    }
  } catch (error) {
    alert("Invalid Auth");
  }
};

async function handleCredentialResponse(response) {
  // console.log("Encoded JWT ID token: " + response.credential);
  let res = await axios.post(
    `${P_API}/login/google`,
    {
      token: response.credential,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  if (res.status == 200) {
    let jwt = res.data.data.token;
    localStorage.setItem("token", `Bearer ${jwt}`);
    // window.router.push('/edit-profile');
    window.location = "/edit-profile";
  } else {
    alert("SignUp failed Please try Again");
  }
}

function signUpGoogle() {
  window.google.accounts.id.initialize({
    client_id: process.env.GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(
    document.getElementById("google-login"),
    { theme: "outline", size: "large" }
    // customization attributes
  );
  window.google.accounts.id.prompt(); // also display the One Tap dialog
}

function Index() {
  const [initUserData, setinitUserData] = useState({});
  const [updatedUserData, setupdatedUserData] = useState({ bio: "" });

  console.log(initUserData);
  console.log(updatedUserData);

  const [showWallet, setshowWallet] = useState(false);
  const [showWalletChange, setshowWalletChange] = useState(false);
  const [particularChain, setparticularChain] = useState("");
  const [particularChainChange, setparticularChainChange] = useState("");

  const [LoaderVisible, setLoaderVisible] = useState(false);

  const [updateCounter, setupdateCounter] = useState(0);

  useEffect(() => {
    if (particularChain) {
      setshowWallet(true);
    }
  }, [particularChain]);

  useEffect(() => {
    if (particularChainChange) {
      setshowWalletChange(true);
    }
  }, [particularChainChange]);

  useEffect(() => {
    if (!showWallet) {
      setLoaderVisible(true);
      fetchUserDetails((user_data, intrests) => {
        !user_data.email && signUpGoogle();
        setinitUserData(user_data);
        setupdatedUserData({
          bio: user_data.bio,
          interests: user_data.tags.map((ele) => ele._id),
          interestsOptions: intrests,
        });
        setLoaderVisible(false);
      });
    }
  }, [showWallet, updateCounter]);

  const saveProfileDetails = async (username) => {
    setLoaderVisible(true);
    if (!initUserData.username) {
      let updateUsername = axios.patch(
        `${P_API}/user/set/username`,
        {
          username,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    }
    let resp = await axios.patch(
      `${P_API}/user/update`,
      { ...updatedUserData, tags: JSON.stringify(updatedUserData.interests) },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (resp.status == 200) {
    } else {
      alert("error");
    }
    setupdateCounter((ele) => ele + 1);
    setLoaderVisible(false);

    toast.success("Changes saved successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const [selectedPage, setselectedPage] = useState("Profile");

  useEffect(() => {
    let searchParams = location.search;
    if (searchParams) {
      let split = searchParams.split("=");
      let pages = {
        profile: "Profile",
        social: "Socials",
        wallets: "Wallets",
      };

      if (split[0] == "?page") {
        setselectedPage(pages[split[1]]);
      }

      if (location.hash == "#twitter-success") {
        toast.success("Twitter Connected successfully !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      if (location.hash == "#twitter-fail") {
        toast.error("Twitter Connection Failed !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }, []);

  return (
    <>
      {LoaderVisible && <Loader />}
      <Nav isFloating={true} />
      <Head>
        <title>Edit Profile</title>
        <meta
          name="description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <WalletConnect
        isLogin={true}
        walletConnectVisible={showWallet}
        setwalletConnectVisible={setshowWallet}
        particularChain={particularChain}
        setupdateCounter={setupdateCounter}
      />
      <WalletConnect_change
        isLogin={true}
        walletConnectVisible={showWalletChange}
        setwalletConnectVisible={setshowWalletChange}
        particularChain={particularChainChange}
        setupdateCounter={setupdateCounter}
      />
      <div className={styles.editProfile}>
        <div className={styles.progressHeader}>
          <span className={styles.titles}>
            <h1 className={styles.title}>
              Complete your Profile to earn XP Points
            </h1>
            <p className={styles.xpCon}>
              {initUserData.completionStatus}% Completed
            </p>
          </span>
          <div className={styles.progressBar}>
            <div
              style={{ width: `${initUserData.completionStatus}%` }}
              className={styles.progressInner}
            ></div>
          </div>
        </div>
        <div className={styles.profile_form}>
          <div className={styles.mobileNav}>
            {options.map((ele) => {
              if (selectedPage == ele) {
                return (
                  <span
                    key={ele}
                    className={styles.option + " " + styles.selected}
                  >
                    {ele}
                  </span>
                );
              }
              return (
                <span
                  onClick={() => {
                    setselectedPage(ele);
                  }}
                  key={ele}
                  className={styles.option}
                >
                  {ele}
                </span>
              );
            })}
            <span
              onClick={() => {
                location.href = "/profile/private";
              }}
              className={styles.option}
            >
              <button className={styles.exitbtn} key={"btn"}>
                Exit
              </button>
            </span>
          </div>
          <div className={styles.leftSideNav}>
            {options.map((ele) => {
              if (selectedPage == ele) {
                return (
                  <span
                    key={ele}
                    className={styles.option + " " + styles.selected}
                  >
                    {ele}
                  </span>
                );
              }
              return (
                <span
                  onClick={() => {
                    setselectedPage(ele);
                  }}
                  key={ele}
                  className={styles.option}
                >
                  {ele}
                </span>
              );
            })}
            <span
              className={styles.option}
              onClick={() => {
                location.href = "/profile/private";
              }}
            >
              <button className={styles.exitbtn} key={"btn"}>
                Exit
              </button>
            </span>
          </div>
          {selectedPage == options[0] && (
            <Profile
              {...{
                updatedUserData,
                setupdatedUserData,
                initUserData,
                saveProfileDetails,
                setselectedPage,
              }}
            />
          )}
          {selectedPage == options[2] && (
            <Wallets
              {...{
                setparticularChain,
                setparticularChainChange,
                showWallet,
                setshowWallet,
                initUserData,
                setselectedPage,
                setupdateCounter,
              }}
            />
          )}
          {selectedPage == options[1] && <Socials {...{ initUserData }} />}
        </div>
      </div>
    </>
  );
}

const XpCoinComp = ({ value }) => {
  return (
    <span className={styles.xp}>
      {value ? (
        <img src="./missions/tick.png" alt="" />
      ) : (
        <img src="./xpCoin.svg" alt="" />
      )}
      <p>500</p>
    </span>
  );
};

const Profile = ({
  updatedUserData,
  setupdatedUserData,
  initUserData,
  saveProfileDetails,
  setselectedPage,
}) => {
  const [profileImg, setprofileImg] = useState(null);
  const [username, setusername] = useState("");
  const [usernameValid, setusernameValid] = useState({
    valid: false,
    loading: false,
  });

  const checkUsernameAvailability = async () => {
    setusernameValid((uv) => {
      uv.loading = true;
      return { ...uv };
    });
    if (!isValidUsername(username)) {
      return setusernameValid((uv) => {
        uv.loading = false;
        uv.valid = false;
        return { ...uv };
      });
    }
    let res = await axios.get(
      `${P_API}/user/availability/username?username=${username}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status == 200) {
      console.log(res.data.data.available);
      if (username.length < 3) {
        setusernameValid((uv) => {
          uv.loading = false;
          uv.valid = false;
          return { ...uv };
        });
      } else {
        setusernameValid((uv) => {
          uv.loading = false;
          uv.valid = res.data.data.available;
          return { ...uv };
        });
      }
    }
  };

  useEffect(() => {
    if (username.length > 0) {
      checkUsernameAvailability();
    }
  }, [username]);

  useEffect(() => {
    try {
      setprofileImg(
        initUserData.photo.secure_url +
          "?cache=" +
          `${JSON.stringify(initUserData)}`
      );
    } catch (error) {}
  }, [initUserData]);

  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Profile Settings</h1>
        <p>
          Complete your profile to earn 100 XP Points! Your XP points will be
          your gateway to exciting rewards, coming soon...
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Profile Picture</h2>
          <XpCoinComp value={profileImg} />
        </div>
        <label htmlFor="image-upload" className={styles.profile}>
          <img
            className={styles.profileImg}
            src={profileImg || Placeholder}
            alt=""
          />
          <img src="./add-icon.png" alt="" className={styles.addIcon} />
          <input
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setupdatedUserData((usd) => {
                usd.photo = file;
                return { ...usd };
              });
              const reader = new FileReader();
              reader.onload = function () {
                setprofileImg(reader.result);
              };
              reader.readAsDataURL(file);
            }}
            id="image-upload"
            className={styles.profileUpload}
            type="file"
          />
        </label>
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Username *</h2>
          <XpCoinComp
            value={
              (username && usernameValid) ||
              ("username" in initUserData && initUserData.username)
            }
          />
        </div>
        {initUserData.username ? (
          <p className={styles.displayEmail}>@{initUserData.username}</p>
        ) : (
          <input
            value={username}
            onChange={(e) => {
              if (e.target.value.length < 25) {
                setusername(e.target.value.replaceAll(" ", "").toLowerCase());
              }
            }}
            className={styles.input}
            style={{ color: usernameValid ? "black" : "red" }}
          />
        )}
        {usernameValid.loading && (
          <p className={styles.usernameValidation}>{username} ...</p>
        )}
        {!usernameValid.loading &&
          usernameValid.valid &&
          username.length > 0 && (
            <p style={{ color: "green" }} className={styles.usernameValidation}>
              {username} is available
            </p>
          )}
        {!usernameValid.loading &&
          !usernameValid.valid &&
          username.length > 0 && (
            <p style={{ color: "red" }} className={styles.usernameValidation}>
              {!/(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)
                ? `No special characters such as :<>/%#&?@`
                : `${username} is unavailable`}
            </p>
          )}
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Email ID *</h2>
          <XpCoinComp value={initUserData.email} />
        </div>
        <span id="google-login"></span>
        {initUserData.email && (
          <p className={styles.displayEmail}>{initUserData.email}</p>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Bio</h2>
          <p>({updatedUserData.bio?.trim()?.length || 0}/250)</p>
          <XpCoinComp value={updatedUserData.bio} />
        </div>
        <textarea
          value={updatedUserData.bio}
          onChange={(e) => {
            setupdatedUserData((ud) => {
              ud.bio = e.target.value;
              return { ...ud };
            });
          }}
          rows={8}
          placeholder="Tell us something interesting about yourself!"
          className={styles.input}
          maxLength="250"
        />
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Interest</h2>
          <XpCoinComp
            value={
              "interestsOptions" in updatedUserData &&
              updatedUserData.interestsOptions.length >= 1
            }
          />
        </div>
        <p className={styles.subText}>
          Select your top 3 interests in Web3 to showcase to the world!
        </p>

        <div className={styles.tagSelector}>
          {updatedUserData?.interestsOptions?.map((ele, idx) => {
            return (
              <span
                key={ele._id}
                className={
                  styles.tag +
                  " " +
                  (updatedUserData.interests.includes(ele._id)
                    ? styles.selected
                    : "")
                }
                onClick={() => {
                  setupdatedUserData((data) => {
                    if (data.interests.includes(ele._id)) {
                      data.interests = data.interests.filter((dt) => {
                        if (dt == ele._id) {
                          return false;
                        }
                        return true;
                      });
                    } else {
                      if (data.interests.length >= 3) {
                        toast.warn("Max 3 interests allowed", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "colored",
                        });
                      } else {
                        data.interests.push(ele._id);
                      }
                    }
                    return { ...data };
                  });
                }}
              >
                {ele.name}
              </span>
            );
          })}
        </div>
      </div>
      <span className={styles.bottomNav}>
        <button
          onClick={() => {
            if (
              "username" in initUserData ||
              (username.length > 0 && usernameValid.valid)
            ) {
              saveProfileDetails(username);
            } else {
              toast.error("Please add a valid Username", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          }}
          className={styles.saveBtn}
        >
          Save
        </button>
        <button
          onClick={async () => {
            if (
              (username.length > 0 && usernameValid.valid) ||
              ("username" in initUserData && initUserData.username)
            ) {
              await saveProfileDetails(username);
              setselectedPage(options[1]);
            } else {
              toast.error("Please add a valid Username", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          }}
          className={styles.nextBtn}
        >
          Next
        </button>
      </span>
    </div>
  );
};

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

const Wallets = ({
  initUserData,
  showWallet,
  setshowWallet,
  setselectedPage,
  setparticularChain,
  setparticularChainChange,
  setupdateCounter,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  let walletsObjs = {};

  initUserData.wallets.forEach((wt) => {
    walletsObjs[`${wt.chain}`] = wt;
  });

  console.log(walletsObjs);

  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Wallet Settings</h1>
        <p>
          Connect your wallet from your desktop, and seamlessly use your profile
          on mobile without any wallet connect hassle!
        </p>
      </div>
      <div className={styles.walletSection}>
        <div className={styles.wTitle}>
          <h1>List of Wallets</h1>
          {/* <h2>+ Add Wallet</h2> */}
          <XpCoinComp value={"wallets" in initUserData} />
        </div>
        {"wallets" in initUserData ? (
          <>
            {["EVM", "SOL", "NEAR", "FLOW"].map((ele) => {
              if (walletsObjs[ele]) {
                let wallet = walletsObjs[ele];
                return (
                  <div
                    className={styles.walletFrame}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.wallet}>
                      <img
                        className={styles.profileName}
                        src={chainIconMap[getChain(ele)].icon}
                        alt=""
                      />
                      <span className={styles.walletName}>
                        <p>{miniMizewallet(wallet.address)}</p>
                        {wallet.isPrimary && (
                          <img
                            className={styles.option}
                            src="./crown.png"
                            alt=""
                          />
                        )}
                      </span>
                      <WalletSetting
                        wallet={wallet}
                        setparticularChain={setparticularChain}
                        setparticularChainChange={setparticularChainChange}
                        setupdateCounter={setupdateCounter}
                      >
                        <img
                          className={styles.option}
                          src="./threedot.png"
                          alt=""
                        />
                      </WalletSetting>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className={styles.walletFrame}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.wallet}>
                    <img
                      className={styles.profileName}
                      src={chainIconMap[getChain(ele)].icon}
                      alt=""
                    />
                    <p>{ele}</p>

                    <p
                      onClick={() => {
                        setparticularChain(ele);
                      }}
                      className={styles.addWallet}
                    >
                      + Add Wallet
                    </p>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                setselectedPage("Socials");
              }}
              className={styles.saveBtn}
            >
              Continue
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setshowWallet(true);
            }}
            className={styles.saveBtn}
          >
            Connect Wallet
          </button>
        )}

        {/* <div className={styles.wallet}>
                    <img className={styles.profileName} src="./blue.png" alt="" />
                    <p>0x123...456</p>
                    <img className={styles.option} src="./threedot.png" alt="" />
                </div>
                <div className={styles.wallet}>
                    <img className={styles.profileName} src="./blue.png" alt="" />
                    <p>0x123...456</p>
                    <img className={styles.option} src="./threedot.png" alt="" />
                </div> */}
        {/* <button className={styles.saveBtn}>Save</button> */}
      </div>
    </div>
  );
};

let WalletSetting = ({
  children,
  wallet,
  setparticularChain,
  setparticularChainChange,
  setupdateCounter,
}) => {
  return (
    <div className={styles.walletSetting}>
      <span className={styles.menu}>
        {!wallet.isPrimary && (
          <span
            className={styles.option}
            onClick={async () => {
              let options = {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              };
              let res = await axios.patch(
                `${process.env.P_API}/user/wallet/primary`,
                {
                  address: wallet.address,
                },
                options
              );
              if (res.status == 200) {
                console.log(res);
                toast.success("Primary Wallet Saved", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                setupdateCounter((ele) => ele + 1);
              } else {
                alert("Req failed");
              }
            }}
          >
            <img src="/crown.png" alt="" />
            <p>Set as Primary</p>
          </span>
        )}
        <span
          className={styles.option}
          onClick={() => {
            setparticularChainChange(wallet.chain);
          }}
        >
          <img src="/change.png" alt="" />
          <p>Change Wallet</p>
        </span>
        {!wallet.isPrimary && (
          <span
            className={styles.option}
            onClick={async () => {
              let options = {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              };
              let res = await axios.delete(
                `${process.env.P_API}/user/wallet/${wallet.address}`,
                options
              );
              if (res.status == 200) {
                console.log(res);
                toast.success("Changes saved successfully", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                setupdateCounter((ele) => ele + 1);
              } else {
                alert("Req failed");
              }
            }}
          >
            <img src="/remove.png" alt="" />
            <p>Remove Wallet</p>
          </span>
        )}
      </span>
      {children}
    </div>
  );
};

const miniMizewallet = (wt) => {
  return wt.slice(0, 5) + "..." + wt.slice(-5);
};

const Socials = ({ initUserData }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Social Settings</h1>
        <p>
          Connect Your Socials to earn rewards! Connecting all your socials
          helps us get you the best experience on Truts and its communities!
        </p>
      </div>
      <div className={styles.socialSection}>
        <div className={styles.secTitle}>
          <h2>Discord *</h2>
          <XpCoinComp value={initUserData.discord} />
        </div>
        {initUserData.discord ? (
          <p className={styles.displayEmail}>
            {initUserData.discord.username +
              "  #" +
              initUserData.discord.discriminator}
          </p>
        ) : (
          <div className={styles.connectDiscord}>
            <button
              onClick={() => {
                window.localStorage.setItem(
                  "redirect_pre_discord",
                  window.location
                );
                window.location = process.env.DISCORD_OAUTH_URL;
              }}
            >
              <img src="./p-discord.png" alt="" />
              Connect Discord
            </button>
          </div>
        )}
        <div className={styles.secTitle}>
          <h2>Twitter</h2>
          <XpCoinComp value={initUserData.twitter} />
        </div>
        {initUserData.twitter ? (
          <p className={styles.displayEmail}>
            @{initUserData.twitter.username}
          </p>
        ) : (
          <div className={styles.twitterBtn}>
            <button
              onClick={() => {
                location.href = twitter_auth_aur;
              }}
            >
              <img src="./twitter.png" alt="" />
              Verify Twitter
            </button>
          </div>
        )}
      </div>
      <ExtraSocials />
      {/* <button onClick={() => {
                axios.get(`${P_API}/user/guilds`, {
                    headers: {
                        Authorization: `${localStorage.getItem('token')}`
                    }
                })
            }}>get guilds</button> */}
    </div>
  );
};

//["FACEBOOK", "GITHUB", "INSTAGRAM", "MEDIUM", "REDDIT", "DRIBBBLE"]

export default Index;

const ExtraSocials = () => {
  let Socials = () => {
    const [state, setstate] = useState({
      FACEBOOK: "",
      GITHUB: "",
      INSTAGRAM: "",
      MEDIUM: "",
      REDDIT: "",
      DRIBBBLE: "",
    });

    const [statePlaceHolder, setstatePlaceHolder] = useState({
      FACEBOOK: "",
      GITHUB: "",
      INSTAGRAM: "",
      MEDIUM: "",
      REDDIT: "",
      DRIBBBLE: "",
    });

    let queryClient = useQueryClient();

    let socialUpdate = useMutation({
      mutationKey: ["social-update"],
      mutationFn: async (data) => {
        let res = await axios.post(`${process.env.P_API}/user/socials`, data, {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        });
        return res.data.data;
      },
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["socials-init"] });
      },
    });

    let socialRemove = useMutation({
      mutationKey: ["social-remove"],
      mutationFn: async (data) => {
        let res = await axios.delete(`${process.env.P_API}/user/socials`, {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
          data,
        });
        return res.data.data;
      },
      onSuccess: () => {
        setstate({
          FACEBOOK: "",
          GITHUB: "",
          INSTAGRAM: "",
          MEDIUM: "",
          REDDIT: "",
          DRIBBBLE: "",
        });
        setstatePlaceHolder({
          FACEBOOK: "",
          GITHUB: "",
          INSTAGRAM: "",
          MEDIUM: "",
          REDDIT: "",
          DRIBBBLE: "",
        });
        queryClient.refetchQueries({ queryKey: ["socials-init"] });
      },
    });

    let socials = useQuery({
      queryKey: ["socials-init"],
      queryFn: async () => {
        let res = await axios.get(`${P_API}/user`, {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        });
        return res.data.data;
      },
    });

    if (!socials.isSuccess) {
      return <h1>loading</h1>;
    }

    let init_socials = {};
    try {
      socials.data.user.socials.forEach((element) => {
        init_socials[`${element.platform}`] = element.link;
      });
    } catch (error) {
      init_socials = {};
    }

    const getEditOptions = (ele) => {
      if (init_socials[ele]) {
        return (
          <span>
            <button
              type="button"
              onClick={() => {
                queryClient.setQueryData(["socials-init"], (old_data) => {
                  let socials = old_data.user.socials;
                  setstatePlaceHolder((st) => {
                    st[ele] = init_socials[ele];
                    return { ...st };
                  });
                  socials = socials.filter((elm) => elm.platform != ele);
                  old_data.user.socials = [...socials];
                  return { ...old_data, remove: ele };
                });
              }}
              className={styles.socialNavBtn}
            >
              Edit
            </button>
            <button
              type="button"
              style={{ color: "red" }}
              className={styles.socialNavBtn}
              onClick={() => {
                socialRemove.mutate({
                  platform: ele,
                });
              }}
            >
              Remove
            </button>
          </span>
        );
      }
      if (state[ele]) {
        return (
          <button type={"submit"} className={styles.socialNavBtn}>
            Save
          </button>
        );
      }
    };

    return [
      "FACEBOOK",
      "GITHUB",
      "INSTAGRAM",
      "MEDIUM",
      "REDDIT",
      "DRIBBBLE",
    ].map((ele) => {
      return (
        <form
          key={ele}
          onSubmit={(e) => {
            e.preventDefault();
            socialUpdate.mutate({
              platform: ele,
              link: state[ele],
            });
          }}
        >
          <div className={styles.section}>
            <div className={styles.wTitle}>
              <h1 style={{ textTransform: "capitalize" }}>
                {ele.toLowerCase()}
              </h1>
              {getEditOptions(ele)}
            </div>
            {Object.keys(init_socials).includes(ele) ? (
              <span className={styles.value}>
                <img src={`/socials/${ele}.png`} alt="" />
                <p className={styles.displayEmail}>{init_socials[ele]}</p>
              </span>
            ) : (
              <input
                value={state[ele]}
                placeholder={statePlaceHolder[ele] || "https://......"}
                onChange={(e) => {
                  setstate((st) => {
                    st[ele] = e.target.value;
                    return { ...st };
                  });
                }}
                type={"url"}
                className={styles.input}
              />
            )}
          </div>
        </form>
      );
    });
  };

  return <Socials />;
};
