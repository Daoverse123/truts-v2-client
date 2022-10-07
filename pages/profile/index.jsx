import React, { useState } from 'react'
import styles from './profile.module.scss'
import ReactTooltip from 'react-tooltip';
import chainIconMap from '../../components/chainIconMap.json'

//assets
import discord_icon from '../../assets/icons/twitter_white.svg'
import twitter_icon from '../../assets/icons/discord_white.svg'
import downArrow from '../../assets/icons/down_arrow.svg'

//components
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

//
import gradient_star_filled from '../../assets/icons/star_gradient.svg'
import gradient_star_blank from '../../assets/icons/star_gradient_blank.svg'
import down_arrow from '../../assets/icons/down_arrow.svg'
import thumbs_up from '../../assets/icons/thumbs_up.svg'
import thumbs_down from '../../assets/icons/thumbs_down.svg'
import share from '../../assets/icons/share_icon.svg'
import tip from '../../assets/icons/tip_icon.svg'
import loader from '../../assets/mini-loader.gif'


let Placeholder = "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";
const NavSec = ({ selected, setSelected }) => {
    //'Contributions'
    // 'Token/NFTs'
    return (
        <ul className={styles.navSec}>
            {
                [
                    'Communities',
                    'Reviews'
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
function Profile() {
    const [selectedNav, setSelectedNav] = useState('Reviews');
    return (
        <>
            <ReactTooltip backgroundColor={"#747c90"} />
            <Nav isStrech={true} isFloating />
            <div className={styles.profilePage}>
                <div className={styles.profileHeader}>
                    <img className={styles.profileImg} src={Placeholder} alt="" />
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
                        <h1 className={styles.name}>darkjedi.eth</h1>
                        <p className={styles.bio}>Risus cursus faucibus blandit malesuada convallis dignissim sed tincidunt. Sit integer viverra rutrum arcu sit feugiat. Risus cursus</p>
                        <div className={styles.tabs}>
                            <div className={styles.tab}>
                                Product Designer
                            </div>
                            <div className={styles.tab}>
                                Product Designer
                            </div>
                            <div className={styles.tab}>
                                Product Designer
                            </div>
                        </div>
                        <div className={styles.walletTabs}>
                            <div onClick={() => { copyToClipBoard("sample address") }} id='w1' data-tip="Copy Address" style={{ background: chainIconMap['ethereum'].color, borderColor: chainIconMap['ethereum'].color }} className={styles.tab}>
                                <img src={chainIconMap['ethereum'].icon} alt="" />
                                0xe4....cfe
                                <ReactTooltip backgroundColor={"#747c90"} />
                            </div>
                            <div onClick={() => { copyToClipBoard("sample address") }} id='w2' data-tip="Copy Address" style={{ background: chainIconMap['solana'].color, borderColor: chainIconMap['solana'].color }} className={styles.tab}>
                                <img src={chainIconMap['solana'].icon} alt="" />
                                0xe4....cfe
                                <ReactTooltip backgroundColor={"#747c90"} />
                            </div>
                            <div onClick={() => { copyToClipBoard("sample address") }} id='w3' data-tip="Copy Address" style={{ background: chainIconMap['near'].color, borderColor: chainIconMap['near'].color }} className={styles.tab}>
                                <img src={chainIconMap['near'].icon} alt="" />
                                0xe4....cfe
                                <ReactTooltip backgroundColor={"#747c90"} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.socialIcon}>
                        <img src={twitter_icon.src} alt="" />
                        <img src={discord_icon.src} alt="" />
                    </div>

                </div>
                <NavSec selected={selectedNav} setSelected={setSelectedNav} />
                {(selectedNav == 'Communities') && <Communities />}
                {(selectedNav == 'Contributions') && <></>}
                {(selectedNav == 'Reviews') && <Reviews />}
                {(selectedNav == 'Communities') && <></>}



            </div>
            <Footer />
        </>
    )
}

const Reviews = () => {
    return (
        <>
            <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Last Review On</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>12.07.2022</h1>
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
            </div>
            <div className={styles.reviewCon}>
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
                < ReviewComp />
            </div>
        </>
    )
}

const ReviewComp = () => {

    return (
        <>
            <div className={styles.reviewComp}>
                <div className={styles.userInfo}>
                    <img className={styles.profilePic} src={Placeholder} alt="" />
                    <span>
                        <p className={styles.address}>Bankless</p>
                        <StarComp size={'s'} rating={4} />
                    </span>
                </div>
                <div className={styles.review_desc}  >
                    {'There’s no other program that walks you through exactly what you need to know to start an online store fast, written by someone who has built several 7-figure ecommerce businesses from scratch. What’s more, everything has been broken down in step-by-step detail with real action plans including finding your niche.'}
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
                    <h1>Bankless DAO</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>till Date</p>
                    <h1>82.33</h1>
                </div>
            </div>

            <div className={styles.list_communities}>
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
        </>
    )
}

const copyToClipBoard = (txt) => {
    navigator.clipboard.writeText(txt);
}

export default Profile           