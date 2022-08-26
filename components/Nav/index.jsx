import React, { useEffect, useState } from 'react'
import styles from './nav.module.scss'

//assets
import logo from '../../assets/icons/logo.svg'
import ham_burger from '../../assets/icons/ham_burger.svg'
import close_icon from '../../assets/icons/close_icon.svg'
import wallet_icon from '../../assets/icons/wallet-icon.svg'

//components
import Search from '../Search'
import Button from '../Button'
import WalletConnect from '../WalletConnect'

export default function Component({ isFloating }) {

    const [TabletNavOpen, setTabletNavOpen] = useState(false);
    const [walletConnectVisible, setwalletConnectVisible] = useState(false);
    const [navKey, setnav] = useState(0);
    const [walletState, setwalletState] = useState(null);

    console.log("ipdate --> nav")

    const updateNav = () => {
        setnav((s) => {
            return s + 1
        });
    }

    useEffect(() => {
        window.updateNav = updateNav;
        let wallet_state = localStorage.getItem('wallet_state');
        if (wallet_state) {
            setwalletState(JSON.parse(wallet_state));
        }
    }, [navKey])

    return (
        <>
            <WalletConnect walletConnectVisible={walletConnectVisible} setwalletConnectVisible={setwalletConnectVisible} />
            <nav key={navKey}
                style={(isFloating == true) ? { position: 'fixed' } : { position: 'absolute' }}
                className={styles.navWrapper}>
                <div className={styles.nav}>
                    <img className={styles.logo} src={logo.src} alt="" />
                    {
                        isFloating &&
                        <span className={styles.search_wrappper}>  <Search /></span>
                    }
                    <ul className={styles.links}>
                        <li>Add a Dao + {navKey}</li>
                        <li>Discover Communities</li>
                        {(walletState?.address?.length > 5)
                            ?
                            <span>{walletState?.address}</span>
                            :
                            <li onClick={() => {
                                setwalletConnectVisible(true)
                            }}><img alt='' src={wallet_icon.src} /></li>}
                    </ul>

                    <span className={styles.ham_burger_menu} onClick={() => {
                        setTabletNavOpen(!TabletNavOpen);
                    }}  >
                        <img src={ham_burger.src} alt="" />
                    </span>

                </div>
                {(TabletNavOpen) && <TabletNav walletConnectVisible={walletConnectVisible} setwalletConnectVisible={setwalletConnectVisible} TabletNavOpen={TabletNavOpen} setTabletNavOpen={setTabletNavOpen} />}
            </nav>
        </>
    )
}

const TabletNav = ({ TabletNavOpen, setTabletNavOpen, walletConnectVisible, setwalletConnectVisible }) => {
    return (
        <div className={styles.tablet_nav}>
            <div className={styles.blankSpace}>

            </div>
            <div className={styles.menu}>
                <div className={styles.top_bar}>
                    <img src={logo.src} alt="" />
                    <img onClick={() => {
                        setTabletNavOpen(false)
                    }} className={styles.close_icon} src={close_icon.src} alt="" />
                </div>
                <ul className={styles.list}>
                    <li>
                        Home
                    </li>
                    <li>
                        Add a Community
                    </li>
                    <li>
                        Discover a Communities
                    </li>
                </ul>
                <div className={styles.btn_wrapper}>
                    <Button onClick={() => { setwalletConnectVisible(true) }} label={"Connect wallet"} />
                </div>
            </div>
        </div>
    )
}