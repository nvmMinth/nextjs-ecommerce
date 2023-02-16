import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import CheckoutProcess from "../components/CheckoutProcess";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

const Shipping = () => {
  //Context
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;
  // Router
  const router = useRouter();
  // useForm
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  // Handle onSubmit
  const onSubmit = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...state.cart,
        shippingAddress: { fullName, address, city, postalCode, country },
      })
    );
    router.push("/payment");
  };
  // useEffect
  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);
  return (
    <Layout title="Shipping">
      <CheckoutProcess activeStep={1} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-screen-md"
      >
        <h1 className="text-xl mb-4">Shipping</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            className="w-full"
            autoFocus
            {...register("fullName", { required: "Input your full name" })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            className="w-full"
            {...register("address", { required: "Input your address" })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            id="city"
            className="w-full"
            {...register("city", { required: "Input your city" })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal code</label>
          <input
            id="postalCode"
            className="w-full"
            {...register("postalCode", { required: "Enter your postal code" })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            className="w-full"
            {...register("country", { required: "Enter your country" })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <button type="submit" className="primary-button">
          Next
        </button>
      </form>
    </Layout>
  );
};

export default Shipping;
Shipping.auth = true;
