import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";

const ThankYou = () => {
  const { emptyCart } = useCart();
  useEffect(() => {
    emptyCart();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        margin: "20px auto",
        padding: "25px",
        borderRadius: "20px",
        boxShadow: "0 2px 10px rgb(0 0 0 / 0.2)",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        Thank You! Your order has been successfully placed!
      </h1>

      <Link
        className="btn btn-primary"
        to="/"
        style={{
          display: "inline-block",
          height: "60px",
          borderRadius: "30px",
          width: "100%",
          maxWidth: "200px",
          padding: "15px",
          boxSizing: "border-box",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ThankYou;
