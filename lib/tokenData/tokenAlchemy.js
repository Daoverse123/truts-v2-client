// Github: https://github.com/alchemyplatform/alchemy-sdk-js
// Setup: npm install alchemy-sdk
const { Network, Alchemy } = require("alchemy-sdk");
let _apiKey = "3VDBZXBKxInSgBVC4Ku6yIDSsObPdBob"
// Optional Config object, but defaults to demo api-key and eth-mainnet.
let tokenObject = {
    name: "",
    symbol: "",
    logo: "",
    tokenAddress: "",
    tokenBalance: ""
}
let nftObject = {
    title: "",
    contactAddress: "",
    tokenID: "",
    symbol: "",
    description: "",
    tokenImage: "",
    tokenType: "",

}


const getERC20TokensData = async (userAddress, chain) => {
    let evmNetwork;
    if (chain == 'ETH') {
        evmNetwork = Network.ETH_MAINNET
    }
    let returnAllTokenData = []

    const settings = {
        apiKey: _apiKey, // Replace with your Alchemy API Key.
        network: evmNetwork, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);

    // Print token balances of USDC in Vitalik's address
    const results = await alchemy.core.getTokenBalances(userAddress)
    // console.log(results)

    for (let i = 0; i < results.tokenBalances.length; i++) {
        let response = await alchemy.core.getTokenMetadata(results.tokenBalances[i].contractAddress)
        // console.log(response)
        let balanceInt = parseInt(results.tokenBalances[i].tokenBalance);
        tokenObject.name = response.name;
        tokenObject.symbol = response.symbol;
        tokenObject.logo = response.logo;
        tokenObject.tokenBalance = balanceInt / 10 ** (response.decimals);
        tokenObject.tokenAddress = results.tokenBalances[i].contractAddress;
        //console.log("TokenObj", tokenObject);

        // console.log(tokenObject)

        returnAllTokenData.push({ ...tokenObject });

        tokenObject = {
            name: "",
            symbol: "",
            logo: "",
            tokenAddress: "",
            tokenBalance: ""
        }
        //console.log(returnAllTokenData)
    }
    return returnAllTokenData;
}

const userAddress = "0x5568416Fc7E9D575277c78a4f8272e873839f001";
const evmNetwork = Network.ETH_MAINNET

// getERC20TokensData(userAddress, evmNetwork)
//getERC20TokensData(userAddress, evmNetwork)


const getNFTdata = async (userAddress, chain) => {
    let evmNetwork;
    if (chain == 'ETH') {
        evmNetwork = Network.ETH_MAINNET
    }

    let returnAllNFTData = []

    const settings = {
        apiKey: _apiKey, // Replace with your Alchemy API Key.
        network: evmNetwork, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);

    let response = await alchemy.nft.getNftsForOwner(userAddress)
    console.log(response)
    response.ownedNfts.forEach((element) => {
        //  console.log(element)
        try {
            nftObject.tokenImage = element.media[0].gateway
            nftObject.symbol = element.contract.symbol
            nftObject.tokenType = element.contract.tokenType
            nftObject.description = element.description
            nftObject.tokenID = element.tokenId
            nftObject.title = element.title
            //  console.log(nftObject)
            returnAllNFTData.push({ ...nftObject });

            nftObject = {
                title: "",
                contactAddress: "",
                tokenID: "",
                symbol: "",
                description: "",
                tokenImage: "",
                tokenType: "",
            }
        } catch (error) {

        }

    });

    return returnAllNFTData;
}

// getNFTdata(userAddress, evmNetwork)
// getNFTdata(userAddress, evmNetwork)

export default [getNFTdata, getERC20TokensData]