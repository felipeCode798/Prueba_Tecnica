import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from '../functions'
import { jsPDF } from "jspdf";

const ShowProducts = () => {

  const url="http://localhost:8080/api/v1/products"

  const [products, setProducts] = useState([]);
  const [id, setId] = useState([]);
  const [sku, setSku] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [stock, setStock] = useState([]);
  const [operation, setOperacion] = useState([]);
  const [title, setTitle] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  const openModal = (op, id, sku, name, description, price, stock) => {
    setId('');
    setSku('')
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setOperacion(op);
    if(op === 1){
      setTitle('Registrar Producto')
    }else if(op === 2){
      setTitle('Modificar Producto');
      setId(id);
      setSku(sku)
      setName(name);
      setDescription(description);
      setPrice(price);
      setStock(stock);
    }
    window.setTimeout(function(){
      document.getElementById('name').focus()
    },500);
  }

  const validate = () => {
    let parameters;
    let metod;
    if(sku.trim() === ''){
      show_alert('Digita el sku', 'warnig')
    }
    if(name.trim() === ''){
      show_alert('Digita el nombre del producto', 'warnig')
    }
    if(isNaN(price)){
      show_alert('Digita el precio del producto', 'warnig')
    }
    if(isNaN(stock)){
      show_alert('Digita las exitencias del producto', 'warnig')
    }else{
      if(operation === 1){
        parameters = {sku:sku.trim(),name:name.trim(),description:description.trim(),price:price,stock:stock};
        metod = 'POST';
      }else{
        parameters = {id:id,sku:sku.trim(),name:name.trim(),description:description.trim(),price:price,stock:stock};
        metod = 'PUT';
      }

      sendRequest(metod, parameters);

    }
  }

  const sendRequest = async (method, parameters) => {
    try {
        let response;
        if (method === 'POST') {
            response = await axios.post(url, parameters);
        } else if (method === 'PUT') {
            response = await axios.put(`${url}/${parameters.sku}`, parameters);
        } else if (method === 'DELETE') {
          response = await axios.delete(`${url}/${parameters.id}`);
        }


        if (response.status === 200 || response.status === 201) {
            show_alert('Operación exitosa', 'success');
            document.getElementById('btnClose').click()
            getProducts();
        } else {
            show_alert('Error en la operación', 'danger');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        show_alert('Hubo un error en la solicitud', 'error');
        console.log(error)
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
        Swal.fire({
            title: "Error",
            text: "ID no válido",
            icon: "error",
        });
        return;
    }

    // Agregamos la confirmación antes de eliminar
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/v1/products/${id}`);

                if (response.status === 204) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "Producto eliminado correctamente",
                        icon: "success",
                    });

                    getProducts(); // Refrescar lista
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error en la operación",
                    icon: "error",
                });

                console.error("Error en la solicitud:", error.response?.data || error.message);
            }
        }
    });
    
  };


  const handleSale = () => {
    if (selectedProducts.length === 0) {
      show_alert("Selecciona al menos un producto para vender", "warning");
      return;
    }
  
    const confirmSale = async () => {
      // Generamos las filas de productos con un campo de cantidad editable
      const productsList = selectedProducts.map((product) => (
        `<tr key="${product.id}">
          <td>${product.name}</td>
          <td>${new Intl.NumberFormat("es-co").format(product.price)}</td>
          <td>
            <input 
              type="number" 
              value="${product.quantity || 1}" 
              min="1" 
              class="form-control quantity-input" 
              data-product-id="${product.id}" />
          </td>
          <td class="product-total" id="total-${product.id}">
            ${new Intl.NumberFormat("es-co").format(product.quantity * product.price || product.price)}
          </td>
        </tr>`
      )).join("");
  
      const { value: confirm } = await Swal.fire({
        title: "Confirmar Venta",
        html: `
          <table class="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
          </table>
          <div class="total-section">
            <strong>Total: $<span id="grand-total">${new Intl.NumberFormat("es-co").format(calculateGrandTotal())}</span></strong>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Confirmar Venta",
        cancelButtonText: "Cancelar",
        icon: "info",
      });
  
      // Asignamos el evento para actualizar la cantidad después de que SweetAlert se haya mostrado
      if (confirm) {
        document.querySelectorAll('.quantity-input').forEach(input => {
          input.addEventListener('change', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            updateQuantity(productId, event);
          });
        });
  
        try {
          const saleItems = selectedProducts.map((product) => ({
            sku: product.sku,
            quantity: product.quantity || 1, // Aseguramos que tenga la cantidad
            productName: product.name,
            totalPrice: product.quantity * product.price || product.price,
          }));
  
          const response = await axios.post("http://localhost:8080/api/v1/sales", saleItems);
          if (response.status === 200 || response.status === 201) {
            show_alert("Venta realizada con éxito", "success");
            setSelectedProducts([]); // Limpiar productos seleccionados
          }
        } catch (error) {
          console.error("Error en la venta:", error);
          show_alert("Hubo un error en la venta", "error");
        }
      }
    };
  
    confirmSale();
  };
  
  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, event) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.id === productId) {
        product.quantity = parseInt(event.target.value, 10);
      }
      return product;
    });
  
    setSelectedProducts(updatedProducts); // Actualizar el estado de los productos seleccionados
    updateProductTotal(productId); // Actualizar el total del producto
    updateGrandTotal(); // Actualizar el total general
  };
  
  // Función para actualizar el total de un producto
  const updateProductTotal = (productId) => {
    const product = selectedProducts.find(p => p.id === productId);
    const productTotal = document.getElementById(`total-${productId}`);
    if (productTotal) {
      const productTotalValue = product.quantity * product.price;
      productTotal.innerHTML = new Intl.NumberFormat("es-co").format(productTotalValue);
    }
  };
  
  // Función para calcular el total general de la venta
  const calculateGrandTotal = () => {
    return selectedProducts.reduce((total, product) => {
      const productTotal = product.quantity * product.price || product.price;
      return total + productTotal;
    }, 0);
  };
  
  // Función para actualizar el total general en el modal
  const updateGrandTotal = () => {
    const grandTotal = calculateGrandTotal();
    const grandTotalElement = document.getElementById("grand-total");
    if (grandTotalElement) {
      grandTotalElement.innerHTML = new Intl.NumberFormat("es-co").format(grandTotal);
    }
  };

  const generateReport = async () => {
    try {
      // Definir las fechas de inicio y fin (hoy)
      const today = new Date().toISOString().split("T")[0];
  
      // Hacer la petición al endpoint de generación de reportes
      const response = await fetch(
        `http://localhost:8080/api/v1/sales/generate-sales-report?startDate=${today}&endDate=${today}`
      );
  
      if (!response.ok) {
        throw new Error("Error al generar el reporte");
      }
  
      const data = await response.json();
  
      // Estructurar los datos del reporte
      const reportData = {
        fecha: today,
        numeroTransacciones: data.totalTransactions,
        totalIngresos: data.totalRevenue,
        productosVendidos: data.products.map((product) => ({
          nombre: product.productName,
          cantidadVendida: product.totalQuantity,
        })),
      };
  
      // Convertir a JSON y crear archivo para descargar
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reporte_Ventas_${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      alert("📊 Reporte generado y descargado con éxito.");
    } catch (error) {
      console.error("Error generando el reporte:", error);
      alert("⚠️ Hubo un error al generar el reporte.");
    }
  };

  return (
    <div className='App'>
      <div className='container-fluid'>
        {/* Botón de Añadir */}
        <div className='row mt-3'>
          <div className='col-md-12 d-flex justify-content-center gap-3'>
            <button onClick={() => generateReport()} className='btn btn-success'>
              <i className='fa-solid fa-file-alt'></i> Generar Reporte
            </button>

            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
              <i className='fa-solid fa-circle-plus'></i> Añadir
            </button>

            <button onClick={() => handleSale()} className='btn btn-primary'>
              <i className='fa-solid fa-cart-shopping'></i> Vender
            </button>
          </div>
        </div>
  
        {/* Tabla de productos */}
        <div className='row mt-3'>
          <div className='col-12'>
            <div className='table-responsive'>
              <table className='table table-bordered w-100'>
                <thead className='table-dark'>
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
                <tbody className='table-group-divider'>
                  {products.map((product, i) => (
                    <tr key={product.id}>
                      <th>
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.some(item => item.id === product.id)} 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prevState => [...prevState, product]); // Agrega el producto seleccionado
                            } else {
                              setSelectedProducts(prevState => prevState.filter(item => item.id !== product.id)); // Elimina el producto desmarcado
                            }
                          }} 
                        />
                      </th>
                      <td>{i + 1}</td>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${new Intl.NumberFormat('es-co').format(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button onClick={() => openModal(2, product.id, product.sku, product.name, product.description, product.price, product.stock )} 
                                className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteProduct(product.id, product.name)} className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      {/* Modal */}
      <div id="modalProducts" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg rounded">
            
            {/* Header */}
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title fw-bold text-center w-100">{title}</h5>
              <button type="button" className="btn-close btn-close-white text-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            {/* Body */}
            <div className="modal-body p-3">
              <input type="hidden" id="id" />

              <div className="mb-3">
                <label className="form-label fw-bold">SKU</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-solid fa-code"></i></span>
                  <input type="text" id="sku" className="form-control" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Nombre</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                  <input type="text" id="name" className="form-control" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Descripción</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-solid fa-comment"></i></span>
                  <input type="text" id="description" className="form-control" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Precio</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-solid fa-dollar-sign"></i></span>
                  <input type="number" id="price" className="form-control" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Existencias</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-solid fa-archive"></i></span>
                  <input type="number" id="stock" className="form-control" placeholder="Existencias" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="d-grid col-12 mx-auto">
                <button onClick={ () => validate() } className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">
              <button type="button" id='btnClose' className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShowProducts