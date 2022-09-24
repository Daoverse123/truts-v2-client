import React, { useState, useEffect } from 'react'
import styles from './sidebar.module.scss'

//utils
import numFormatter from '../../../utils/numFormatter'
import openNewTab from '../../../utils/openNewTab'

import discord_white from '../../../assets/icons/twitter_white.svg'
import twitter_white from '../../../assets/icons/discord_white.svg'
import copy_icon from '../../../assets/icons/copy_icon.svg'
import eth_chain_icon from '../../../assets/icons/eth_chain_icon.svg'
import sol_chain_icon from '../../../assets/icons/sol_chain_icon.svg'
import near_chain_icon from '../../../assets/icons/near_chain_icon.svg'
import matic_chain_icon from '../../../assets/icons/matic_chain_icon.svg'

let getChainIcon = (chain) => {
    if (chain == 'solana') {
        return <img key={chain} src={sol_chain_icon.src} alt="" />
    }
    if (chain == 'ethereum') {
        return <img key={chain} src={eth_chain_icon.src} alt="" />
    }
    if (chain == 'near') {
        return <img key={chain} src={near_chain_icon.src} alt="" />
    }
    if (chain == 'polygon-pos') {
        return <img key={chain} src={matic_chain_icon.src} alt="" />
    }
    else {
        return (<span className={styles.chain_tag}>{chain}</span>)
    }
}

const Sidebar = ({ dao_data }) => {
    console.log(dao_data);

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
                    {numFormatter(dao_data?.twitter_followers)}
                </button>
                <button className={styles.discord_soc} onClick={() => {
                    openNewTab(dao_data.discord_link)
                }}>
                    <img src={discord_white.src} alt="" />
                    {numFormatter(dao_data?.discord_members)}
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
                    {
                        dao_data.chain.map((ele) => {
                            return getChainIcon(ele)
                        })
                    }

                    {/* <img src={sol_chain_icon.src} alt="" /> */}
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

export default Sidebar