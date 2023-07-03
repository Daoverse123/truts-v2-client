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

  const fetchData = async (term_init) => {
    let term = term_init.trim().toLowerCase();
    if (!(term.length > 0)) return;
    console.log("search --> ", term);
    // let res = await axios.get(`${API}/search/${term}`);

    let query3 = {
      query: {
        bool: {
          should: [
            {
              prefix: {
                dao_name: {
                  value: term,
                },
              },
            },
            {
              query_string: {
                query: term,
                default_field: "dao_name",
              },
            },
          ],
          filter: {
            term: {
              verified_status: true,
            },
          },
        },
      },
      _source: {
        includes: [
          "dao_name",
          "dao_category",
          "dao_logo",
          "review_count",
          "slug",
          "chain",
          "description",
          "dao_mission",
        ],
      },
    };

    let query4 = {
      query: {
        bool: {
          should: [
            {
              prefix: {
                name: {
                  value: term,
                },
              },
            },
            {
              query_string: {
                query: term,
                default_field: "name",
              },
            },
          ],
          filter: {
            term: {
              visible: true,
            },
          },
        },
      },
      _source: {
        includes: [
          "name",
          "categories",
          "photo",
          "reviews",
          "slug",
          "chains",
          "description",
          "oneliner",
        ],
      },
    };

    let res = await axios.post(
      `https://search.truts.xyz/listings/_search`,
      query4
    );

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
  //   {
  //     "name": "A&T Capital",
  //     "oneliner": "",
  //     "description": "A&T Capital is an early to growth stage venture fund for emerging disruptive technologies.",
  //     "slug": "a&t_capital",
  //     "chains": [],
  //     "categories": [
  //         "Investors"
  //     ],
  //     "photo": {
  //         "logo": {
  //             "secure_url": "https://truts-listings.s3.ap-south-1.amazonaws.com/a&t_capital-logo.webp"
  //         },
  //         "cover": {
  //             "secure_url": "https://truts-listings.s3.ap-south-1.amazonaws.com/a&t_capital-cover.webp"
  //         }
  //     },
  //     "reviews": {
  //         "meta": {
  //             "friend_recommend": 0,
  //             "great_incentives": 0,
  //             "great_org_structure": 0,
  //             "onboarding_exp": 0,
  //             "opinions_matter": 0,
  //             "resonate_vibes_rate": 0
  //         },
  //         "rating": 0,
  //         "count": 0
  //     }
  // }

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
