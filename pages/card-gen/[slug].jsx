import React from 'react'
import styles from './cardgen.module.scss'

import gradient_star_filled from '../../assets/icons/star_gradient.svg'
import gradient_star_blank from '../../assets/icons/star_gradient_blank.svg'
import down_arrow from '../../assets/icons/down_arrow.svg'
import thumbs_up from '../../assets/icons/thumbs_up.svg'
import thumbs_down from '../../assets/icons/thumbs_down.svg'
import share from '../../assets/icons/share_icon.svg'
import tip from '../../assets/icons/tip_icon.svg'
import loader from '../../assets/mini-loader.gif'
import axios from 'axios'

const API = process.env.API

function Cardgen({ grad, data }) {
    let review = data;
    let isTextLarge = (review.review_desc.length >= 400)
    const getReviewDesc = () => {
        if (isTextLarge && !isreadMore) {
            return data.review_desc.slice(0, 400) + '...';
        }
        return data.review_desc
    }
    let min_public_address = review.public_address.slice(0, 5) + '....' + review.public_address.slice(-3)
    return (
        <div className={styles.cardgen}>
            <div className={styles.reviewComp}>
                <div className={styles.userInfo}>
                    <span className={styles.profilePic} style={{ background: grad }} src={"https://pbs.twimg.com/profile_banners/1380589844838055937/1634756837/1500x500"} alt="" />
                    <span>
                        <p className={styles.address}>{min_public_address}</p>
                        <StarComp size={'s'} rating={review.rating} />
                    </span>
                </div>
                <div className={styles.review_desc}  >
                    {getReviewDesc()}
                </div>
                <div className={styles.bottom_nav}>
                    <span className={styles.iconText} >
                        <img src={thumbs_up.src} alt="" />
                        <p>{ }</p>
                    </span>
                    <span className={styles.iconText} >
                        <img src={thumbs_down.src} alt="" />
                        <p>{ }</p>
                    </span>
                    {/* <span className={styles.iconText}  >
                        <img src={share.src} alt="" />
                        <p>share</p>
                    </span> */}
                    <span className={styles.iconText} >
                        <img src={tip.src} alt="" />
                        {/* <p>$400</p> */}
                    </span>
                </div>
                <span className={styles.divider} />
            </div>
        </div>
    )
}

const StarComp = ({ rating, size }) => {
    let filter_style = styles.starComp;
    if (size == 's') {
        filter_style = styles.starComp + ' ' + styles.starComp_small
    }
    return (
        <span className={filter_style}>
            {
                [1, 2, 3, 4, 5].map((i) => {
                    if (i <= parseInt(rating)) {
                        return (
                            <img key={i} src={gradient_star_filled.src} alt="" />
                        )
                    }
                    else {
                        return (
                            <img key={i} src={gradient_star_blank.src} alt="" />
                        )
                    }
                })
            }
        </span>
    )
}

function newGradient() {
    var c1 = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
    var c2 = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
    c1.rgb = 'rgb(' + c1.r + ',' + c1.g + ',' + c1.b + ')';
    c2.rgb = 'rgb(' + c2.r + ',' + c2.g + ',' + c2.b + ')';
    return 'radial-gradient(at top left, ' + c1.rgb + ', ' + c2.rgb + ')';
}



export async function getServerSideProps(ctx) {

    let { slug } = ctx.query;
    let res = await axios.get(`${API}/review/get-review-by-id?rid=${slug}`)

    return {
        props: {
            grad: newGradient(),
            data: res.data
        }
    }
}


export default Cardgen