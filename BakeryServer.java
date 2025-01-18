package com.bakery;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class BakeryServer {
    private static ProductRepository productRepo = new ProductRepository();
    private static UserRepository userRepo = new UserRepository();
    private static CartService cartService = new CartService();
    private static String currentSessionUserId = null;  // Variable to track logged-in user ID

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // endpoints
        server.createContext("/products", new ProductsHandler());
        server.createContext("/addToCart", new AddToCartHandler());
        server.createContext("/register", new RegisterHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/cart", new CartHandler());
        server.createContext("/removeFromCart", new RemoveFromCartHandler());
        server.createContext("/checkout", new CheckoutHandler());
        server.createContext("/updateQuantity", new UpdateQuantityHandler());
        server.createContext("/currentUser", new CurrentUserHandler());

        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 8080");
    }

    // -------------------
    // 1) Handler to get all products
    static class ProductsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                List<Product> products = productRepo.getAllProducts();
                // Convert list to JSON string manually
                String response = productsToJson(products);
                sendResponse(exchange, 200, response);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    // 2) Handler to add product to cart
    static class AddToCartHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String userId = null;
                String productId = null;
    
                if (query != null) {
                    String[] pairs = query.split("&");
                    for (String pair : pairs) {
                        String[] keyVal = pair.split("=");
                        if (keyVal.length == 2) {
                            if ("userId".equals(keyVal[0])) {
                                userId = keyVal[1];
                            } else if ("productId".equals(keyVal[0])) {
                                productId = keyVal[1];
                            }
                        }
                    }
                }
    
                System.out.println("userId: " + userId + " productId: " + productId);  // Debug log
    
                if (userId == null || productId == null) {
                    sendResponse(exchange, 400, "Missing userId or productId");
                    return;
                }
    
                // Get the product by productId (this should be working for cookies as well)
                Product product = productRepo.getProductById(productId);
                if (product == null) {
                    sendResponse(exchange, 404, "Product not found");
                    return;
                }
    
                cartService.addProductToCart(userId, product);
                sendResponse(exchange, 200, "Product added to cart for user " + userId);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    // 3) Handler for user registration
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                // Read the body of the POST request to get the registration data
                InputStreamReader reader = new InputStreamReader(exchange.getRequestBody());
                BufferedReader br = new BufferedReader(reader);
                StringBuilder data = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    data.append(line);
                }
    
                // Parse the data (email, password, and username)
                String requestData = data.toString();
                String username = null;
                String password = null;
                String email = null;
    
                try {
                    requestData = requestData.trim().replaceAll("[{}]", "");
                    String[] keyValuePairs = requestData.split(",");
                    for (String pair : keyValuePairs) {
                        String[] keyValue = pair.split(":");
                        if (keyValue.length == 2) {
                            String key = keyValue[0].trim().replaceAll("\"", "");
                            String value = keyValue[1].trim().replaceAll("\"", "");
    
                            if (key.equals("username")) {
                                username = value;
                            } else if (key.equals("email")) {
                                email = value;
                            } else if (key.equals("password")) {
                                password = value;
                            }
                        }
                    }
                } catch (Exception e) {
                    sendResponse(exchange, 400, "Invalid JSON format");
                    return;
                }
    
                // Create user and save to file
                User user = userRepo.createUser(username, password, email);
                sendResponse(exchange, 200, "User registered: " + user.getUsername());
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }
    


    // 5) Handler for login
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                // Read request body
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader reader = new BufferedReader(isr);
                StringBuilder requestBody = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    requestBody.append(line);
                }

                // Parse the request body (email and password)
                String requestData = requestBody.toString();
                String email = null;
                String password = null;

                try {
                    requestData = requestData.trim().replaceAll("[{}]", "");
                    String[] keyValuePairs = requestData.split(",");
                    for (String pair : keyValuePairs) {
                        String[] keyValue = pair.split(":");
                        if (keyValue.length == 2) {
                            String key = keyValue[0].trim().replaceAll("\"", "");
                            String value = keyValue[1].trim().replaceAll("\"", "");

                            if (key.equals("email")) {
                                email = value;
                            } else if (key.equals("password")) {
                                password = value;
                            }
                        }
                    }
                } catch (Exception e) {
                    sendResponse(exchange, 400, "Invalid JSON format");
                    return;
                }

                // Validate credentials using email
                User user = userRepo.login(email, password);  // Use email to search
                if (user != null) {
                    currentSessionUserId = user.getUserId();  // Set the logged-in user ID
                    // Send successful response with user details
                    String response = "{\"message\":\"Login successful! Welcome " + user.getUsername() + "\",\"user\":\"" + user.getUsername() + "\"}";
                    sendResponse(exchange, 200, response);
                } else {
                    sendResponse(exchange, 401, "{\"message\":\"Invalid email or password\"}");
                }
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }       
    
    // -------------------
    // Remove product from cart
    static class RemoveFromCartHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String userId = null;
                String productId = null;

                // Parse userId and productId from query
                if (query != null) {
                    String[] pairs = query.split("&");
                    for (String pair : pairs) {
                        String[] keyVal = pair.split("=");
                        if (keyVal.length == 2) {
                            if ("userId".equals(keyVal[0])) {
                                userId = keyVal[1];
                            } else if ("productId".equals(keyVal[0])) {
                                productId = keyVal[1];
                            }
                        }
                    }
                }

                if (userId == null || productId == null) {
                    sendResponse(exchange, 400, "Missing userId or productId");
                    return;
                }

                // Get the cart for the user
                Cart cart = cartService.getCartByUserId(userId);
                Product product = productRepo.getProductById(productId);

                if (product == null) {
                    sendResponse(exchange, 404, "Product not found");
                    return;
                }

                // Remove the item from the cart
                cartService.removeFromCart(userId, product);
                sendResponse(exchange, 200, "Product removed from cart");
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    // NEW: Checkout / Payment
    static class CheckoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                // e.g. /checkout?userId=1
                String query = exchange.getRequestURI().getQuery();
                String userId = null;
    
                if (query != null) {
                    String[] pairs = query.split("&");
                    for (String pair : pairs) {
                        String[] keyVal = pair.split("=");
                        if (keyVal.length == 2 && "userId".equals(keyVal[0])) {
                            userId = keyVal[1];
                        }
                    }
                }
    
                if (userId == null) {
                    sendResponse(exchange, 400, "Missing userId in query");
                    return;
                }
    
                double total = cartService.checkout(userId);
                sendResponse(exchange, 200, "Payment success, total = " + total);
    
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }
    
    // -------------------
    // Utility: Convert a list of products to a JSON-like string
    private static String productsToJson(List<Product> products) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            sb.append("{");
            sb.append("\"id\":\"").append(p.getId()).append("\",");
            sb.append("\"name\":\"").append(p.getName()).append("\",");
            sb.append("\"category\":\"").append(p.getCategory()).append("\",");
            sb.append("\"price\":").append(p.getPrice()).append(",");
            sb.append("\"description\":\"").append(p.getDescription()).append("\"");
            sb.append("}");
            if (i < products.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private static String userToJson(User user) {
        if (user == null) return "{}";
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"userId\":\"").append(user.getUserId()).append("\",");
        sb.append("\"username\":\"").append(user.getUsername()).append("\",");
        sb.append("\"password\":\"").append(user.getPassword()).append("\",");
        sb.append("\"email\":\"").append(user.getEmail()).append("\"");
        sb.append("}");
        return sb.toString();
    }

    // Update item quantity in cart
    static class UpdateQuantityHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String userId = null;
                String productId = null;
                int quantity = 0;

                if (query != null) {
                    String[] pairs = query.split("&");
                    for (String pair : pairs) {
                        String[] keyVal = pair.split("=");
                        if (keyVal.length == 2) {
                            if ("userId".equals(keyVal[0])) {
                                userId = keyVal[1];
                            } else if ("productId".equals(keyVal[0])) {
                                productId = keyVal[1];
                            } else if ("quantity".equals(keyVal[0])) {
                                quantity = Integer.parseInt(keyVal[1]);
                            }
                        }
                    }
                }

                if (userId == null || productId == null || quantity == 0) {
                    sendResponse(exchange, 400, "Missing parameters");
                    return;
                }

                Product product = productRepo.getProductById(productId);
                if (product == null) {
                    sendResponse(exchange, 404, "Product not found");
                    return;
                }

                cartService.updateItemQuantity(userId, product, quantity);
                sendResponse(exchange, 200, "Quantity updated");
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private static String cartItemsToJson(Cart cart, ProductRepository productRepo) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"userId\":\"").append(cart.getUserId()).append("\",");
        sb.append("\"totalPrice\":").append(cart.getTotalPrice()).append(",");
        sb.append("\"items\":[");

        List<Product> products = cart.getProducts(productRepo);  // Use getProducts() method here
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            sb.append("{");
            sb.append("\"id\":\"").append(product.getId()).append("\",");
            sb.append("\"name\":\"").append(product.getName()).append("\",");
            sb.append("\"category\":\"").append(product.getCategory()).append("\",");
            sb.append("\"price\":").append(product.getPrice()).append(",");
            sb.append("\"description\":\"").append(product.getDescription()).append("\"");
            sb.append("}");

            if (i < products.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        sb.append("}");
        return sb.toString();
    }

    // Cart Handler to get current cart items
    static class CartHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String userId = null;

                if (query != null) {
                    String[] pairs = query.split("&");
                    for (String pair : pairs) {
                        String[] keyVal = pair.split("=");
                        if (keyVal.length == 2 && "userId".equals(keyVal[0])) {
                            userId = keyVal[1];
                        }
                    }
                }

                if (userId == null) {
                    sendResponse(exchange, 400, "Missing userId in query");
                    return;
                }

                Cart cart = cartService.getCartByUserId(userId);
                sendResponse(exchange, 200, cartItemsToJson(cart, productRepo));  // Pass productRepo here
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    static class CurrentUserHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String userId = getUserIdFromSession(exchange);  // Retrieve user ID from session or token

                if (userId == null) {
                    sendResponse(exchange, 401, "No user logged in");
                    return;
                }

                // Retrieve user from userRepo
                User user = userRepo.getUserById(userId);
                if (user != null) {
                    String response = "{\"user\":\"" + user.getUsername() + "\"}";
                    sendResponse(exchange, 200, response);  // Send the username as response
                } else {
                    sendResponse(exchange, 404, "User not found");
                }
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private static String getUserIdFromSession(HttpExchange exchange) {
        return currentSessionUserId;  // Return the current logged-in user's ID (or null if no one is logged in)
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {   
        // Add CORS headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");  // Allow all origins
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");  // Allow these methods
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");  // Allow these headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)

        // For OPTIONS preflight request
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);  // No content for OPTIONS
            return;
        }

        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }


    
}
