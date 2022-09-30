import React, { useState } from 'react'
import styles from './footer.module.scss'
import Link from 'next/link'
import axios from 'axios'

//COMPONENTS
import Button from '../Button'

// CONSTANTS
const API = process.env.API

//utils 
import openNewTab from '../../utils/openNewTab'

//ASSETS
import web_w from '../../assets/icons/web_white.svg'
import twitter_w from '../../assets/icons/twitter_white.svg'
import discord_w from '../../assets/icons/discord_white.svg'
import arrow_icon from '../../assets/icons/arrow-right.svg'

export default function Component() {

    const [email, setemail] = useState('');
    const [saved, setsaved] = useState(false);
    console.log(email);
    const saveEmail = async () => {
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };
        if (!validateEmail(email)) {
            return alert("Please enter a valid email");
        }
        let res = await axios.get(`${API}/email-save?email=${email.toLowerCase()}`);
        if (res) {
            setsaved(true);
        }
        else {
            alert("Something went wrong! please try again")
        }
    }
    return (
        <div className={styles.footer}>
            {(saved) ? <h1 style={{ color: "#48C9B0 " }} className={styles.footerTitle}>Thanks for Subscribing to our newsletter</h1> : <h1 className={styles.footerTitle}>Subscribe to our newsletter</h1>}
            <span className={styles.email}>
                <input value={email} onChange={(e) => {
                    setemail(e.target.value);
                }} placeholder={'Enter Email address'} type="text" />
                <img onClick={() => {
                    saveEmail();
                }} src={arrow_icon.src} alt="" />
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

