import clientPromise from "../../lib/mongodb";

export default async (req, res) => {

    let userId = req.query.userId;
    let username = req.query.username;
    let city = req.query.city;

    try {
        const client = await clientPromise;
        const db = client.db("pizza");

        const pizza = await db
            .collection("users")
            .insertOne({
                userId,
                username,
                city
            })

        res.json(pizza);
    } catch (e) {
        console.error(e);
    }
}

// /api/addpizza?userId=123&username=john&city=hyd