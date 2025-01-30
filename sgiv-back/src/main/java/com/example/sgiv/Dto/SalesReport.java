package com.example.sgiv.Dto;

import java.util.List;

public class SalesReport {

    private int totalTransactions;  // Número de transacciones realizadas
    private List<ProductSalesReport> productSalesReports;  // Lista de productos vendidos
    private double totalIncome;  // Total general de ingresos

    // Constructor, getters y setters
    public SalesReport(int totalTransactions, List<ProductSalesReport> productSalesReports, double totalIncome) {
        this.totalTransactions = totalTransactions;
        this.productSalesReports = productSalesReports;
        this.totalIncome = totalIncome;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(int totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public List<ProductSalesReport> getProductSalesReports() {
        return productSalesReports;
    }

    public void setProductSalesReports(List<ProductSalesReport> productSalesReports) {
        this.productSalesReports = productSalesReports;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }
}
