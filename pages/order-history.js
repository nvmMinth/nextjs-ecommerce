import axios from "axios";
import { useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import Link from "next/link";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const OrderHistory = () => {
  const initialState = {
    loading: true,
    orders: [],
    error: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  /// state: loading, orders, error
  console.log(state.orders);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/orders/history");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchOrderHistory();
  }, []);

  return (
    <Layout title="Order History">
      <h1>Order History</h1>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div className="alert-error">{state.error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="p-5 text-left">ID</th>
                <th className="p-5 text-left">Date</th>
                <th className="p-5 text-left">Total</th>
                <th className="p-5 text-left">Paid</th>
                <th className="p-5 text-left">Delivered</th>
                <th className="p-5 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5">{order._id.substring(20, 24)}</td>
                  <td className="p-5">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-5">${order.totalPrice}</td>
                  <td className="p-5">
                    {order.isPaid
                      ? `Paid at ${order.paidAt.substring(0, 10)}`
                      : "Not paid"}
                  </td>
                  <td className="p-5">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : "Not delivered"}
                  </td>
                  <td className="p-5">
                    <Link
                      href={`/order/${order._id}`}
                      className="text-blue-500"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default OrderHistory;
OrderHistory.auth = true;
