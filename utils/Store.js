import { createContext, useReducer } from "react";
import Cookies from "js-cookie";


// create context
export const Store = createContext();

// initial state
const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
};

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    // case add item to cart
    case "ADD_TO_CART": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (cartItem) => cartItem.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(
          (cartItem) =>
            cartItem.name === existItem.name ? newItem : cartItem // newItem with updated qty
        )
        : [...state.cart.cartItems, newItem];
      // save to cookies
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    // case remove item from cart
    case "REMOVE_FROM_CART": {
      const removeItem = action.payload;
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== removeItem.slug
      );
      // save to cookies
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    // case "CART_RESET":
    //   return {
    //     ...state,
    //     cart: {
    //       cartItems: [],
    //       shippingAddress: { location: {} },
    //       paymentMethod: "",
    //     },
    //   };
    // case reset cart
    case "CART_RESET":
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    // case save shipping address and payment method
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
};

// useReducer
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch }; //combine
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
