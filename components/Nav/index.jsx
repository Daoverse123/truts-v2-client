import React, { useEffect, useState } from 'react'
import styles from './nav.module.scss'
import Link from 'next/link'
import {
    useDisconnect,
} from 'wagmi';

//assets
import logo from '../../assets/icons/logo.svg'
import ham_burger from '../../assets/icons/ham_burger.svg'
import close_icon from '../../assets/icons/close_icon.svg'
import wallet_icon from '../../assets/icons/wallet-icon.svg'
import pixel_icon from '../../assets/icons/pixelated.jpg'
import power_off from '../../assets/icons/power-off.svg'

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
        let wallet_state = localStorage.getItem('wallet_state');
        setwalletState(JSON.parse(wallet_state));
        window.updateNav = updateNav;
    }, [navKey])

    return (
        <>
            <WalletConnect walletConnectVisible={walletConnectVisible} setwalletConnectVisible={setwalletConnectVisible} />
            <nav key={navKey}
                style={(isFloating == true) ? { position: 'fixed' } : { position: 'absolute' }}
                className={styles.navWrapper}>
                <div className={styles.nav}>
                    <Link href={'/'}><img className={styles.logo} src={logo.src} alt="" /></Link>
                    {
                        isFloating &&
                        <span className={styles.search_wrappper}>  <Search /></span>
                    }
                    <ul className={styles.links}>
                        <li>Add a Dao</li>
                        <li>Discover Communities</li>
                        {(walletState?.address?.length > 5)
                            ? // wallet connected
                            <li className={styles.profileIcon}>
                                <img className={styles.pixel_icon} alt='' src={pixel_icon.src} />

                                <ProfileDropDown walletState={walletState} />

                            </li>
                            :  // connect wallet
                            <li
                                onClick={() => {
                                    setwalletConnectVisible(true)
                                }}>
                                <img alt='' src={wallet_icon.src} />
                            </li>}
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

const ProfileDropDown = ({ walletState }) => {
    let { address, chain } = walletState
    const { disconnectAsync: disconnectEth } = useDisconnect()
    const getProvider = () => {
        if ('phantom' in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                return provider;
            }
        }
        //window.open('https://phantom.app/', '_blank');
    };
    const provider = getProvider(); // see "Detecting the Provider"

    const disconnect_wallet = async () => {
        if (chain == Chains[0]) {
            console.log("Disconnect eth")
            await disconnectEth();
            localStorage.clear();
        }
        else if (chain == Chains[1]) {
            localStorage.clear();
        }
        setTimeout(() => {
            window.updateNav()
        }, 100)

    }

    return (
        <span className={styles.profileDropDown}>
            <div className={styles.dd_menu}>
                <div className={styles.addressBar}>
                    <img className={styles.pixel_icon} alt='' src={pixel_icon.src} />
                    <span className={styles.address_chain}>
                        <h2>{address.slice(0, 5) + '...' + address.slice(address.length - 4)}</h2>
                        <p>{chain}</p>
                    </span>
                </div>
                <ul className={styles.list}>
                    {/* <li>My Profile</li> */}
                    <li onClick={disconnect_wallet} className={styles.power_btn}> <img src={power_off.src} alt="" /> Sing Out</li>
                </ul>
            </div>
        </span>
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

const Chains = ['Ethereum', 'Solana']