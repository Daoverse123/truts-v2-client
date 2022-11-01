import React, { useEffect, useState, useReducer } from 'react'
import styles from './discover.module.scss'
import axios from 'axios'
import DoubleSlider from 'double-slider';
import { useMediaQuery } from 'react-responsive'
import Head from 'next/head'
import { removeDuplicates } from 'remove-duplicates-from-an-array-of-object';

//components
import Nav from '../../components/Nav'
import DAOCard from '../../components/DAOCard'
import Button from '../../components/Button'

//assets
import downArrow from '../../assets/icons/down_arrow.svg'
import star_blank_gradient from '../../assets/icons/star_blank_gradient.svg'
import star_filled_gradient from '../../assets/icons/star_filled_gradient.svg'
import close_btn from '../../assets/icons/close_icon.svg'

let sideNavTabs = {
    "Categories": "",
    "Network Chains": "",
    "Ratings": "",
    "Discord Member Count": "",
    "Twitter Follower Count": "",
}

// CONSTANTS
const API = process.env.API
//const CATEGORY_LIST = ['All', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Legal', `NEAR Ecosystem`]
const CATEGORY_LIST = [
    'DAO',
    'Media',
    'Investors',
    'Service',
    'Grant',
    'Social',
    'DAO tool',
    'Defi',
    'CeFi',
    'TradeFi',
    'BlockFi',
    'Lending',
    'Yield aggregator',
    'Stablecoin',
    'NFT',
    'Metaverse',
    'Art',
    'Music',
    'NFT marketplace',
    'Utilities',
    'Analytics',
    'Payment',
    'Oracle',
    'Games',
    'Infrastructure',
    'Wallet',
    'Indexer',
    'Storage',
    'Identity',
    'Exchange',
    'Community',
    'Guild',
    'Marketing tool',
    'Public Good',
    'Education',
    'Investment'
];


let discordFollowers = {
    '0 to 5K': { min: 0, max: 5000 },
    '5K to 15K': { min: 0, max: 15000 },
    '15K & 30k': { min: 15000, max: 30000 },
    '30K & 50k': { min: 30000, max: 50000 },
    '50K & 100k': { min: 50000, max: 100000 },
    '100k+': { min: 100000, max: Infinity },
}

let twitterFollowers = {
    '0 to 20k': { min: 0, max: 20000 },
    '20K to 50K': { min: 20000, max: 50000 },
    '50K to 100k': { min: 50000, max: 100000 },
    '100K+': { min: 50000, max: Infinity }
}

let chainMap = {
    'All': "all",
    'Arbitrum': 'arbitrum-one',
    'Binance Smart Chain': 'binance-smart-chain',
    'Cardano': 'cardano',
    'Ethereum': 'ethereum',
    'Near': 'near',
    'Polygon': 'polygon-pos',
    'Solana': 'solana',
    'Tezos': 'tezos'
}

let initialState = {
    "sort by": "HL",
    "Types of Communities": ["All"],
    "Network Chains": ["All"],
    "Discord Members": { min: 0, max: 0 },
    "Twitter Followers": { min: 0, max: 0 },
    "Ratings": [0, 1, 2, 3, 4, 5]
}

let actionTypes = {
    "COMMUNITY": "COMMUNITY",
    "CHAIN": "CHAIN",
    "DISCORD": "DISCORD",
    "TWITTER": "TWITTER",
    "RATING": "RATING",
    "SORT": "SORT"
}

let checkboxManager = (inputLabel, action, state) => {
    if (action.payload.label == 'All') {
        state[inputLabel] = ['All'];
        return { ...state }
    }
    if (action.payload.type == true) {
        state[inputLabel] = state[inputLabel].filter(ele => !(ele == `All`))
        state[inputLabel] = [...new Set([...state[inputLabel], action.payload.label])]
        return { ...state };
    }
    if (action.payload.type == false) {
        let index = state[inputLabel].indexOf(action.payload.label);
        state[inputLabel] = state[inputLabel].filter(ele => !(ele == action.payload.label))
        if (state[inputLabel].length == 0) {
            state[inputLabel] = ['All'];
            return { ...state };
        }
        return { ...state };
    }
    return { ...state };
}

let checkboxManagerRating = (inputLabel, action, state) => {
    if (action.payload.type == true) {
        state[inputLabel] = [...new Set([...state[inputLabel], action.payload.label])]
        return { ...state };
    }
    if (action.payload.type == false) {
        let index = state[inputLabel].indexOf(action.payload.label);
        state[inputLabel] = state[inputLabel].filter(ele => !(ele == action.payload.label))
        if (state[inputLabel].length == 0) {
            state[inputLabel] = [1, 2, 3, 4, 5];
            return { ...state };
        }
        return { ...state };
    }
    return { ...state };
}

let reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "COMMUNITY":
            return checkboxManager('Types of Communities', action, state)
        case "CHAIN":
            return checkboxManager('Network Chains', action, state)
        case "DISCORD":
            state['Discord Members'].min = action.payload.min;
            state['Discord Members'].max = action.payload.max;
            return { ...state }
        case "TWITTER":
            state['Twitter Followers'].min = action.payload.min;
            state['Twitter Followers'].max = action.payload.max;
            return { ...state }
        case "RATING":
            return checkboxManagerRating('Ratings', action, state)
        case "SORT":
            state['sort by'] = action.payload;
            return { ...state }
        default:
            return state;
    }
}


function Discover({ daoList_ssr_init, paginationConfig }) {

    console.log(paginationConfig)

    const [daoList_ssr, setdaoList_ssr] = useState(daoList_ssr_init);

    const [collapseState, setcollapseState] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false })

    const [state, dispatch] = useReducer(reducer, initialState);

    const [galleryLimit, setgalleryLimit] = useState(33);

    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    const [filtersVisible, setfiltersVisible] = useState(false);

    const [catCount, setcatCount] = useState({});

    useEffect(() => {
        setfiltersVisible(!isMobile);
    }, [isMobile])

    useEffect(() => {
        getDynamicLoad(daoList_ssr, setdaoList_ssr, paginationConfig, setcatCount)
        let query_category = window.location.href.split('=')[1];
        if (query_category) {
            dispatch({ type: actionTypes.COMMUNITY, payload: { label: query_category, type: true } })
        }
    }, [])


    console.log(daoList_ssr.length);

    const filteredList = (daos) => {

        //filter by Types of Communities
        let filterByCommunities = (daos) => {
            if (state['Types of Communities'].includes('All')) {
                return daos
            }
            return daos.filter((ele) => {
                let true_cond = false;
                ele.dao_category.forEach((cat) => {
                    if (state['Types of Communities'].includes(cat)) {
                        console.log("++")
                        true_cond = true;
                    }
                })
                if (true_cond) {
                    return true
                }
                return false
            })
        }

        //twitter/discord limiting
        const tdRangeLimit = (daos) => {
            //discord member count limit (0,0) show all

            let filterMethod = (daos, state_type, key_name) => {
                if (state[state_type].min == 0 && state[state_type].max == 0) {
                    return daos;
                }

                return daos.filter((ele) => {
                    if (ele[key_name] <= state[state_type].max && ele[key_name] >= state[state_type].min) {
                        return true;
                    }
                    return false
                })
            }

            let d_filtered_daos = filterMethod(daos, "Discord Members", "discord_members");

            return filterMethod(d_filtered_daos, "Twitter Followers", "twitter_followers");
        }


        // star rating filter 
        let starFilter = (daos) => {
            return daos.filter((ele) => {
                if (state['Ratings'].includes(Math.ceil(ele.average_rating))) {
                    return true
                }
                return false;
            })
        }

        //chain filter 
        let chainFilter = (daos) => {
            if (state['Network Chains'].includes('All')) {
                return daos;
            }
            return daos.filter((ele) => {
                let true_condition = false;
                state['Network Chains'].forEach((chain) => {
                    if (ele.chain.includes(chainMap[chain])) {
                        true_condition = true;
                    }
                })
                return true_condition;
            })
        }

        //sorting
        let sort_by_rating = (daos) => {
            if (state['sort by'] == 'HL') {
                let sorted_daos = daos.sort(
                    (a, b) => b.average_rating - a.average_rating
                )
                if (sorted_daos.length > 0) {
                    return sorted_daos
                }
            }
            if (state['sort by'] == 'LH') {
                let sorted_daos = daos.sort(
                    (a, b) => a.average_rating - b.average_rating
                )
                if (sorted_daos.length > 0) {
                    return sorted_daos
                }
            }
            return daos;
        }


        return sort_by_rating(starFilter(tdRangeLimit(filterByCommunities(chainFilter(daos))))).sort((a, b) => { return b.review_count - a.review_count });

    }

    let filteredDaoList = filteredList(daoList_ssr);

    console.log(state);

    return (
        <div className={styles.discoverPage}>
            <Nav isFloating />
            <h1 className={styles.title}>
                Our Wall of Communities
            </h1>
            <div className={styles.mainCon}>
                {(filtersVisible) && <div className={styles.sideNav}>
                    <span className={styles.mobileFilterHeadder}>
                        <img onClick={() => {
                            setfiltersVisible(false);
                        }} src={close_btn.src} alt="" /><p>Filters</p>
                    </span>
                    <SortComp state={state} dispatch={dispatch} />
                    {
                        Object.keys(sideNavTabs).map((ele, i) => {
                            return (
                                < >
                                    <span onClick={
                                        () => {
                                            setcollapseState((sc) => {
                                                sc[i] = !sc[i];
                                                return { ...sc }
                                            })
                                        }
                                    } className={styles.option} key={i + 'sd'}>
                                        <p >{ele}</p>
                                        <img src={downArrow.src} alt="" />
                                    </span>
                                    <GetSection catCount={catCount} key={i + 'gsd'} state={state} dispatch={dispatch} label={ele} idx={i} collapseState={collapseState} />
                                    <span key={i + 'dv'} className={styles.divider} />
                                </>
                            )
                        })
                    }
                </div>}
                <div className={styles.gallery}>
                    <div key={JSON.stringify(state)} className={styles.daoList}>
                        {
                            filteredDaoList.map((ele, idx) => {
                                return (
                                    <DAOCard key={idx + '_' + ele.dao_name} data={ele} />
                                )
                            }).slice(0, galleryLimit)
                        }
                    </div>
                    {(galleryLimit < filteredDaoList.length + 1) && < Button onClick={() => { setgalleryLimit(galleryLimit + 15) }} label={"show more"} />}
                </div>
            </div>

            <div className={styles.mobileFilterNav}>
                <button onClick={() => {
                    setfiltersVisible(true)
                }}>Filters</button>
            </div>

        </div>
    )
}

//SSR DATA Discover PAGE
export async function getServerSideProps(ctx) {
    // Fetch data from external API
    let { res, paginationConfig } = await getDaolistAPI()

    // Pass data to the page via props
    return { props: { daoList_ssr_init: res, paginationConfig: paginationConfig } }
}

// API CALLS

//get list of daos
const getDaolistAPI = async () => {
    //gets initial 20 doas
    let url = `${API}/dao/get-dao-list?limit=100&page=1`;
    let res = await axios.get(url);
    console.log(res);
    return { res: res.data.results, paginationConfig: { lastPage: res.data.lastPage, limit: res.data.limit } }
}

//dynamic load all the daos
const getDynamicLoad = async (daoList_ssr, setdaoList_ssr, paginationConfig, setcatCount) => {
    //gets initial 20 doas
    let daoList_ssr_current = daoList_ssr;
    let { lastPage, limit } = paginationConfig;

    let requestArray = [];

    for (let i = 1 + 1; i <= lastPage; i++) {
        let url = `${API}/dao/get-dao-list?limit=${limit}&page=${i}`
        let apiRequest = axios.get(url);
        requestArray.push(apiRequest);
    }

    let allPagesRes = await Promise.all(requestArray);
    let daoList_ssr_final
    if (allPagesRes[lastPage - 2].status == 200) {
        daoList_ssr_final = [...daoList_ssr_current];
        allPagesRes.forEach((ele) => {
            daoList_ssr_final = [...daoList_ssr_final, ...ele.data.results]
        })
    }
    const key = 'slug';
    const arrayUniqueByKey = [...new Map(daoList_ssr_final.map(item =>
        [item[key], item])).values()];
    setdaoList_ssr(arrayUniqueByKey);

    // const arrayUniqueByKey = removeDuplicates(daoList_ssr_final, 'slug');

    let catCount = {};

    CATEGORY_LIST.forEach((ele) => {
        catCount[ele] = 0
    })

    CATEGORY_LIST.forEach((ele) => {
        arrayUniqueByKey.forEach((alx) => {
            if (alx.dao_category.includes(ele)) {
                catCount[ele] = catCount[ele] + 1;
            }
        })
    })

    console.log(daoList_ssr_final.length)

    console.log(catCount)
    setcatCount(catCount)
}



const SortComp = ({ state, dispatch }) => {
    return (
        <span className={styles.sortComp}>
            <span className={styles.option}>
                <p>Sort by</p>
            </span>
            <span className={styles.typesOption}>
                <p>Ratings: High to Low</p>
                <input
                    checked={(state['sort by'] == 'HL')}
                    type={'checkbox'}
                    onClick={(e) => {
                        if (e.target.checked) {
                            dispatch({ type: actionTypes.SORT, payload: "HL" })
                        }
                    }}
                />
            </span>
            <span className={styles.typesOption}>
                <p>Ratings: Low to Hign</p>
                <input
                    checked={(state['sort by'] == 'LH')}
                    type={'checkbox'}
                    onClick={(e) => {
                        if (e.target.checked) {
                            dispatch({ type: actionTypes.SORT, payload: "LH" })
                        }
                    }}
                />
            </span>
            <span className={styles.divider} />
        </span>
    )
}

const GetSection = ({ label, idx, collapseState, state, dispatch, catCount }) => {
    if (label == Object.keys(sideNavTabs)[0] && collapseState[0]) {
        return (
            <TypesOfCommunities state={state} dispatch={dispatch} catCount={catCount} />
        )
    }
    if (label == Object.keys(sideNavTabs)[1] && collapseState[1]) {
        return (
            <NetworkChains visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[2] && collapseState[2]) {
        return (
            <RatingComp visible={collapseState[4]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[3] && collapseState[3]) {
        return (
            <DiscordMembers visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[4] && collapseState[4]) {
        return (
            <TwitterFollowers visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    else { return <></> }
}

const TypesOfCommunities = ({ state, dispatch, catCount }) => {
    console.log(catCount);
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.COMMUNITY, payload: { label: 'All', type: true } }) }} >Reset</p>
            {
                CATEGORY_LIST.map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            {
                                (catCount[ele] || (catCount[ele] == 0)) ? <p>{ele} {`(${catCount[ele]})`}</p> : <p>{ele} {<img src='/mini-loader.gif' />}</p>
                            }
                            <input checked={(state["Types of Communities"].includes(ele))}
                                onChange={(e) => {
                                    dispatch({ type: actionTypes.COMMUNITY, payload: { label: ele, type: e.target.checked } })
                                }}
                                type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}

const TwitterFollowers = ({ state, dispatch }) => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.TWITTER, payload: { min: 0, max: 0 } }) }} >Reset</p>
            {
                Object.keys(twitterFollowers).map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input
                                checked={(state['Twitter Followers'].min == twitterFollowers[ele].min && state['Twitter Followers'].max == twitterFollowers[ele].max)}
                                onChange={(e) => {
                                    dispatch({ type: actionTypes.TWITTER, payload: twitterFollowers[ele] })
                                }}
                                type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}


const DiscordMembers = ({ state, dispatch }) => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.DISCORD, payload: { min: 0, max: 0 } }) }}  >Reset</p>
            {
                Object.keys(discordFollowers).map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input
                                checked={(state['Discord Members'].min == discordFollowers[ele].min && state['Discord Members'].max == discordFollowers[ele].max)}
                                onChange={(e) => {

                                    dispatch({ type: actionTypes.DISCORD, payload: discordFollowers[ele] })
                                }}
                                type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}


const NetworkChains = ({ state, dispatch }) => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset}
                onClick={() => { dispatch({ type: actionTypes.CHAIN, payload: { label: 'All', type: true } }) }}
            >Reset</p>
            {
                Object.keys(chainMap).map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input checked={(state["Network Chains"].includes(ele))}
                                onChange={(e) => {
                                    dispatch({ type: actionTypes.CHAIN, payload: { label: ele, type: e.target.checked } })
                                }}
                                type={'checkbox'} />
                        </span>
                    )
                })
            }
        </div>
    )
}


const RatingComp = ({ state, dispatch }) => {

    const StarComp = ({ count }) => {
        return (
            <span className={styles.starComp}>
                {
                    [1, 2, 3, 4, 5].map((i) => {
                        if (i <= count) {
                            return <img key={i + 's'} src={star_filled_gradient.src} alt="" />
                        }
                        else {
                            return <img key={i + 's'} src={star_blank_gradient.src} alt="" />
                        }
                    })
                }
                <input
                    checked={(state['Ratings'].includes(count))}
                    type={'checkbox'}
                    onChange={(e) => {
                        dispatch({ type: actionTypes.RATING, payload: { label: count, type: e.target.checked } })
                    }}
                />
            </span>
        )
    }

    return (<div className={styles.ratingComp}>
        {
            [0, 1, 2, 3, 4, 5].reverse().map((i) => {
                return <StarComp key={i + 'star'} count={i} />
            })
        }

    </div>)
}

const SliderComp = ({ label, min, max, state, dispatch }) => {

    const [sliderValue, setsliderValue] = useState({ min, max })

    useEffect(() => {
        if (!document.getElementById('my-slider' + label)) { return '' }
        const mySlider = new DoubleSlider(document.getElementById('my-slider' + label));
        mySlider.addEventListener('slider:input', () => {
            const { min, max } = mySlider.value;
            setsliderValue({ min, max })
        });
        mySlider.addEventListener('slider:change', () => {
            const { min, max } = mySlider.value;
            if (label == 'Discord Members') {
                dispatch({ type: actionTypes.DISCORD, payload: { min, max } });
            }
            if (label == 'Twitter Followers') {
                dispatch({ type: actionTypes.TWITTER, payload: { min, max } });
            }
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