import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from "nextjs-progressbar";
import Script from 'next/script';
import { publicProvider } from 'wagmi/providers/public'
import 'react-tooltip/dist/react-tooltip.css'
import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
  chain
} from 'wagmi';

import { QueryClient, QueryClientProvider, useQuery } from "react-query";


import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai, chain.mainnet],
  [publicProvider()],
)
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'truts',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider
})

let GOOGLE_ANALYTICS_ID = 'G-DGWXPLZZMM'

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (<QueryClientProvider client={queryClient} contextSharing={true}>
    <WagmiConfig client={client}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
      <Script id='script' strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GOOGLE_ANALYTICS_ID}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
      <Script src="https://accounts.google.com/gsi/client" strategy={'beforeInteractive'}></Script>
      <NextNProgress color="#2e68f5" />

      <Component {...pageProps} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}

    </WagmiConfig>
  </QueryClientProvider>)
}

export default MyApp