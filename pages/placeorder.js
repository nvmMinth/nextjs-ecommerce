import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutProcess from "../components/CheckoutProcess";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

const Placeorder = () => {
  // Context
  const { state, dispatch } = useContext(Store);
  const { shippingAddress, paymentMethod, cartItems } = state.cart;
  // Prices//round to 2 decimal
  const round2 = (number) => Math.round((number + Number.EPSILON) * 100) / 100;
  const itemsPrice = round2(
    cartItems.reduce((total, item) => total + item.price * item.cartQty, 0)
  );
  const taxPrice = round2(itemsPrice * 0.15);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  // Router
  const router = useRouter();
  // useEffect
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);
  // State
  const [loading, setLoading] = useState(false);
  // handle placeOrder
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      // load data from backend api
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        paymentMethod,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_RESET" });
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems: [] }));
      // redirect to order/[id]
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutProcess activeStep={3} />
      <h1 className="text-xl mb-4">Place Order</h1>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="md:col-span-3">
          <div className="card p-5">
            <h2 className="text-lg mb-2">Shipping address</h2>
            <div>
              {shippingAddress.fullName}, {shippingAddress.address},{" "}
              {shippingAddress.city}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}
            </div>
            <div>
              <Link href="/shipping" className="text-blue-600">
                Edit
              </Link>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-lg mb-2">Payment method</h2>
            <div>{paymentMethod}</div>
            <div>
              <Link href="/payment" className="text-blue-600">
                Edit
              </Link>
            </div>
          </div>
          <div className="cart p-5">
            <h2 className="text-lg mb-2">Order Items</h2>
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      &nbsp;
                      {item.name}
                    </td>
                    <td className="text-center p-5">{item.cartQty}</td>
                    <td className="text-center p-5">${item.price}</td>
                    <td className="text-center p-5">
                      ${item.cartQty * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <Link href="/cart" className="text-blue-600">
                Edit
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="card p-5">
            <h2 className="text-lg mb-2">Order Summary</h2>
            <ul>
              <li className="flex justify-between mb-2">
                <div>Items</div>
                <div>${itemsPrice}</div>
              </li>
              <li className="flex justify-between mb-2">
                <div>Tax</div>
                <div>${taxPrice}</div>
              </li>
              <li className="flex justify-between mb-2">
                <div>Shipping</div>
                <div>${shippingPrice}</div>
              </li>
              <li className="flex justify-between mb-2">
                <div>Total</div>
                <div>${totalPrice}</div>
              </li>
              <li>
                <button
                  className="w-full primary-button"
                  disabled={loading}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Placeorder;
Placeorder.auth = true;
