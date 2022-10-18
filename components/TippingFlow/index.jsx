import React, { useState, useEffect, useMemo } from 'react'
import styles from './styles.module.scss'
import { useSendTransaction, usePrepareSendTransaction, usePrepareContractWrite, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi'
import { BigNumber } from 'ethers'
import { ethers } from 'ethers'
import axios from 'axios'

import {
    Token,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    getAssociatedTokenAddress,
    createTransferInstruction,
    createTransferCheckedInstruction,
    getAccount,
    getMint,
    createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import * as bs58 from "bs58";
import {
    sendAndConfirmTransaction,
    Connection,
    PublicKey,
    Transaction,
    clusterApiUrl,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";

import * as nearAPI from "near-api-js";

//components
import Button from '../Button'

//assets
import setting from '../../assets/icons/setting_icon.svg'
import close_icon from '../../assets/icons/close_icon_tip.svg'
import matic_icon from '../../assets/icons/matic_icon.png'
import down_arrow from '../../assets/icons/down_arrow.svg'
import error_icon from '../../assets/icons/error_icon.svg'

//near tokens
import near_icon from '../../assets/icons/near_chain_icon.png'

//polygon erc20 ABI
import umbriaPolygonAbi from '../../assets/polygonERC20/umbriaNetworkPolygonAbi.json';
import mahaDaoPolygonAbi from '../../assets/polygonERC20/mahaDaoPolygonAbi.json';

//polygon erc20 icons
import umbriaPolygonIcon from '../../assets/polygonERC20Icons/umbria.png'
import mahaDaoPolygonIcon from '../../assets/polygonERC20Icons/mahadao.png'

//solana icons 
import solanaIcon from '../../assets/solanaIcons/solana.png'
import solrazrIcon from '../../assets/solanaIcons/solrazr.png'
import bonfidaIcon from '../../assets/solanaIcons/bonfida.png'
import meanfiIcon from '../../assets/solanaIcons/meanfi.png'



const polygonTokens = {
    MATIC: {
        icon: matic_icon.src,
        coingecko_id: 'matic-network',
        native: true,
    },
    UMBR: {
        ABI: umbriaPolygonAbi.abi,
        address: process.env.UMBRIA_POLYGON_ERC20,
        icon: umbriaPolygonIcon.src,
        coingecko_id: 'umbra-network',
        native: false,
    },
    MAHA: {
        ABI: mahaDaoPolygonAbi.abi,
        address: process.env.MAHADAO_POLYGON_ERC20,
        icon: mahaDaoPolygonIcon.src,
        coingecko_id: 'mahadao',
        native: false,
    },
}


const solanaTokens = {
    SOL: {
        icon: solanaIcon.src,
        coingecko_id: 'solana',
        native: true,
    },
    MEAN: {
        icon: meanfiIcon.src,
        coingecko_id: 'meanfi',
        splTokenPubKey: process.env.MEAN_SPL_TOKEN,
        native: false,
    },
    SOLR: {
        icon: solrazrIcon.src,
        coingecko_id: 'solrazr',
        splTokenPubKey: process.env.SOLRAZR_SPL_TOKEN,
        native: false,
    },
    FIDA: {
        icon: bonfidaIcon.src,
        coingecko_id: 'bonfida',
        splTokenPubKey: process.env.BONFIDA_SPL_TOKEN,
        native: false,
    }
}

const nearTokens = {
    NEAR: {
        icon: near_icon.src,
        coingecko_id: 'near',
        native: true,
    }
}

let TokenList = ({ tokens, setselectedToken, selectedToken }) => {
    return (
        Object.keys(tokens).map((token, i) => {
            return (<span key={i} onClick={() => { setselectedToken(token) }}>
                <img src={tokens[token].icon} alt="" />
                <p>{token}</p>
            </span>)
        })
    )
}

let EM = {
    INSUFFICIENT: 'Not Enough Funds! please try again',
    FAILED: 'transaction failed something went wrong! please try again',
    WRONG_CHAIN: 'Token requires Matic network, click here to switch'
}

export default function TippingFlow({ settippingFlowVisible, tippingFlowVisible, tipReviewInfo }) {

    let { review_details, setreview_details } = tipReviewInfo;
    const [inputField, setInputField] = useState('');
    const [TOKENS, setTOKENS] = useState({});
    const [tokenPrice, settokenPrice] = useState(undefined)
    const [selectedToken, setselectedToken] = useState('MATIC');
    const { chains, error, isLoading: switchNetworkLoading, pendingChainId, switchNetwork, switchNetworkAsync } =
        useSwitchNetwork()

    useEffect(() => {
        if (review_details.chain == 'sol') {
            setTOKENS(solanaTokens);
            setselectedToken('SOL')
        }
        else if (review_details.chain == 'matic') {
            setTOKENS(polygonTokens);
            setselectedToken('MATIC')

        }
        else if (review_details.chain == 'near') {
            setTOKENS(nearTokens);
            setselectedToken('NEAR')
        }

    }, [review_details.chain])

    console.log(selectedToken);
    console.log(tokenPrice);

    const fetchTokenPrice = async () => {
        console.log("api req");
        let res = await Promise.all(Object.keys(TOKENS).map((ele) => {
            let coingecko_id = TOKENS[ele].coingecko_id;
            return axios.get(`https://api.coingecko.com/api/v3/coins/${coingecko_id}`)
        }))
        // data.market_data.current_price.usd
        let priceObject = {};
        res.forEach((ele) => {
            priceObject[ele.data.id] = ele.data.market_data.current_price.usd
        })
        settokenPrice(priceObject);
    }

    useEffect(() => {
        fetchTokenPrice()
    }, [TOKENS])

    const calculatePrice = () => {
        if (!tokenPrice) {
            return {
                valueInUSD: 0,
                noOfTokens: 0
            }
        }
        else {
            let price = tokenPrice[TOKENS[selectedToken]?.coingecko_id];
            let noOfTokens = inputField;
            let valueInUSD = price * noOfTokens;
            console.log('USD', valueInUSD);
            return {
                valueInUSD,
                noOfTokens
            }
        }
    }

    const [errorMessage, seterrorMessage] = useState(undefined);
    const [successScreen, setsuccessScreen] = useState(false);
    let [isLoading, write] = useTipToken(review_details, selectedToken, calculatePrice().noOfTokens, seterrorMessage, setsuccessScreen);
    let [isLoadingMatic, sendTransactionAsync] = useTipNativeMatic(review_details, selectedToken, calculatePrice().noOfTokens, seterrorMessage, setsuccessScreen)
    let tipNativeSol = useTipNativeSol(review_details, selectedToken, calculatePrice().noOfTokens, seterrorMessage, setsuccessScreen)
    let tipSPLSol = usetipSPLtoken(review_details, selectedToken, calculatePrice().noOfTokens, seterrorMessage, setsuccessScreen)
    //let tipNativeNear = useTipNativeNear(review_details, selectedToken, calculatePrice().noOfTokens, seterrorMessage, setsuccessScreen)

    const intiateTransaction = async () => {
        if (inputField <= 0) {
            return alert("Please Enter a valid tipping Amount")
        }
        let chain = review_details.chain || 'eth'
        console.log(chain)
        if (chain == 'eth') {
            if (selectedToken == 'MATIC') {
                sendTransactionAsync();
            }
            else {
                write()
            }
        }
        else if (chain == 'sol') {
            if (selectedToken == 'SOL') {
                tipNativeSol();
            }
            else {
                tipSPLSol();
            }
        }
        else if (chain == 'near') {
            if (selectedToken == 'NEAR') {
                tipNativeNear();
            }
        }
    }

    if (!tippingFlowVisible) return <></>
    return (
        <section className={styles.tippingFlow}>
            <div className={styles.window}>
                {(successScreen) &&
                    <div className={styles.sucessMessage}>
                        <span className={styles.animation}>
                            <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json" background="transparent" speed="1" style={{ width: "40%", height: "auto", marginBottom: "30px" }} autoplay></lottie-player>
                        </span>
                        <p>Transaction has been initiated successfully</p>
                        <Button onClick={() => { setTimeout(() => { settippingFlowVisible(false); }, 0) }} type={"secondary"} label="Close"></Button>
                    </div>
                }
                <div className={styles.options}>
                    {/* <img src={setting.src} alt="" /> */}
                    <img onClick={() => { seterrorMessage(undefined); settippingFlowVisible(false) }} src={close_icon.src} alt="" />
                </div>
                <h1 className={styles.title}>Tip the reviewer</h1>
                <h3 className={styles.subtitle}>Please enter the amout you would like to tip.</h3>
                <h4 className={styles.tag}>Pay With</h4>
                <span className={styles.tokenInput}>
                    <div className={styles.tokenSymbol}>
                        <span className={styles.icon}>
                            <img key={selectedToken} className={styles.icon} src={TOKENS[selectedToken]?.icon} alt="" />
                        </span>
                        <p>{selectedToken}</p>
                        <img className={styles.down_arrow} src={down_arrow.src} alt="" />
                        <div className={styles.tokenDropDownWrap}>
                            <div className={styles.tokenDropDown}>
                                <TokenList selectedToken={selectedToken} setselectedToken={setselectedToken} tokens={TOKENS} />
                            </div>
                        </div>
                    </div>
                    <span className={styles.amount}>
                        <input
                            value={inputField}
                            onChange={(e) => { setInputField(e.target.value) }}
                            type={'number'}
                            placeholder={'0.00'}
                        />
                        {(inputField > 0) && <p>${parseFloat(calculatePrice().valueInUSD).toFixed(2)} USD</p>}
                    </span>
                </span>
                {(errorMessage)
                    ? <span onClick={
                        async () => {
                            if (EM.WRONG_CHAIN == errorMessage) {
                                let res = await switchNetworkAsync(137);
                            }
                            seterrorMessage(undefined)
                        }}
                        className={styles.errorMessage}>
                        <img src={error_icon.src} alt="" />
                        <p>{errorMessage}</p>
                    </span>
                    : <Button onClick={intiateTransaction} label={"Tip the Amount"} />}
            </div >
        </section >
    )
}

const useTipNativeNear = (review_details, selectedToken, noOfTokens, seterrorMessage, setsuccessScreen) => {
    const { connect, keyStores, WalletConnection, utils } = nearAPI;
    const [connectConfig, setConnectConfig] = useState({});
    useEffect(() => {
        const connectionConfig = {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        setConnectConfig(connectionConfig);
    }, [])

    // sends NEAR tokens
    let sendTransaction = async () => {

        // connect to NEAR
        const nearConnection = await connect(connectConfig);

        // create wallet connection
        const walletConnection = new WalletConnection(nearConnection);

        console.log('review details address: ', review_details.address);
        console.log('connecting to wallet: ', walletConnection.getAccountId());
        const account = await nearConnection.account(walletConnection.getAccountId());
        await account.sendMoney(
            review_details.address, // receiver account
            utils.format.parseNearAmount(noOfTokens) // amount in yoctoNEAR
        );
    }
    return sendTransaction
}

const useTipNativeMatic = (review_details, selectedToken, noOfTokens, seterrorMessage, setsuccessScreen) => {


    const { chain } = useNetwork()
    const { chains, error, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()



    console.log(noOfTokens);
    const { config } = usePrepareSendTransaction({
        request:
        {
            to: review_details.address,
            value: ethers.utils.parseEther(`${noOfTokens}` || '0')
        },
    })

    useEffect(() => {
        seterrorMessage(undefined);
    }, [selectedToken])

    const { data, isLoading, isSuccess, sendTransaction, sendTransactionAsync } = useSendTransaction(config);


    useEffect(() => {

    }, [isSuccess])

    let SendTransactionAsync = async () => {
        if (chain?.id != '137') {
            return seterrorMessage(EM.WRONG_CHAIN);
        }
        try {
            await sendTransactionAsync()
            setsuccessScreen(true);
        } catch (error) {
            return seterrorMessage(EM.FAILED)
        }
    }

    return [isLoading, SendTransactionAsync]
}

const useTipToken = (review_details, selectedToken, noOfTokens, seterrorMessage, setsuccessScreen) => {

    console.log(noOfTokens);
    const { config } = usePrepareContractWrite({
        addressOrName: polygonTokens[selectedToken]?.address,
        contractInterface: polygonTokens[selectedToken]?.ABI,
        functionName: 'transfer',
        args: [review_details.address, ethers.utils.parseEther(`${noOfTokens}` || '0')],
        onError(error) {
            console.log(error)
        },
    })

    const { chain } = useNetwork()
    const { chains, error, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    useEffect(() => {
        seterrorMessage(undefined);
    }, [selectedToken])

    const { isLoading, write } = useContractWrite({
        config,
        onError(error) {
            console.log(error);
            seterrorMessage(EM.INSUFFICIENT);
        },
        onSuccess(data) {
            console.log('Success', data)
            //alert('SUCCESS');
            setsuccessScreen(true)
        },
    })

    let initiateTransaction = async () => {
        if (chain?.id != '137') {
            return seterrorMessage(EM.WRONG_CHAIN);
        }
        console.log(write())
    }

    return [isLoading, initiateTransaction]
}

const getProvider = () => {
    if ("solana" in window) {
        const anyWindow = window;
        const provider = anyWindow.solana;
        if (provider.isPhantom) {
            console.log(provider)
            return provider;
        }
    }
    window.open("https://phantom.app/", "_blank");
};

const NETWORK = clusterApiUrl("mainnet-beta");
const connection = new Connection(NETWORK);

let useTipNativeSol = (review_details, selectedToken, noOfTokens, seterrorMessage) => {
    const createTransferTransaction = async (lamports) => {
        let provider = getProvider();
        const resp = await provider.connect();
        if (!provider.publicKey) return;
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: review_details.address,
                lamports: lamports,

            })
        );
        transaction.feePayer = provider.publicKey;
        // addLog("Getting recent blockhash");
        const anyTransaction = transaction;
        anyTransaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        return transaction;
    };
    const sendTransaction = async (transaction) => {
        let provider = getProvider();
        try {
            if (!transaction) return;
            let signed = await provider.signTransaction(transaction);
            // addLog("Got signature, submitting transaction");
            let signature = await connection.sendRawTransaction(signed.serialize());
            // setdialogType(SUCCESS);
            //  addLog("Submitted transaction " + signature + ", awaiting confirmation");
            await connection.confirmTransaction(signature);
            //  addLog("Transaction " + signature + " confirmed");
        } catch (err) {
            // setdialogType(FAILURE)
            console.log(err);
            console.warn(err);
            //  addLog("[error] sendTransaction: " + JSON.stringify(err));
        }
    };


    return async () => {
        let transaction = await createTransferTransaction(1000000000 * noOfTokens);
        await sendTransaction(transaction);
        setsuccessScreen(true);
    };
}

const usetipSPLtoken = (review_details, selectedToken, noOfTokens, seterrorMessage) => {

    const createTransferTransactionSplToken = async (splTokenAmount, splTokenPubKey) => {
        console.log('t amount', splTokenAmount);
        console.log('pkey', splTokenPubKey);

        let provider = getProvider();
        const resp = await provider.connect();
        if (!provider.publicKey) return alert('return');
        console.log('Token amount ', splTokenAmount)
        let publicKey = splTokenPubKey;
        const mySplToken = new PublicKey(publicKey);
        const mint = await getMint(connection, mySplToken);
        console.log('zzz');
        const ownerPublicKey = new PublicKey(provider.publicKey);
        const destPublickey = new PublicKey(review_details.address)
        console.log('xxx');
        console.log(process.env.SPLTOKENACCOUNTSPAREKEY);
        const feePayer = Keypair.fromSecretKey(
            bs58.decode(process.env.SPLTOKENACCOUNTSPAREKEY)
        )
        console.log('---');
        const associatedSourceTokenAddr = await getOrCreateAssociatedTokenAccount(
            connection,
            ownerPublicKey,
            mySplToken,
            ownerPublicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        // setsplAccountLoad(true);
        const associatedDestTokenAddr = await getOrCreateAssociatedTokenAccount(
            connection,
            feePayer,
            mySplToken,
            destPublickey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        console.log(associatedSourceTokenAddr);
        console.log(associatedDestTokenAddr);

        // setsplAccountLoad(false)
        let decimals = mint.decimals;
        let valueDesi = Math.pow(10, decimals);
        let amount = (valueDesi * splTokenAmount).toFixed(0);
        const tokens = BigNumber.from(`${amount}`);
        console.log('token ', tokens)
        let transaction = new Transaction().add(
            createTransferCheckedInstruction(
                associatedSourceTokenAddr.address,
                mySplToken,
                associatedDestTokenAddr.address,
                ownerPublicKey,
                tokens,
                mint.decimals,
            )
        );
        transaction.feePayer = provider.publicKey;
        // addLog("Getting recent blockhash");
        const anyTransaction = transaction;
        anyTransaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        if (transaction) {
            console.log("Txn created successfully", transaction);
        }
        return transaction;
    };

    const sendTransaction = async (transaction) => {
        let provider = getProvider();
        try {
            if (!transaction) return;
            let signed = await provider.signTransaction(transaction);
            // addLog("Got signature, submitting transaction");
            let signature = await connection.sendRawTransaction(signed.serialize());
            // setdialogType(SUCCESS);
            //  addLog("Submitted transaction " + signature + ", awaiting confirmation");
            await connection.confirmTransaction(signature);
            //  addLog("Transaction " + signature + " confirmed");
        } catch (err) {
            // setdialogType(FAILURE)
            console.log(err);
            console.warn(err);
            //  addLog("[error] sendTransaction: " + JSON.stringify(err));
        }
    };

    return async () => {
        let transaction = await createTransferTransactionSplToken(`${parseFloat(noOfTokens).toFixed(2)}`, solanaTokens[selectedToken].splTokenPubKey);
        await sendTransaction(transaction)
        setsuccessScreen(true);
        return true
    }
}