import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutProcess from "../components/CheckoutProcess";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

const Payment = () => {
  // Context
  const { state, dispatch } = useContext(Store);
  console.log(state);
  const { shippingAddress, paymentMethod } = state.cart;
  // State
  const [selectedPayment, setSelectedPayment] = useState("");
  // Router
  const router = useRouter();
  // Payment methods arr
  const payments = ["Paypal", "Stripe", "CashOnDelivery"];
  // handle onSubmit
  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      return toast.error("Please select a payment method");
    }
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: selectedPayment,
    });
    Cookies.set(
      "cart",
      JSON.stringify({ ...state.cart, paymentMethod: selectedPayment })
    );
    router.push("/placeorder");
  };
  // useEffect
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    }
    setSelectedPayment(paymentMethod || "");
  }, [shippingAddress, router, paymentMethod]);

  return (
    <Layout title="Payment">
      <CheckoutProcess activeStep={2} />
      <form onSubmit={submitHandler} className="mx-auto max-w-screen-md">
        <h1 className="text-xl mb-4">Shipping</h1>
        {payments.map((payment) => (
          <div key={payment} className="mb-4">
            <input
              className="outline-none focus:ring-0 p-2"
              type="radio"
              name="paymentMehod"
              id="payment"
              checked={payment === selectedPayment}
              onChange={() => setSelectedPayment(payment)}
            />
            <label htmlFor="payment" className="p-2">
              {payment}
            </label>
          </div>
        ))}
        <div className="flex justify-between">
          <button
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default Payment;
