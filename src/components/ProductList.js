import React from "react";
import { show_alert } from "../functions";

const ProductList = ({ products, onEdit, onDelete, onSelect }) => {
  const handleDelete = (id) => {
    if (!id) return show_alert("ID no válido", "error");
    onDelete(id);
  };

  return (
    <div>
      <h3>Lista de Productos</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{new Intl.NumberFormat("es-co").format(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => onEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                <button onClick={() => onSelect(product)}>Seleccionar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
