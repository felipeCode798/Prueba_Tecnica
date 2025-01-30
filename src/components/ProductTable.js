import React from "react";

const ProductTable = ({ products, onEdit, onDelete, onSelectProduct, selectedProducts }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered w-100">
        <thead className="table-dark">
          <tr>
            <th>Check</th>
            <th>#</th>
            <th>Sku</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {products.map((product, i) => (
            <tr key={product.id}>
              <th>
                <input
                  type="checkbox"
                  checked={selectedProducts.some((item) => item.id === product.id)}
                  onChange={(e) => onSelectProduct(e, product)}
                />
              </th>
              <td>{i + 1}</td>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${new Intl.NumberFormat("es-co").format(product.price)}</td>
              <td>{product.stock}</td>
              <td>
              <button
                onClick={() => onEdit(product)} // Pasa el producto completo
                className="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#modalProducts"
              >
                <i className="fa-solid fa-edit"></i>
              </button>
                &nbsp;
                <button onClick={() => onDelete(product.id)} className="btn btn-danger">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;