package com.bakery;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io. File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class UserRepository {
    private Map<String, User> users = new HashMap<>();
    private static int userCounter = 1;
    private static final String USERS_FILE = "/C://Users//chanj//Downloads//cat projects new//bakery-backend//users.txt";  // File where user data is stored

    public UserRepository() {
        loadUsers();
    }

    private void loadUsers() {
        try {
            File file = new File(USERS_FILE);
            if (!file.exists()) return;

            // Read the file and load users
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                String userId = data[0];
                String username = data[1];
                String password = data[2];
                String email = data[3];

                User user = new User(userId, username, password, email);
                users.put(userId, user);
                userCounter = Math.max(userCounter, Integer.parseInt(userId) + 1);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void saveUsers() {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(USERS_FILE));
            for (User user : users.values()) {
                System.out.println("Saving user: " + user.getUsername());  // Log the user being saved
                writer.write(user.getUserId() + "," + user.getUsername() + "," + user.getPassword() + "," + user.getEmail());
                writer.newLine(); // Add a new line for each user
            }
            writer.close();  // Ensure the writer is closed after writing
        } catch (IOException e) {
            System.out.println("Error saving users to file: " + e.getMessage());
            e.printStackTrace(); // Log any errors encountered while writing to the file
        }
    }
    
    

    public User createUser(String username, String password, String email) {
        String userId = String.valueOf(userCounter++);  // Generate a new user ID
        User user = new User(userId, username, password, email);
        users.put(userId, user);
        saveUsers();  // save users after adding a new one
        return user;
    }
    
    

    public User getUserById(String userId) {
        return users.get(userId);
    }

    public User login(String identifier, String password) {
        for (User user : users.values()) {
            if ((user.getUsername().equals(identifier) || user.getEmail().equals(identifier)) && user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}
