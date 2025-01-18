package com.bakery;
public class User {
  private String userId;
  private String username;
  private String password;
  private String email;

  public User(String userId, String username, String password, String email) {
      this.userId = userId;
      this.username = username;
      this.password = password;
      this.email = email;
  }

  // Getters and setters...
  public String getUserId() {
    return userId;
  }
  public String getUsername() {
    return username;
  }
  public String getPassword() {
    return password;
  }
  public String getEmail() {
    return email;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public void setPassword(String password) {
    this.password = password;
  }
  public void setEmail(String email) {
    this.email = email;
  } 
}
