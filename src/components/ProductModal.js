import React, { useEffect, useState } from "react";
import { show_alert } from "../functions";

const ProductModal = ({ isOpen, onClose, onSave, product, operation }) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      setSku(product.sku || "");
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
    }
  }, [product]);

  const handleSave = () => {
    if (!sku.trim()) {
      show_alert("Digita el SKU", "warning");
      return;
    }
    if (!name.trim()) {
      show_alert("Digita el nombre del producto", "warning");
      return;
    }
    if (isNaN(price) || price <= 0) {
      show_alert("Digita un precio válido", "warning");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      show_alert("Digita una cantidad válida", "warning");
      return;
    }

    const productData = { sku, name, description, price, stock };
    onSave(productData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{operation === 1 ? "Registrar Producto" : "Modificar Producto"}</h2>
        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" />
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />

        <button onClick={handleSave}>{operation === 1 ? "Guardar" : "Actualizar"}</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProductModal;
