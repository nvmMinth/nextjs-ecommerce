import { useEffect, useReducer } from "react";
import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// chart options
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
  },
};
const AdminDashboard = () => {
  const initialState = {
    loading: true,
    summary: { totalSalesGroup: [] },
    error: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);

  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/sales-summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetchData();
  }, []);

  // chart data
  const chartData = {
    labels: state.summary.totalSalesGroup.map((i) => i._id), //=> ex:03-2023
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgb(255,215,0)",
        data: state.summary.totalSalesGroup.map((i) => i.totalSales),
      },
    ],
  };
  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-5 md:gap-5">
        <ul>
          <li>
            <Link href="/admin/dashboard" className="font-bold">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link href="/admin/products">Products</Link>
          </li>
          <li>
            <Link href="/admin/users">Users</Link>
          </li>
        </ul>
        <div className="md:col-span-4">
          <h1 className="text-xl">Dashboard</h1>
          {state.loading ? (
            <div>Loading...</div>
          ) : state.error ? (
            <div className="alert-error">{state.error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card p-5 m-5">
                  <p className="text-2xl font-bold">
                    ${state.summary.ordersPrice}
                  </p>
                  <p>Sales</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View details
                  </Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-2xl font-bold">
                    {state.summary.ordersQty}
                  </p>
                  <p>Total orders</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View details
                  </Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-2xl font-bold">
                    {state.summary.productsQty}
                  </p>
                  <p>Total products</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View details
                  </Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-2xl font-bold">{state.summary.usersQty}</p>
                  <p>Total users</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View details
                  </Link>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-xl">Sales Report</h2>
                <Bar
                  options={{
                    legend: { display: true, position: "right" },
                  }}
                  data={chartData}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
AdminDashboard.auth = { adminOnly: true };
