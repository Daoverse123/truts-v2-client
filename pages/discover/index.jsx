import React, { useEffect, useState } from 'react'
import styles from './discover.module.scss'
import axios from 'axios'
import DoubleSlider from 'double-slider';

//components
import Nav from '../../components/Nav'
import DAOCard from '../../components/DAOCard'

//assets
import downArrow from '../../assets/icons/down_arrow.svg'

let sideNavTabs = {
    "Types of Communities": "",
    "Network Chains": "",
    "Discord Followers": "",
    "Twitter Followers": "",
    "Ratings": ""
}

// CONSTANTS
const API = process.env.API
const CATEGORY_LIST = ['all', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Event']

function Discover({ daoList_ssr }) {

    console.log(daoList_ssr);

    const [collapseState, setcollapseState] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false })

    return (
        <div className={styles.discoverPage}>
            <Nav />
            <h1 className={styles.title}>
                Our Wall of Communities
            </h1>
            <div className={styles.mainCon}>
                <div className={styles.sideNav}>
                    {
                        Object.keys(sideNavTabs).map((ele, i) => {
                            return (
                                <>
                                    <span onClick={
                                        () => {
                                            setcollapseState((sc) => {
                                                sc[i] = !sc[i];
                                                return { ...sc }
                                            })
                                        }
                                    } className={styles.option} key={i}>
                                        <p>{ele}</p>
                                        <img src={downArrow.src} alt="" />
                                    </span>
                                    <GetSection label={ele} idx={i} collapseState={collapseState} />
                                    <span className={styles.divider} />
                                </>
                            )
                        })
                    }
                </div>
                <div className={styles.gallery}>
                    <div className={styles.daoList}>
                        {
                            daoList_ssr['all'].map((ele, idx) => {
                                return (
                                    <DAOCard key={'card' + idx} data={ele} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
    // Fetch data from external API
    let res = await Promise.all(
        [getDaolistAPI(), getLeaderboard()]
    )
    // Pass data to the page via props
    return { props: { daoList_ssr: res[0], leaderboard_ssr: res[1] } }
}

// API CALLS

//get list of daos
const getDaolistAPI = async () => {
    //gets initial 20 doas
    let url = `${API}/dao/get-dao-list?limit=20&page=1`;
    let res = await axios.get(url);
    let dao_data_obj = {};
    CATEGORY_LIST.forEach((ele) => {
        dao_data_obj[ele] = [];
    })
    dao_data_obj['all'] = res.data.results
    return dao_data_obj;
}

//get Leaderboard
const getLeaderboard = async () => {
    let url = `${API}/dao/leaderboard`;
    let res = await axios.get(url);
    //console.log(res.data)
    return res.data
}

const GetSection = ({label, idx, collapseState}) => {
    if (label == Object.keys(sideNavTabs)[0] && collapseState[0]) {
        return (
            <TypesOfCommunities />
        )
    }
    if (label == Object.keys(sideNavTabs)[1] && collapseState[1]) {
        return (
            <NetworkChains visible={collapseState[1]} />
        )
    }
    if (label == Object.keys(sideNavTabs)[2] && collapseState[2]) {
        return (
            <SliderComp visible={collapseState[2]} label={"Discord Followers"} min={0} max={50000} />
        )
    }
    if (label == Object.keys(sideNavTabs)[3] && collapseState[3]) {
        return (
            <SliderComp visible={collapseState[3]} label={"Twitter Followers"} min={0} max={50000} />
        )
    }
    else{ return <></>}
}

const TypesOfCommunities = () => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset}>Reset</p>
            {
                [
                    'All',
                    'Investment',
                    'Marketplace',
                    'Social',
                    'NFT',
                    'Service',
                    'Marketplace'
                ].map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}


const NetworkChains = () => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset}>Reset</p>
            {
                [
                    'All',
                    'Ethereum',
                    'Polygon',
                    'Solana',
                    'Tezos',
                    'Near',
                    'Cardano'
                ].map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}

const SliderComp = ({ label, min, max }) => {

    const [sliderValue, setsliderValue] = useState({ min, max })

    useEffect(() => {
        if (!document.getElementById('my-slider' + label)) { return '' }
        const mySlider = new DoubleSlider(document.getElementById('my-slider' + label));
        mySlider.addEventListener('slider:change', () => {
            const { min, max } = mySlider.value;
            setsliderValue({ min, max })
            console.log(`Min is: ${min}, max is: ${max}`);
        });
    }, [])

    return (
        <span className={styles.sliderComp}>
            <div id={"my-slider" + label}
                className={styles.sliderBar}
                data-min={min}
                data-max={max}
                data-range={max}
            ></div>
            <span className={styles.values}>
                <p>0</p>
                <h1>{sliderValue.min}{`-`}{sliderValue.max}</h1>
                <p>50000</p>
            </span>
        </span>
    )
}


export default Discover