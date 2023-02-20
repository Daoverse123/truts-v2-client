import React, { useState, useCallback } from "react";
import styles from "./search.module.scss";
import _ from "lodash";
import axios from "axios";
import Link from "next/link";

// CONSTANTS
const API = process.env.API;

//Assets
import gradient_search from "../../assets/icons/gradient_search.svg";
import close_icon from "../../assets/icons/close_icon.svg";

export default function Search({ className }) {
  const [searchTerm, setsearchTerm] = useState("");
  const [searchSuggestiondata, setSuggestiondata] = useState([]);
  const [suggestionVisible, setsuggestionVisible] = useState(false);
  const [focus, setfocus] = useState(false);

  const fetchData = async (term) => {
    if (!(term.length > 0)) return;
    console.log("search --> ", term);
    // let res = await axios.get(`${API}/search/${term}`);
    let query = {
      query: {
        bool: {
          must: [
            {
              wildcard: {
                dao_name: `*${term}*`,
              },
            },
            {
              match: {
                verified_status: true,
              },
            },
          ],
        },
      },
      _source: {
        includes: [
          "dao_name",
          "dao_category",
          "dao_logo",
          "review_count",
          "slug",
        ],
      },
    };
    let res = await axios.post(`https://search.truts.xyz/daos/_search`, query);

    console.log(res);

    let data = res.data.hits.hits.map((ele) => {
      return ele._source;
    });

    data.length > 0 && setSuggestiondata([...data]);
  };

  let fetchSearchTerm = useCallback(
    _.debounce((term) => fetchData(term), 100),
    []
  );

  let focus_style = focus ? styles.focus : "";

  return (
    <div className={styles.search + " " + focus_style + " " + className}>
      <div className={styles.icon}>
        <img src={gradient_search.src} alt="" />
      </div>
      <input
        id={"search_box"}
        className={styles.seachBoxInput}
        type="text"
        placeholder={"Search Communities"}
        value={searchTerm}
        onChange={(e) => {
          setsearchTerm(e.target.value);
          fetchSearchTerm(e.target.value);
        }}
        onBlur={() => {
          setTimeout(() => {
            setsuggestionVisible(false);
          }, 500);
          setfocus(false);
        }}
        onFocus={() => {
          setsuggestionVisible(true);
          setfocus(true);
        }}
      />
      {searchSuggestiondata.length > 0 &&
        searchTerm.length > 0 &&
        suggestionVisible && (
          <div className={styles.suggestionBox}>
            <div className={styles.nameBasedSuggestions}>
              {searchSuggestiondata.map((ele, idx) => {
                return (
                  <SearchSuggestionEntry data={ele} key={ele.dao_name + idx} />
                );
              })}
            </div>
            <div className={styles.descBasedSuggestions}></div>
          </div>
        )}
      <div
        className={styles.icon}
        onClick={() => {
          setsearchTerm("");
          setSuggestiondata([]);
        }}
      >
        <img
          style={searchTerm.length > 0 ? { opacity: "1" } : null}
          className={styles.close_icon}
          src={close_icon.src}
          alt=""
        />
      </div>
    </div>
  );
}

const SearchSuggestionEntry = ({ data }) => {
  const getDaoTags = () => {
    let tagsString = "";
    data.dao_category.forEach((ele, idx) => {
      tagsString = tagsString + ele;
      if (idx < data.dao_category.length - 1) {
        tagsString = tagsString + ", ";
      }
    });
    return tagsString;
  };

  return (
    <Link href={`/dao/${data.slug}`}>
      <div className={styles.searchSuggestionEntry}>
        <div className={styles.daoIcon}>
          <img src={data.dao_logo} alt="" />
        </div>
        <div className={styles.daoInfo}>
          <h1 className={styles.daoName}>{data.dao_name}</h1>
          <h3 className={styles.daoTags}>{getDaoTags()}</h3>
          <p className={styles.reviewCount}>{data.review_count} Reviews</p>
        </div>
      </div>
    </Link>
  );
};
