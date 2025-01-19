package com.bakery;
import java.util.ArrayList;
import java.util.List;

public class ProductRepository {
    private List<Product> products = new ArrayList<>();
    
        public ProductRepository() {
            // Pre-populate with sample data including image URL
            products.add(new Product("1", "Chocolate Cake", "cake", 49.00, "Rich chocolate flavor", "/image/cakes.jpeg"));
            products.add(new Product("2", "Vanilla Cake", "cake", 39.00, "Light and fluffy sponge cake with a smooth vanilla flavour.", "/image/vanilla.png"));
            products.add(new Product("3", "Red Velvet Cake", "cake", 49.00, "Delicious, soft cake with a light cocoa flavor and topped with cream cheese frosting.", "/image/red_cake.jpg"));
            products.add(new Product("4", "Coffee Cake", "cake", 49.00, "The moist cake has a light coffee flavor and is perfect for breakfast or dessert.", "/image/coffee_cake.jpg"));
            products.add(new Product("5", "Strawberry Cake", "cake", 49.00, "Layers of fluffy sponge cake, fresh strawberries, and whipped cream.", "/image/straw_cake.jpg"));
            products.add(new Product("6", "Cheese Cake", "cake", 39.00, "Rich, creamy dessert made with a smooth cream cheese filling and a buttery graham cracker crust", "/image/cheesee_cake.webp"));
            products.add(new Product("7", "Lemon Cake", "cake", 35.00, "It's just the right amount of sweet and sour, with a tangy lemon flavor and a hint of icing sugar.", "/image/lemon_cake.jpg"));
            products.add(new Product("8", "Durian Cake", "cake", 79.00, "A unique and aromatic cake made from durian, known for its creamy texture and rich, unique aroma", "/image/durian_cake.jpg"));
            //cookie
            products.add(new Product("9", "Chocolate Chip Cookie", "cookie", 5.50, "Classic cookie filled with gooey chocolate chips.", "/image/cookie.png"));
            products.add(new Product("10", "White Chocolate Cookie", "cookie", 7.00, "Soft and chewy cookies are filled with sweet, creamy white chocolate chunks, providing a rich and tantalizing taste.", "/image/w_cookie.jpeg"));
            products.add(new Product("11", "Peanut Butter Cookie", "cookie", 5.50, "Rich and soft cookie made with creamy peanut butter.", "/image/p_b_cookie.jpg"));
            products.add(new Product("12", "Snickerdoodle", "cookie", 6.50, "Soft and chewy cinnamon sugar cookies.", "/image/snicker_cookie.jpg"));
            products.add(new Product("13", "Macadamia Nut Cookie", "cookie", 8.50, "Buttery cookies with crunchy macadamia nuts and white chocolate chips", "/image/macadamia_cookie.jpg"));
            products.add(new Product("14", "Double Chocolate Cookie", "cookie", 7.50, " Delicious chocolate chip cookie with added extra chocolate chips.", "/image/d_cookie.jpeg"));
            products.add(new Product("15", "Lemon Sugar Cookie", "cookie", 5.50, "Refreshing cookie with a tangy lemon flavor with a sweet and slightly crisp edge.", "/image/l_s_cookie.webp"));
            products.add(new Product("16", "Caramel Cookie", "cookie", 7.50, "Soft and chewy cookies with rich caramel flavor have a buttery texture and a lightly sweet taste from the caramel chunks inside.", "/image/caramel_cookie.jpg"));
            
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
