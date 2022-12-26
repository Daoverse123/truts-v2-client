import ethAssets from '../../lib/tokenData/tokenAlchemy';
import solAssets from '../../lib/tokenData/solanaTokenData';

export default async function handler(req, res) {
    let key = req.query.key;
    let type = req.query.type;
    let id = 1;
    if (type == 'nft') {
        id = 0
    }
    if (type == 'token') {
        id = 1
    }
    console.log(id)
    let assets = await ethAssets[id](key, 'ETH');
    // console.log(assets)
    res.status(200).json({ assets })
}
