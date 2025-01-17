// Source code is decompiled from a .class file using FernFlower decompiler.
package com.bakery;

public class Product {
   private String id;
   private String name;
   private String category;
   private double price;
   private String description;

   public Product(String id, String name, String category, double price, String description) {
      this.id = id;
      this.name = name;
      this.category = category;
      this.price = price;
      this.description = description;
   }

   public String getId() {
      return this.id;
   }

   public String getName() {
      return this.name;
   }

   public String getCategory() {
      return this.category;
   }

   public double getPrice() {
      return this.price;
   }

   public String getDescription() {
      return this.description;
   }

   public void setId(String id) {
      this.id = id;
   }

   public void setName(String name) {
      this.name = name;
   }

   public void setCategory(String category) {
      this.category = category;
   }

   public void setPrice(double price) {
      this.price = price;
   }

   public void setDescription(String description) {
      this.description = description;
   }
}
