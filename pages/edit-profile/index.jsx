import React, { useState } from 'react'
import styles from './edit-profile.module.scss'

import Nav from '../../components/Nav'
import Button from '../../components/Button'

let Placeholder = "https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000";

function Index() {

    let options = ['Profile', 'Wallets', 'Socials', 'Superpowers'];
    const [selectedPage, setselectedPage] = useState('Profile');
    return (
        <>
            <Nav isFloating={true} />
            <div className={styles.editProfile}>
                <div className={styles.progressHeader}>
                    <span className={styles.titles}>
                        <h1 className={styles.title}>
                            Complete your Profile to earn XP Points
                        </h1>
                        <p className={styles.xpCon}>
                            55% Completed
                        </p>
                    </span>
                    <div className={styles.progressBar}>
                        <div className={styles.progressInner}>
                        </div>
                    </div>
                </div>
                <div className={styles.profile_form}>
                    <div className={styles.leftSideNav}>
                        {options.map((ele) => {
                            if (selectedPage == ele) {
                                return <span key={ele} className={styles.option + ' ' + styles.selected}>{ele}</span>
                            }
                            return (
                                <span onClick={() => { setselectedPage(ele) }} key={ele} className={styles.option}>{ele}</span>
                            )
                        })}
                    </div>
                    {
                        (selectedPage == options[0]) && <Profile />
                    }
                    {
                        (selectedPage == options[1]) && <Wallets />
                    }
                    {
                        (selectedPage == options[2]) && <Socials />
                    }
                </div>

            </div>
        </>
    )
}

const Profile = () => {
    return (
        <div className={styles.formContent}>
            <div className={styles.mainTitle}>
                <h1>Profile Settings</h1>
                <p>Complete every details on your profile to earn XP points. Total of 100 to be earned in this section</p>
            </div>
            <div className={styles.section}>
                <div className={styles.secTitle}>
                    <h2>Profile Picture</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <div className={styles.profile}>
                    <img className={styles.profileImg} src={Placeholder} alt="" />
                    <img src="./add-icon.png" alt="" className={styles.addIcon} />
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.secTitle}>
                    <h2>Email ID</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <input placeholder='ABC@gmail.com' className={styles.input} />
            </div>
            <div className={styles.section}>
                <div className={styles.secTitle}>
                    <h2>Bio</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <textarea rows={8} placeholder='Write an amazing bio about yourself.....' className={styles.input} />
            </div>
            <div className={styles.section}>
                <div className={styles.secTitle}>
                    <h2>Interest</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <p className={styles.subText}>Select (maximum 3) and show your interests to web3 world!</p>

                <div className={styles.tagSelector}>
                    <span className={styles.tag + ' ' + styles.selected}>Product Designer</span>
                    <span className={styles.tag + ' ' + styles.selected}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                    <span className={styles.tag}>Product Designer</span>
                </div>
            </div>
            <span className={styles.bottomNav}>
                <button className={styles.saveBtn}>Save</button>
            </span>
        </div>
    )
}

const Wallets = () => {
    return (
        <div className={styles.formContent}>
            <div className={styles.mainTitle}>
                <h1>Wallet Settings</h1>
                <p>Please make sure to connect your primary wallet as it will also serve as your TrutsID and all data on profile would be linked and fetched from it.</p>
            </div>
            <div className={styles.walletSection}>
                <div className={styles.wTitle}>
                    <h1>List of Wallets</h1>
                    <h2>+ Add Wallets</h2>
                </div>

                <div className={styles.wallet}>
                    <img className={styles.profileName} src="./blue.png" alt="" />
                    <p>0x123...456</p>
                    <img className={styles.option} src="./threedot.png" alt="" />
                </div>
                <div className={styles.wallet}>
                    <img className={styles.profileName} src="./blue.png" alt="" />
                    <p>0x123...456</p>
                    <img className={styles.option} src="./threedot.png" alt="" />
                </div>
                <button className={styles.saveBtn}>Save</button>
            </div>

        </div>
    )
}


const Socials = () => {
    return (
        <div className={styles.formContent}>
            <div className={styles.mainTitle}>
                <h1>Social Settings</h1>
                <p>Connect your socials to get rewards. Also connecting your socials will help us to show you more data about how you interact with the communities. This will also serve as a web3 Proof of Work</p>
            </div>
            <div className={styles.socialSection}>
                <div className={styles.secTitle}>
                    <h2>Twitter</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <div className={styles.connectDiscord}>
                    <button style={{
                        background: "rgba(29, 155, 240, 0.2)",
                        border: "1px solid #1D9BF0",
                        color: "#1D9BF0"
                    }}>
                        <img src="./twitter.png" alt="" />
                        Verify Twitter
                    </button>
                </div>
                <div className={styles.secTitle}>
                    <h2>Discord</h2>
                    <span className={styles.xp}>
                        <img src="./xpCoin.png" alt="" />
                        <p>50</p>
                    </span>
                </div>
                <div className={styles.connectDiscord}>
                    <button>
                        <img src="./discord.png" alt="" />
                        Connect Discord
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Index 