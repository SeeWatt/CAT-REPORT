package com.bakery;
import java.util.ArrayList;
import java.util.List;

public class ProductRepository {
    private List<Product> products = new ArrayList<>();

    public ProductRepository() {
        // Pre-populate with sample data
        products.add(new Product("1", "Chocolate Cake", "cake", 15.00, "Rich chocolate flavor"));
        products.add(new Product("2", "Vanilla Cupcake", "cake", 5.00, "Classic vanilla cupcake"));
        products.add(new Product("3", "Chocolate Chip Cookie", "cookie", 3.00, "Chewy chocolate chip cookie"));
        products.add(new Product("4", "Oatmeal Cookie", "cookie", 12.00, "Oat"));
        // ...
    }

    public List<Product> getAllProducts() {
        return products;
    }

    public Product getProductById(String id) {
        for (Product p : products) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }

    public void addProduct(Product product) {
        products.add(product);
    }
}
