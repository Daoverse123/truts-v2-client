import axios from "axios";


const fetchDomain = async (address) => {

  let res = await axios.get(`https://resolve.unstoppabledomains.com/reverse/${address}`, {
    headers: {
      Authorization: `Bearer ${process.env.UD_API}`
    }
  })
  return res
};


export default async function handler(req, res) {
  try {
    let address = req.query.address
    let domain = await fetchDomain(`${address}`.toLowerCase());
    console.log(domain.data.meta)
    if (domain.status == 200) {
      res.status(202).send(domain.data.meta);
    }
    else {
      res.status(204).send({
        error: "not found"
      });
    }
  }
  catch (err) {
    console.log(err)
    res.status(204).send({
      error: "internal server error"
    });
  }
} 
