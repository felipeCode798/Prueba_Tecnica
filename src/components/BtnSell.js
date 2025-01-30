import React from "react";

const BtnSell = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-primary">
      <i className="fa-solid fa-cart-shopping"></i> Vender
    </button>
  );
};

export default BtnSell;