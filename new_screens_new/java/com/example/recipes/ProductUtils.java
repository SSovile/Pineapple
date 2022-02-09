package com.example.recipes;

public class ProductUtils {

    private String imageName;
    private String productName;
    private String componentsList;

    public ProductUtils(String imageName, String productName, String componentsList) {
        this.imageName = imageName;
        this.productName = productName;
        this.componentsList = componentsList;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getProductName() {
        return productName;
    }

    public void setPersonName(String productName) {
        this.productName = productName;
    }

    public String getComponentsList() {
        return componentsList;
    }

    public void setComponentsList(String componentsList) {
        this.componentsList = componentsList;
    }
}