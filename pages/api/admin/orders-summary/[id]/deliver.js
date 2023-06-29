import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import Order from "../../../../../models/order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("signin required");
  }
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    (order.isDelivered = true), (order.deliveredAt = Date.now());

    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({
      message: "Order delivered successfully",
      order: deliveredOrder,
    });
  } else {
    await db.disconnect();
    res.status(400).send("order not found");
  }
};
export default handler;
