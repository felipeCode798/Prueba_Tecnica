package com.example.sgiv.Controllers;

import com.example.sgiv.Dto.ProductSalesReport;
import com.example.sgiv.Dto.SalesReport;
import com.example.sgiv.Entities.Product;
import com.example.sgiv.Entities.Sale;
import com.example.sgiv.Entities.SaleItem;
import com.example.sgiv.Services.ProductService;
import com.example.sgiv.Services.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/sales")
public class SaleController {
    @Autowired
    private SaleService saleService;

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody List<SaleItem> items) {
        double totalAmount = 0;

        for (SaleItem item : items) {
            totalAmount += item.getTotalPrice();
            productService.reduceStock(item.getSku(), item.getQuantity(), item.getProductName());
        }

        Sale sale = new Sale();
        sale.setDateTime(LocalDateTime.now());
        sale.setItems(items);
        sale.setTotalAmount(totalAmount);

        Sale savedSale = saleService.saveSale(sale);
        System.out.println("Venta guardada: " + savedSale);  // Log para ver la venta guardada
        return ResponseEntity.ok(savedSale);
    }

    @GetMapping("/total-sales")
    public ResponseEntity<Double> getTotalSales(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        double totalSales = saleService.getTotalSales(start, end);
        return ResponseEntity.ok(totalSales);
    }

    @GetMapping("/top-selling-products")
    public ResponseEntity<List<ProductSalesReport>> getTopSellingProducts(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<ProductSalesReport> topSellingProducts = saleService.getTopSellingProducts(start, end);
        return ResponseEntity.ok(topSellingProducts);
    }

    @GetMapping("/report")
    public List<Sale> getSalesReport(@RequestParam String date) {
        LocalDate reportDate = LocalDate.parse(date);
        return saleService.getSalesByDate(reportDate);
    }

    @GetMapping("/generate-sales-report")
    public ResponseEntity<SalesReport> generateSalesReport(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // Llamamos al servicio para generar el reporte de ventas
        SalesReport salesReport = saleService.generateSalesReport(start, end);
        return ResponseEntity.ok(salesReport);
    }
}
