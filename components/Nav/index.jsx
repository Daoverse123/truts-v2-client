import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import _ from "lodash";
import styles from "./nav.module.scss";
import Link from "next/link";
import signout from "../../utils/signout";
import { useQuery } from "react-query";

//assets
import logo from "../../assets/icons/logo.svg";
import ham_burger from "../../assets/icons/ham_burger.svg";
import close_icon from "../../assets/icons/close_icon.svg";
import wallet_icon from "../../assets/icons/wallet-icon.svg";
import pixel_icon from "../../assets/icons/pixelated.jpg";
import power_off from "../../assets/icons/power-off.svg";
import search_icon from "../../assets/icons/search_grad.svg";

//components
import Search from "../Search";
import Button from "../Button";

// CONSTANTS
const API = process.env.API;
const P_API = process.env.P_API;

export default function Component({ isFloating, isStrech }) {
  const [TabletNavOpen, setTabletNavOpen] = useState(false);
  const [TabletSearchOpen, setTabletSearchOpen] = useState(false);
  const [navKey, setnav] = useState(0);
  const [walletState, setwalletState] = useState(null);

  const updateNav = () => {
    setnav((s) => {
      return s + 1;
    });
  };

  const [user, setuser] = useState(null);

  const fetchUser = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      let option = {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      };
      try {
        let user_res = await axios.get(`${P_API}/user`, option);
        setuser(user_res.data.data.user);
        if (user_res.data.data.user) {
          localStorage.setItem(
            "user-server",
            JSON.stringify(user_res.data.data.user)
          );
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        localStorage.removeItem("user-server");
        await signout();
      }
    }
  };

  let nav = useRef(null);

  const checkScroll = () => {
    if (window.scrollY == 0) {
      document.querySelector("#nav").style.background = "transparent";
      document.querySelector("#nav").style.borderBottom = "none";
    } else {
      document.querySelector("#nav").style.background = "#f7f7f7";
      document.querySelector("#nav").style.borderBottom =
        "1px solid rgba(135, 135, 135, 0.25)";
    }
  };

  useEffect(() => {
    fetchUser();
    checkScroll();
    window.addEventListener("scroll", (e) => {
      checkScroll();
    });
  }, []);

  console.log(user);

  useEffect(() => {
    if (TabletNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [TabletNavOpen]);

  let admin = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      let token = localStorage.getItem("token");
      if (!token) return new Error("No Token");
      let res = await axios.get(`${process.env.P_API}/admin`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        return res.data.data.count > 0;
      } else {
        //throw error
        new Error("Wheel Error", res.status);
      }
    },
  });

  return (
    <>
      <nav
        id="nav"
        key={navKey}
        style={
          isFloating == true ? { position: "fixed" } : { position: "absolute" }
        }
        className={styles.navWrapper}
      >
        <div style={{ maxWidth: "1440px" }} className={styles.nav}>
          <Link href={"/"}>
            <img className={styles.logo} src={logo.src} alt="" />
          </Link>
          {isFloating && (
            <span className={styles.search_wrappper}>
              <Search />
            </span>
          )}
          <ul className={styles.links}>
            <Link href={"/add-your-community"}>
              <li>Add a Community</li>
            </Link>
            <Link href={"/discover"}>
              <li>Discover Communities</li>
            </Link>
            <Link href={"/missions"}>
              <li>Missions</li>
            </Link>
            {user ? (
              // wallet connected
              <li className={styles.profileIcon}>
                <img
                  className={styles.pixel_icon}
                  alt=""
                  src={user.photo?.secure_url || pixel_icon.src}
                />

                <ProfileDropDown user={user} admin={admin} />
              </li>
            ) : (
              // connect wallet

              <li
                onClick={() => {
                  window.showSignupPrompt && window.showSignupPrompt();
                }}
              >
                <img alt="" src={"/svg/nav-soc.svg"} />
              </li>
            )}
          </ul>

          <span
            className={styles.search_menu}
            onClick={() => {
              setTabletSearchOpen(!TabletSearchOpen);
            }}
          >
            <img src={search_icon.src} alt="" />
          </span>
          <span
            className={styles.ham_burger_menu}
            onClick={() => {
              setTabletNavOpen(!TabletNavOpen);
            }}
          >
            <img src={ham_burger.src} alt="" />
          </span>
        </div>
        {TabletNavOpen && (
          <TabletNav
            user={user}
            TabletNavOpen={TabletNavOpen}
            setTabletNavOpen={setTabletNavOpen}
          />
        )}
        {TabletSearchOpen && (
          <TabletSearch
            TabletSearchOpen={TabletSearchOpen}
            setTabletSearchOpen={setTabletSearchOpen}
          />
        )}
      </nav>
    </>
  );
}

const ProfileDropDown = ({ user, admin }) => {
  console.log(admin.data);
  return (
    <span className={styles.profileDropDown}>
      <div className={styles.dd_menu}>
        <Link href="/profile/private">
          <div className={styles.addressBar}>
            <img
              className={styles.pixel_icon}
              alt=""
              src={user.photo?.secure_url || pixel_icon.src}
            />
            <span className={styles.address_chain}>
              <h2>{limit(9, user.name)}</h2>
              <p>@{user.username}</p>
            </span>
          </div>
        </Link>
        <ul className={styles.list}>
          {/* <li>My Profile</li> */}
          {admin.isSuccess && admin.data && (
            <li
              onClick={async () => {
                window.location.href = "https://admin.truts.xyz";
              }}
              className={styles.admin_btn}
            >
              <img src={"/starts.svg"} alt="" /> Admin Dashboard
            </li>
          )}
          <li
            onClick={async () => {
              localStorage.removeItem("token");
              localStorage.removeItem("user-server");
              await signout();
              window.location.reload();
            }}
            className={styles.power_btn}
          >
            <img src={power_off.src} alt="" /> Sign Out
          </li>
        </ul>
      </div>
    </span>
  );
};

const TabletNav = ({ TabletNavOpen, setTabletNavOpen, user }) => {
  return (
    <div className={styles.tablet_nav}>
      <div className={styles.blankSpace}></div>
      <div className={styles.menu}>
        <div className={styles.top_bar}>
          {user ? (
            <div className={styles.profileState}>
              <div
                className={styles.addressBar}
                onClick={() => {
                  location.href = "/profile/private";
                }}
              >
                <img
                  className={styles.pixel_icon}
                  alt=""
                  src={user.photo?.secure_url || pixel_icon.src}
                />
                <span className={styles.address_chain}>
                  <h2>{limit(9, user.name)}</h2>
                  <p>@{user.username}</p>
                </span>
              </div>
            </div>
          ) : (
            <img className={styles.main_logo} src={logo.src} alt="" />
          )}
          <img
            onClick={() => {
              setTabletNavOpen(false);
            }}
            className={styles.close_icon}
            src={close_icon.src}
            alt=""
          />
        </div>
        <ul className={styles.list}>
          <Link href={"/"}>
            <li>Home</li>
          </Link>
          <Link href={"/add-your-community"}>
            <li>Add a Community</li>
          </Link>
          <Link href={"/discover"}>
            <li>Discover Communities</li>
          </Link>
          <Link href={"/missions"}>
            <li>Missions</li>
          </Link>
        </ul>
        <div className={styles.btn_wrapper}>
          {user ? (
            <Button
              type={"secondary"}
              onClick={async () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user-server");
                await signout();
                location.href = "/?signup=true";
              }}
              label={"Log Out"}
            />
          ) : (
            <Button
              onClick={() => {
                location.href = "/?signup=true";
              }}
              label={"Login/Sign up"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

let limit = (lt, name) => {
  if (name?.length > lt) {
    return name.slice(0, lt) + "...";
  }
  return name;
};

const TabletSearch = ({ TabletSearchOpen, setTabletSearchOpen }) => {
  const [searchTerm, setsearchTerm] = useState("");
  const [searchSuggestiondata, setSuggestiondata] = useState([]);

  const fetchData = async (term) => {
    if (!(term.length > 0)) return;
    console.log("search --> ", term);

    let res = await axios.get(
      `${process.env.P_API}/search/${term.toLowerCase()}`
    );

    let data = res.data.data.result.hits.hits.map((ele) => {
      return ele._source;
    });
    res.status == 200 && setSuggestiondata(data);
  };

  let fetchSearchTerm = useCallback(
    _.debounce((term) => fetchData(term), 100),
    []
  );

  return (
    <div className={styles.tabletSearch}>
      <div className={styles.searchInput} type="text">
        <img src={search_icon.src} alt="" />
        <input
          autoFocus={true}
          value={searchTerm}
          onChange={(e) => {
            setsearchTerm(e.target.value);
            fetchSearchTerm(e.target.value);
          }}
          type="text"
        />
        <img
          onClick={() => {
            setTabletSearchOpen(false);
          }}
          className={styles.close_icon}
          src={close_icon.src}
          alt=""
        />
      </div>
      <div className={styles.suggestionBox}>
        {searchSuggestiondata.map((ele, idx) => {
          return <SearchSuggestionEntry data={ele} key={ele.dao_name + idx} />;
        })}
      </div>
    </div>
  );
};

const SearchSuggestionEntry = ({ data }) => {
  const getDaoTags = () => {
    let tagsString = "";
    data.categories.forEach((ele, idx) => {
      tagsString = tagsString + ele;
      if (idx < data.categories.length - 1) {
        tagsString = tagsString + ", ";
      }
    });
    return tagsString;
  };

  return (
    <Link href={`/dao/${data.slug}`}>
      <div className={styles.searchSuggestionEntry}>
        <div className={styles.daoIcon}>
          <img src={data.photo.logo.secure_url} alt="" />
        </div>
        <div className={styles.daoInfo}>
          <h1 className={styles.daoName}>{data.name}</h1>
          <h3 className={styles.daoTags}>{getDaoTags()}</h3>
          <p className={styles.reviewCount}>{data.reviews.count} Reviews</p>
        </div>
      </div>
    </Link>
  );
};

const Chains = ["Ethereum", "Solana", "near"];
