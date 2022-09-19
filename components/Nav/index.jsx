import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'
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
import search_icon from '../../assets/icons/search_grad.svg'


//components
import Search from '../Search'
import Button from '../Button'
import WalletConnect from '../WalletConnect'

// CONSTANTS
const API = process.env.API

export default function Component({ isFloating }) {

    const [TabletNavOpen, setTabletNavOpen] = useState(false);
    const [TabletSearchOpen, setTabletSearchOpen] = useState(false);
    const [walletConnectVisible, setwalletConnectVisible] = useState(false);
    const [navKey, setnav] = useState(0);
    const [walletState, setwalletState] = useState(null);

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
                        <Link href={'https://www.truts.xyz/add-your-community'}><li>Add a Community</li></Link>
                        <Link href={'/discover'}><li>Discover Communities</li></Link>
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

                    <span className={styles.search_menu} onClick={() => {
                        setTabletSearchOpen(!TabletSearchOpen)
                    }}  >
                        <img src={search_icon.src} alt="" />
                    </span>
                    <span className={styles.ham_burger_menu} onClick={() => {
                        setTabletNavOpen(!TabletNavOpen);
                    }}  >
                        <img src={ham_burger.src} alt="" />
                    </span>

                </div>
                {(TabletNavOpen) && <TabletNav walletConnectVisible={walletConnectVisible} setwalletConnectVisible={setwalletConnectVisible} TabletNavOpen={TabletNavOpen} setTabletNavOpen={setTabletNavOpen} />}
                {(TabletSearchOpen) && <TabletSearch TabletSearchOpen={TabletSearchOpen} setTabletSearchOpen={setTabletSearchOpen} />}
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
                    <li onClick={disconnect_wallet} className={styles.power_btn}> <img src={power_off.src} alt="" /> Sign Out</li>
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
                    <Link href={'/'}>
                        <li>
                            Home
                        </li>
                    </Link>
                    <Link href={'https://www.truts.xyz/add-your-community'}>
                        <li>
                            Add a Community
                        </li>
                    </Link>
                    <Link href={'/discover'}>
                        <li>
                            Discover a Communities
                        </li>
                    </Link>
                </ul>
                <div className={styles.btn_wrapper}>
                    <Button onClick={() => { setwalletConnectVisible(true) }} label={"Connect wallet"} />
                </div>
            </div>
        </div>
    )
}


const TabletSearch = ({ TabletSearchOpen, setTabletSearchOpen }) => {

    const [searchTerm, setsearchTerm] = useState('');
    const [searchSuggestiondata, setSuggestiondata] = useState([]);

    const fetchData = async (term) => {
        if (!(term.length > 0)) return
        console.log('search --> ', term)
        let res = await axios.get(`${API}/search/${term}`);
        (res.data.length > 0) && setSuggestiondata([...res.data]);
    }

    let fetchSearchTerm = useCallback(
        _.debounce(term => fetchData(term), 100),
        [],
    )

    console.log(searchSuggestiondata)

    return (
        <div className={styles.tabletSearch}>
            <div className={styles.searchInput} type="text" >
                <img src={search_icon.src} alt="" />
                <input
                    autoFocus={true}
                    value={searchTerm}
                    onChange={(e) => {
                        setsearchTerm(e.target.value);
                        fetchSearchTerm(e.target.value)
                    }} type="text" />
                <img onClick={() => {
                    setTabletSearchOpen(false)
                }} className={styles.close_icon} src={close_icon.src} alt="" />
            </div>
            <div className={styles.suggestionBox}>
                {
                    searchSuggestiondata.map((ele, idx) => {
                        return (
                            (<SearchSuggestionEntry data={ele} key={ele.dao_name + idx} />)
                        )
                    })}
            </div>
        </div >
    )
}

const SearchSuggestionEntry = ({ data }) => {

    const getDaoTags = () => {
        let tagsString = '';
        data.dao_category.forEach((ele, idx) => {
            tagsString = tagsString + ele;
            if (idx < (data.dao_category.length - 1)) {
                tagsString = tagsString + ', '
            }
        })
        return tagsString;
    }

    return (
        <Link href={`/dao/${data.slug}`} >
            <div className={styles.searchSuggestionEntry}>
                <div className={styles.daoIcon}>
                    <img src={data.dao_logo} alt="" />
                </div>
                <div className={styles.daoInfo}>
                    <h1 className={styles.daoName}>{data.dao_name}</h1>
                    <h3 className={styles.daoTags}>
                        {getDaoTags()}
                    </h3>
                    <p className={styles.reviewCount}>{data.review_count} Reviews</p>
                </div>
            </div>
        </Link >
    )
}




const Chains = ['Ethereum', 'Solana']