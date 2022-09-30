import React from 'react'
import styles from './footer.module.scss'
import Link from 'next/link'

//COMPONENTS
import Button from '../Button'

//utils 
import openNewTab from '../../utils/openNewTab'

//ASSETS
import web_w from '../../assets/icons/web_white.svg'
import twitter_w from '../../assets/icons/twitter_white.svg'
import discord_w from '../../assets/icons/discord_white.svg'
import arrow_icon from '../../assets/icons/arrow-right.svg'

export default function Component() {
    return (
        <div className={styles.footer}>
            <h1 className={styles.footerTitle}>Subscribe to our newsletter</h1>
            <span className={styles.email}>
                <input placeholder='Email Address' type="text" />
                <img src={arrow_icon.src} alt="" />
            </span>
            <ul className={styles.links}>
                <Link href={'/'} ><li>Home</li></Link>
                <Link href={'/add-your-community'} ><li>Add a Community</li></Link>
                <Link href={'/discover'} ><li>Explore Communities</li></Link>
                {/* <Link href={'/discover'} ><li>Review Communities</li></Link> */}
                <Link href={'https://discord.truts.xyz'} ><li>Contact Us</li></Link>
            </ul>
            <span className={styles.socialIcons}>
                <img onClick={() => { openNewTab('https://discord.truts.xyz') }} src={twitter_w.src} alt="" />
                <img onClick={() => { openNewTab('https://twitter.truts.xyz') }} src={discord_w.src} alt="" />
                <img onClick={() => { openNewTab('https://truts.xyz') }} src={web_w.src} alt="" />
            </span>
            <ul className={styles.tnc}>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
            </ul>
        </div >
    )
}

