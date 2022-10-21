import Head from 'next/head'
import styles from './Home/home.module.scss'
import { useState, useEffect } from 'react'
import axios from 'axios'
import openNewTab from '../utils/openNewTab'

// COMPONENTS
import Button from '../components/Button'
import DAOCard from '../components/DAOCard'
import Footer from '../components/Footer'
import Nav from '../components/Nav'

// ASSETS
import searchIcon from '../assets/icons/search_white.svg'
import heroGraphic from '../assets/hero_graphic.svg'
import statcard_1 from '../assets/statcard_1.svg'
import statcard_2 from '../assets/statcard_2.svg'
import statcard_3 from '../assets/statcard_3.svg'
import gold_medal from '../assets/icons/gold_medal.svg'
import silver_medal from '../assets/icons/silver_medal.svg'
import bronze_medal from '../assets/icons/bronze_medal.svg'
import blank_medal from '../assets/icons/blank_medal.png'
import starFilled from '../assets/icons/star_filled.svg'
import starBlank from '../assets/icons/star_blank.svg'
import web_w from '../assets/icons/web_white.svg'
import twitter_w from '../assets/icons/twitter_white.svg'
import discord_w from '../assets/icons/discord_white.svg'
import search_white from '../assets/icons/search_white.svg'
import binoculars_icon from '../assets/icons/binoculars_icon.svg'

//new hero
import heroGradLeft from '../assets/leftGrad.png'
import heroGradRight from '../assets/rightGrad.png'
import heroImg from '../assets/hero_img.png'


// CONSTANTS
const API = process.env.API
//const CATEGORY_LIST = ['all', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Event']

const CATEGORY_LIST = ['DAO',
  'Media',
  'Investment',
  'Service',
  'Grant',
  'Social',
  'DAO tool',
  'Defi',
  'CeFi',
  'TradeFi',
  'BlockFi',
  'Lending',
  'Yield aggregator',
  'Stablecoin',
  'NFT',
  'Metaverse',
  'Art',
  'Music',
  'NFT marketplace',
  'Utilities',
  'Analytics',
  'Payment',
  'Oracle',
  'Games',
  'Infrastructure',
  'Wallet',
  'Indexer',
  'Storage',
  'Identity',
  'Exchange',
  'Community',
  'Guild',
  'Marketing tool',
  'Public Good',
  'Education'];


// MAIN COMPONENT
export default function Home({ daoList_ssr, leaderboard_ssr }) {

  //data states
  const [daoList, setdaoList] = useState(daoList_ssr);
  const [leaderboard, setleaderboard] = useState(leaderboard_ssr)

  useEffect(() => {
    getDynamicCategoryDaoList(setdaoList);
  }, [])

  return (
    <div className={styles.container}>
      <Nav isFloating />
      <Head>
        <title>Truts</title>
        <meta name="description" content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them" />
        <link rel="icon" href="/favicon.png" />

        <meta property="og:url" content="https://www.truts.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Truts" />
        <meta property="og:description" content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them" />
        <meta property="og:image" content="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="truts.xyz" />
        <meta property="twitter:url" content="https://www.truts.xyz" />
        <meta name="twitter:title" content="Truts" />
        <meta name="twitter:description" content="Discover web3 communities that vibes with you from a list of thousands of communities across different categories (service, investment, media, social) and know all about them" />
        <meta name="twitter:image" content="/favicon.png" />


      </Head>
      <Hero />
      <main className={styles.main}>
        {/* <StatCards /> */}
        <CommunitiesWall daoList={daoList} />
        <Leaderboard data={leaderboard} />
        <Leaderboard_mobile data={leaderboard} />
      </main>
      <RecentReviewsSection />
      <Footer />
    </div>
  )
}

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
  // Fetch data from external API
  let res = await Promise.all(
    [getDaolistAPI(), getLeaderboard()]
  )
  // Pass data to the page via props
  return { props: { daoList_ssr: res[0], leaderboard_ssr: res[1] } }
}

// API CALLS

//get list of daos
const getDaolistAPI = async (setter) => {
  //gets initial 20 doas
  let url = `${API}/dao/get-dao-list?limit=20&page=1`;
  let res = await axios.get(url);
  let dao_data_obj = {};
  CATEGORY_LIST.forEach((ele) => {
    dao_data_obj[ele] = [];
  })
  dao_data_obj['all'] = res.data.results
  return dao_data_obj;
}

//get Leaderboard
const getLeaderboard = async (setter) => {
  let url = `${API}/dao/leaderboard`;
  let res = await axios.get(url);
  //console.log(res.data)
  return res.data
}

//get 20 Dynamic category based Daos  
const getDynamicCategoryDaoList = async (setter) => {
  CATEGORY_LIST.forEach((cat) => {
    if (cat == 'all') return
    let url = `${API}/dao/similar?category=${cat}&page=1&limit=20`;
    axios.get(url).then((res) => {
      setter((prev) => {
        prev[cat] = res.data.results;
        return { ...prev }
      })
    });
  })
}


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

function Hero() {
  return (
    <>
      <img className={styles.heroLeft} src={heroGradLeft.src} alt="" />
      <img className={styles.heroRight} src={heroGradRight.src} alt="" />
      <div className={styles.new_hero}>
        <span className={styles.new_heroText}>
          <h1 className={styles.new_heroTitle}>
            Start your Web3 Journey with <span className={styles.gradientText}>Truts</span>
          </h1>
          <h2>Discover, join, contribute and earn.</h2>
          <button onClick={() => {
            openNewTab('http://truts.xyz/discover');
          }} className={styles.black_btn}> <img src={binoculars_icon.src} alt="" /> Discover Communities</button>
        </span>
        <img src={heroImg.src} alt="" className={styles.heroImg} />
        <div className={styles.heroStat}>
          <div className={styles.stat}>
            <h3>1700+</h3>
            <p>Communities Listed</p>
          </div>
          <div className={styles.stat}>
            <h3>400+</h3>
            <p>Reviews Posted</p>
          </div>
          <div className={styles.stat}>
            <h3>600+</h3>
            <p>Contributors Onboarded</p>
          </div>
        </div>
      </div>
    </>
  )
}

// STAT CARD COMPONENT
function StatCards() {
  return (
    <div className={styles.statCardsSection}>
      <div className={styles.statCard1}>
        <span className={styles.text1}><span className={styles.colorText_card1}>Discover and Contribute</span> to Communities </span>
        <img src={statcard_1.src} alt="" />
      </div>
      <div className={styles.statCard2}>
        <span className={styles.text2}>Earn tips for your <span className={styles.colorText_card2}>genuine reviews</span></span>
        <img src={statcard_2.src} alt="" />
      </div>
      <div className={styles.statCard3}>
        <span className={styles.text3}>100% fully <span className={styles.colorText_card3}>On-chain, Anonymous</span> and Gasless</span>
        <img src={statcard_3.src} alt="" />
      </div>
    </div>
  )
}

// COMMUNITY WALL
function CommunitiesWall({ daoList }) {

  const [selectedTab, setselectedTab] = useState('all');
  const [scrollPosDefault, setscrollPosDefault] = useState(false);

  const categoryTabsOnScroll = (e) => {
    const scrollPos = document.querySelector('#cat_container').scrollLeft
    if (scrollPos > 1) {
      setscrollPosDefault(true)
    }
    else {
      setscrollPosDefault(false);
    }
  }

  const scrolltoEnd = () => {
    // document.querySelector('#cat_container').scrollLeft = 99999;
    let rightArrow = document.querySelector('.' + styles.scrollEnd);
    let rightMarker = rightArrow.getBoundingClientRect().x;
    let list = document.querySelector('#cat_container').childNodes;
    let startingPoint;
    list = [...list].forEach((ele, idx) => {
      let x = ele.getBoundingClientRect().x;
      let delta = rightMarker - x;
      console.log(delta, ele.innerText)
      if (delta > 0) {
        startingPoint = ele;
      }
    })
    console.log(startingPoint.innerText);
    document.querySelector('#cat_container').scrollLeft = document.querySelector('#cat_container').scrollLeft + startingPoint.getBoundingClientRect().x;
  }

  const scrolltoStart = () => {
    document.querySelector('#cat_container').scrollLeft = 0;
    // let list = document.querySelector('#cat_container').childNodes;
    // console.log(list);
  }

  let categoryTabs = CATEGORY_LIST.map((ele, idx) => {
    if (daoList[ele].length <= 0) {
      return null
    }
    return (
      <button
        id={`t${idx}`}
        onClick={() => {
          setselectedTab(ele);
        }}
        className={(ele == selectedTab) ? styles.categoryTabSelected : styles.categoryTab} key={'cat' + idx}>
        {ele}
      </button>
    )
  })


  return (
    <div className={styles.wall_of_communties}>
      <h1 className={styles.sec_title}>Our Wall of Communities</h1>
      <div className={styles.categoryTabConWrapper}>
        <button className={styles.scrollStart} onClick={scrolltoStart} />
        <div id='cat_container' className={styles.categoryTabCon} onScroll={categoryTabsOnScroll}>
          {categoryTabs}
        </div>
        <button className={styles.scrollEnd} onClick={scrolltoEnd} />
      </div>
      <div className={styles.cardCon} key={selectedTab}>
        {
          daoList[selectedTab].map((ele, idx) => {
            return (
              <DAOCard key={'card' + idx} data={ele} />
            )
          })
        }
      </div>
      <Button label={"See More"} type={'secondary'} />
    </div>
  )
}

// LEADERBOARD COMPONENT

let StarRating = ({ rating, showCount, color, count }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.stars} style={(color == 'black') ? { filter: 'invert(1)' } : null}>
        {
          [1, 2, 3, 4, 5].map((ele) => {
            let starSrc = (ele <= rating) ? starFilled.src : starBlank.src
            return (
              <img alt='' key={'s' + ele} src={starSrc} />
            )
          })
        }
      </span>
      {(showCount) && <p className={styles.rating_count}>({count})</p>}
    </div>
  )
}

let Entry = ({ idx, data }) => {
  let medal_src;
  switch (idx) {
    case 1: { medal_src = gold_medal.src; break; }
    case 2: { medal_src = silver_medal.src; break; }
    case 3: { medal_src = bronze_medal.src; break; }
    default: { medal_src = blank_medal.src }
  }

  return (
    <>
      <ul className={styles.entry}>
        <li className={styles.c1}>
          <span>
            #{idx}
          </span>
          <img className={styles.medal} src={medal_src} alt="" />
        </li>
        <li className={styles.c2}>{data.dao_name}</li>
        <li className={styles.c3}><StarRating count={data.review_count} rating={data.average_rating} showCount={true} /></li>
        <li className={styles.c4}>
          <img src={twitter_w.src} alt="" onClick={() => {
            (data.twitter_link) && openNewTab(data.twitter_link)
          }} />
          <img src={discord_w.src} alt="" onClick={() => {
            (data.website_link) && openNewTab(data.discord_link)
          }} />
          <img src={web_w.src} alt="" onClick={() => {
            (data.website_link) && openNewTab(data.website_link)
          }} />
        </li>
      </ul>
      <span className={styles.divider} />
    </>
  )
}

function Leaderboard({ data }) {
  return (
    <div className={styles.leaderboard}>
      <h1 className={styles.leaderboard_title}>Community Leaderboard</h1>
      <ul className={styles.tableHead}>
        <li className={styles.th1}>Position</li>
        <li className={styles.th2}>Name of the DAO</li>
        <li className={styles.th3}>Ratings</li>
        <li className={styles.th4}>Socials</li>
      </ul>
      <div className={styles.leaderboard_entries}>
        {
          data.map((ele, idx) => {
            return (
              <Entry key={idx + 'l'} idx={idx + 1} data={ele} />
            )
          })
        }
      </div>
    </div>
  )
}

// MOBILE LEADERBOARD 

function Leaderboard_mobile_entry({ idx, data }) {
  let medal_src;
  switch (idx) {
    case 1: { medal_src = gold_medal.src; break; }
    case 2: { medal_src = silver_medal.src; break; }
    case 3: { medal_src = bronze_medal.src; break; }
    default: { medal_src = blank_medal.src }
  }
  return (
    <div className={styles.mobile_leaderboard_entry}>
      <span className={styles.medal}>
        <img src={medal_src} alt="" />
      </span>
      <span>
        <h1>{data.dao_name}</h1>
        <StarRating color={'white'} rating={data.average_rating} />
      </span>
      <div className={styles.socialIcons}>
        <img src={twitter_w.src} alt="" onClick={() => {
          (data.twitter_link) && openNewTab(data.twitter_link)
        }} />
        <img src={discord_w.src} alt="" onClick={() => {
          (data.website_link) && openNewTab(data.discord_link)
        }} />
        <img src={web_w.src} alt="" onClick={() => {
          (data.website_link) && openNewTab(data.website_link)
        }} />
      </div>
    </div>
  )
}

function Leaderboard_mobile({ data }) {
  return (
    <div className={styles.mobile_leaderboard_con}>
      <h1 className={styles.sec_title}>Community Leaderboard</h1>
      <div className={styles.leaderboard_list}>
        {data.map((ele, idx) => {
          return (<Leaderboard_mobile_entry data={ele} key={'ml' + idx} idx={idx + 1} />)
        }).slice(0, 5)
        }
      </div>
    </div>
  )
}

// RECENT REVIEWS

function RecentReview({ text, address, daoName, rating, i }) {
  var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  return (
    <div className={styles.recentReview}>
      <p className={styles.review_text}>{text.slice(0, 300)}...</p>
      <div className={styles.profile}>
        <span style={{ backgroundColor: `${colorArray[i]}` }} className={styles.profile_img}>

        </span>
        <span className={styles.info}>
          <h1>{address}</h1>
          <p>{daoName}</p>
          <StarRating rating={rating} color={'black'} />
        </span>
      </div>
    </div>
  )
}

function RecentReviewsSection() {

  const [motion, setmotion] = useState(true);

  useEffect(() => {
    setTimeout(() => { setmotion(false) }, 1000)
  }, [])

  useEffect(() => {
    let nodes = document.querySelectorAll(`.${styles.recentReview}`)
    nodes.forEach((node) => {
      node.style.animationPlayState = (motion) ? 'paused' : 'running';
    })
  }, [motion])

  return (
    <div className={styles.recentReviewsCon}>
      <h1 className={styles.sec_title}>Recent Reviews</h1>
      <div className={styles.reviewCon}
        onMouseEnter={() => {
          setmotion(true);
        }}
        onMouseLeave={() => {
          setmotion(false);
        }}
      >
        <div id={'slider1'} className={styles.row_review_1}>
          <RecentReview
            i={0}
            rating={5}
            address={'9GaUZ...tgcR'}
            daoName={'SuperteamDAO'}
            text={`I know of many a people are upskilling themselves using SuperteamDAO and all that is being put to great use. Such collaborative effort is super awesome! It adds so much value to the ecosystem and help people achieve their potential. This DAO is going to go places! ATB.`}
          />
          <RecentReview
            i={1}
            rating={5}
            address={'0x044...96C0'}
            daoName={'SuperteamDAO'}
            text={`If WAGMI had a DAO, it would in all probability be SuperteamDAO. Super stuff keeps happening here with mind-blowing opportunities that will take your Web3 game to the next LEVEL 🚀`}
          />
          <RecentReview
            i={7}
            rating={5}
            address={'0x30F...e805'}
            daoName={'SuperteamDAO'}
            text={`Superteam DAO is tight-knit and has a familial vibe to begin your bounty hunting journey in web 3. It's still evolving and getting better but given that these are early days for DAOs it's definitely setting up an edifice for the future. 
            Also, crazy memes and other stuff beyond web 3 on their discord. `}
          />
          <RecentReview
            i={13}
            rating={5}
            address={'0xA9f...ca30'}
            daoName={'SuperteamDAO'}
            text={`SuperTeamDAO helped me realize that there's more to the crypto space than just cryptocurrencies and shitcoins. The vibes are awesome and the people here just keep it up. They've helped me contribute to DAOs and explore more about web3`}
          />
          < RecentReview
            i={4}
            rating={5}
            address={'0xa30...5F94'}
            daoName={'SuperteamDAO'}
            text={`🚀Superteam DAO is one of my favorite DAO communities, built by crazy people to assist Web3 thrive all across the world, and to make Solana a global enabler for web3. Super cool folks are putting their support towards their super cool ideas.  I'm happy to be a part of it.... 🚀`}
          />
          < RecentReview
            i={12}
            rating={5}
            address={'0x38C...7347'}
            daoName={'SuperteamDAO'}
            text={`It is a very great community to get started in Crypto. Has very great onboarding experiences as well as amazing bounties as well as weekly meet to keep you intact and involved. Tons of side projects to choose from and get your Web3 journey on nitro mode!`}
          />
          < RecentReview
            i={6}
            rating={5}
            address={'0xC33...130E'}
            daoName={'SuperteamDAO'}
            text={`Superteam DAO is a super awesome community. Superteam folks are always buidling cool stuff for the Solana ecosystem. Everyone contribute their absolute best in every way possible. As a part of the community, I can guarantee a great potential to learn and explore the web3 ecosystem. Everyone right from writers, designers, creators, memers, devs are welcomed to contribute.`}
          />
          < RecentReview
            i={7}
            rating={10}
            address={'0x9Be...35dc'}
            daoName={'SuperteamDAO'}
            text={`Superteam is a community that helps and uplifts all it's members and solana ecosystem. They help you grow both financially and socially. It's not a DAO it's a place where you make friends for life. The best part is there's opportunity for people from all the areas be it dev, design, marketing, content or memes. Would definitely recommend everyone to have this super experience. WAGMI.`}
          />
          < RecentReview
            i={8}
            rating={5}
            address={'0x65e...f4b1'}
            daoName={'SuperteamDAO'}
            text={`SuperteamDAO is a crazy community, being build by crazy people, helping Web3 flourish alll around, making solana a global enabler for web3. Super cool floks backing super cool projects. Definitely community to be part off. 🚀🚀`}
          />
        </div>
        <div id={'slider2'} className={styles.row_review_2}>

          <RecentReview
            i={13}
            rating={5}
            address={'0xA9f...ca30'}
            daoName={'SuperteamDAO'}
            text={`SuperTeamDAO helped me realize that there's more to the crypto space than just cryptocurrencies and shitcoins. The vibes are awesome and the people here just keep it up. They've helped me contribute to DAOs and explore more about web3`}
          />
          < RecentReview
            i={4}
            rating={5}
            address={'0xa30...5F94'}
            daoName={'SuperteamDAO'}
            text={`🚀Superteam DAO is one of my favorite DAO communities, built by crazy people to assist Web3 thrive all across the world, and to make Solana a global enabler for web3. Super cool folks are putting their support towards their super cool ideas.  I'm happy to be a part of it.... 🚀`}
          />
          < RecentReview
            i={12}
            rating={5}
            address={'0x38C...7347'}
            daoName={'SuperteamDAO'}
            text={`It is a very great community to get started in Crypto. Has very great onboarding experiences as well as amazing bounties as well as weekly meet to keep you intact and involved. Tons of side projects to choose from and get your Web3 journey on nitro mode!`}
          />
          < RecentReview
            i={6}
            rating={5}
            address={'0xC33...130E'}
            daoName={'SuperteamDAO'}
            text={`Superteam DAO is a super awesome community. Superteam folks are always buidling cool stuff for the Solana ecosystem. Everyone contribute their absolute best in every way possible. As a part of the community, I can guarantee a great potential to learn and explore the web3 ecosystem. Everyone right from writers, designers, creators, memers, devs are welcomed to contribute.`}
          />
          < RecentReview
            i={7}
            rating={10}
            address={'0x9Be...35dc'}
            daoName={'SuperteamDAO'}
            text={`Superteam is a community that helps and uplifts all it's members and solana ecosystem. They help you grow both financially and socially. It's not a DAO it's a place where you make friends for life. The best part is there's opportunity for people from all the areas be it dev, design, marketing, content or memes. Would definitely recommend everyone to have this super experience. WAGMI.`}
          />
          < RecentReview
            i={8}
            rating={5}
            address={'0x65e...f4b1'}
            daoName={'SuperteamDAO'}
            text={`SuperteamDAO is a crazy community, being build by crazy people, helping Web3 flourish alll around, making solana a global enabler for web3. Super cool floks backing super cool projects. Definitely community to be part off. 🚀🚀`}
          />

          <RecentReview
            i={0}
            rating={5}
            address={'9GaUZ...tgcR'}
            daoName={'SuperteamDAO'}
            text={`I know of many a people are upskilling themselves using SuperteamDAO and all that is being put to great use. Such collaborative effort is super awesome! It adds so much value to the ecosystem and help people achieve their potential. This DAO is going to go places! ATB.`}
          />
          <RecentReview
            i={1}
            rating={5}
            address={'0x044...96C0'}
            daoName={'SuperteamDAO'}
            text={`If WAGMI had a DAO, it would in all probability be SuperteamDAO. Super stuff keeps happening here with mind-blowing opportunities that will take your Web3 game to the next LEVEL 🚀`}
          />
          <RecentReview
            i={7}
            rating={5}
            address={'0x30F...e805'}
            daoName={'SuperteamDAO'}
            text={`Superteam DAO is tight-knit and has a familial vibe to begin your bounty hunting journey in web 3. It's still evolving and getting better but given that these are early days for DAOs it's definitely setting up an edifice for the future. 
            Also, crazy memes and other stuff beyond web 3 on their discord. `}
          />

        </div>
      </div>
    </div>
  )
}

