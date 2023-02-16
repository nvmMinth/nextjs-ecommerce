import React from "react";

const CheckoutProcess = ({ activeStep = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];
  return (
    <div className="flex mb-5">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2 text-center ${
            index <= activeStep
              ? "border-green-600 text-green-600"
              : "border-gray-400 text-gray-400"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProcess;
