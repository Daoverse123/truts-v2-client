import React, { useState, useEffect } from 'react'
import styles from '../dao/dao.module.scss'
import Footer from '../../components/Footer'
import axios from 'axios'
//components
import Button from '../../components/Button'
import Nav from '../../components/Nav'
import WalletConnect from '../../components/WalletConnect'
//assets
import gradient_star_filled from '../../assets/icons/star_gradient.svg'
import gradient_star_blank from '../../assets/icons/star_gradient_blank.svg'
import discord_white from '../../assets/icons/twitter_white.svg'
import twitter_white from '../../assets/icons/discord_white.svg'
import copy_icon from '../../assets/icons/copy_icon.svg'
import eth_chain_icon from '../../assets/icons/eth_chain_icon.svg'
import sol_chain_icon from '../../assets/icons/sol_chain_icon.svg'
import down_arrow from '../../assets/icons/down_arrow.svg'
import thumbs_up from '../../assets/icons/thumbs_up.svg'
import thumbs_down from '../../assets/icons/thumbs_down.svg'
import share from '../../assets/icons/share_icon.svg'
import tip from '../../assets/icons/tip_icon.svg'
import globe_white from '../../assets/icons/web_white.svg'

const API = process.env.API

function Dao({ dao_data, rid, slug }) {
    const [selected, setSelected] = useState('Reviews');
    //console.log(dao_data);

    return (
        <div className={styles.dao}>
            <Nav isFloating />
            <InfoSec
                dao_data={dao_data}
            />
            <NavSec selected={selected} setSelected={setSelected} />
            <div className={styles.content}>
                <div className={styles.main}>
                    <TabletSideBar dao_data={dao_data} />
                    <ReviewsSec dao_data={dao_data} />
                </div>
                <Sidebar dao_data={dao_data} />
            </div>
            <Footer />
        </div >
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
            <p className={styles.showmore} onClick={() => { setshowmore(!showmore) }} style={{ marginTop: '-10px', marginBottom: '12.35px' }}>{(showmore) ? "show less" : "read more"}</p>
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
                                    <span key={cat + idx} className={styles.category}>{cat}</span>
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

const TabletSideBar = ({ dao_data }) => {

    let key_label_map = {
        'Community Vibes': 'resonate_vibes_rate',
        'Onboarding Experience': 'onboarding_exp',
        'Having a Voice': 'opinions_matter',
        'Organizational Structure': 'great_org_structure',
        'Recommendation to a friend': 'friend_recommend',
        'Incentives for Members': 'great_incentives',
    }

    const getAverageRating = (key) => {
        let avg = 50;
        let sum = 0;
        let list = dao_data?.reviews;
        if (list?.length > 0) {
            list.forEach((ele) => {
                sum = sum + ele[key];
            })
            avg = Math.ceil(sum / list.length);
        }
        return avg;
    }

    let DialComp = ({ label }) => {
        const [range, setrange] = useState(0);

        useEffect(() => {
            setrange((((parseFloat(50) / 10) * 2) * 100));
        }, [])

        return (
            <div className={styles.dialCon}>
                <p className={styles.label}>{label}</p>
                <span className={styles.barCon}>
                    <span className={styles.bar}>
                        <div style={{ width: `${getAverageRating(key_label_map[label])}%` }} className={styles.range}></div>
                    </span>
                    <p>{((getAverageRating(key_label_map[label]) / 10))}</p>
                </span>
            </div>
        )
    }


    return (
        <div className={styles.tabletSideBar}>
            <div className={styles.btn_row}>
                <button onClick={() => {
                    openNewTab(dao_data.twitter_link)
                }} className={styles.soc_btn} style={{ background: '#1DA1F2' }}>
                    <img src={twitter_white.src} alt="" />
                    {numFormatter(dao_data.twitter_followers)}
                </button>
                <button onClick={() => {
                    openNewTab(dao_data.discord_link)
                }} className={styles.soc_btn} style={{ background: '#4962FE' }}>
                    <img src={discord_white.src} alt="" />
                    {numFormatter(dao_data.discord_members)}
                </button>
                <button onClick={() => {
                    openNewTab(dao_data.website_link)
                }} className={styles.soc_btn} style={{ background: '#121212' }}>
                    <img style={{ marginRight: '0' }} src={globe_white.src} alt="" />
                </button>
            </div>
            <div className={styles.tablet_dial_sec}>
                <div className={styles.chain_row}>
                    <p>Chain</p>
                    <span>
                        <img src={eth_chain_icon.src} alt="" />
                        <img src={sol_chain_icon.src} alt="" />
                    </span>
                </div>
                <div className={styles.dialSectablet}>
                    <span>
                        <DialComp label={"Community Vibes"} />
                        <DialComp label={"Onboarding Experience"} />
                        <DialComp label={"Organizational Structure"} />
                    </span>
                    <span>
                        <DialComp label={"Incentives for Members"} />
                        <DialComp label={"Having a Voice"} />
                        <DialComp label={"Recommendation to a friend"} />
                    </span>
                </div>
            </div>
        </div>
    )
}

const Sidebar = ({ dao_data }) => {

    let key_label_map = {
        'Community Vibes': 'resonate_vibes_rate',
        'Onboarding Experience': 'onboarding_exp',
        'Having a Voice': 'opinions_matter',
        'Organizational Structure': 'great_org_structure',
        'Recommendation to a friend': 'friend_recommend',
        'Incentives for Members': 'great_incentives',
    }

    const getAverageRating = (key) => {
        let avg = 50;
        let sum = 0;
        let list = dao_data?.reviews;
        if (list?.length > 0) {
            list.forEach((ele) => {
                sum = sum + ele[key];
            })
            avg = Math.ceil(sum / list.length);
        }
        return avg;
    }


    let DialComp = ({ label }) => {
        const [range, setrange] = useState(0);

        useEffect(() => {
            setrange((((parseFloat(50) / 10) * 2) * 100));
        }, [])

        return (
            <div className={styles.dialCon}>
                <p className={styles.label}>{label}</p>
                <span className={styles.barCon}>
                    <span className={styles.bar}>
                        <div style={{ width: `${getAverageRating(key_label_map[label])}%` }} className={styles.range}></div>
                    </span>
                    <p>{((getAverageRating(key_label_map[label]) / 10))}</p>
                </span>
            </div>
        )
    }


    return (
        <div className={styles.sidebar}>
            <div className={styles.socials}>
                <button className={styles.twitter_soc} onClick={() => {
                    openNewTab(dao_data.twitter_link)
                }}>
                    <img src={twitter_white.src} alt="" />
                    {numFormatter(dao_data.twitter_followers)}
                </button>
                <button className={styles.discord_soc} onClick={() => {
                    openNewTab(dao_data.discord_link)
                }}>
                    <img src={discord_white.src} alt="" />
                    {numFormatter(dao_data.discord_members)}
                </button>
                <button onClick={() => {
                    navigator.clipboard.writeText(`https://www.truts.xyz/dao/${dao_data.slug}`);
                }} className={styles.long_btn} style={{ gridArea: "c" }}>
                    trust.xyz/dao/{dao_data.slug}
                    <img style={{ filter: "invert(0 )" }} src={copy_icon.src} alt="" />
                </button>
            </div>
            <span className={styles.chain_con}>
                <p>Chain</p>
                <span className={styles.chain_icons}>
                    <img src={eth_chain_icon.src} alt="" />
                    <img src={sol_chain_icon.src} alt="" />
                </span>
            </span>
            <div className={styles.dialSec}>
                <DialComp label={"Community Vibes"} />
                <DialComp label={"Onboarding Experience"} />
                <DialComp label={"Organizational Structure"} />
                <DialComp label={"Incentives for Members"} />
                <DialComp label={"Having a Voice"} />
                <DialComp label={"Recommendation to a friend"} />
            </div>

        </div>
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

const ReviewsSec = ({ dao_data }) => {
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
                            <ReviewComp review={review} key={'r' + idx} />
                        )
                    }) :
                    dao_data.reviews.map((review, idx) => {
                        return (
                            <ReviewComp review={review} key={'r' + idx} />
                        )
                    }).reverse()
                }
            </div>
        </div>
    )
}

const ReviewComp = ({ review }) => {
    let min_public_address = review.public_address.slice(0, 5) + '....' + review.public_address.slice(-3)

    const [isLonger, setisLonger] = useState(false)
    const [showMore, setshowMore] = useState(false)


    useEffect(() => {
        if (review.review_desc.length > 450) {
            setisLonger(true);
        }
    }, [])


    return (
        <div className={styles.reviewComp}>
            <div className={styles.userInfo}>
                <span className={styles.profilePic} style={{ background: review.profile_img }} src={"https://pbs.twimg.com/profile_banners/1380589844838055937/1634756837/1500x500"} alt="" />
                <span>
                    <p className={styles.address}>{min_public_address}</p>
                    <StarComp size={'s'} rating={review.rating} />
                </span>
            </div>
            <div className={styles.review_desc} >
                {
                    (showMore) ?
                        review.review_desc
                        :
                        review.review_desc.slice(0, 450) + (review.review_desc.length > 450 ? '...' : '')
                }
            </div>
            {(isLonger) && <p onClick={() => {
                setshowMore(!showMore)
            }}
                className={styles.showmore}>
                {(showMore) ? "show less" : "read more"}
            </p>}
            <div className={styles.bottom_nav}>
                <span className={styles.iconText}>
                    <img src={thumbs_up.src} alt="" />
                    <p>{review.thumbs_up}</p>
                </span>
                <span className={styles.iconText}>
                    <img src={thumbs_down.src} alt="" />
                    <p>{review.thumbs_down}</p>
                </span>
                <span className={styles.iconText}>
                    <img src={share.src} alt="" />
                    <p>share</p>
                </span>
                <span className={styles.iconText}>
                    <img src={tip.src} alt="" />
                    {/* <p>$400</p> */}
                </span>
            </div>
            <span className={styles.divider} />
        </div>
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

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num <= 999) {
        return num; // if value < 1000, nothing to do
    }
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

const openNewTab = (url) => {
    if (url.length < 1) return
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = url;
    a.click();
}

export default Dao