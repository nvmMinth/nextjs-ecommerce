import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("signin required");
  }
  if (req.method === "GET") {
    await db.connect()
    const orders = await Order.find({}).populate("user", "name")
    await db.disconnect()
    res.send(orders)
  } else {
    return res.status(400).send({ message: "method not allowed" })
  }
}
export default handler;
