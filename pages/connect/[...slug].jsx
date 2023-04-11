import React, { useEffect } from "react";

//twitter url
import authorizeTwitterURI from "../../utils/twitter-url";
import { redirect } from "next/dist/server/api-utils";

let twitter_auth_uri = authorizeTwitterURI();

function Connect({ mode, redirect }) {
  useEffect(() => {
    if (redirect) {
      localStorage.setItem("d-redirect", JSON.stringify(redirect));
    }
    checkMode(mode, redirect);
  }, []);

  return <></>;
}

// DISCORD_ACCOUNT: {
//     msg: "*Connect your Discord account to unlock this task*",
//     btn: "Connect Discord",
//   },
//   TWITTER_ACCOUNT: {
//     msg: "*Connect your Twitter account to unlock this task*",
//     btn: "Connect Twitter",
//   },
//   EVM_WALLET: {
//     msg: "*Connect your EVM wallet to unlock this task*",
//     btn: "Connect EVM wallet",
//   },
//   SOL_WALLET: {
//     msg: "*Connect your Solana wallet to unlock this task*",
//     btn: "Connect SOL wallet",
//   },

const checkMode = (mode, redirect) => {
  if (mode == "TWITTER_ACCOUNT") {
    location.href = twitter_auth_uri;
  }

  if (mode == "DISCORD_ACCOUNT") {
    location.href = process.env.DISCORD_OAUTH_URL;
  }

  if (mode == "EVM_WALLET") {
  }

  if (mode == "SOL_WALLET") {
  }
};

export async function getServerSideProps(ctx) {
  let mode = ctx.query.slug[0];
  let redirect = ctx.query.slug[1];
  console.log(redirect);
  return {
    props: {
      mode: mode || "",
      redirect: redirect || "",
    },
  };
}

export default Connect;
