import React, { useState, useEffect } from "react";
import { show_alert } from "../functions";

const ProductForm = ({ operation, product, onSubmit }) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (operation === 2) {
      setSku(product.sku);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [operation, product]);

  const validate = () => {
    if (sku.trim() === "") return show_alert("Digita el sku", "warning");
    if (name.trim() === "") return show_alert("Digita el nombre del producto", "warning");
    if (isNaN(price)) return show_alert("Digita el precio del producto", "warning");
    if (isNaN(stock)) return show_alert("Digita las existencias del producto", "warning");

    onSubmit({ sku, name, description, price, stock });
  };

  return (
    <div>
      <h3>{operation === 1 ? "Registrar Producto" : "Modificar Producto"}</h3>
      <div>
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button onClick={validate}>Guardar</button>
      </div>
    </div>
  );
};

export default ProductForm;
