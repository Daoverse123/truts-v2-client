import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import {
    useAccount,
    useConnect,
    useDisconnect,
} from 'wagmi';

import { Buffer } from "buffer";

//assets
import eth_icon from '../../assets/icons/eth-icon.png'
import sol_icon from '../../assets/icons/sol-icon.png'
import metamask from '../../assets/icons/metamask.svg'
import wallet_connect from '../../assets/icons/wallet-connect.svg'
import coinbase_wallet from '../../assets/icons/coinbase-icon.png'
import close_icon from '../../assets/icons/close_icon.svg'
import other_wallet from '../../assets/icons/other-wallet.png'
import phantom_icon from '../../assets/icons/phantom.avif'


// { wallet state
//     address: res.address,
//     chain: "Ethereum",
//     status: "connected"
// }


export default function WalletConnect({ walletConnectVisible, setwalletConnectVisible }) {

    const [walletState, setwalletState] = useState(null);
    const [selectedChain, setselectedChain] = useState('Ethereum')

    useEffect(() => {
        let wallet_state = localStorage.getItem('wallet_state');
        if (wallet_state) {
            setwalletState(JSON.parse(wallet_state))
        }
    }, [])

    const closePopUp = () => {
        setwalletConnectVisible(false);
    }

    const isSelectedChain = (chain) => {
        if (chain == selectedChain) {
            return styles.selectedBtn
        }
        else {
            return null
        }
    }

    if (!walletConnectVisible) return (<></>);
    return (
        <div className={styles.walletConnectPopUp} >
            <div className={styles.menu_con}>
                <img
                    onClick={() => {
                        setwalletConnectVisible(false)
                    }}
                    className={styles.close_icon}
                    src={close_icon.src}
                    alt="" />
                <div className={styles.chainBar}>
                    {
                        Chains.map((ele) => {
                            return (
                                <div onClick={() => {
                                    setselectedChain(ele)
                                }} key={ele + 'chain'} className={styles.chainBtn + ' ' + isSelectedChain(ele)}>
                                    <img src={chainIconMap[ele]} alt="" />
                                    <p>{ele}</p>
                                </div>
                            )
                        })
                    }
                </div>
                {(selectedChain == 'Ethereum') && < Eth_wallets setwalletState={setwalletState} closePopUp={closePopUp} />}
                {(selectedChain == 'Solana') && <Solana_wallets setwalletState={setwalletState} closePopUp={closePopUp} />}
            </div>
        </div>)
}


const Wallet = ({ icon, name, onClick }) => {
    return (
        <span onClick={() => { onClick() }} className={styles.elm}>
            <img src={icon} alt="" />
            <p>{name}</p>
        </span>
    )
}


const Eth_wallets = ({ setwalletState, closePopUp }) => {
    const { connectAsync, connectors, isLoading, pendingConnector } = useConnect();
    const { address, isConnected, connector, isConnecting } = useAccount();

    const saveWalletState = async (ele) => {
        localStorage.clear();
        try {
            let res = await connectAsync({ connector: ele })
            if (res.account.length > 5) {
                let state_obj = {
                    address: res.account,
                    chain: "Ethereum",
                    status: "connected"
                }
                setwalletState(state_obj)
                localStorage.setItem('wallet_state', JSON.stringify(state_obj));
                window.updateNav()
                closePopUp()
            }
        } catch (error) {
            console.log(error.message)
            if (error.message == 'Connector already connected') {
                if (address.length > 5) {
                    let state_obj = {
                        address: address,
                        chain: "Ethereum",
                        status: "connected"
                    }
                    setwalletState(state_obj)
                    localStorage.setItem('wallet_state', JSON.stringify(state_obj));
                    window.updateNav()
                    closePopUp()
                }
            }
        }
    }

    return (
        <div className={styles.list}>
            {
                connectors.map((ele, idx) => {
                    return (
                        <Wallet
                            key={idx + 'id'} icon={walletIconMap[ele.name] || other_wallet.src}
                            name={<>{ele.name}
                                {!ele.ready && '(unavailable)'}
                                {isConnecting &&
                                    ele.id === pendingConnector?.id &&
                                    ' (connecting)'}</>}
                            onClick={() => { saveWalletState(ele) }}
                        />
                    )
                })
            }
        </div>
    )
}

const Solana_wallets = ({ setwalletState, closePopUp }) => {
    const isPhantomInstalled = window.phantom?.solana?.isPhantom

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

    const connect_phantom = async () => {
        try {
            const resp = await provider.connect();
            console.log(resp.publicKey.toString());
            return ({ address: resp.publicKey.toString() })
            // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
        }
    }

    return (
        <div className={styles.list}>
            <Wallet
                onClick={async () => {
                    if (isPhantomInstalled) {
                        let res = await connect_phantom()
                        if (res.address.length > 5) {
                            setwalletState({
                                address: res.address,
                                chain: "Solana",
                                status: "connected"
                            })
                            localStorage.setItem('wallet_state', JSON.stringify({
                                address: res.address,
                                chain: "Solana",
                                status: "connected"
                            }));

                            window.updateNav()
                            closePopUp()
                        }
                    }
                }} icon={walletIconMap['Phantom'] || other_wallet.src} name={"Phantom" + ((!isPhantomInstalled) ? " (not-installed)" : "")}
            />
        </div>
    )
}


const Chains = ['Ethereum', 'Solana']

const walletIconMap = {
    'MetaMask': metamask.src,
    'Coinbase Wallet': coinbase_wallet.src,
    'WalletConnect': wallet_connect.src,
    'Phantom': phantom_icon.src
}

const chainIconMap = {
    'Ethereum': eth_icon.src,
    'Solana': sol_icon.src,
}



