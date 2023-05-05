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
  let address = req.query.address
  let domain = await fetchDomain(address);
  console.log(domain.data.meta)
  if (domain.status == 200) {
    res.status(200).send(domain.data.meta);
  }
  else {
    res.status(404).send({
      error: "not found"
    });
  }

} 
