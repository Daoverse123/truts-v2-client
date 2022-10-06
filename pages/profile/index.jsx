import React, { useState } from 'react'
import styles from './profile.module.scss'

import chainIconMap from '../../components/chainIconMap.json'

//assets
import discord_icon from '../../assets/icons/twitter_white.svg'
import twitter_icon from '../../assets/icons/discord_white.svg'
import downArrow from '../../assets/icons/down_arrow.svg'

//components
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'


let Placeholder = "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";
function Profile() {
    const [selected, setSelected] = useState('Reviews');
    return (
        <>
            <Nav  isStrech={true} isFloating />
            <div className={styles.profilePage}>
                <div className={styles.profileHeader}>
                    <img className={styles.profileImg} src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000" alt="" />
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
                            <div style={{ background: chainIconMap['ethereum'].color, borderColor: chainIconMap['ethereum'].color }} className={styles.tab}>
                                <img src={chainIconMap['ethereum'].icon} alt="" />
                                0xe4....cfe
                            </div>
                            <div style={{ background: chainIconMap['solana'].color, borderColor: chainIconMap['solana'].color }} className={styles.tab}>
                                <img src={chainIconMap['solana'].icon} alt="" />
                                0xe4....cfe
                            </div>
                            <div style={{ background: chainIconMap['near'].color, borderColor: chainIconMap['near'].color }} className={styles.tab}>
                                <img src={chainIconMap['near'].icon} alt="" />
                                0xe4....cfe
                            </div>
                        </div>
                    </div>

                    <div className={styles.socialIcon}>
                        <img src={twitter_icon.src} alt="" />
                        <img src={discord_icon.src} alt="" />
                    </div>

                </div>
                <NavSec selected={selected} setSelected={setSelected} />

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

            </div>
            <Footer />
        </>
    )
}

const NavSec = ({ selected, setSelected }) => {
    return (
        <ul className={styles.navSec}>
            {
                [
                    'Communities',
                    'Contributions',
                    'Reviews',
                    'Token/NFTs'
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

export default Profile           