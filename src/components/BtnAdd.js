import React from "react";

const BtnAdd = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalProducts">
      <i className="fa-solid fa-circle-plus"></i> Añadir
    </button>
  );
};

export default BtnAdd