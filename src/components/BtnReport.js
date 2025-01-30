export default function BtnReport() {
  
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

  return(
    <button onClick={() => generateReport()} className='btn btn-success'>
      <i className='fa-solid fa-file-alt'></i> Generar Reporte
    </button>
  )
}