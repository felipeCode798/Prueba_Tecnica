package com.example.sgiv.Dto;

public class ProductSalesReport {

    private String sku;
    private String productName;
    private int quantitySold;

    // Constructor con los tres parámetros
    public ProductSalesReport(String sku, String productName, int quantitySold) {
        this.sku = sku;
        this.productName = productName;
        this.quantitySold = quantitySold;
    }

    public void addQuantity(int quantity) {
        this.quantitySold += quantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(int quantitySold) {
        this.quantitySold = quantitySold;
    }
}
