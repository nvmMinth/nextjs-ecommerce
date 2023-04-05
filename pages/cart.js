import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { MdOutlineDelete } from "react-icons/md";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

function Cart() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  // Handle Remove from cart
  const removeFromCartHandler = (item) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item,
    });
  };
  // Handle select and update quantity
  const updateQtyHandler = (item, selectedQty) => {
    const cartQty = Number(selectedQty);
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, cartQty },
    });
  };
  // round subtotal price to 2 decimal
  const round2 = (number) => Math.round((number + Number.EPSILON) * 100) / 100;
  const subtotal = round2(
    state.cart.cartItems.reduce(
      (total, item) => total + item.price * item.cartQty,
      0
    )
  );
  return (
    <Layout title="Cart">
      <h1 className="text-xl mb-4">Shopping Cart</h1>
      {state.cart.cartItems.length === 0 ? (
        <div>
          <h2>Your cart is empty</h2>
          <Link href="/">Visit our products</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.cart.cartItems.map((item) => (
                  <tr key={item.slug} className="font-semibold border-b">
                    <td>
                      <Link
                        href={`product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        &nbsp;
                        {item.name}
                      </Link>
                    </td>
                    <td className="text-center p-5">
                      <select
                        value={item.cartQty}
                        onChange={(e) => updateQtyHandler(item, e.target.value)}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option value={x + 1} key={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center p-5">${item.price}</td>
                    <td className="text-center p-5">
                      <button onClick={() => removeFromCartHandler(item)}>
                        <MdOutlineDelete className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card max-h-40 p-5 flex flex-col justify-between items-center">
            <ul className="pb-3">
              <li>
                Subtotal (
                {state.cart.cartItems.reduce(
                  (total, item) => total + item.cartQty,
                  0
                )}
                ):
              </li>
              <li className="font-bold text-2xl text-center">${subtotal}</li>
            </ul>
            <button
              onClick={() => router.push("login?redirect=/shipping")}
              className="primary-button font-semibold text-xl w-full"
            >
              Check out
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
