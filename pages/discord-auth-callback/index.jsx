import React, { useEffect } from "react";
import axios from "axios";

let P_API = process.env.P_API;

const sendCode = async (code) => {
  let res = await axios.get(`${P_API}/login/discord/callback?code=${code}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  if (res.status == 200) {
    console.log(res.data.data);
    let redirect = localStorage.getItem("d-redirect");
    if (redirect) {
      redirect = decodeURIComponent(redirect).replaceAll(`"`, ``);
      alert(redirect);
      console.log(redirect);
      // localStorage.removeItem("d-redirect");
      // return (location.href = redirect);
    }

    // window.location = localStorage.getItem('redirect_pre_discord');
    // window.location = "/profile/private";
  } else {
    alert("auth failed Please try again");
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
  axios;

  return {
    props: {
      query: query,
    },
  };
}

export default Callback;
