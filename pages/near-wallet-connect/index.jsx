import axios from "axios";
import React, { useEffect } from "react";
import * as nearAPI from "near-api-js";
let P_API = process.env.P_API;
import { toast } from "react-toastify";

const { connect, keyStores, WalletConnection, Signer } = nearAPI;

const connect_near = async (login) => {
  //   return walletConnection.signOut();
  //mainet added
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const connectionConfig = {
    networkId: "mainnet",
    keyStore: myKeyStore, // first create a key store
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  };
  const walletConnection = null;
  // connect to NEAR
  const nearConnection = await connect(connectionConfig);

  // create wallet connection
  walletConnection = new WalletConnection(nearConnection);
  // const walletConnection = new WalletConnection(nearConnection);

  if (!walletConnection.isSignedIn()) {
    let AccessKey = walletConnection.requestSignIn(
      "example-contract.testnet", // contract requesting access
      "Truts App", // optional title
      `REPLACE_ME://.com/success"`, // optional redirect URL on success
      `${window.location.host}/error` // optional redirect URL on failure
    );
    console.log(AccessKey);
  } else {
    const walletAccountId = walletConnection.getAccountId();

    // send req to server
    let options = {};
    if (login) {
      options = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
    }
    console.log({ options });
    let res_nonce = await axios.get(
      `${P_API}/login/wallet?address=${walletAccountId}`,
      options
    );

    if (res_nonce.status == 200) {
      let auth_res = await axios.post(`${P_API}/login/wallet/verify`, {
        public_key: walletAccountId,
        chain: "NEAR",
        signature: "",
      });
      localStorage.setItem("token", `Bearer ${auth_res.data.data.token}`);
      if (login) {
        toast.success("Wallet connected successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        window.location = "/profile/private";
      } else {
        window.location = "/profile/private";
      }
    }
  }
};

function Index() {
  useEffect(() => {
    connect_near(location.href.includes("islogin=true"));
  }, []);

  return <div></div>;
}

export default Index;
