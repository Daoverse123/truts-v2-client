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

import chainIconMap from '../../../components/chainIconMap.json'

let getChainIcon = (chain) => {

    return (<span style={{ backgroundColor: `${chainIconMap[chain].color}` }} className={styles.chain_tag}>
        <img src={chainIconMap[chain].icon} alt="" />
        {chainIconMap[chain].ticker}
    </span>)
}

const Sidebar = ({ dao_data, reviews }) => {
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
        let list = reviews;
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
                {(dao_data.dao_category.includes('Investors')) ?
                    <button className={styles.discord_soc} onClick={() => {
                        openNewTab(`mailto:${dao_data?.email}`)
                    }}>
                        <img src={'/email.png'} alt="" style={{ filter: "unset" }} />

                        {/* {numFormatter(dao_data?.discord_members)} */}
                    </button>
                    : <button className={styles.discord_soc} onClick={() => {
                        openNewTab(dao_data.discord_link)
                    }}>
                        <img src={discord_white.src} alt="" />
                        {numFormatter(dao_data?.discord_members)}
                    </button>}
                <button onClick={() => {
                    navigator.clipboard.writeText(dao_data.website_link);
                    document.querySelector('#copy_1').src = '/copy_after.png'
                }} className={styles.long_btn} style={{ gridArea: "c" }}>
                    {dao_data.website_link}
                    <img id='copy_1' style={{ filter: "invert(0 )" }} src={copy_icon.src} alt="" />
                </button>
                <button onClick={() => {
                    navigator.clipboard.writeText(`https://www.truts.xyz/dao/${dao_data.slug}`);
                    document.querySelector('#copy_2').src = '/copy_after.png'
                }} className={styles.long_btn} style={{ gridArea: "d" }}>
                    trust.xyz/dao/{dao_data.slug}
                    <img id='copy_2' style={{ filter: "invert(0 )" }} src={copy_icon.src} alt="" />
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