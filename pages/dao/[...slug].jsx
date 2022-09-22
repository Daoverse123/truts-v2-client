import React, { useState, useEffect } from 'react'
import styles from '../dao/dao.module.scss'
import Footer from '../../components/Footer'
import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'

//utils
import openNewTab from '../../utils/openNewTab'

//components
import Button from '../../components/Button'
import Nav from '../../components/Nav'
import WalletConnect from '../../components/WalletConnect'
import TippingFlow from '../../components/TippingFlow'

//local components
import Sidebar from '../../components/dao_page/Sidebar'
import TabletSideBar from '../../components/dao_page/TabletSideBar'

//assets
import gradient_star_filled from '../../assets/icons/star_gradient.svg'
import gradient_star_blank from '../../assets/icons/star_gradient_blank.svg'
import down_arrow from '../../assets/icons/down_arrow.svg'
import thumbs_up from '../../assets/icons/thumbs_up.svg'
import thumbs_down from '../../assets/icons/thumbs_down.svg'
import share from '../../assets/icons/share_icon.svg'
import tip from '../../assets/icons/tip_icon.svg'
import loader from '../../assets/mini-loader.gif'

const API = process.env.API

function Dao({ dao_data, rid, slug }) {
    const [selected, setSelected] = useState('Reviews');
    //console.log(dao_data);
    const [walletConnectVisible, setwalletConnectVisible] = useState(false)
    const [tippingFlowVisible, settippingFlowVisible] = useState(false);
    const [review_details, setreview_details] = useState({ address: "", chain: "" })

    let tipReviewInfo = { review_details, setreview_details }

    return (
        <>
            <TippingFlow tipReviewInfo={tipReviewInfo} tippingFlowVisible={tippingFlowVisible} settippingFlowVisible={settippingFlowVisible} />
            <div className={styles.dao}>
                <Head>
                    <title>{dao_data.dao_name}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="preload" as="image" href="/verified.png"></link>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="description" content={dao_data.dao_mission || dao_data.description} />

                    {(rid.length > 0) && <><meta property="og:url" content={`https://www.truts.xyz/dao/${dao_data.slug}`} />
                        <meta property="og:type" content="website" />
                        <meta property="og:title" content={dao_data.dao_name} />
                        <meta property="og:description" content={dao_data.dao_mission || dao_data.description} />
                        <meta property="og:image" content={`https://www.truts.xyz/api/fetchcard?rid=${rid}`} />


                        <meta name="twitter:card" content="summary_large_image" />
                        <meta property="twitter:domain" content="truts.xyz" />
                        <meta property="twitter:url" content={`https://www.truts.xyz/dao/${dao_data.slug}`} />
                        <meta name="twitter:title" content={dao_data.dao_name} />
                        <meta name="twitter:description" content={dao_data.dao_mission || dao_data.description} />
                        <meta name="twitter:image" content={`https://www.truts.xyz/api/fetchcard?rid=${rid}`} /></>}

                    <script defer src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
                    <link href="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json" rel="preload"></link>
                    <link href="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json" rel="preload"></link>
                    <link href="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json" rel="preload"></link>
                </Head>
                <WalletConnect setwalletConnectVisible={setwalletConnectVisible} walletConnectVisible={walletConnectVisible} />

                <Nav isFloating />
                <InfoSec
                    dao_data={dao_data}
                />
                <NavSec selected={selected} setSelected={setSelected} />
                {(selected == "Reviews") && <div className={styles.content}>
                    <div className={styles.main}>
                        <TabletSideBar dao_data={dao_data} />
                        <ReviewsSec slug={slug} setreview_details={setreview_details} dao_data={dao_data} setwalletConnectVisible={setwalletConnectVisible} settippingFlowVisible={settippingFlowVisible} />
                    </div>
                    <Sidebar dao_data={dao_data} />

                </div>}
                {(selected == "Opportunites") && <div className={styles.content}>
                    <h1 className={styles.coming_soon}>Coming Soon..</h1>

                </div>}
                {(selected == "Insights") && <div className={styles.content}>

                    <h1 className={styles.coming_soon}>Coming Soon..</h1>
                </div>}
                <Footer />
            </div >
        </>
    )
}

const NavSec = ({ selected, setSelected }) => {
    return (
        <ul className={styles.navSec}>
            {
                [
                    'Reviews',
                    'Opportunites',
                    'Insights'
                ].map((ele, i) => {
                    return (
                        <li
                            className={(selected == ele) ? styles.selected : {}}
                            onClick={() => {
                                setSelected(ele)
                            }} key={ele + i}>{ele}</li>
                    )
                })
            }
        </ul>
    )
}

const InfoSec = ({ dao_data }) => {
    let { dao_name, review_count, dao_category, dao_cover, average_rating, slug } = dao_data

    let info = dao_data.description + '\n' + dao_data.dao_mission

    const [showmore, setshowmore] = useState(false);

    return (
        <div className={styles.infoSec}>
            <h1 className={styles.title}>{dao_name}</h1>
            <p style={{ whiteSpace: "pre-wrap" }} className={styles.desc}>{
                (info.length < 200) ? info : (showmore) ? info : info.slice(0, 218) + '...'
            }</p>
            {(info.length > 200) && <p className={styles.showmore} onClick={() => { setshowmore(!showmore) }} style={{ marginTop: '-10px', marginBottom: '12.35px' }}>{(showmore) ? "show less" : "read more"}</p>}
            <div className={styles.cta}>
                <span className={styles.reviewInfo}>
                    <span className={styles.ratingCon}>
                        <StarComp rating={average_rating} />
                        <p>{review_count} reviews</p>
                    </span>
                    <div className={styles.categoryCon}>
                        {
                            [...new Set(dao_category)].map((cat, idx) => {
                                return (
                                    <Link key={cat + idx} href={`/discover?category=${cat}`}>
                                        <span className={styles.category}>{cat}</span>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </span>
                <Button label={'Join Community'} onClick={() => { openNewTab(dao_data.discord_link) }} />
                <Button onClick={() => {
                    setCookie('target', slug)
                    window.location.href = `${API}/auth/discord`
                }} type={'secondary'} label={'Write a Review'} />
            </div>
            <img alt='' className={styles.cover} src={dao_cover} />
        </div >
    )
}

const StarComp = ({ rating, size }) => {
    let filter_style = styles.starComp;
    if (size == 's') {
        filter_style = styles.starComp + ' ' + styles.starComp_small
    }
    return (
        <span className={filter_style}>
            {
                [1, 2, 3, 4, 5].map((i) => {
                    if (i <= parseInt(rating)) {
                        return (
                            <img key={i} src={gradient_star_filled.src} alt="" />
                        )
                    }
                    else {
                        return (
                            <img key={i} src={gradient_star_blank.src} alt="" />
                        )
                    }
                })
            }
        </span>
    )
}


const Filter = ({ selectedFilter, setselectedFilter }) => {

    return (<span className={styles.filter}>
        {selectedFilter}
        <img src={down_arrow.src} alt="" />
        <ul className={styles.filterOptions}>
            <li onClick={() => {
                setselectedFilter('Newest')
            }}>Newest</li>
            <li onClick={() => {
                setselectedFilter('Oldest')
            }}>Oldest</li>
        </ul>
    </span>)
}

const ReviewsSec = ({ dao_data, setwalletConnectVisible, settippingFlowVisible, setreview_details, slug }) => {
    const [selectedFilter, setselectedFilter] = useState('Newest');
    return (
        <div className={styles.reviewSec}>
            {/* <div className={styles.info}>
                <h2>What is it?</h2>
                <p>{dao_data.dao_mission}</p>
                <p>{dao_data.description}</p>
            </div> */}
            <span className={styles.reviewFilter}>
                <Button onClick={() => {
                    setCookie('target', slug)
                    window.location.href = `${API}/auth/discord`
                }} label={"Write a Review"} type={"secondary"} />
                <Filter selectedFilter={selectedFilter} setselectedFilter={setselectedFilter} />
            </span>
            <div className={styles.reviewCon}>
                {(selectedFilter == 'Newest') ?
                    dao_data.reviews.map((review, idx) => {
                        return (
                            <ReviewComp setreview_details={setreview_details} settippingFlowVisible={settippingFlowVisible} setwalletConnectVisible={setwalletConnectVisible} review={review} key={'r' + idx} />
                        )
                    }).reverse() :
                    dao_data.reviews.map((review, idx) => {
                        return (
                            <ReviewComp setreview_details={setreview_details} settippingFlowVisible={settippingFlowVisible} setwalletConnectVisible={setwalletConnectVisible} review={review} key={'r' + idx} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const ReviewComp = ({ review, setwalletConnectVisible, settippingFlowVisible, setreview_details }) => {
    let min_public_address = review.public_address.slice(0, 5) + '....' + review.public_address.slice(-3)
    const [isreadMore, setisreadMore] = useState(false);

    const [thumbs_up_count, setthumbs_up_count] = useState(review.thumbs_up)
    const [thumbs_down_count, setthumbs_down_count] = useState(review.thumbs_down)

    const [rateReviewLoading, setrateReviewLoading] = useState(false);

    let isTextLarge = (review.review_desc.length >= 400)

    const getReviewDesc = () => {
        if (isTextLarge && !isreadMore) {
            return review.review_desc.slice(0, 400) + '...';
        }
        return review.review_desc
    }

    const rateReviewHandler = async (rating) => {
        let wallet_state = JSON.parse(localStorage.getItem('wallet_state'));
        if (!wallet_state.address) { return setwalletConnectVisible(true) }
        let address = wallet_state.address;
        setrateReviewLoading(true)
        let api_res = await axios.post(`${API}/review-v2/rate-review`, { review_id: review._id, address, rating })
        if (api_res.status != 200) { setrateReviewLoading(false); return null }

        let types = { NEW: "new", SWITCH: "switch", DELETE: "delete" }
        if (api_res.data.type == types.NEW) {
            //new rating
            if (api_res.data.rating) {
                setthumbs_up_count(c => c + 1)
            }
            else {
                setthumbs_down_count(c => c + 1)
            }
        }
        else if (api_res.data.type == types.DELETE) {
            //delete rating
            if (api_res.data.rating) {
                setthumbs_up_count(c => c - 1)
            }
            else {
                setthumbs_down_count(c => c - 1)
            }
        }
        else if (api_res.data.type == types.SWITCH) {
            //switch rating
            if (api_res.data.rating) {
                setthumbs_up_count(c => c + 1)
                setthumbs_down_count(c => c - 1)
            }
            else {
                setthumbs_down_count(c => c + 1)
                setthumbs_up_count(c => c - 1)
            }
        }
        setrateReviewLoading(false);
    }

    const intiateTip = () => {

        let chainMap = {
            'Ethereum': 'eth',
            'Solana': 'sol',
        }


        function inverse(obj) {
            var retobj = {};
            for (var key in obj) {
                retobj[obj[key]] = key;
            }
            return retobj;
        }


        setreview_details({ address: review.public_address, chain: review.chain });
        let wallet_state = JSON.parse(localStorage.getItem('wallet_state'));
        if (wallet_state) {

            let chain = review.chain || 'eth'
            if (chainMap[wallet_state.chain] != chain) {

                alert(`Current review can only be tipped via ${inverse(chainMap)[chain]} based Wallets \nPlease connect ${inverse(chainMap)[chain]} wallet to continue`)
                return setwalletConnectVisible(true);
            }

            settippingFlowVisible(true);
        }
        else {
            return setwalletConnectVisible(true);
        }
    }

    return (
        <>
            <div className={styles.reviewComp}>
                <div className={styles.userInfo}>
                    <span className={styles.profilePic} style={{ background: review.profile_img }} src={"https://pbs.twimg.com/profile_banners/1380589844838055937/1634756837/1500x500"} alt="" />
                    <span>
                        <p className={styles.address}>{min_public_address}</p>
                        <StarComp size={'s'} rating={review.rating} />
                    </span>
                </div>
                <div className={styles.review_desc}  >
                    {getReviewDesc()}
                </div>
                {(isTextLarge) && <p
                    onClick={() => { setisreadMore(!isreadMore) }}
                    className={styles.showmore}>
                    {(isreadMore) ? "show less" : "read more"}
                </p>}
                <div className={styles.bottom_nav}>
                    <span className={styles.iconText} onClick={() => { rateReviewHandler(true) }}>
                        <img src={rateReviewLoading ? loader.src : thumbs_up.src} alt="" />
                        <p>{thumbs_up_count}</p>
                    </span>
                    <span className={styles.iconText} onClick={() => { rateReviewHandler(false) }}>
                        <img src={rateReviewLoading ? loader.src : thumbs_down.src} alt="" />
                        <p>{thumbs_down_count}</p>
                    </span>
                    <span className={styles.iconText}  >
                        <img src={share.src} alt="" />
                        <p>share</p>
                    </span>
                    <span className={styles.iconText} onClick={intiateTip}>
                        <img src={tip.src} alt="" />
                        {/* <p>$400</p> */}
                    </span>
                </div>
                <span className={styles.divider} />
            </div>
        </>
    )
}

function setCookie(name, value) {
    let days = 1;
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
    let { slug } = ctx.query
    // Fetch data from external API
    if (!slug) return null
    let res = await fetchData(slug[0])
    let rid = slug[1] || '';
    // Pass data to the page via props

    let reviews = res.reviews.map((ele) => {
        return { ...ele, profile_img: newGradient() }
    })

    return { props: { dao_data: { ...res, reviews }, rid: rid, slug: slug[0] } }
}

const fetchData = async (slug) => {
    console.log('slug :', slug);
    try {
        const res = await axios.get(`${API}/dao/get-dao-by-slug?slug=${slug}`)
        if (res.data.status) {
            return JSON.parse(JSON.stringify(res.data.data))
        }
        else {
            alert("DAO NOT FOUND");
        }
    }
    catch (er) {
        console.log(er);
    }
    return null
}


function newGradient() {
    var c1 = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
    var c2 = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
    c1.rgb = 'rgb(' + c1.r + ',' + c1.g + ',' + c1.b + ')';
    c2.rgb = 'rgb(' + c2.r + ',' + c2.g + ',' + c2.b + ')';
    return 'radial-gradient(at top left, ' + c1.rgb + ', ' + c2.rgb + ')';
}


export default Dao