import React, { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import { useAdminStore } from "./index";
import axios from "axios";
import { useQuery } from "react-query";
import { create } from "zustand";
import Button from "../../components/Button";

const useSocialStore = create((set) => ({
  socialState: null,
  initSocials: (data) => {
    let socialMap = {};
    data.forEach((ele) => {
      socialMap[ele.platform] = { link: ele.link, meta: ele.meta };
    });
    set((state) => ({
      ...state,
      socialState: socialMap,
    }));
  },
  setState: (sp) =>
    set((state) => {
      return { ...state, ...sp };
    }),
  setMeta: (platform, key, value) => {
    set((state) => {
      let socialState = state.socialState;
      socialState[platform].meta[key] = value;
      return { ...state, socialState: socialState };
    });
  },
}));

function Socials() {
  let selected = useAdminStore((s) => s.selected);
  let socialState = useSocialStore((s) => s.socialState);

  console.log("social state", socialState);

  let initSocials = useSocialStore().initSocials;
  let socials = useQuery({
    queryKey: [selected, "socials"],
    queryFn: async (query) => {
      let res = await axios.get(
        `${process.env.P_API}/listing/${selected}/social`
      );
      if (res.status == 200) {
        initSocials(res.data.data.listingSocials);
        return res.data.data.listingSocials;
      }
      return [];
    },
    enabled: !!selected,
  });

  const saveSocials = async () => {
    let socials = Object.keys(socialState).map((ele) => {
      return {
        platform: ele,
        link: socialState[ele].link,
        meta: socialState[ele].meta,
      };
    });

    let res = await Promise.all(
      socials.map((ele) => {
        return axios.patch(
          `${process.env.P_API}/listing/${selected}/social`,
          ele
        );
      })
    );

    let success = 0;
    res.forEach((ele) => {
      if (ele.status == 200 || ele.status == 201) {
        console.log("success");
        success++;
      } else {
        console.log("failed", ele);
      }
    });
    if (success == res.length) {
      alert("saved Socials");
    } else {
      alert("failed to save Socials");
    }
  };

  if (socialState == null) return <div>Loading...</div>;
  return (
    <form
      className={styles.daoForm}
      onSubmit={(e) => {
        e.preventDefault();
        saveSocials();
      }}
    >
      <h1 style={{ marginTop: "60px" }}>Socials</h1>
      {socials.data?.map((ele) => {
        return <Social key={ele.platform} social={ele} />;
      })}

      <Button label={"Save Socials"} />
    </form>
  );
}

const Social = ({ social }) => {
  let socialState = useSocialStore((s) => s.socialState);
  let setSocialState = useSocialStore((s) => s.setState);
  let setMeta = useSocialStore((s) => s.setMeta);
  let platform = social.platform;
  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h1>{social.platform}</h1>
      <label htmlFor="">
        <p>{"Link"}</p>
        <input
          value={socialState[platform].link}
          onChange={(e) => {}}
          type="text"
        />
      </label>
      {"meta" in social &&
        Object.keys(socialState[social.platform]?.meta).map((ele) => {
          return (
            <label key={ele + social.platform} htmlFor="">
              <p>{ele}</p>
              <input
                value={socialState[platform].meta[ele] || ""}
                onChange={(e) => {
                  setMeta(platform, ele, e.target.value);
                }}
                type="text"
              />
            </label>
          );
        })}
    </div>
  );
};

export default Socials;
