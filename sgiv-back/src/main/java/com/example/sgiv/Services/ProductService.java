package com.example.sgiv.Services;


import com.example.sgiv.Dto.ProductSalesReport;
import com.example.sgiv.Dto.SalesReport;
import com.example.sgiv.Entities.Product;
import com.example.sgiv.Entities.Sale;
import com.example.sgiv.Entities.SaleItem;
import com.example.sgiv.Repositories.ProductRepository;
import com.example.sgiv.Repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true; // Indica que el producto se eliminó correctamente
        }
        return false; // Indica que el producto no existe
    }

    public void reduceStock(String sku, int quantity, String productName) {
        Product product = getProductBySku(sku);
        if (product != null && product.getStock() >= quantity) {
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);
            // Log para confirmar que el stock se ha reducido
            System.out.println("Stock de " + productName + " reducido a " + product.getStock());
        } else {
            // Log si no hay suficiente stock
            System.out.println("No hay suficiente stock para el producto " + productName);
        }
    }

    public SalesReport generateSalesReport(LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = SaleRepository.findByDateTimeBetween(startDate.atStartOfDay(), endDate.atStartOfDay()); // Filtramos ventas por fecha

        int totalTransactions = sales.size();
        double totalIncome = sales.stream().mapToDouble(Sale::getTotalAmount).sum();

        Map<String, ProductSalesReport> productSalesMap = new HashMap<>();
        for (Sale sale : sales) {
            for (SaleItem item : sale.getItems()) {
                String sku = item.getSku();
                String productName = item.getProductName();
                int quantitySold = item.getQuantity();
                productSalesMap.putIfAbsent(productName, new ProductSalesReport(sku,productName,quantitySold));
                productSalesMap.get(productName).addQuantity(item.getQuantity());
            }
        }

        List<ProductSalesReport> productSalesReports = new ArrayList<>(productSalesMap.values());

        return new SalesReport(totalTransactions, productSalesReports, totalIncome);
    }
}
