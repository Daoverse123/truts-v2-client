import React, { useState, useEffect } from "react";
import styles from "./edit-profile.module.scss";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import Button from "../../components/Button";
import axios from "axios";
import WalletConnect from "../../components/WalletConnect_v3";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

let Placeholder = "/profile.jpg";

const P_API = process.env.P_API;

const fetchUserDetails = async (setter) => {
  let jwt = localStorage.getItem("token");
  axios.post(
    `${P_API}/user/intrest-tag`,
    {},
    {
      headers: {
        Authorization: jwt,
      },
    }
  );
  try {
    let res = await axios.get(`${P_API}/user`, {
      headers: {
        Authorization: jwt,
      },
    });
    console.log(res);
    if (res.status == 200) {
      setter(res.data.data.user);
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

  useEffect(() => {
    fetchUserDetails((user_data) => {
      !user_data.email && signUpGoogle();
      setinitUserData(user_data);
      setupdatedUserData({ bio: user_data.bio });
    });
  }, []);

  const saveProfileDetails = async () => {
    setLoaderVisible(true);
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

  let options = [
    "Profile",
    "Wallets",
    "Socials",
    <button
      className={styles.exitbtn}
      onClick={() => {
        location.href = "/profile";
      }}
      key={"btn"}
    >
      Exit
    </button>,
  ];
  const [selectedPage, setselectedPage] = useState("Profile");
  const [showWallet, setshowWallet] = useState(false);
  const [LoaderVisible, setLoaderVisible] = useState(false);
  return (
    <>
      {LoaderVisible && <Loader />}
      <Nav isFloating={true} />
      <WalletConnect
        isLogin={true}
        walletConnectVisible={showWallet}
        setwalletConnectVisible={setshowWallet}
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
          </div>
          {selectedPage == options[0] && (
            <Profile
              {...{
                updatedUserData,
                setupdatedUserData,
                initUserData,
                saveProfileDetails,
              }}
            />
          )}
          {selectedPage == options[1] && (
            <Wallets
              {...{ showWallet, setshowWallet, initUserData, setselectedPage }}
            />
          )}
          {selectedPage == options[2] && <Socials {...{ initUserData }} />}
        </div>
      </div>
    </>
  );
}

const fetchInterest = async (setter) => {
  let res = await axios.get(`${P_API}/user/intrest-tag`, {
    headers: {
      Authorization: window.localStorage.getItem("token"),
    },
  });
  if (res.status == 200) {
    console.log(res.data);
    setter(res.data.data.tags);
  }
};

const Profile = ({
  updatedUserData,
  setupdatedUserData,
  initUserData,
  saveProfileDetails,
}) => {
  const [profileImg, setprofileImg] = useState(null);
  const [interests, setinterests] = useState([]);

  console.log(interests);

  useEffect(() => {
    try {
      setprofileImg(initUserData.photo.secure_url);
    } catch (error) {}
  }, [initUserData]);

  useEffect(() => {
    fetchInterest((ele) => {
      setinterests(ele);
    });
  }, []);

  useEffect(() => {
    if (interests.length > 0) {
      setinterests((tag) => {
        let selelectedIdTagArray = initUserData.tags.map((ele) => ele._id);
        let updatedList = tag.map((t) => {
          if (selelectedIdTagArray.includes(t._id)) {
            t.selected = true;
          }
          return t;
        });
        console.log(updatedList);
        return [...updatedList];
      });
    }
  }, [initUserData]);

  useEffect(() => {
    setupdatedUserData((usd) => {
      usd.interests = interests
        .filter((elm) => elm.selected)
        .map((elm) => elm._id);
      return { ...usd };
    });
  }, [interests]);

  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Profile Settings</h1>
        <p>
          Complete every details on your profile to earn XP points. Total of 100
          to be earned in this section
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Profile Picture</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
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
          <h2>Email ID</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
        </div>
        <span id="google-login"></span>
        {initUserData.email && (
          <p className={styles.displayEmail}>{initUserData.email}</p>
        )}
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Bio</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
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
          placeholder="Write an amazing bio about yourself....."
          className={styles.input}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.secTitle}>
          <h2>Interest</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
        </div>
        <p className={styles.subText}>
          Select (maximum 3) and show your interests to web3 world!
        </p>

        <div className={styles.tagSelector}>
          {interests.map((ele, idx) => {
            return (
              <span
                onClick={() => {
                  setinterests((int) => {
                    int[idx].selected = !int[idx].selected;
                    if (int.filter((ele) => ele.selected).length > 3) {
                      return interests;
                    } else {
                      return [...int];
                    }
                  });
                }}
                key={ele._id}
                className={
                  styles.tag +
                  " " +
                  (interests[idx].selected ? styles.selected : "")
                }
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
            saveProfileDetails();
          }}
          className={styles.saveBtn}
        >
          Save
        </button>
      </span>
    </div>
  );
};

const Wallets = ({
  initUserData,
  showWallet,
  setshowWallet,
  setselectedPage,
}) => {
  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Wallet Settings</h1>
        <p>
          Please make sure to connect your primary wallet as it will also serve
          as your TrutsID and all data on profile would be linked and fetched
          from it.
        </p>
      </div>
      <div className={styles.walletSection}>
        <div className={styles.wTitle}>
          <h1>List of Wallets</h1>
          {/* <h2>+ Add Wallet</h2> */}
        </div>
        {"wallets" in initUserData ? (
          <>
            <div className={styles.wallet}>
              <img className={styles.profileName} src="./blue.png" alt="" />
              <p>{miniMizewallet(initUserData.wallets.address)}</p>
              <img className={styles.option} src="./threedot.png" alt="" />
            </div>
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

const miniMizewallet = (wt) => {
  return wt.slice(0, 5) + "..." + wt.slice(-5);
};

const Socials = ({ initUserData }) => {
  return (
    <div className={styles.formContent}>
      <div className={styles.mainTitle}>
        <h1>Social Settings</h1>
        <p>
          Connect your socials to get rewards. Also connecting your socials will
          help us to show you more data about how you interact with the
          communities. This will also serve as a web3 Proof of Work
        </p>
      </div>
      <div className={styles.socialSection}>
        <div className={styles.secTitle}>
          <h2>Twitter</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
        </div>
        <div className={styles.connectDiscord}>
          <button
            style={{
              background: "rgba(29, 155, 240, 0.2)",
              border: "1px solid #1D9BF0",
              color: "#1D9BF0",
            }}
          >
            <img src="./twitter.png" alt="" />
            Verify Twitter
          </button>
        </div>
        <div className={styles.secTitle}>
          <h2>Discord</h2>
          <span className={styles.xp}>
            <img src="./xpCoin.png" alt="" />
            <p>50</p>
          </span>
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
                let domain = location.host;
                window.location = `https://discord.com/oauth2/authorize?client_id=966238946294116382&redirect_uri=https://${domain}/discord-auth-callback&response_type=code&scope=identify%20email%20guilds`;
              }}
            >
              <img src="./discord.png" alt="" />
              Connect Discord
            </button>
          </div>
        )}
      </div>
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

export default Index;
