import axios from "axios";

const signout = async () => {
    let res = await axios.get(`${process.env.P_API}/logout`);
    if (res.status == 200) {
        return true
    }
    return false
}

export default signout