// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(req, res) {

  let API = process.env.API;

  let dao_data = [];

  let init_req = await axios.get(`${API}/dao/get-dao-list?limit=100&page=1`);

  res.status(200).send(init_req.data);

}
