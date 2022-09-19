import React from 'react'
import styles from './card.module.scss'
import Link from 'next/link'

// ASSETS
import verified from './../../assets/icons/verified.svg'
import star from './../../assets/icons/star_white.svg'
import globe from './../../assets/icons/Globe_grey.svg'
import twitter from './../../assets/icons/Twitter_grey.svg'
import discord from './../../assets/icons/Discord_grey.svg'

export default function DAOCard({ data }) {
    return (
        <Link href={`/dao/${data.slug}`}>
            <div className={styles.card}>
                <div className={styles.cover} >
                    <img src={data.dao_cover} alt="" />
                </div>
                <div className={styles.info}>
                    <span className={styles.title}>
                        <h1>{data.dao_name}</h1>
                        <img src={verified.src} alt="" />
                    </span>
                    <div className={styles.review_stats}>
                        <div className={styles.ratingBox}>
                            <span>
                                {addDecimal(data.average_rating)}
                            </span>
                            <img src={star.src} alt="" />
                        </div>
                        <span className={styles.review_count}>
                            {data.review_count} reviews
                        </span>
                    </div>
                    <div className={styles.social_icons}>
                        <span className={styles.icon}>
                            <img src={globe.src} alt="" onClick={() => {
                                (data.website_link) && openNewTab(data.website_link)
                            }} />
                        </span>
                        <span className={styles.icon}>
                            <img src={twitter.src} alt="" onClick={() => {
                                (data.twitter_link) && openNewTab(data.twitter_link)
                            }} />
                            <p>
                                {(data.twitter_followers) ? numFormatter(data.twitter_followers) : 'n/a'}
                            </p>
                        </span>
                        <span className={styles.icon}>
                            <img src={discord.src} alt="" onClick={() => {
                                (data.discord_link) && openNewTab(data.discord_link)
                            }} />
                            <p>
                                {(data.discord_members) ? numFormatter(data.discord_members) : 'n/a'}
                            </p>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function limitText(text) {
    if (text.length < 18) return text;
    let snippedText = text.substring(0, 18);
    return snippedText + "..."
}

function numFormatter(num) {
    if (!num) return 'n/a'
    if (isNaN(num)) return 'n/a'

    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

const openNewTab = (url) => {
    if (url.length < 1) return
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = url;
    a.click();
}

const addDecimal = (num) => {
    if (!num) return '0.0';
    let str = `${num}`;
    if (str.length > 1) {
        return str
    }
    else {
        return str + '.0'
    }
}