import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Router, { useRouter } from 'next/router';
import {
    useAccount,
    useConnect,
    useDisconnect,
    useSignMessage
} from 'wagmi';

import { Buffer } from "buffer";
import * as nearAPI from "near-api-js";
//assets
import eth_icon from '../../assets/icons/eth-icon.png'
import sol_icon from '../../assets/icons/sol-icon.png'
import metamask from '../../assets/icons/metamask.svg'
import wallet_connect from '../../assets/icons/wallet-connect.svg'
import coinbase_wallet from '../../assets/icons/coinbase-icon.png'
import close_icon from '../../assets/icons/close_icon.svg'
import other_wallet from '../../assets/icons/other-wallet.png'
import phantom_icon from '../../assets/icons/phantom.avif'
import near_icon from '../../assets/icons/near_chain_icon.png'
import axios from 'axios';


// { wallet state
//     address: res.address,
//     chain: "Ethereum",
//     status: "connected"
// }

let P_API = process.env.P_API;
const walletAuth = async (login, walletState, signMessage) => {
    //step 1 fetch nonce
    console.log(walletState)
    let options = {};
    console.log(login)
    if (login) {
        options = {
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        }
    }
    let res_nonce = await axios.get(`${P_API}/login/wallet?address=${walletState.address}`, options)
    if (res_nonce.status == 200) {

        // Solana Ethereum
        let message = res_nonce.data.data.nonce;
        let public_key = walletState.address;
        let chain = walletState.chain;
        let signature;

        signature = await signMessage(message, chain);

        let chainENUM = () => {
            if ("Ethereum") {
                return "EVM"
            }
            if ("Solana") {
                return 'SOL'
            }
        }

        let auth_res = await axios.post(`${P_API}/login/wallet/verify`,
            { public_key, signature, chain: chainENUM(chain) });
        localStorage.setItem('token', `Bearer ${auth_res.data.data.token}`)
        if (login) {
            window.location = '/edit-profile'
        }
        else {
            window.location = '/profile'
        }
    }
    else {
        return alert("Auth error");
    }
}

const solSign = async (msgs) => {
    let msg = msgs.message;
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
    const resp = await provider.connect();
    const message = msg;
    const encodedMessage = new TextEncoder().encode(message);
    console.log("sign message")

    try {
        const signedMessage = await provider.signMessage(encodedMessage, "utf8");
        return bs58.encode(signedMessage.signature)
    } catch (error) {
        alert("Auth error")
    }
}

export default function WalletConnect({ isLogin, walletConnectVisible, setwalletConnectVisible }) {

    const [walletState, setwalletState] = useState(null);
    const [selectedChain, setselectedChain] = useState('Ethereum')
    const { data, error, isLoading, signMessageAsync } = useSignMessage({
        message: '',
    })

    useEffect(() => {
        let wallet_state = localStorage.getItem('wallet_state');
        if (wallet_state) {
            setwalletState(JSON.parse(wallet_state))
        }
    }, [])

    useEffect(() => {
        let query = window.location.search;
        if (query.includes("account_id") && query.includes("all_keys")) {
            //set wallet screen visible
            setwalletConnectVisible(true);
            //select near
            setselectedChain("Near");
            //click on near
        }
    }, [])

    const closePopUp = async () => {
        let wallet = JSON.parse(localStorage.getItem('wallet_state'))
        walletAuth(isLogin, wallet, signMessage);
        //setwalletConnectVisible(false);
    }

    const signMessage = async (message, chain) => {
        if (chain == 'Ethereum') {
            let sig = await signMessageAsync({ message });
            return sig;
        }
        if (chain == 'Solana') {
            let sig = await solSign({ message });
            return sig;
        }
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
                {(selectedChain == 'Near') && <Near_wallets setwalletState={setwalletState} closePopUp={closePopUp} />}
            </div>
        </div>)
}


const Wallet = ({ icon, name, onClick }) => {
    return (
        <span id={'btn' + name} onClick={() => { onClick() }} className={styles.elm}>
            <img src={icon} alt="" />
            <p>{name}</p>
        </span>
    )
}


const Eth_wallets = ({ setwalletState, closePopUp }) => {
    const { connectAsync, connectors, isLoading, pendingConnector } = useConnect();
    const { address, isConnected, connector, isConnecting } = useAccount();

    const saveWalletState = async (ele) => {
        let token = localStorage.getItem('token');
        localStorage.clear();
        localStorage.setItem('token', token);
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


const Near_wallets = ({ setwalletState, closePopUp }) => {
    //const isSenderInstalled = window.near.isSender;
    // if (typeof window.near !== 'undefined' && window.near.isSender) {
    //     console.log('Sender is installed!');
    // }
    const [accessKey, setAccessKey] = useState('');
    const { connect, keyStores, WalletConnection } = nearAPI;
    //mainet added
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
    const connectionConfig = {
        networkId: "mainnet",
        keyStore: myKeyStore, // first create a key store
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
    };
    const walletConnection = null;

    const connect_near = async () => {

        // connect to NEAR
        const nearConnection = await connect(connectionConfig);

        // create wallet connection
        walletConnection = new WalletConnection(nearConnection);
        // const walletConnection = new WalletConnection(nearConnection);
        if (!walletConnection.isSignedIn()) {
            let AccessKey = walletConnection.requestSignIn(
                "example-contract.testnet", // contract requesting access
                "Truts App", // optional title
                "http://YOUR-URL.com/success", // optional redirect URL on success
                "http://YOUR-URL.com/failure" // optional redirect URL on failure
            );
            setAccessKey(AccessKey);
            console.log(AccessKey);
        }

    }

    useEffect(() => {
        let query = window.location.search;
        setTimeout(() => {
            if (query.includes("account_id") && query.includes("all_keys")) {
                document.getElementById('btn' + 'Near').click();
            }
        }, 0)
    }, [])



    return (
        <div className={styles.list}>
            <Wallet
                onClick={async () => {
                    await connect_near()
                    if (walletConnection.isSignedIn()) {
                        // // user is signed in
                        // const walletAccountObj = walletConnection.account();
                        const account = walletConnection.account();
                        console.log('near connection established', account);
                        console.log(accessKey);
                    }
                    if (walletConnection.isSignedIn()) {
                        setwalletState({
                            address: walletConnection.getAccountId(),
                            chain: "near",
                            status: "connected"
                        })
                        localStorage.setItem('wallet_state', JSON.stringify({
                            address: walletConnection.getAccountId(),
                            chain: "near",
                            status: "connected"
                        }));
                        window.updateNav()

                    }

                    closePopUp()

                }
                } icon={walletIconMap['Near'] || other_wallet.src} name={"Near"}
            />
        </div>
    )
}



const Chains = ['Ethereum', 'Solana']

const walletIconMap = {
    'MetaMask': metamask.src,
    'Coinbase Wallet': coinbase_wallet.src,
    'WalletConnect': wallet_connect.src,
    'Phantom': phantom_icon.src,
    'Near': near_icon.src
}

const chainIconMap = {
    'Ethereum': eth_icon.src,
    'Solana': sol_icon.src,
    'Near': near_icon.src,
}



