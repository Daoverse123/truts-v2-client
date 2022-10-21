import styles from './tabletSideBar.module.scss'

import React, { useState, useEffect } from 'react'

//utils
import numFormatter from '../../../utils/numFormatter'
import openNewTab from '../../../utils/openNewTab'

import chainIconMap from '../../../components/chainIconMap.json'

//assets
import discord_white from '../../../assets/icons/twitter_white.svg'
import twitter_white from '../../../assets/icons/discord_white.svg'
import eth_chain_icon from '../../../assets/icons/eth_chain_icon.svg'
import sol_chain_icon from '../../../assets/icons/sol_chain_icon.svg'
import near_chain_icon from '../../../assets/icons/near_chain_icon.svg'
import matic_chain_icon from '../../../assets/icons/matic_chain_icon.svg'
import binance_smart_chain from '../../../assets/icons/bsc_chain_icon.svg'
import globe_white from '../../../assets/icons/web_white.svg'



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

    let getChainIcon = (chain) => {
        return (<span style={{ backgroundColor: `${chainIconMap[chain].color}` }} className={styles.chain_tag}>
            <img src={chainIconMap[chain].icon} alt="" />
            {chainIconMap[chain].ticker}
        </span>)
    }



    return (
        <div className={styles.tabletSideBar}>
            <div className={styles.btn_row}>
                <button onClick={() => {
                    openNewTab(dao_data.twitter_link)
                }} className={styles.soc_btn} style={{ background: '#1DA1F2' }}>
                    <img src={twitter_white.src} alt="" />
                    {numFormatter(dao_data?.twitter_followers)}
                </button>
                {dao_data.dao_category.includes('Investors') ?
                    <button onClick={() => {
                        openNewTab(`mailto:${dao_data?.email}`)
                    }} className={styles.soc_btn} style={{ background: '#4962FE' }}>
                        <img style={{ margin: "unset", filter: "invert(100%)" }} src={'/email.png'} alt="" />
                        {/* {numFormatter(dao_data?.discord_members)} */}
                    </button>
                    : <button onClick={() => {
                        openNewTab(dao_data.discord_link)
                    }} className={styles.soc_btn} style={{ background: '#4962FE' }}>
                        <img src={discord_white.src} alt="" />
                        {numFormatter(dao_data?.discord_members)}
                    </button>}
                <button onClick={() => {
                    openNewTab(dao_data.website_link)
                }} className={styles.soc_btn} style={{ background: '#121212' }}>
                    <img style={{ marginRight: '0' }} src={globe_white.src} alt="" />
                </button>
            </div>
            <div className={styles.tablet_dial_sec}>
                <div className={styles.chain_row}>
                    <p>Chain</p>
                    <span className={styles.chain_icons}>
                        {
                            dao_data.chain.map((ele) => {
                                return getChainIcon(ele)
                            })
                        }
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

export default TabletSideBar