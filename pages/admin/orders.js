import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { getError } from "../../utils/error";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const AdminOrders = () => {
  const initialState = {
    loading: true,
    orders: [],
    error: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/orders-summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  /// sort newest to oldest orders
  const arr = state.orders.map((obj) => {
    return { ...obj, createdAt: new Date(obj.createdAt) };
  });
  const sortDescOrders = arr.sort(
    (orderA, orderB) => Number(orderB.createdAt) - Number(orderA.createdAt)
  );

  return (
    <Layout title="Admin orders summary">
      <div className="grid md:grid-cols-5 md:gap-5">
        <ul>
          <li>
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/orders" className="font-bold">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/products">Products</Link>
          </li>
          <li>
            <Link href="/admin/users">Users</Link>
          </li>
        </ul>
        <div className="overflow-x-auto md:col-span-4">
          <h1 className="text-xl mb-auto">Admin Orders Summary</h1>
          {state.loading ? (
            <div>Loading...</div>
          ) : state.error ? (
            <div className="alert-error">{state.error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-5 text-center">ID</th>
                    <th className="p-5 text-center">User</th>
                    <th className="p-5 text-center">Date</th>
                    <th className="p-5 text-center">Total</th>
                    <th className="p-5 text-center">Payment</th>
                    <th className="p-5 text-center">Paid</th>
                    <th className="p-5 text-center">Delivered</th>
                    <th className="p-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortDescOrders.map((order) => (
                    <tr key={order._id} className="border-b text-center">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "Deleted user"}
                      </td>
                      <td className="p-5">
                        {order.createdAt.toISOString().substring(0, 10)}
                      </td>
                      <td className="p-5">${order.totalPrice}</td>
                      <td className="p-5">{order.paymentMethod}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? order.paidAt.substring(0, 10)
                          : "Not paid"}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
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
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
AdminOrders.auth = { adminOnly: true };
