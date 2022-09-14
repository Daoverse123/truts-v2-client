import { useSignMessage } from 'wagmi' // evm 

const Chains = ['Ethereum', 'Solana']

const useMessageSigner = async () => {

    const { signMessageAsync } = useSignMessage({
        message: 'Sign the review',
    })
    let wallet_state = JSON.parse(localStorage.getItem('wallet_state')).chain;
    let res;
    if (wallet_state == Chains[0]) {
        res = await ethSign('Sign the review', signMessageAsync)
    }
    if (wallet_state == Chains[1]) {
        res = await solSign('Sign the review')
    }

    if (res) {
        return true
    }
    return false
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

export default useMessageSigner