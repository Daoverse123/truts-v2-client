import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("pizza");

        const pizza = await db
            .collection("users")
            .find({})
            .toArray();

        res.json(pizza);
    } catch (e) {
        console.error(e);
    }
}