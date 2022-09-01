/** @type {import('next').NextConfig} */

let LOCALHOST = 'http://localhost:5000'
let AWS = 'https://7cjecbsr4a.us-west-2.awsapprunner.com'
let TEST_SERVER = 'https://rf2rcgt6ax.us-west-2.awsapprunner.com'

const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  env: {
    API: TEST_SERVER
  },
}

module.exports = nextConfig

