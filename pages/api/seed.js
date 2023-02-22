import Product from "../../models/product";
import User from "../../models/user";
import data from "../../utils/data";
import db from "../../utils/db";

async function handler(req, res) {
    await db.connect()
    // sample users
    await User.deleteMany()
    await User.insertMany(data.users)
    // sample products
    await Product.deleteMany()
    await Product.insertMany(data.products)

    await db.disconnect()
    res.send({ message: 'seeded successfully' })
}

export default handler