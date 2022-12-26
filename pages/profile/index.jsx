import React, { useState, useEffect } from 'react'
import styles from './profile.module.scss'
import ReactTooltip from 'react-tooltip';
import chainIconMap from '../../components/chainIconMap.json'
import WalletConnect_v3 from '../../components/WalletConnect_v3'

//components
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import DAOCard from '../../components/DAOCard';

//assets
import discord_icon from '../../assets/icons/twitter_white.svg'
import twitter_icon from '../../assets/icons/discord_white.svg'
import downArrow from '../../assets/icons/down_arrow.svg'
import eth_icon from '../../assets/icons/eth-icon.png'
import gradient_star_filled from '../../assets/icons/star_gradient.svg'
import gradient_star_blank from '../../assets/icons/star_gradient_blank.svg'
import down_arrow from '../../assets/icons/down_arrow.svg'
import thumbs_up from '../../assets/icons/thumbs_up.svg'
import thumbs_down from '../../assets/icons/thumbs_down.svg'
import share from '../../assets/icons/share_icon.svg'
import tip from '../../assets/icons/tip_icon.svg'
import loader from '../../assets/mini-loader.gif'
import twitter_blue from '../../assets/icons/twitter_icon_blue.png'
import axios from 'axios';
import Link from 'next/link';


let Placeholder = "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";
const NavSec = ({ selected, setSelected }) => {
    //'Contributions'
    // 'Token/NFTs'
    return (
        <ul className={styles.navSec}>
            {
                [
                    'Communities',
                    'Reviews',
                    'Xp',
                    'Token/NFTs'
                ].map((ele, i) => {
                    return (
                        <li
                            className={(selected == ele) ? styles.selected : null}
                            onClick={() => {
                                setSelected(ele)
                            }} key={ele + i}>{<p>{ele}</p>}</li>
                    )
                })
            }
        </ul>
    )
}

const P_API = process.env.P_API;

const fetchWalletAssets = async (data, setter) => {
    let key = data.user.wallets.address
    let [tokenData, nftData] = await Promise.all([axios.get(`api/get-chain-assets?key=${key}&type=token`), axios.get(`api/get-chain-assets?key=${key}&type=nft`)]);
    console.log(nftData)
    setter((data) => {
        return {
            ...data, tokenData: tokenData.data.assets, nftData: nftData.data.assets
        }
    })

}

const fetchUserData = async (setter) => {
    let option = {
        headers: {
            "Authorization": window.localStorage.getItem('token')
        }
    };

    let user_data = await Promise.all(
        [
            axios.get(`${P_API}/user`, option),
            axios.get(`${P_API}/user/reviews`, option),
            axios.get(`${P_API}/user/guilds`, option),
        ]
    )

    if (user_data[0].status == 200) {
        setter(user_data[0].data.data.user);

        fetchWalletAssets(user_data[0].data.data, setter);

    } else {
        alert("Auth error")
    }

    if (user_data[1].status == 200) {
        setter((data) => {
            return { ...data, reviews: user_data[1].data.data.reviews }
        });
    } else {
        alert("Auth error")
    }

    if (user_data[2].status == 200) {
        setter((data) => {
            return { ...data, daos: user_data[2].data.data.listings }
        });
    } else {
        alert("Auth error")
    }
}



function Profile() {
    const [selectedNav, setSelectedNav] = useState('Reviews');
    const [userData, setuserData] = useState({});

    useEffect(() => {
        fetchUserData(setuserData)
    }, [])

    console.log(userData);

    return (
        <>
            <ReactTooltip backgroundColor={"#747c90"} />
            {/* <OnBoardForm /> */}
            <Nav isStrech={true} isFloating />
            {/* <ProfileLogin /> */}
            <div className={styles.profilePage}>
                <div className={styles.profileHeader}>
                    <img className={styles.profileImg} src={userData.photo?.secure_url || '/profile.png'} alt="" />
                    <div className={styles.data}>
                        <span className={styles.xpLevel}>
                            <span className={styles.levelCount}>
                                <h3>Level 15</h3>
                                <p>500 to next XP</p>
                            </span>
                            <div className={styles.progressBard}>
                                <span></span>
                            </div>
                        </span>
                        <h1 className={styles.name}>{userData.name || (('wallets' in userData) ? minimizeWallet(userData.wallets.address) : 'Username')}</h1>
                        {
                            (userData.bio) ? <p className={styles.bio}>{userData.bio}</p> :
                                <p style={{ color: "grey" }} className={styles.bio}>Write a amazing bio introducing
                                    yourself.....</p>
                        }
                        <div className={styles.tabs}>
                            {
                                ('tags' in userData && userData.tags.length > 0) ? userData.tags.map((tgs) => {
                                    return (
                                        <div key={"id" + tgs?.name} className={styles.tab}>
                                            {tgs?.name}
                                        </div>
                                    )
                                }) : <div style={{ opacity: 0.6 }} className={styles.tab}>
                                    {"Add Tags"}
                                </div>
                            }

                        </div>
                        <div className={styles.walletTabs}>
                            {('wallets' in userData) ? <div onClick={() => { copyToClipBoard(userData.wallets.address) }} id='w1' data-tip="Copy Address" style={{ background: chainIconMap['ethereum'].color, borderColor: chainIconMap['ethereum'].color }} className={styles.tab}>
                                <img src={chainIconMap['ethereum'].icon} alt="" />
                                {minimizeWallet(userData.wallets.address)}
                                <ReactTooltip backgroundColor={"#747c90"} />
                            </div> : <div onClick={() => { copyToClipBoard("sample address") }} id='w1' data-tip="Copy Address" style={{ background: chainIconMap['ethereum'].color, borderColor: chainIconMap['ethereum'].color }} className={styles.tab}>
                                <img src={chainIconMap['ethereum'].icon} alt="" />
                                Wallet Address
                                <ReactTooltip backgroundColor={"#747c90"} />
                            </div>}
                        </div>
                    </div>

                    <div className={styles.socialIcon}>
                        <img src={twitter_icon.src} alt="" />
                        <img src={discord_icon.src} alt="" />
                    </div>

                </div>
                <NavSec selected={selectedNav} setSelected={setSelectedNav} />

                {('discord' in userData) ? <>
                    {(selectedNav == 'Communities') && <Communites_temp {...{ userData }} />}
                    {(selectedNav == 'Xp') && <Xp />}
                    {(selectedNav == 'Reviews') && <Reviews {...{ userData }} />}
                    {(selectedNav == 'Token/NFTs') && <TokenNftCon {...{ userData }} />}
                </>
                    : <div className={styles.completeProfilePrompt}>
                        <span>
                            <h1>We would love to know about the communities that you’re part of. </h1>
                            <p>Please complete your user profile to view your community data</p>
                        </span>
                        <Link href={'/edit-profile'}>
                            <button>Complete Profile</button>
                        </Link>
                    </div>}
            </div>
            <Footer />
        </>
    )
}

const minimizeWallet = (wt) => {
    return wt.slice(0, 5) + '...' + wt.slice(-5)
}

const Reviews = ({ userData }) => {
    return (
        <>
            {/* <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Last Review On</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>12.07</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Total No. of Reviews</h3>
                    <p>till Date</p>
                    <h1>128</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>Updated 1m ago</p>
                    <h1>XYZ</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>Updated 1m ago</p>
                    <h1>XYZ</h1>
                </div>
            </div> */}
            <div className={styles.reviewCon}>
                {
                    ('reviews' in userData) && userData.reviews.map((ele, idx) => {
                        return (
                            <ReviewComp userData={userData} key={'re' + idx} data={ele} />
                        )
                    })
                }
            </div>
        </>
    )
}

const ReviewComp = ({ data, userData }) => {
    let dao_name = data.listing.name;
    let review = data.content;
    let rating = data.rating;
    return (
        <>
            <div className={styles.reviewComp}>
                <div className={styles.userInfo}>
                    <img className={styles.profilePic} src={userData.photo?.secure_url || '/profile.png'} alt="" />
                    <span>
                        <p className={styles.address}>{dao_name}</p>
                        <StarComp size={'s'} rating={rating} />
                    </span>
                </div>
                <div className={styles.review_desc}  >
                    {review}
                </div>
                {/* {(isTextLarge) && <p

                    className={styles.showmore}>
                    {(isreadMore) ? "show less" : "read more"}
                </p>} */}
                <div className={styles.bottom_nav}>
                    <span className={styles.iconText} >
                        <img src={thumbs_up.src} alt="" />
                        <p>{5}</p>
                    </span>
                    <span className={styles.iconText} >
                        <img src={thumbs_down.src} alt="" />
                        <p>{6}</p>
                    </span>
                    <span className={styles.iconText}  >
                        <img src={share.src} alt="" />
                        <p>share</p>
                    </span>
                    <span className={styles.iconText} >
                        <img src={tip.src} alt="" />
                        {/* <p>$400</p> */}
                    </span>
                </div>
                <span className={styles.divider} />
            </div>
        </>
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

const Communites_temp = ({ userData }) => {
    return (
        <div className={styles.communities_list}>
            {userData.daos.map((ele, idx) => {
                let data = {
                    dao_name: ele?.name,
                    twitter_link: ele?.twitter.link,
                    twitter_followers: ele?.twitter.count,
                    discord_link: ele?.discord.link,
                    discord_members: ele?.discord.count,
                    average_rating: ele?.ratings.average,
                    review_count: ele?.ratings.count,
                    slug: ele.slug,
                    dao_cover: ele?.image.cover.url,
                    website_link: ele?.website,
                }
                return (
                    <DAOCard key={"d" + idx} data={data} />
                )
            })}
        </div>
    )
}

const Communities = () => {
    return (
        <>
            <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Avg Attendence Score</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>82.33</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Total No. of Communites</h3>
                    <p>till Date</p>
                    <h1>128</h1>
                </div>
                <div style={{ width: "fit-content" }} className={styles.stat}>
                    <h3>Your Most Active Community</h3>
                    <p>Updated 1m ago</p>
                    <h1>Bankless</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>till Date</p>
                    <h1>82.33</h1>
                </div>
            </div>

            <div className={styles.list_communities_desktop}>
                <h1 className={styles.title}>List of Communities</h1>
                <span className={styles.tableHead}>
                    <p className={styles.name}>Name</p>
                    <p className={styles.joined}>Joined on</p>
                    <p className={styles.score}>Attendence Score</p>
                    <p className={styles.friends}>Your friends</p>
                </span>
                <div className={styles.table}>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}><img src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />Bankless</p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-10 * 3}px)` }} src={Placeholder} alt="" />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>+4 others</span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                </div>
            </div>
            <div className={styles.list_communities_mobile}>
                <h1 className={styles.title}>List of Communities</h1>
                <span className={styles.daoListCon}>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 3}px)` }} src={Placeholder} alt="" />
                            <span className={styles.text} style={{ transform: `translateX(${-4 * 2.5}px)`, width: "max-content" }}>+4 others</span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 3}px)` }} src={Placeholder} alt="" />
                            <span className={styles.text} style={{ transform: `translateX(${-4 * 2.5}px)`, width: "max-content" }}>+4 others</span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 3}px)` }} src={Placeholder} alt="" />
                            <span className={styles.text} style={{ transform: `translateX(${-4 * 2.5}px)`, width: "max-content" }}>+4 others</span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 3}px)` }} src={Placeholder} alt="" />
                            <span className={styles.text} style={{ transform: `translateX(${-4 * 2.5}px)`, width: "max-content" }}>+4 others</span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 1}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 2}px)` }} src={Placeholder} alt="" />
                            <img className={styles.friendImg} style={{ transform: `translateX(${-4 * 3}px)` }} src={Placeholder} alt="" />
                            <span className={styles.text} style={{ transform: `translateX(${-4 * 2.5}px)`, width: "max-content" }}>+4 others</span>
                        </span>
                    </div>
                </span>
            </div>
        </>
    )
}

const TokenNftCon = ({ userData }) => {
    const [selectedTab, setselectedTab] = useState('NFTS')
    console.log(selectedTab)


    return (
        <>
            <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Value of Assets</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>$3.4K</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Avg Floor Price</h3>
                    <p>for all NFTs</p>
                    <h1>1.2ETH</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Most Precious NFT</h3>
                    <p>till date</p>
                    <h1>BAYC</h1>
                </div>
                <div className={styles.stat}>
                    <h3>No. of NFTs</h3>
                    <p>Updated 1m ago</p>
                    <h1>46</h1>
                </div>
            </div>
            <section className={styles.tokenNftSec}>
                <div className={styles.tokenSwitch}>
                    <button onClick={() => { setselectedTab('NFTS') }} className={(selectedTab == 'NFTS') ? styles.btnSwitchSelected : styles.btnSwitch}>NFTs</button>
                    <button onClick={() => { setselectedTab('TOKENS') }} className={(selectedTab == 'TOKENS') ? styles.btnSwitchSelected : styles.btnSwitch}>Tokens</button>
                </div>
                {(selectedTab == 'NFTS') && <Nfts userData={userData} />}
                {(selectedTab == 'TOKENS') && <Tokens userData={userData} />}
            </section>
        </>
    )
}

const Nfts = ({ userData }) => {
    const Nft = ({ data }) => {
        return (
            <div className={styles.nftCon}>
                <img src={data.tokenImage || '/grad.jpg'} className={styles.cover} alt='' />
                <div className={styles.info}>
                    <h3>{limit(25, data.title)}</h3>
                    <p>Last Price</p>
                    <span className={styles.price}>
                        <img src={eth_icon.src} alt="" />
                        <h4>10.01</h4>
                    </span>
                </div>
            </div >
        )
    }

    return (
        <>
            <div className={styles.nfts}>
                {
                    ('nftData' in userData) && userData.nftData.map((ele, idx) => {
                        return (
                            <Nft key={"nft" + idx} data={ele} />
                        )
                    })
                }
            </div>
        </>
    )
}

let limit = (lt, name) => {
    if (name?.length > lt) {
        return name.slice(0, lt) + '...'
    }
    return (name)
}

const Tokens = ({ userData }) => {

    const Token = ({ data }) => {
        return (
            <div className={styles.token}>
                <img className={styles.tokenLogo} src={data.logo || '/blue.png'} alt="" />
                <span className={styles.topLine}>
                    <span className={styles.tokenName}>{limit(10, data.symbol)} <p>{limit(10, data.name)}</p></span>
                    <h3>$1,238</h3>
                </span>
                <span className={styles.bottomLine}>
                    <p>$36,500</p>
                    <p>0.05</p>
                </span>
            </div>
        )
    }

    // logo : "https://static.alchemyapi.io/images/assets/5617.png"
    // name :"UMA"
    // symbol :"UMA"
    // tokenAddress :"0x04fa0d235c4abf4bcf4787af4cf447de572ef828"
    // tokenBalance :628.3984457034

    return (
        <>
            <div className={styles.tokens}>
                {
                    ('tokenData' in userData) && userData.tokenData.map((ele, id) => {
                        return (
                            <Token key={"tkn" + id} data={ele} />
                        )
                    })
                }
            </div>
        </>
    )
}

const Xp = () => {
    const [selectedTab, setselectedTab] = useState('COMPLETED')
    console.log(selectedTab)

    const XpChip = ({ status }) => {
        return (
            <div className={styles.xpChipWrapper}>
                <div className={styles.xpChip}>
                    <img src={twitter_blue.src} alt="" />
                    <span>
                        <h1>Connect your twitter<span>Task Owner</span> </h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </span>
                    <button>300 XP</button>
                </div>
                {(status) && <span className={styles.status}>
                    <div className={styles.progress}>
                        <span className={styles.progressInner}></span>
                    </div>
                    <p>60% Completed</p>
                </span>}
            </div>
        )
    }

    return (
        <section className={styles.XpSec}>
            <div className={styles.tokenSwitch}>
                <button onClick={() => { setselectedTab('COMPLETED') }} className={(selectedTab == 'COMPLETED') ? styles.btnSwitchSelected : styles.btnSwitch}>Completed</button>
                <button onClick={() => { setselectedTab('ACTIVE') }} className={(selectedTab == 'ACTIVE') ? styles.btnSwitchSelected : styles.btnSwitch}>Active Tasks</button>
            </div>
            {
                (selectedTab == 'COMPLETED') &&
                <div className={styles.xpChipCon}>
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                    <XpChip />
                </div>

            }
            {
                (selectedTab == 'ACTIVE') &&
                <div className={styles.xpChipCon}>
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                    <XpChip status={true} />
                </div>

            }
        </section>
    )
}


const copyToClipBoard = (txt) => {
    navigator.clipboard.writeText(txt);
}


const OnBoardForm = () => {
    return (
        <div className={styles.onBoardingFlow}>
            <div className={styles.onBoardingForm}>
                <div className={styles.progressHeader}>
                    <div className={styles.title}>
                        <h1>Your Profile</h1>
                        <p>Complete every details on your profile to earn XP points</p>
                    </div>
                    <div className={styles.xpCon}>
                        <span className={styles.xpIcon}>
                            <img src="/xpCoin.png" alt="" />
                            <p>100 XP</p>
                        </span>
                        <p>Earned so far</p>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressInner}>
                        </div>
                    </div>
                </div>
                <div className={styles.formContent}>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Profile Picture</h1>
                        </span>
                        <span className={styles.iconXp}>
                            <img src="/xpCoin.png" alt="" />
                            <p>50</p>
                        </span>
                    </div>
                    <img className={styles.profilePicture} src="/grad.jpg" alt="" />
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>TrutsID</h1>
                            <p>Your ENS/Primary Wallet address also serves as Truts ID</p>
                        </span>
                        <span className={styles.iconXp}>
                            <img src="/xpCoin.png" alt="" />
                            <p>50</p>
                        </span>
                    </div>
                    <div className={styles.walletSec}>
                        <span className={styles.walletChip}>
                            <p>xefd....3tf23</p>
                            <img src="/close-icon.png" alt="" />
                        </span>
                        <span className={styles.walletChip}>
                            <p>xefd....3tf23</p>
                            <img src="/close-icon.png" alt="" />
                        </span>
                        <span className={styles.walletChipAdd}>
                            <p>Add more Wallet</p>
                            <img src="/add-icon.png" alt="" />
                        </span>
                    </div>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Bio</h1>
                        </span>
                    </div>
                    <textarea className={styles.bioInput}>

                    </textarea>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Socials</h1>
                            <p>Connect all your socials to earn XP points</p>
                        </span>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Twitter</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Discord</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Email</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Tags</h1>
                            <p>Select tags that describes you</p>
                        </span>
                    </div>
                    <div className={styles.tagsCon}>
                        <div className={styles.selectedChips}>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                        </div>
                        <div className={styles.chipOptions}>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Profile           