import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    // fetch order
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    // fetch pay
    case "PAY_REQUEST":
      return { ...state, paypalPaying: true };
    case "PAY_SUCCESS":
      return { ...state, paypalPaying: false, paypalPaid: true };
    case "PAY_FAIL":
      return {
        ...state,
        paypalPaying: false,
        paypalPaid: false,
        paypalError: action.payload,
      };
    case "PAY_RESET":
      return {
        ...state,
        paypalPaying: false,
        paypalPaid: false,
        paypalError: "",
      };
    default:
      return state;
  }
};

////////////// OrderPlaced function
const OrderPlaced = () => {
  // paypal
  const [paypalState, paypalDispatch] = usePayPalScriptReducer();
  /////paypalState: isPending
  // session
  const { data: session } = useSession();
  console.log(session);
  // router
  const router = useRouter();
  const orderId = router.query.id;

  // initial state
  const initialState = {
    loading: true,
    order: {},
    error: "",
  };

  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  ///state: loading, error, order, paypalPayping, paypalPaid
  console.log(state);

  //useEffect
  useEffect(() => {
    // fetch order detail
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (
      !state.order._id ||
      (state.order._id && state.order._id !== orderId) ||
      state.paypalPaid
    ) {
      fetchOrder();
      if (state.paypalPaid) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      // load paypal script
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      loadPaypalScript();
    }
  }, [orderId, orderId, paypalDispatch, state.paypalPaid]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = state.order;
  console.log(state);

  // createOrder function
  const createOrder = (data, actions) => {
    console.log(actions);
    return actions.order
      .create({
        purchase_units: [{ amount: { value: state.order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  // onApprove function
  const onApprove = (data, actions) => {
    console.log(actions);
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${state.order._id}/pay`,
          details
        );
        dispatch({
          type: "PAY_SUCCESS",
          payload: data,
        });
        toast.success("Order is successfully paid ❤️");
      } catch (error) {
        dispatch({
          type: "PAY_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error));
      }
    });
  };
  // onError function
  const onError = (error) => {
    toast.error(getError(error));
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="text-xl mb-4">{`Order ${orderId}`}</h1>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div className="alert-error">{state.error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="md:col-span-3">
            <div className="card p-5">
              <h2 className="text-lg mb-2">Shipping address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {state.order.shippingAddress.city}, {shippingAddress.postalCode}
                , {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="text-lg mb-2">Payment method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
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
                  {orderItems.map((item) => (
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
                {!isPaid && (
                  <li>
                    <div className="w-full">
                      Paypal
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                    {state.paypalPaying && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

OrderPlaced.auth = true;
export default OrderPlaced;
