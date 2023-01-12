import React from 'react'
import styles from './page_mission.module.scss'

import Nav from '../../components/Nav'

const Tag = ({ src, color, title }) => {
    return (
        <div className={styles.tag} style={{ outlineColor: color, background: color.replace(")", ",0.1)") }}>
            <img src={src} alt=" " />
            <p style={{ color: color }}>{title}</p>
        </div>
    )
}

function index() {
    return (
        <>
            <Nav isFloating />
            <div className={styles.missionPage} >
                <div className={styles.missionHead}>
                    <img className={styles.profileImg} src="/profile.png" alt="" />
                    <div className={styles.content}>
                        <h2 className={styles.sub}>Polygon</h2>
                        <h1 className={styles.title}>Title for the task/mission/bounty</h1>
                        <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur. Diam quis ut egestas risus sed scelerisque sit. Lorem ipsum dolor sit amet consectetur. Diam quis ut see more</p>
                        <span>

                        </span>
                        <div className={styles.tags}>
                            <Tag src={'/missions/bounty.png'} color={"rgb(203, 56, 240)"} title={"Bounty"} />
                            <Tag src={'/missions/bounty.png'} color={"rgb(203, 56, 240)"} title={"Bounty"} />
                            <div className={styles.profilesCompleted}>
                                <img src="/profile.png" alt="" />
                                <img style={{ left: "-7px" }} src="/profile.png" alt="" />
                                <img style={{ left: "-13px" }} src="/profile.png" alt="" />
                                <p>+ 123 completed</p>
                            </div>
                        </div>
                    </div>
                    <span className={styles.xp}>
                        <p>Rewards</p>
                        <span className={styles.xpCount}>
                            <img src="/missions/coin.png" alt="" />
                            <h1>
                                300 XP
                            </h1>
                        </span>
                    </span>
                </div>
            </div>
        </>
    )
}

export default index