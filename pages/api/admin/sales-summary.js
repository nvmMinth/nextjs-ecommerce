import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/order";
import Product from "../../../models/product";
import User from "../../../models/user";

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("signin required");
  }
  await db.connect();

  const ordersQty = await Order.countDocuments();
  const productsQty = await Product.countDocuments();
  const usersQty = await User.countDocuments();

  const priceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const ordersPrice = priceGroup.length > 0 ? priceGroup[0].sales : 0;

  const totalSalesGroup = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%m-%Y", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  await db.disconnect();
  res.send({ ordersQty, productsQty, usersQty, ordersPrice, totalSalesGroup });
};

export default handler;
