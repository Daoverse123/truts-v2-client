import React, { useEffect } from "react";
import axios from "axios";

let P_API = process.env.P_API;

const sendCode = async (code) => {
  try {
    let res = await axios.get(
      `${P_API}/connect/twitter/callback?code=${code}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status == 200) {
      console.log(res.data.data);
      // window.location = localStorage.getItem('redirect_pre_discord');

      let redirect = localStorage.getItem("d-redirect");
      if (redirect) {
        redirect = decodeURIComponent(redirect).replaceAll(`"`, "");
        localStorage.removeItem("d-redirect");
        return (location.href = redirect);
      }

      window.location = "/edit-profile?page=social#twitter-success";
    } else if (res.status == 409) {
      alert(
        "This Twitter accout is already connected to a truts account please try again with another Twitter account, or contact support"
      );
      window.location = "/edit-profile?page=social";
    } else {
      alert("auth failed Please try again");
      window.location = "/edit-profile?page=social";
    }
  } catch (error) {
    alert("auth failed Please try again");
    window.location = "/edit-profile?page=social";
  }
};

function Callback({ query }) {
  let code = query.code;

  useEffect(() => {
    sendCode(code);
  }, []);

  return <div></div>;
}

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
  let query = ctx.query;

  return {
    props: {
      query: query,
    },
  };
}

export default Callback;
