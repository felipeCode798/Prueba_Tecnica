import React, { useState } from "react";
import Swal from "sweetalert2";

const SaleModal = ({ selectedProducts, onClose, onConfirmSale }) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + product.price * quantity;
    }, 0);
  };

  const handleConfirmSale = () => {
    const saleItems = selectedProducts.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      quantity: quantities[product.id] || 1,
      price: product.price,
    }));

    onConfirmSale(saleItems);
    onClose();
  };

  return (
    <div className="modal fade" id="saleModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Confirmar Venta</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => {
                  const quantity = quantities[product.id] || 1;
                  const total = product.price * quantity;
                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>${product.price.toLocaleString("es-CO")}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="form-control"
                        />
                      </td>
                      <td>${total.toLocaleString("es-CO")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-end">
              <h5>Total: ${calculateTotal().toLocaleString("es-CO")}</h5>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmSale}
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;