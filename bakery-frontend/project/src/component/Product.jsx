import { useState } from 'react';
import './app.css';

// Cakes and Cookies data
const cakes = [
  { id: '1', name: 'Chocolate Cake', price: 49.00, description: 'Rich chocolate flavor', image: '/image/cakes.jpeg' },
  { id: '2', name: 'Vanilla Cake', price: 39.00, description: 'Light and fluffy sponge cake with a smooth vanilla flavour.', image: '/image/vanilla.png' },
  { id: '3', name: 'Red Velvet Cake', price: 49.00, description: 'Delicious, soft cake with a light cocoa flavor and topped with cream cheese frosting.', image: '/image/red_cake.jpg' },
  { id: '4', name: 'Coffee Cake', price: 49.00, description: 'The moist cake has a light coffee flavor and is perfect for breakfast or dessert.', image: '/image/coffee_cake.jpg' },
  { id: '5', name: 'Strawberry Cake', price: 49.00, description: 'Layers of fluffy sponge cake, fresh strawberries, and whipped cream.', image: '/image/straw_cake.jpg' },
  { id: '6', name: 'Cheese Cake', price: 39.00, description: 'Rich, creamy dessert made with a smooth cream cheese filling and a buttery graham cracker crust', image: '/image/cheesee_cake.webp' },
  { id: '7', name: 'Lemon Cake', price: 35.00, description: "It's just the right amount of sweet and sour, with a tangy lemon flavor and a hint of icing sugar.", image: '/image/lemon_cake.jpg' },
  { id: '8', name: 'Durian Cake', price: 79.00, description: 'A unique and aromatic cake made from durian, known for its creamy texture and rich, unique aroma', image: '/image/durian_cake.jpg' },
];

const cookies = [
  { id: '9', name: 'Chocolate Chip Cookie', price: 5.50, description: 'Classic cookie filled with gooey chocolate chips.', image: '/image/cookie.png' },
  { id: '10', name: 'White Chocolate Cookie', price: 7.00, description: 'Soft and chewy cookies are filled with sweet, creamy white chocolate chunks, providing a rich and tantalizing taste.', image: '/image/w_cookie.jpeg' },
  { id: '11', name: 'Peanut Butter Cookie', price: 5.50, description: 'Rich and soft cookie made with creamy peanut butter.', image: '/image/p_b_cookie.jpg' },
  { id: '12', name: 'Snickerdoodle', price: 7.50, description: 'Soft and chewy cinnamon sugar cookies.', image: '/image/snicker_cookie.jpg' },
  { id: '13', name: 'Macadamia Nut Cookie', price: 6.50, description: 'Buttery cookies with crunchy macadamia nuts and white chocolate chips', image: '/image/macadamia_cookie.jpg' },
  { id: '14', name: 'Double Chocolate Cookie', price: 8.50, description: 'Delicious chocolate chip cookie with added extra chocolate chips.', image: '/image/d_cookie.jpeg' },
  { id: '15', name: 'Lemon Sugar Cookie', price: 5.50, description: 'Refreshing cookie with a tangy lemon flavor with a sweet and slightly crisp edge.', image: '/image/l_s_cookie.webp' },
  { id: '16', name: 'Caramel Cookie', price: 7.50, description: 'Soft and chewy cookies with rich caramel flavor have a buttery texture and a lightly sweet taste from the caramel chunks inside.', image: '/image/caramel_cookie.jpg' },
];


function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/addToCart?userId=1&productId=${productId}`,
        { method: "POST" }
      );
      if (response.ok) {
        alert("Product added to cart!");
      } else {
        alert("Failed to add product: " + (await response.text()));
      }
    } catch (error) {
      console.error("Network error adding product:", error);
      alert("Network error adding product");
    }
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="products-page">
      <h2 style={{ color: 'black', textDecoration: 'none', fontWeight:'bold', lineHeight:'70px', fontSize:'50px',fontFamily: 'Caveat, cursive', padding:'1.5rem'}}>Cakes</h2>
      <div className="product-grid">
        {cakes.map((cake) => (
          <div key={cake.id} className="product-item">
            <img
              src={cake.image}
              alt={cake.name}
              onClick={() => showProductDetails(cake)} // Show product details when image is clicked
            />
            <h3 style={{margin:'0.6rem',}}>{cake.name}</h3>
            <p style={{margin:'0.6rem',}}><strong>Price:</strong> RM {cake.price}</p> {/* Display price here */}
            <button onClick={() => addToCart(cake.id)} style={{margin:'0.6rem',}}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2 >Cookies</h2>
      <div className="product-grid">
        {cookies.map((cookie) => (
          <div key={cookie.id} className="product-item">
            <img
              src={cookie.image}
              alt={cookie.name}
              onClick={() => showProductDetails(cookie)} // Show product details when image is clicked
            />
            <h3 style={{margin:'0.6rem',}}>{cookie.name}</h3>
            <p style={{margin:'0.6rem',}}><strong>Price:</strong> RM {cookie.price}</p> {/* Display price here */}
            <button onClick={() => addToCart(cookie.id)} style={{margin:'0.6rem',}}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="product-description">
         <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{
              
              width: '100%',
              maxWidth: '300px',  // Set a maximum width for the image
              height: 'auto',     // Maintain aspect ratio
              borderRadius: '10px',
              marginBottom: '10px', // Add space below the image
            }}
          />
          <h3>{selectedProduct.name}</h3>
          <p><strong>Price:</strong> RM {selectedProduct.price}</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Products;
