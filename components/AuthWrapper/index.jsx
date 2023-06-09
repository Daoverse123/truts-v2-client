import React, { useEffect, useState } from "react";

import Profile_signup from "../../components/Profile_signup";
import WalletConnect from "../../components/WalletConnect_v3";

function AuthWrapper({ children }) {
  const [profileSignupPrompt, setprofileSignupPrompt] = useState(false);
  const [walletConnectVisible, setwalletConnectVisible] = useState(false);
  const [referral, setreferral] = useState(undefined);
  useEffect(() => {
    let ref = location.search.replaceAll("?", "").split("=");
    if (ref[0] == "ref") {
      setprofileSignupPrompt(true);
      setreferral(ref[1]);
    }
    if (ref[0] == "signup" && !localStorage.getItem("token")) {
      setprofileSignupPrompt(true);
    }

    if (localStorage.getItem("token")) {
      //setisLoggedIn(true);
    }
  }, []);

  const showSignupPrompt = () => {
    setprofileSignupPrompt(true);
  };

  useEffect(() => {
    window.showSignupPrompt = showSignupPrompt;
  }, []);

  return (
    <>
      <>
        {profileSignupPrompt && (
          <Profile_signup
            referral={referral}
            setprofileSignupPrompt={setprofileSignupPrompt}
            showWalletConnect={() => {
              setwalletConnectVisible(true);
            }}
          />
        )}
        <WalletConnect
          referral={referral}
          walletConnectVisible={walletConnectVisible}
          setwalletConnectVisible={setwalletConnectVisible}
        />
      </>
      {children}
    </>
  );
}

export default AuthWrapper;
