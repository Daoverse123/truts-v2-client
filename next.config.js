/** @type {import('next').NextConfig} */

let LOCALHOST = 'http://localhost:5000'
let AWS = 'https://7cjecbsr4a.us-west-2.awsapprunner.com'
let TEST_SERVER = 'https://rf2rcgt6ax.us-west-2.awsapprunner.com'

const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: 'akamai',
    path: '',
  },
  env: {
    API: TEST_SERVER,
    SPLTOKENACCOUNTSPAREKEY: process.env.SPLTOKENACCOUNTSPAREKEY,

    MEAN_SPL_TOKEN: 'MEANeD3XDdUmNMsRGjASkSWdC8prLYsoRJ61pPeHctD',
    SOLRAZR_SPL_TOKEN: '7j7H7sgsnNDeCngAPjpaCN4aaaru4HS7NAFYSEUyzJ3k',
    BONFIDA_SPL_TOKEN: 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp',

    UMBRIA_POLYGON_ERC20: '0x2e4b0Fb46a46C90CB410FE676f24E466753B469f',
    MAHADAO_POLYGON_ERC20: '0xedd6ca8a4202d4a36611e2fff109648c4863ae19',
  },
  async redirects() {
    return [
      {
        source: '/dao-form',
        destination: '/add-your-community',
        permanent: true,
      },
      {
        source: '/talent',
        destination: 'https://tally.so/r/3j81En',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

