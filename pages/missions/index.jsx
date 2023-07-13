import styles from "./missions.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Mission from "../../components/Mission";
import axios from "axios";
import Head from "next/head";
import { useQuery } from "react-query";
import downArrow from "../../assets/icons/down_arrow.svg";
import Footer from "../../components/Footer";
import { create } from "zustand";

const filterStore = create((set) => ({
  sortState: "",
  typeFilter: [],
  completionFilter: [],
  setTypeFilter: (type) =>
    set((state) => ({ ...state, typeFilter: [...type] })),
  setCompletionFilter: (completion) =>
    set((state) => ({ ...state, completionFilter: [...completion] })),
  setSortState: (sort) => set((state) => ({ ...state, sortState: sort })),
}));

let FilterComp = ({ label, options, setter }) => {
  const [toggleCollapse, settoggleCollapse] = useState(false);
  const [filter, setfilter] = useState([]);

  useEffect(() => {
    if (filter == "All") {
      setter([]);
    } else {
      setter(filter);
    }
  }, [filter]);

  return (
    <>
      <span
        className={styles.option}
        onClick={() => {
          settoggleCollapse(!toggleCollapse);
        }}
      >
        <p>{label}</p>
        <img src={downArrow.src} alt="" />
      </span>
      {toggleCollapse &&
        options.map((ele) => {
          return (
            <span key={"options" + ele} className={styles.typesOption}>
              <p>{ele}</p>
              <input
                key={"opt" + ele}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (ele == "All") {
                      return setfilter(["All"]);
                    }
                    setfilter([...filter, ele].filter((e) => e != "All"));
                  } else {
                    setfilter(filter.filter((e) => e != ele));
                  }
                }}
                type={"checkbox"}
                checked={filter.includes(ele)}
              />
            </span>
          );
        })}
    </>
  );
};

const SortComp = ({ state, dispatch }) => {
  //Sort types
  // ALPHA
  // XP_HIGH
  // XP_LOW

  let setSortState = filterStore().setSortState;
  let sort = filterStore().sortState;

  let setTypesFilter = filterStore().setTypeFilter;
  let setCompletionFilter = filterStore().setCompletionFilter;

  return (
    <span className={styles.sortComp}>
      <span className={styles.divider} />
      <span className={styles.option}>
        <p>Sort by</p>
        <p
          onClick={() => {
            setSortState("");
          }}
          style={
            sort
              ? {
                  color: "red",
                }
              : {}
          }
          className={styles.reset}
        >
          Reset
        </p>
      </span>
      <span className={styles.typesOption}>
        <p>Alphabetical Order</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("ALPHA");
            }
          }}
          checked={sort == "ALPHA"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.typesOption}>
        <p>XP : High to Low</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("XP_HIGH");
            }
          }}
          checked={sort == "XP_HIGH"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.typesOption}>
        <p>XP : Low to High</p>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              setSortState("XP_LOW");
            }
          }}
          checked={sort == "XP_LOW"}
          type={"checkbox"}
        />
      </span>
      <span className={styles.divider} />
      <FilterComp
        label={"Type"}
        options={["All", "Task", "Quiz"]}
        setter={setTypesFilter}
      />
      <span className={styles.divider} />
      <FilterComp
        label={"Completion"}
        options={["All", "Completed", "Unattempted"]}
        setter={setCompletionFilter}
      />
    </span>
  );
};

let P_API = process.env.P_API;

const Missions = ({ data }) => {
  const [toggleFilters, settoggleFilters] = useState(false);

  let completedMissions = useQuery({
    queryKey: ["completed-missions"],
    queryFn: async () => {
      if (!window.localStorage.getItem("token")) return [];
      let option = {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      };
      let res = await axios.get(`${P_API}/user/completed-mission`, option);

      return res.data.data.missions;
    },
  });

  let sort = filterStore().sortState;

  let getSortParam = (sort) => {
    if (sort == "XP_HIGH") {
      return `{ "listingXP": -1 }`;
    }
    if (sort == "XP_LOW") {
      return `{ "listingXP": 1 }`;
    }
    if (sort == "ALPHA") {
      return `{ "name": 1 }`;
    }
    return "";
  };

  let mission = useQuery({
    queryKey: ["missions", sort],
    queryFn: async (key) => {
      let sortParms = getSortParam(key.queryKey[1]);
      if (sortParms) {
        let res = await axios.get(
          `${P_API}/mission?page=1&limit=201&sort=${sortParms}`
        );
        return res.data.data.result;
      }
      let res = await axios.get(`${P_API}/mission?page=1&limit=201`);
      return res.data.data.result;
    },
  });

  let typeFilter = filterStore().typeFilter;
  let completionFilter = filterStore().completionFilter;
  console.log(typeFilter);

  //Filter by type
  let filterByType = (data) => {
    let TypeMap = {
      TASKS: "Task",
      QUIZ: "Quiz",
    };
    //Filter by type
    let typeFilteredData = data;
    if (typeFilter.length > 0) {
      return (typeFilteredData = data.filter((ele) => {
        return typeFilter.includes(TypeMap[ele.type]);
      }));
    } else {
      return data;
    }
  };

  //Filter by completion
  let filterByCompletion = (data) => {
    let completionMap = {
      All: "All",
      Completed: true,
      Unattempted: false,
    };
    let completionFilteredData = data;
    if (completionFilter.length > 0) {
      if (completionFilter.length >= 2) {
        return data;
      }
      return (completionFilteredData = data.filter((ele) => {
        return ele.isCompleted == completionMap[completionFilter[0]];
      }));
    } else {
      return data;
    }
  };

  //divide by Completion
  let divideByCompletion = (data) => {
    // remove trending if completed
    let completed = data
      .filter((ele) => ele.isCompleted)
      .map((ele) => {
        ele.trending = false;
        return ele;
      });

    let uncompleted = data.filter((ele) => !ele.isCompleted);
    let trending = uncompleted.filter((ele) => ele.trending);
    if (sort) {
      return [...uncompleted, ...completed];
    }
    uncompleted = uncompleted.filter((ele) => !ele.trending);
    return [...trending, ...uncompleted, ...completed];
  };

  const getFilteredData = (data) => {
    return filterByCompletion(filterByType(data));
  };

  let missionData =
    mission.isFetched && completedMissions.isFetched
      ? getFilteredData(
          divideByCompletion(
            mission.data.map((ele) => {
              let isCompleted = false;
              for (let i = 0; i < completedMissions.data.length; i++) {
                if (completedMissions.data[i]._id == ele._id) {
                  isCompleted = true;
                }
              }

              return { ...ele, isCompleted };
            })
          )
        )
      : [];

  return (
    <>
      <Head>
        <title>Truts | Missions</title>
        <meta
          name="description"
          content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them"
        />
        <link rel="icon" href="/favicon.ico" />

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
      <Nav isFloating />
      <div className={styles.missions}>
        {/* Desktop nav */}
        <div className={styles.sideNav + " " + styles.desktopNav}>
          <h1 className={styles.title}>Missions</h1>
          <SortComp />
        </div>
        {toggleFilters && (
          <div className={styles.sideNav + " " + styles.mobileNav}>
            <h1 className={styles.title}>Missions</h1>
            <SortComp />
          </div>
        )}
        <h1 className={styles.titleMain}>Missions</h1>
        <div className={styles.mainContent}>
          {missionData.map((ele, idx) => {
            return (
              <Mission
                isCompleted={ele.isCompleted}
                data={ele}
                key={idx + "m" + ele.name}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            settoggleFilters(!toggleFilters);
          }}
          className={styles.filterBtn}
        >
          Filters
        </button>
      </div>
      <div style={{ paddingTop: "100px" }}>
        <Footer />
      </div>
    </>
  );
};

function compareArrays(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays
  const sortedArr1 = arr1.sort();
  const sortedArr2 = arr2.sort();

  // Compare the sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export default Missions;
