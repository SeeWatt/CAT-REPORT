// CartService.java
package com.bakery;

import java.util.HashMap;
import java.util.Map;

public class CartService {
    // userId -> Cart
    private Map<String, Cart> carts = new HashMap<>();

    // Get or create a new cart for a user
    public Cart getCartByUserId(String userId) {
        if (!carts.containsKey(userId)) {
            carts.put(userId, new Cart(userId));  // Create a new cart if it doesn't exist
        }
        return carts.get(userId);
    }

    // Add product to cart
    public void addProductToCart(String userId, Product product) {
        Cart cart = getCartByUserId(userId);
        cart.addItem(product.getId(), product.getPrice(), 1); // Add one by default
    }

    // Remove product from cart
    public void removeFromCart(String userId, Product product) {
        Cart cart = getCartByUserId(userId);
        cart.removeItem(product.getId(), product.getPrice());  // Make sure to remove the item
    }

    // Update item quantity in cart
    public void updateItemQuantity(String userId, Product product, int quantity) {
        Cart cart = getCartByUserId(userId);
        cart.addItem(product.getId(), product.getPrice(), quantity);
    }

    // Checkout (payment)
    public double checkout(String userId) {
        Cart cart = getCartByUserId(userId);
        double total = cart.getTotalPrice();
        cart.clearCart(); // Clear the cart after checkout
        return total;
    }
}
