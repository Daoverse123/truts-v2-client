import React, { useState, useEffect } from 'react'
import styles from './addReview.module.scss'
import Link from 'next/link'
import axios from 'axios'
import Head from 'next/head';
import openNewTab from '../../utils/openNewTab';
import { useSignMessage } from 'wagmi'

const Chains = ['Ethereum', 'Solana']

//assets
import left_arrow from '../../assets/left-arrow.png'
import star_blank_gradient from '../../assets/icons/star_blank_gradient.svg'
import star_filled_gradient from '../../assets/icons/star_filled_gradient.svg'

//components
import Button from '../../components/Button'
import Nav from '../../components/Nav'
import WalletConnect from '../../components/WalletConnect'

const API = process.env.API

const status = { READY: "READY", LOADING: "LOADING", ERROR: "ERROR" }

function AddReview({ dao_name, guild_id, uid, slug }) {

    const [walletConnectVisible, setwalletConnectVisible] = useState(false);
    const [reviewForm, setreviewForm] = useState({ dao_name, guild_id, rating: 0, review_desc: "" });
    const [tc, settc] = useState(false);
    const [pageState, setpageState] = useState(status.READY)

    const { signMessageAsync } = useSignMessage({
        message: 'sign the review',
    })

    useEffect(() => {
        let wallet_state = localStorage.getItem('wallet_state');
        if (!wallet_state) {
            setwalletConnectVisible(true)
        }
    }, [])

    const dialValueSetter = (key, value) => {
        setreviewForm((rf) => { rf[key] = value; return { ...rf } })
    }

    const starCompSetter = (value) => {
        setreviewForm((rf) => { rf['rating'] = value; return { ...rf } })
    }

    const submitReview = async (e) => {
        e.preventDefault();
        if (!tc) {
            return alert("Please check the terms and conditions")
        }
        else if (reviewForm.rating == 0) {
            return alert("Rate your experience cannot be empty")
        }
        else if (reviewForm.review_desc.length <= 30) {
            return alert("Please tell us your experience and review in more than 30 letters.")
        }

        let public_address = JSON.parse(localStorage.getItem('wallet_state'))?.address;
        let chain = (JSON.parse(localStorage.getItem('wallet_state'))?.chain == 'Solana') ? "sol" : "eth"
        if (!public_address || public_address?.length < 5) { return (setwalletConnectVisible(true)) }
        try {
            setpageState(status.LOADING)
            let sign_msg;

            if (chain == 'eth') {
                sign_msg = await ethSign('sign message', signMessageAsync);
            }
            if (chain == 'sol') {
                sign_msg = await solSign('sign message');
            }
            if (!sign_msg) {
                return setpageState(status.ERROR)
            }

            let res = await axios.post(`${API}/review-v2/add-review`, { validation: { uid, slug }, review: { ...reviewForm, chain, public_address } }, { withCredentials: true, baseURL: API });
            if (res.status == 200) {
                window.location = `${API}/review-v2/auth-review?r_id=${res.data.r_id}`
                return true;
            }
        } catch (error) {
            setpageState(status.ERROR)
        }
    }

    console.log(reviewForm);
    return (
        <>
            <WalletConnect walletConnectVisible={walletConnectVisible} setwalletConnectVisible={setwalletConnectVisible} />
            <div className={styles.reviewPage}>
                <Head>
                    <script defer src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
                    <link href="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json" rel="preload"></link>
                    <link href="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json" rel="preload"></link>
                    <link href="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json" rel="preload"></link>
                    <link href={star_blank_gradient.src} rel="preload"></link>
                    <link href={star_filled_gradient.src} rel="preload"></link>
                </Head>
                <Nav />
                <div className={styles.mainCon}>
                    <div className={styles.breadCrum}>
                        <img src={left_arrow.src} alt="" />
                        <Link href={`./dao/${slug}`}>
                            <span>
                                <p>Add review for</p>
                                <h3>{dao_name}</h3>
                            </span>
                        </Link>
                    </div>

                    {(pageState == status.LOADING) && <LoadingState />}
                    {(pageState == status.ERROR) && <ErrorState slug={slug} />}

                    {(pageState == status.READY) && <form className={styles.reviewForm}>
                        <div className={styles.field}>
                            <h3 className={styles.label}>Rate your experience</h3>
                            <StartComponent setter={starCompSetter} />
                        </div>
                        <div className={styles.field}>
                            <h3 className={styles.label}>Tell us about your experience</h3>
                            <textarea
                                onChange={(e) => {
                                    setreviewForm((rf) => {
                                        rf['review_desc'] = e.target.value;
                                        return { ...rf }
                                    })
                                }}
                                placeholder='This is where you will write your review. Explain what happened, and leave out offensive words. Keep your feedback honest, helpful and constructive.' className={styles.desc_input} name="" id="" cols="30" rows="10"></textarea>
                        </div>
                        <h1 className={styles.title}>Please rate the following experiences</h1>
                        <div className={styles.dialsCon}>
                            <SliderComp label={"Do you resonate with the vibes in the DAO community?"} setter={dialValueSetter} />
                            <SliderComp label={"How would you rate the DAO’s onboarding experience?"} setter={dialValueSetter} />
                            <SliderComp label={"Do you believe your opinions matter in the DAO community?"} setter={dialValueSetter} />
                            <SliderComp label={"Do you think that DAO has great organizational structure?"} setter={dialValueSetter} />
                            <SliderComp label={"Would you recommed this DAO/community to your friend?"} setter={dialValueSetter} />
                            <SliderComp label={"Do you think there are great incentives for DAO members?"} setter={dialValueSetter} />
                        </div>
                        <div className={styles.tc}>
                            <input onChange={() => { settc(!tc) }} className={styles.checkbox} type="checkbox" />
                            <p>I confirm this review is about my own genuine experience. I am eligible to leave this review, and have not been offered any incentive or payment to leave a review for this company.</p>
                        </div>
                        <Button onClick={submitReview} label={"Submit Review"} />
                    </form>}
                </div>
            </div>
        </>
    )
}

//SSR DATA DAO PAGE
export async function getServerSideProps(ctx) {
    let { uid } = ctx.query;
    let target = ctx.req.cookies['target']
    let validation = await axios.get(`${API}/review-v2/user-validation?uid=${uid}&slug=${target}`)

    let { isMember, isDuplicate, dao_name, guild_id } = validation.data;

    if (!isMember) {
        return {
            redirect: {
                destination: '/status/not-member'
            }
        }
    }
    else if (isDuplicate) {
        return {
            redirect: {
                destination: '/status/duplicate-review'
            }
        }
    }

    return {
        props: {
            dao_name,
            guild_id,
            uid,
            slug: target
        }
    }
}

const StartComponent = ({ setter }) => {
    const [rating, setrating] = useState(0);
    const [selector, setselector] = useState(0);

    useEffect(() => {
        setter(rating);
    }, [rating])

    return (
        <span className={styles.starComponent}
            onMouseLeave={() => {
                setselector(0)
            }}
        >
            {[1, 2, 3, 4, 5].map((r) => {
                if (r <= selector || r <= rating) {
                    return (
                        <img
                            onMouseEnter={() => {
                                setselector(r)
                            }}
                            onClick={() => {
                                setrating(r)
                            }}
                            key={r + 'star' + 'filled'}
                            src={star_filled_gradient.src}
                            alt=""
                        />
                    )
                }
                else {
                    return (
                        <img
                            onMouseEnter={() => {
                                setselector(r)
                            }}
                            onClick={() => {
                                setrating(r)
                            }}
                            key={r + 'star' + 'blank'}
                            src={star_blank_gradient.src}
                            alt=""
                        />
                    )
                }
            })}
        </span>
    )
}


function SliderComp({ setter, label }) {
    const [sliderValue, setsliderValue] = useState(50);

    useEffect(() => {
        setter(questionMap[label], sliderValue);
    }, [sliderValue])

    return (
        <span>
            <h4 className={styles.dialLabel}>{label}</h4>
            <div className={styles.slider}>
                <span className={styles.sliderComp}>
                    <div className={styles.sliderBarBg}>
                        {
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                                return (
                                    <span key={"marker" + i} className={styles.marker}></span>
                                )
                            })
                        }
                    </div>
                    <div
                        style={{ width: `${Math.min(sliderValue, 97)}%` }}
                        className={styles.sliderBar}
                    />
                    <input type="range"
                        min="0" max="100" step="10"
                        value={sliderValue}
                        onChange={(e) => {
                            setsliderValue(parseInt(e.target.value));
                        }}
                    />
                </span >
                <p className={styles.value} >{sliderValue / 10}</p>
            </div >
        </span>
    )
}

const ethSign = async (msg, signMessageAsync) => {
    try {
        let res = await signMessageAsync();
        return res;
    } catch (error) {
        console.log(error);
        return undefined
    }
}

const solSign = async (msg) => {

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
        return signedMessage
    } catch (error) {
        console.log(error);
        return undefined
    }
}

const LoadingState = () => {
    return (
        <div className={styles.response}>
            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json" background="transparent" speed="1" style={{ width: "75%", height: "100%" }} loop autoplay></lottie-player>
            <span className={styles.message}>Hang on a sec! We are submitting your review.</span>
        </div >
    )
}

const ErrorState = ({ slug }) => {
    return (
        <div className={styles.response}>
            <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json" background="transparent" speed="1" style={{ width: "60%", height: "100%", marginBottom: "30px" }} loop autoplay></lottie-player>
            <span className={styles.message}>
                <p>Sorry, something went wrong. Can you please try again :)</p>
                <Link href={`/dao/${slug}`}>
                    <Button label={'Try Again'} />
                </Link>
            </span>
        </div>
    )
}

const questionMap = {
    "Do you resonate with the vibes in the DAO community?": "resonate_vibes_rate",
    "How would you rate the DAO’s onboarding experience?": "onboarding_exp",
    "Do you believe your opinions matter in the DAO community?": "opinions_matter",
    "Do you think that DAO has great organizational structure?": "great_org_structure",
    "Would you recommed this DAO/community to your friend?": "friend_recommend",
    "Do you think there are great incentives for DAO members?": "great_incentives"
}

export default AddReview