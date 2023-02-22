import React, { useContext } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Store } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/product";
import axios from "axios";

export default function ProductDetail({ product }) {
  console.log(product);
  // Context
  const { state, dispatch } = useContext(Store);

  if (!product)
    return <Layout title="Product not found">Data Not Found</Layout>;

  const { name, brand, price, image, description, rating, countInStock } =
    product;

  // Handle Add product to cart, item quantity
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (cartItem) => cartItem.name === name
    );
    const cartQty = existItem ? existItem.cartQty + 1 : 1;

    //fetch product detail from backend db to get the actual count in stock
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(data);
    if (cartQty > data.countInStock) {
      alert("Sorry. This item is out of stock now ☹️");
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, cartQty },
    });
  };

  return (
    <Layout title={name}>
      <Link className="py-2" href="/">
        Back to Products
      </Link>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={image}
            width={640}
            height={640}
            alt={product.name}
            layout="responsive"
          />
        </div>
        <div>
          <ul>
            <li>{name}</li>
            <li>From ®{brand}</li>
            <li>{rating}</li>
            <li>{price}</li>
            <li>{description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="flex justify-between mb-2">
              <div>Price</div>
              <div>${price}</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Status</div>
              <div>{countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="w-full primary-button"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.covertDocToObj(product) : null,
    },
  };
}
