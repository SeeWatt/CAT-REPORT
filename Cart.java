package com.bakery;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Cart {
    private String userId;
    private Map<String, Integer> items; // productId -> quantity
    private double totalPrice;

    public Cart(String userId) {
        this.userId = userId;
        this.items = new HashMap<>();
        this.totalPrice = 0.0;
    }

    // Add or update item in the cart
    public void addItem(String productId, double price, int quantity) {
      int currentQuantity = items.getOrDefault(productId, 0) + quantity;
      items.put(productId, currentQuantity);  // Update quantity
      totalPrice += (price * quantity);
    }

    // Remove an item entirely
    public void removeItem(String productId, double price) {
        if (items.containsKey(productId)) {
            int currentQty = items.get(productId);
            items.remove(productId);
            totalPrice -= (price * currentQty);
        }
    }

    // Clears the cart (e.g. after payment)
    public void clearCart() {
        items.clear();
        totalPrice = 0.0;
    }

    public Map<String, Integer> getItems() {
        return items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public String getUserId() {
        return userId;
    }

    // Get products from the cart as a list
    public List<Product> getProducts(ProductRepository productRepo) {
        List<Product> productList = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : items.entrySet()) {
            Product product = productRepo.getProductById(entry.getKey());
            if (product != null) {
                productList.add(product);
            }
        }
        return productList;
    }
}
