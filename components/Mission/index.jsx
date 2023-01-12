import React from 'react'
import styles from './styles.module.scss'


const Tag = ({ src, color, title }) => {
    return (
        <div className={styles.tag} style={{ outlineColor: color, background: color.replace(")", ",0.1)") }}>
            <img src={src} alt=" " />
            <p style={{ color: color }}>{title}</p>
        </div>
    )
}

let defaultChip = { color: '', status: false, text: '', iconSrc: '' };
let date = { color: 'red', status: true, text: '3 days left', iconSrc: '/missions/date.png' };

const getChipType = () => {
    return date
}

export default function Component({ chipType }) {

    let chip = getChipType(chipType);

    return (
        <div style={{ borderColor: ('color' in chip) ? chip.color : '' }} className={styles.mission}>
            {(chip.status) && <div className={styles.timeChip}>
                <img src={chip.iconSrc} alt="" />
                <p>3 days left</p>
            </div>}
            <span className={styles.topCon}>
                <img src="/profile.png" alt="" className={styles.profileImg} />
                <h2>Polygon</h2>
                <h1>Matic Trivia</h1>
                <p>Write a short review for Bankless DAO some random text is here....</p>
                <div className={styles.tags}>
                    <Tag src={'/missions/bounty.png'} color={"rgb(203, 56, 240)"} title={"Bounty"} />
                    <Tag src={'/missions/development.png'} color={"rgba(56, 96, 240)"} title={"Development"} />
                </div>
            </span>
            <div className={styles.xpCon}>
                <img src="/missions/coin.png" alt="" />
                <p>300 XP</p>
                <img src="/missions/save.png" alt="" />
                <img src="/missions/share.png" alt="" />
            </div>
        </div>
    )
}

