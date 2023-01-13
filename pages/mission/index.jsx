import React from 'react'
import styles from './page_mission.module.scss'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const Tag = ({ src, color, title }) => {
    return (
        <div className={styles.tag} style={{ outlineColor: color, background: color.replace(")", ",0.1)") }}>
            <img src={src} alt=" " />
            <p style={{ color: color }}>{title}</p>
        </div>
    )
}

let STATUS = {
    COMPLETED: "completed",
    CURRENT: "current",
    DISABLED: "disabled"
}

function index() {
    return (
        <>
            <Nav isFloating />
            <div className={styles.missionPage} >
                <h3 style={{ marginTop: "200px" }} className={styles.subtitle}><img src='/missions/arrow.png' /> Back</h3>
                <div className={styles.missionHead}>
                    <img className={styles.profileImg} src="/profile.png" alt="" />
                    <div className={styles.content}>
                        <h2 className={styles.sub}>Polygon</h2>
                        <h1 className={styles.title}>Title for the task/mission/bounty</h1>
                        <p className={styles.desc}>{limitText(120, "Lorem ipsum dolor sit amet consectetur. Diam quis ut egestas risus sed scelerisque sit. Lorem ipsum dolor sit amet consectetur. Diam quis ut see more")}</p>

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
                <h3 className={styles.subtitle}>Tasks to Perform</h3>
                <div className={styles.tasksCon}>
                    <Task no={1} status={STATUS.COMPLETED} />
                    <Task no={2} status={STATUS.CURRENT} />
                    <Task no={3} status={STATUS.DISABLED} />
                </div>
                <button className={styles.mainBtn}>Verify & Claim</button>
            </div>
            <Footer />
        </>
    )



    function Task({ status, no }) {

        let taskStatus = styles.taskDisabled;

        if (status === STATUS.CURRENT) {
            taskStatus = ''
        }
        if (status === STATUS.COMPLETED) {
            taskStatus = styles.taskCompleted
        }

        return <div className={styles.task + ' ' + (taskStatus)}>
            <span className={styles.count}>
                {no}
            </span>
            <div className={styles.textCont}>
                <h1>Hold the ENS Explorer NFT:</h1>
                <p>{limitText(100, "If you completed our ENS Explorer Bounty, you should be eligible to complete this step. If you completed our ENS Explorer Bounty, you should be eligible to complete this step. ")}</p>
            </div>
            {(status == STATUS.COMPLETED) ?
                <button >
                    Verified  <img src="/missions/tick.png" alt="" />
                </button> :
                <button>start</button>}
        </div>
    }
}

function limitText(count, text) {
    if (text.length < count) return text;
    let snippedText = text.substring(0, count);
    return snippedText + "..."
}


export default index