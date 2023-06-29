import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/product";

// const handler = async (req, res) => {
//   const session = await getSession({ req });
//   if (!session || (session && !session.user.isAdmin)) {
//     res.status(401).send("signin required");
//   }

//   if (req.method === "GET") {
//     await db.connect();
//     const products = await Product.find({});
//     await db.disconnect();
//     res.send(products);
//   } else if (req.method === "POST") {
//     await db.connect();
//     const newProduct = new Product({
//       name: "sample name",
//       slug: "sample-name-" + Math.random(),
//       image: "/images/bed1.jpg",
//       price: 0,
//       category: "sample category",
//       brand: "sample brand",
//       countInStock: 0,
//       description: "sample description",
//       rating: 0,
//       reviewNum: 0,
//     });
//     const product = await newProduct.save();
//     await db.disconnect();
//     res.send({ message: "product created successfully", product });
//   } else {
//     return res.status(400).send({ message: "method not found" });
//   }
// };

// export default handler;

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("admin signin required");
  }
  // const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};
const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-name-" + Math.random(),
    image: "/images/shirt1.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product created successfully", product });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
