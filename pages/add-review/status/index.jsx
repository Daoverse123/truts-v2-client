import React from 'react'
import styles from '../addReview.module.scss'
import Link from 'next/link'
import Head from 'next/head'

import left_arrow from '../../../assets/left-arrow.png'

import Button from '../../../components/Button'
import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'

function index({ type }) {
  return (
    <>
      <div className={styles.statusPage}>
        <Head>
          <script defer src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
          <link href="https://assets10.lottiefiles.com/packages/lf20_yt7b7vg3.json" rel="preload"></link>
          <link href="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json" rel="preload"></link>
          <link href="https://assets5.lottiefiles.com/packages/lf20_afwjhfb2.json" rel="preload"></link>
        </Head>
        <Nav />
        <div style={{ margin: "0" }} className={styles.mainCon}>
          {/* <div className={styles.breadCrum}>
          <img src={left_arrow.src} alt="" />
          <Link href={`/`}>
            <span>
              <p>Add review for</p>
              <h3>{"Test"}</h3>
            </span>
          </Link>
        </div> */}
          {(type == 'success') && < SuccessState />}
          {(type == 'error') && <ErrorState />}
        </div>

      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps(ctx) {
  let { type } = ctx.query;
  let target = ctx.req.cookies['target']
  return {
    props: {
      type
    }
  }
}

const SuccessState = () => {
  return (
    <div className={styles.response}>
      <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json" background="transparent" speed="1" style={{ width: "50%", height: "100%", marginBottom: "30px" }} autoplay></lottie-player>
      <span className={styles.message}>
        <p>Thank you for reviewing with us. Join Truts discord community to get exclusive rewards and opportunities.</p>
        <Button onClick={() => {
          openNewTab('https://discord.truts.xyz/');
        }} label={'Join Community'} />
      </span>

    </div>
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

export default index