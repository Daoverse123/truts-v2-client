function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let authorizeTwitterURI = () => {
  const url = new URL("https://twitter.com/i/oauth2/authorize");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", process.env.TWITTER_CLIENT_ID);
  url.searchParams.append("redirect_uri", process.env.TWITTER_REDIRECT_URI);
  url.searchParams.append("scope", 'users.read tweet.read like.read offline.access follows.read');
  // We implement the PCKE extension for additional security.
  // Here, we're passing a randomly generate state parameter, along
  // with a code challenge. In this example, the code challenge is
  // a plain string, but s256 is also supported.
  url.searchParams.append("state", randomString(5));
  url.searchParams.append("code_challenge", "challenge");
  url.searchParams.append("code_challenge_method", "plain");
  return url;
};


export default authorizeTwitterURI