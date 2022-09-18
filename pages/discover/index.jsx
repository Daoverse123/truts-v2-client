import React, { useEffect, useState, useReducer } from 'react'
import styles from './discover.module.scss'
import axios from 'axios'
import DoubleSlider from 'double-slider';
import { useMediaQuery } from 'react-responsive'
import Head from 'next/head'

//components
import Nav from '../../components/Nav'
import DAOCard from '../../components/DAOCard'

//assets
import downArrow from '../../assets/icons/down_arrow.svg'
import star_blank_gradient from '../../assets/icons/star_blank_gradient.svg'
import star_filled_gradient from '../../assets/icons/star_filled_gradient.svg'
import close_btn from '../../assets/icons/close_icon.svg'

let sideNavTabs = {
    "Types of Communities": "",
    "Network Chains": "",
    "Discord Followers": "",
    "Twitter Followers": "",
    "Ratings": ""
}

// CONSTANTS
const API = process.env.API
const CATEGORY_LIST = ['All', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Legal', `NEAR Ecosystem`]

let discordFollowers = {
    'Small (0 to 10K)': { min: 0, max: 10000 },
    'Medium (10K to 50K)': { min: 0, max: 50000 },
    'Large (50K & above)': { min: 50000, max: -1 }
}

let twitterFollowers = {
    'Small (0 to 10K)': { min: 0, max: 10000 },
    'Medium (10K to 50K)': { min: 0, max: 50000 },
    'Large (50K & above)': { min: 50000, max: -1 }
}

let initialState = {
    "sort by": "HL",
    "Types of Communities": ["All"],
    "Network Chains": ["All"],
    "Discord Followers": { min: 0, max: 0 },
    "Twitter Followers": { min: 0, max: 0 },
    "Ratings": [1, 2, 3, 4, 5]
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
        console.log(index)
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
        console.log(index)
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
            state['Discord Followers'].min = action.payload.min;
            state['Discord Followers'].max = action.payload.max;
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


function Discover({ daoList_ssr }) {

    console.log(daoList_ssr);

    const [collapseState, setcollapseState] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false })

    const [state, dispatch] = useReducer(reducer, initialState);

    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    const [filtersVisible, setfiltersVisible] = useState(false);

    useEffect(() => {
        setfiltersVisible(!isMobile);
    }, [isMobile])

    console.log(state);

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

        //sorting
        let sort = (daos) => {
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

        //twitter/discord limiting
        const tdRangeLimit = (daos) => {
            //discord member count limit (0,0) show all

            let d_daos = (daos) => {
                if (state['Discord Followers'].min == 0 && state['Discord Followers'].max == 0) {
                    return daos;
                }
            }

        }

        return sort(filterByCommunities(daos))
    }

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
                                <>
                                    <span onClick={
                                        () => {
                                            setcollapseState((sc) => {
                                                sc[i] = !sc[i];
                                                return { ...sc }
                                            })
                                        }
                                    } className={styles.option} key={i + 'sd'}>
                                        <p>{ele}</p>
                                        <img src={downArrow.src} alt="" />
                                    </span>
                                    <GetSection key={i + 'gsd'} state={state} dispatch={dispatch} label={ele} idx={i} collapseState={collapseState} />
                                    <span className={styles.divider} />
                                </>
                            )
                        })
                    }
                </div>}
                <div className={styles.gallery}>
                    <div className={styles.daoList}>
                        {
                            filteredList(daoList_ssr['all']).map((ele, idx) => {
                                return (
                                    <DAOCard key={'card' + idx} data={ele} />
                                )
                            })
                        }
                    </div>
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
    let url = `${API}/dao/get-dao-list`;
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

const GetSection = ({ label, idx, collapseState, state, dispatch }) => {
    if (label == Object.keys(sideNavTabs)[0] && collapseState[0]) {
        return (
            <TypesOfCommunities state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[1] && collapseState[1]) {
        return (
            <NetworkChains visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[2] && collapseState[2]) {
        return (
            <DiscordMembers visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[3] && collapseState[3]) {
        return (
            <TwitterFollowers visible={collapseState[1]} state={state} dispatch={dispatch} />
        )
    }
    if (label == Object.keys(sideNavTabs)[4] && collapseState[4]) {
        return (
            <RatingComp visible={collapseState[4]} label={"Twitter Followers"} min={0} max={50000} state={state} dispatch={dispatch} />
        )
    }
    else { return <></> }
}

const TypesOfCommunities = ({ state, dispatch }) => {
    return (
        <div className={styles.typesOfCommunities}>
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.COMMUNITY, payload: { label: 'All', type: true } }) }} >Reset</p>
            {
                CATEGORY_LIST.map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input checked={(state["Types of Communities"].includes(ele))}
                                onChange={(e) => {
                                    console.log(e.target.checked, ele)
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
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.TWITTER, payload: { label: 'All', type: true } }) }} >Reset</p>
            {
                Object.keys(twitterFollowers).map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input
                                checked={(state['Twitter Followers'].min == twitterFollowers[ele].min && state['Twitter Followers'].max == twitterFollowers[ele].max)}
                                onChange={(e) => {
                                    console.log(e.target.checked, ele)
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
            <p className={styles.reset} onClick={() => { dispatch({ type: actionTypes.DISCORD, payload: { label: 'All', type: true } }) }} >Reset</p>
            {
                Object.keys(discordFollowers).map((ele, i) => {
                    return (
                        <span key={i + ele} className={styles.typesOption}>
                            <p>{ele}</p>
                            <input
                                checked={(state['Discord Followers'].min == discordFollowers[ele].min && state['Discord Followers'].max == discordFollowers[ele].max)}
                                onChange={(e) => {
                                    console.log(e.target.checked, ele)
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
                            <input checked={(state["Network Chains"].includes(ele))}
                                onChange={(e) => {
                                    console.log(e.target.checked, ele)
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
            if (label == 'Discord Followers') {
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
            [1, 2, 3, 4, 5].reverse().map((i) => {
                return <StarComp key={i + 'star'} count={i} />
            })
        }

    </div>)
}

export default Discover