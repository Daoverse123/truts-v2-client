import React from 'react'
import styles from './footer.module.scss'

//COMPONENTS
import Button from '../Button'

//ASSETS
import web_w from '../../assets/icons/web_white.svg'
import twitter_w from '../../assets/icons/twitter_white.svg'
import discord_w from '../../assets/icons/discord_white.svg'

export default function Component() {
    return (
        <div className={styles.footer}>
            <h1 className={styles.footerTitle}>Love what we do? Truts your guts and join us now!</h1>
            <Button label={'Join Community'} />
            <ul className={styles.links}>
                <li>Home</li>
                <li>Add a DAO</li>
                <li>Explore DAOs</li>
                <li>Review DAO</li>
                <li>Contact Us</li>
            </ul>
            <span className={styles.socialIcons}>
                <img src={twitter_w.src} alt="" />
                <img src={discord_w.src} alt="" />
                <img src={web_w.src} alt="" />
            </span>
            <ul className={styles.tnc}>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
    )
}

