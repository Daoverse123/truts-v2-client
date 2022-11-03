import React, { useState } from 'react'
import styles from './profile.module.scss'
import ReactTooltip from 'react-tooltip';
import chainIconMap from '../../components/chainIconMap.json'

//components
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

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
                        <span className={styles.iconXp}>
                            <img src="/xpCoin.png" alt="" />
                            <p>50</p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Profile() {
    const [selectedNav, setSelectedNav] = useState('Reviews');
    return (
        <>
            <ReactTooltip backgroundColor={"#747c90"} />
            <OnBoardForm />
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
                {(selectedNav == 'Xp') && <Xp />}
                {(selectedNav == 'Reviews') && <Reviews />}
                {(selectedNav == 'Token/NFTs') && <TokenNftCon />}
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

const TokenNftCon = () => {
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
                {(selectedTab == 'NFTS') && <Nfts />}
                {(selectedTab == 'TOKENS') && <Tokens />}
            </section>
        </>
    )
}

const Nfts = () => {
    const Nft = () => {
        return (
            <div className={styles.nftCon}>
                <img src='/grad.jpg' className={styles.cover} alt='' />


                <div className={styles.info}>
                    <h3>NFT Title #3456</h3>
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
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
                <Nft />
            </div>
        </>
    )
}


const Tokens = () => {

    const Token = () => {
        return (
            <div className={styles.token}>
                <img className={styles.tokenLogo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="" />
                <span className={styles.topLine}>
                    <span className={styles.tokenName}>BTC <p>Bitcoin</p></span>
                    <h3>$1,238</h3>
                </span>
                <span className={styles.bottomLine}>
                    <p>$36,500</p>
                    <p>0.05</p>
                </span>
            </div>
        )
    }

    return (
        <>
            <div className={styles.tokens}>
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
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

export default Profile           