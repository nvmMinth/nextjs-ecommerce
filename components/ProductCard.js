import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "../utils/Store";

export default function ProductCard({ product }) {
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find(
      (cartItem) => cartItem.name === product.name
    );
    const cartQty = existItem ? existItem.cartQty + 1 : 1;
    if (cartQty > product.countInStock) {
      alert("Sorry. This item is out of stock now ☹️");
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, cartQty },
    });
  };

  return (
    <div className="card">
      <Link href={`product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col p-5">
        <Link href={`product/${product.slug}`} className="h-16">
          <h2 className="text-lg font-semibold">{product.name}</h2>
        </Link>
        <p className="mb-2">® {product.brand}</p>
        <p className="text-red-600 font-bold mb-2">${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={addToCartHandler}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
