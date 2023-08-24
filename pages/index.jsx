import Head from "next/head";
import styles from "./Home/home.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import openNewTab from "../utils/openNewTab";
import Link from "next/link";
import { useQuery } from "react-query";

// COMPONENTS
import Button from "../components/Button";
import DAOCard from "../components/DAOCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Profile_signup from "./../components/Profile_signup";
import WalletConnectProfile from "../components/WalletConnect_v3";
import Leaderboard from "./Home/Leaderboard";
import NewHero from "./Home/NewHero";

// ASSETS
import searchIcon from "../assets/icons/search_white.svg";
import heroGraphic from "../assets/hero_graphic.svg";
import statcard_1 from "../assets/statcard_1.svg";
import statcard_2 from "../assets/statcard_2.svg";
import statcard_3 from "../assets/statcard_3.svg";
import gold_medal from "../assets/icons/gold_medal.svg";
import silver_medal from "../assets/icons/silver_medal.svg";
import bronze_medal from "../assets/icons/bronze_medal.svg";
import blank_medal from "../assets/icons/blank_medal.png";
import starFilled from "../assets/icons/star_filled.svg";
import starBlank from "../assets/icons/star_blank.svg";
import gradstarFilled from "../assets/icons/star_filled_gradient.svg";
import gradstarBlank from "../assets/icons/star_blank_gradient.svg";
import web_w from "../assets/icons/web_white.svg";
import twitter_w from "../assets/icons/twitter_white.svg";
import discord_w from "../assets/icons/discord_white.svg";
import search_white from "../assets/icons/search_white.svg";
import binoculars_icon from "../assets/icons/binoculars_icon.svg";

//new hero
import heroGradLeft from "../assets/leftGrad.png";
import heroGradRight from "../assets/rightGrad.png";
import heroImg from "../assets/hero_img.png";

// CONSTANTS
const API = process.env.API;
//const CATEGORY_LIST = ['all', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Event']

// MAIN COMPONENT
export default function Home({ daoList_ssr, categoryList }) {
  //data states

  return (
    <div className={styles.container}>
      <Nav isFloating />
      <Head>
        <title>Truts - the best discovery platform for web3</title>
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
      <Hero />
      <main className={styles.main}>
        {/* <StatCards /> */}
        <CommunitiesWall daoList={daoList_ssr} categoryList={categoryList} />
        <RewardSection />
        <Leaderboard />
      </main>
      <RecentReviewsSection />
      <main className={styles.main}>
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
//cg
const RewardSection = () => {
  return (
    <div className={styles.rewardSection}>
      <span className={styles.text}>
        <h1>Rewards, Reputation, Legacy.</h1>
        <h3>What's in it for you?</h3>
        <p>
          Use your Truts Xp to claim various rewards from early access to
          products to airdrops. Don't miss anything.
        </p>
        <button>Explore Rewards</button>
      </span>
      <span className={styles.image}>
        <img className={styles.circle} src="/rewardHero.svg" alt="" />
        <img className={styles.center} src="/rewardIconCenter.svg" alt="" />
      </span>
    </div>
  );
};

const Faq_qn = ({ data }) => {
  const [open, setopen] = useState(false);

  return (
    <div className={styles.faq_qn}>
      <span
        onClick={() => {
          setopen((state) => {
            return !state;
          });
        }}
        className={styles.qn}
      >
        <h1>{data.qn}</h1>
        {!open ? (
          <img className={styles.plus} src="/faq/plus.svg" alt="" />
        ) : (
          <img className={styles.plus} src="/faq/minus.svg" alt="" />
        )}
      </span>
      {open && <p className={styles.ans}>{data.ans}</p>}
    </div>
  );
};

let faqs = [
  {
    qn: "What is Truts?",
    ans: "Truts is a comprehensive discovery platform for web3 projects across various categories, chains, and ecosystems. It allows users to explore and learn more about web3 projects through community reviews, social details, missions, and much more.",
  },
  {
    qn: "What are Missions?",
    ans: "Missions are tasks provided by Truts Network projects that encourage users to engage with their products. By participating in and completing more missions, users can earn additional XPs.",
  },
  {
    qn: "What are XPs?",
    ans: "XPs, or Experience Points, are rewards given to community members for completing missions, making referrals, and engaging with Truts. Accumulating XPs makes users eligible for various rewards offered by Truts.",
  },
  {
    qn: "What rewards can be earned through XPs?",
    ans: "Holding XPs makes users eligible for a range of benefits, including access to whitelists, airdrops, discounts, early access, merchandise drops, and other incentives provided by Truts Network Partners.",
  },
  {
    qn: "Wen token ?",
    ans: "Just get more XPs for now my fren, you no more need an onchain token to become rich.",
  },
];

const Faq = () => {
  return (
    <div className={styles.faq_sec}>
      <img className={styles.tl} src="/faq/blur_tr.png" alt="" />
      <img className={styles.br} src="/faq/blur_br.png" alt="" />
      <span className={styles.faq_title}>
        <h1>Frequently Asked Questions</h1>
        <p>Have questions? We are here to help</p>
      </span>
      <div className={styles.con}>
        {faqs.map((ele, idx) => {
          return <Faq_qn data={ele} key={idx + "faq"} />;
        })}
      </div>
    </div>
  );
};

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
  // Fetch data from external API
  let res = await Promise.all([
    getDaolistAPI(),
    axios.get(`${process.env.P_API}/listing/categories`),
  ]);
  // Pass data to the page via props
  return {
    props: { daoList_ssr: res[0], categoryList: res[1].data.data.result },
  };
}

// API CALLS

//get list of daos
const getDaolistAPI = async (setter) => {
  //gets initial 20 doas
  let params = {
    limit: 20,
    sort: `{ "reviews.count": -1 ,"reviews.rating" : -1 }`,
  };

  let url = `${process.env.P_API}/listing`;
  let res = await axios.get(url, { params });
  return res.data.data.result;
};

//HERO COMPONENT

// function Hero() {
//   return (
//     <div className={styles.hero}>
//       <Head>
//         <title>Truts</title>
//         <meta name="description" content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className={styles.hero_left}>
//         <h1>Start your Web3</h1>
//         <h1 >journey with <span className={styles.gradientText}>Truts.</span></h1>
//         <p>Discover, join, contribute and earn</p>
//         <div className={styles.cta_btns}>
//           <Button onClick={() => {
//             let sc = document.querySelector('#search_box');
//             sc.focus()
//           }} label={'Search Truts'} icon={searchIcon.src} />
//           <Link href={'/discover'}>
//             <Button type={'secondary'} label={'Explore Communities'} />
//           </Link>
//         </div>
//       </div>
//       <div className={styles.hero_right}>
//         <img src={heroGraphic.src} alt="" />
//       </div>
//     </div>
//   )
// }
//s
function Hero() {
  const [profileSignupPrompt, setprofileSignupPrompt] = useState(false);
  const [walletConnectVisible, setwalletConnectVisible] = useState(false);

  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <>
      {/* <img
        className={styles.heroLeft}
        src={`//wsrv.nl/?url=https://daoverse-bucket.s3.ap-south-1.amazonaws.com/leftGrad.png`}
        alt=""
      />
      <img
        className={styles.heroRight}
        src={
          "//wsrv.nl/?url=https://daoverse-bucket.s3.ap-south-1.amazonaws.com/rightGrad.1a237d6b+(Small).png"
        }
        alt=""
      /> */}
      {/* <div className={styles.new_hero}>
        <span className={styles.new_heroText}>
          <h1 className={styles.new_heroTitle}>
            Start your Web3 Journey with{" "}
            <span className={styles.gradientText}>Truts</span>
          </h1>
          <h2>Discover, join, contribute and earn.</h2>
          {!isLoggedIn ? (
            <button
              onClick={() => {
                window.showSignupPrompt && window.showSignupPrompt();
                // openNewTab('/early-alpha.html');
              }}
              className={styles.black_btn}
            >
              <img src={"/svg/profile.svg"} alt="" />
              Login/Sign up
            </button>
          ) : (
            <button
              onClick={() => {
                location.href = "/missions";
                // openNewTab('/early-alpha.html');
              }}
              className={styles.black_btn}
            >
              <img src={"/svg/rocket.svg"} alt="" />
              Explore Missions
            </button>
          )}
        </span>
        <img src={heroImg.src} alt="" className={styles.heroImg} />
        <div className={styles.heroStat}>
          <div className={styles.stat}>
            <h3>2700+</h3>
            <p>Communities Listed</p>
          </div>
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>Reviews Posted</p>
          </div>
          <div className={styles.stat}>
            <h3>1200+</h3>
            <p>Contributors Onboarded</p>
          </div>
        </div>
      </div> */}
      <NewHero />
    </>
  );
}

// STAT CARD COMPONENT
function StatCards() {
  return (
    <div className={styles.statCardsSection}>
      <div className={styles.statCard1}>
        <span className={styles.text1}>
          <span className={styles.colorText_card1}>
            Discover and Contribute
          </span>{" "}
          to Communities{" "}
        </span>
        <img src={statcard_1.src} alt="" />
      </div>
      <div className={styles.statCard2}>
        <span className={styles.text2}>
          Earn tips for your{" "}
          <span className={styles.colorText_card2}>genuine reviews</span>
        </span>
        <img src={statcard_2.src} alt="" />
      </div>
      <div className={styles.statCard3}>
        <span className={styles.text3}>
          100% fully{" "}
          <span className={styles.colorText_card3}>On-chain, Anonymous</span>{" "}
          and Gasless
        </span>
        <img src={statcard_3.src} alt="" />
      </div>
    </div>
  );
}

// COMMUNITY WALL
function CommunitiesWall({ daoList, categoryList }) {
  const [selectedTab, setselectedTab] = useState("all");

  const scrolltoEnd = () => {
    // document.querySelector('#cat_container').scrollLeft = 99999;
    let rightArrow = document.querySelector("." + styles.scrollEnd);
    let rightMarker = rightArrow.getBoundingClientRect().x;
    let list = document.querySelector("#cat_container").childNodes;
    let startingPoint;
    list = [...list].forEach((ele, idx) => {
      let x = ele.getBoundingClientRect().x;
      let delta = rightMarker - x;
      console.log(delta, ele.innerText);
      if (delta > 0) {
        startingPoint = ele;
      }
    });
    console.log(startingPoint.innerText);
    document.querySelector("#cat_container").scrollLeft =
      document.querySelector("#cat_container").scrollLeft +
      startingPoint.getBoundingClientRect().x;
  };

  const scrolltoStart = () => {
    document.querySelector("#cat_container").scrollLeft = 0;
    // let list = document.querySelector('#cat_container').childNodes;
    // console.log(list);
  };

  let filteredList = useQuery({
    queryKey: ["filteredDAOList", selectedTab],
    queryFn: async (query) => {
      let selected = query.queryKey[1];
      if (selected == "all") return daoList;

      let params = {
        limit: 20,
        sort: `{ "reviews.count": -1 ,"reviews.rating" : -1 }`,
        filter: `{ "categories": ["${selected}"] }`,
      };

      let url = `${process.env.P_API}/listing`;
      let res = await axios.get(url, { params });
      return res.data.data.result;
    },
  });

  let categoryTabs = [{ category: "all" }, ...categoryList].map((ele, idx) => {
    return (
      <button
        id={`t${idx}`}
        onClick={() => {
          setselectedTab(ele.category);
        }}
        className={
          ele.category == selectedTab
            ? styles.categoryTabSelected
            : styles.categoryTab
        }
        key={"cat" + idx}
      >
        {ele.category}
      </button>
    );
  });

  return (
    <div className={styles.wall_of_communties}>
      <h1 className={styles.sec_title}>Our Wall of Communities</h1>
      <div className={styles.categoryTabConWrapper}>
        <button className={styles.scrollStart} onClick={scrolltoStart} />
        <div id="cat_container" className={styles.categoryTabCon}>
          {categoryTabs}
        </div>
        <button className={styles.scrollEnd} onClick={scrolltoEnd} />
      </div>
      <div className={styles.cardCon} key={selectedTab}>
        {filteredList.isSuccess ? (
          filteredList.data.map((ele, idx) => {
            return <DAOCard key={"card" + idx} data={ele} />;
          })
        ) : (
          <span className={styles.loader}>
            <img src="/white-loader.gif" alt="" />
          </span>
        )}
      </div>
      <Link href={"/discover"}>
        <Button label={"See More"} type={"secondary"} />
      </Link>
    </div>
  );
}

// LEADERBOARD COMPONENT

let StarRating = ({ rating, showCount, color, count }) => {
  return (
    <div className={styles.starRating}>
      <span
        className={styles.stars}
        style={color == "black" ? { filter: "invert(1)" } : null}
      >
        {[1, 2, 3, 4, 5].map((ele) => {
          let starSrc = ele <= rating ? starFilled.src : starBlank.src;
          return <img alt="" key={"s" + ele} src={starSrc} />;
        })}
      </span>
      {showCount && <p className={styles.rating_count}>({count})</p>}
    </div>
  );
};

let GradStarRating = ({ rating, showCount, color, count }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((ele) => {
          let starSrc = ele <= rating ? gradstarFilled.src : gradstarBlank.src;
          return <img alt="" key={"s" + ele} src={starSrc} />;
        })}
      </span>
      {showCount && <p className={styles.rating_count}>({count})</p>}
    </div>
  );
};

// RECENT REVIEWS

function RecentReview({ text, address, daoName, rating, i }) {
  const [gradArray, setgradArray] = useState([]);

  useEffect(() => {
    let newGradArray = [];
    for (let i = 0; i < 16; i++) {
      newGradArray.push(newGradient());
    }
    setgradArray(newGradArray);
  }, []);

  return (
    <div className={styles.recentReview}>
      <div className={styles.user}>
        <img src="/blue.png" alt="" />
        <span>
          <h1>{address}</h1>
          <p>@{address}</p>
        </span>
      </div>
      <span className={styles.rating}>
        <h1>{daoName}</h1>
        <GradStarRating rating={rating} />
      </span>
      <div className={styles.desc}>
        <p>
          <img src="/quotes.svg" alt="" />
          {limitText(280, text)}
        </p>
      </div>
    </div>
  );
}

function limitText(count, text) {
  if (text.length < count) return text;
  let snippedText = text.substring(0, count);
  return snippedText + "...";
}

function RecentReviewsSection() {
  const [motion, setmotion] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setmotion(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let nodes = document.querySelectorAll(`.${styles.recentReview}`);
    nodes.forEach((node) => {
      node.style.animationPlayState = motion ? "paused" : "running";
    });
  }, [motion]);

  return (
    <div className={styles.recentReviewsCon}>
      <h1 className={styles.sec_title}>Recent Reviews</h1>
      <div
        className={styles.reviewCon}
        onMouseEnter={() => {
          setmotion(true);
        }}
        onMouseLeave={() => {
          setmotion(false);
        }}
      >
        <div id={"slider1"} className={styles.row_review_1}>
          <RecentReview
            i={0}
            rating={5}
            address={"0x30F...e805"}
            daoName={"SuperteamDAO"}
            text={`Superteam DAO is tight-knit and has a familial vibe to begin your bounty hunting journey in web 3. It's still evolving and getting better but given that these are early days for DAOs it's definitely setting up an edifice for the future. Also, crazy memes and other stuff beyond web 3 on ...`}
          />
          <RecentReview
            i={1}
            rating={5}
            address={"Fw92n....q9S"}
            daoName={"Mean DAO"}
            text={`This is a rare and excellent project on the solana network. The bear market should 
            participate more and wait for the spring of the bull market.`}
          />
          <RecentReview
            i={7}
            rating={5}
            address={"0xC2e....f4d"}
            daoName={"CropBytes"}
            text={`J’ai découvert ce jeu par hasard, pour Découvrire le monde crypto je trouve le concept vraiment intéressant.(place de trading entre joueurs,ou revente direct)
            Je recommande ce jeu. Les développeurs ne sont jamais à court d’idées pour des évènements et réactif au moindre problème.les communautés sont actif et réactif aussi.
            Le sytème de parrainage qui vous donne droit à un asset gratuit  quand vou...
            read more`}
          />
          <RecentReview
            i={13}
            rating={5}
            address={"0x97c....2A6"}
            daoName={"CropBytes"}
            text={`CropBytes is my favorite platform to spend my time and de-stress, I really like the game because it is very real and it is in constant development, it has a very dedicated team and they care about the community, I have met wonderful people in that great community because it is very easy to interact with other farmers, we help each other as well as help new players by giving them the best advice ba...`}
          />
          <RecentReview
            i={4}
            rating={5}
            address={"0x4a3....b85"}
            daoName={"iDriss"}
            text={`I have been a core contributer to IDriss since day 1 and I love the direction it is heading. More and more people are helping each other out, cross-community engagement grows, and an exciting product line is coming up straight ahead. Jump into our discord server and join us!`}
          />
          <RecentReview
            i={12}
            rating={5}
            address={"GuhBf....5So"}
            daoName={"Across DAO"}
            text={`Across is literally the best bridging protocol which doesn't guzzle your money and provides the fastest and safest experience. 
            The Across DAO is a great place to be for DeFi enthusiasts and users who are interested in great blockchain technology. $ACX launching soon too! `}
          />
          <RecentReview
            i={6}
            rating={5}
            address={"0x5F0....e49"}
            daoName={"Across DAO"}
            text={`我认为 Across DAO 是一个非常活跃和非常好的社区，项目使用跨链交易既快速又便宜。此外，关于项目空投的各个提案团队正在积极合作并满足社区。可见团队对社区还是很重视的。这是一个完美的 DAO 社区应该具备的条件`}
          />
          <RecentReview
            i={7}
            rating={10}
            address={"0xeDB....44c"}
            daoName={"Cult DAO"}
            text={`CultDAO is not all about making money--it has a mission that will benefit everyone on this lovely planet. If you want to further decentralization, I urge you to look into CultDAO and read the manifesto. Aside from that, our community is a diverse group of wonderful passionate people that are full of love. Lastly, your mind will be at ease as no one can change CULT--no one can access the liquidity,...`}
          />
          <RecentReview
            i={8}
            rating={5}
            address={"0x1Be....22F"}
            daoName={"Cult DAO "}
            text={`i have written some reviews on many DAOs.
            The most innovative DAO that i found is the CULT DAO with his awsome Community and his great tokenomic system. 
            i really like it!`}
          />
        </div>
        <div id={"slider2"} className={styles.row_review_2}>
          <RecentReview
            i={13}
            rating={5}
            address={"9GaUZ....gcR"}
            daoName={"Superteam DAO"}
            text={`SuperteamDAO is one of the best places to learn more about web3 and there is a place for everyone, dev, designer, content writer, etc.
            Contribute, gain XP, get incentivized, grow and learn together 🤝
            WAGMI`}
          />
          <RecentReview
            i={4}
            rating={5}
            address={"0xf58....691"}
            daoName={"XDAO"}
            text={`I admire the idea of creating XDAO. This is the most convenient and easy tool to create your DAO. I'm also impressed by the structure of the work in the DAO community. I recommend everyone to join and participate in the development of the project!`}
          />
          <RecentReview
            i={12}
            rating={5}
            address={"0x7A9....24B"}
            daoName={"XDAO"}
            text={`The project is really amazing, this time DAO is developing much more successfully and at a tremendous speed, the XDAO project includes all the amenities for creating, using your own DAO, the community of this project is at the highest level, all your questions will be heard by ambassadors and assistants, and you will get an answer to your any question as quickly as possible, in general, you can ta...`}
          />
          <RecentReview
            i={6}
            rating={5}
            address={"0x76B....f73"}
            daoName={"Umbria Network"}
            text={`Been using Umbria for 6 months. It’s the fastest and cheapest bridge I’ve found. Has a great team behind it and an excellent discord community. Very highly recommended!!`}
          />
          <RecentReview
            i={7}
            rating={10}
            address={"0x57F....f6E"}
            daoName={"Umbria Network"}
            text={`Umbria has always been fast and inexpensive for me.  Only had a minor delay once and the team in discord responded quickly and explained the reason for the delay -- which was a network issue, nothing on their end -- and the issue was resolved soon after just as they said it would be.`}
          />
          <RecentReview
            i={8}
            rating={5}
            address={"GSWhs....dcD"}
            daoName={"Bankless DAO"}
            text={`Bankless is a community with diversed set of people, It is really awesome to see so many guilds. The only issue I feel is, the navigation between different guilds is very difficult and finding where one can contribute is hard because of that`}
          />

          <RecentReview
            i={0}
            rating={5}
            address={"0xe50....b48"}
            daoName={"Bankless DAO"}
            text={`Bankless DAO is a fantastic community and their newsletter in particular is outstanding. A great subscription to go for for anyone starting their journey down the Web3 Rabbit hole. Love the content, information and knowledge you can get by being part of Bankless DAO`}
          />
          <RecentReview
            i={1}
            rating={5}
            address={"0x7Ed....6DD"}
            daoName={"IndiGG"}
            text={`The gamers' community, IndiGG, is dedicated to fostering competitive gaming at all levels. You can only get a true feel for the community's unique energy, competitive attitude, and drive to succeed by becoming an active participant. Extra benefits include whitelisting invitations, game scholarships, additional ways to earn rewards in the community, and much more.`}
          />
          <RecentReview
            i={7}
            rating={5}
            address={"0x7aF....773"}
            daoName={"IndiGG"}
            text={`Well, Indigg is one great project that actually offered me my first ever opportunity of belonging to a guild in my first web3 guild experiences. Ever since I've been with Indigg, its been all sorts of fun and adventure. I will always definitely recommend this great guild to anyone out there that’s just coming into the web 3 space. This guild packs lots of perks for its members and community as a w...`}
          />
        </div>
      </div>
    </div>
  );
}

function newGradient() {
  var c1 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  var c2 = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  c1.rgb = "rgb(" + c1.r + "," + c1.g + "," + c1.b + ")";
  c2.rgb = "rgb(" + c2.r + "," + c2.g + "," + c2.b + ")";
  return "radial-gradient(at top left, " + c1.rgb + ", " + c2.rgb + ")";
}
