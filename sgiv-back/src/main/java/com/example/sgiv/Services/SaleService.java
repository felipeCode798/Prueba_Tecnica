package com.example.sgiv.Services;

import com.example.sgiv.Dto.ProductSalesReport;
import com.example.sgiv.Dto.SalesReport;
import com.example.sgiv.Entities.Product;
import com.example.sgiv.Entities.Sale;
import com.example.sgiv.Entities.SaleItem;
import com.example.sgiv.Repositories.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductService productService;

    public List<Sale> getSalesByDate(LocalDate date) {
        return SaleRepository.findByDateTimeBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    public double getTotalSales(LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = SaleRepository.findByDateTimeBetween(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        return sales.stream().mapToDouble(Sale::getTotalAmount).sum();
    }

    public List<ProductSalesReport> getTopSellingProducts(LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = SaleRepository.findByDateTimeBetween(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());

        Map<String, Integer> productSalesMap = new HashMap<>();
        for (Sale sale : sales) {
            for (SaleItem item : sale.getItems()) {
                productSalesMap.put(item.getSku(), productSalesMap.getOrDefault(item.getSku(), 0) + item.getQuantity());
            }
        }

        // Convertir el map a una lista de reportes de productos
        List<ProductSalesReport> productReports = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : productSalesMap.entrySet()) {
            Product product = productService.getProductBySku(entry.getKey());
            if (product != null) {
                productReports.add(new ProductSalesReport(product.getSku(), product.getName(), entry.getValue()));
            }
        }

        return productReports;
    }

    public Sale saveSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public SalesReport generateSalesReport(LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = SaleRepository.findByDateTimeBetween(startDate.atStartOfDay(), endDate.atStartOfDay());

        int totalTransactions = sales.size();
        double totalIncome = sales.stream().mapToDouble(Sale::getTotalAmount).sum();

        Map<String, ProductSalesReport> productSalesMap = new HashMap<>();
        for (Sale sale : sales) {
            for (SaleItem item : sale.getItems()) {
                String productName = item.getProductName();
                productSalesMap.putIfAbsent(productName, new ProductSalesReport("", productName, 0));
                productSalesMap.get(productName).addQuantity(item.getQuantity());
            }
        }

        List<ProductSalesReport> productSalesReports = new ArrayList<>(productSalesMap.values());

        return new SalesReport(totalTransactions, productSalesReports, totalIncome);
    }
}
