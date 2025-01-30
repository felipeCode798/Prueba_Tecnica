import React from "react";
import Swal from "sweetalert2";
import { show_alert } from "../functions";

const SaleModal = ({ selectedProducts, onConfirmSale }) => {
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      const totalPrice = product.quantity * product.price;
      return total + totalPrice;
    }, 0);
  };

  const handleConfirmSale = () => {
    if (selectedProducts.length === 0) {
      show_alert("Selecciona al menos un producto", "warning");
      return;
    }

    Swal.fire({
      title: "Confirmar Venta",
      html: createSaleTable(),
      showCancelButton: true,
      confirmButtonText: "Confirmar Venta",
      cancelButtonText: "Cancelar",
      icon: "info",
    }).then((result) => {
      if (result.isConfirmed) onConfirmSale();
    });
  };

  const createSaleTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{new Intl.NumberFormat("es-co").format(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{new Intl.NumberFormat("es-co").format(product.quantity * product.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <button onClick={handleConfirmSale}>Confirmar Venta</button>
      <div>Total: ${new Intl.NumberFormat("es-co").format(calculateTotal())}</div>
    </div>
  );
};

export default SaleModal;
