import { useState } from 'react';

function Cakes() {
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
    <div>
      <h2>Cakes</h2>
      <div className="product-grid">
        {cakes.map((cake) => (
          <div key={cake.id} className="product-item">
            <img
              src={`/images/${cake.name.toLowerCase().replace(" ", "-")}.jpg`} //line for correct image source
              alt={cake.name}
              onClick={() => showProductDetails(cake)} // Show details when image is clicked
            />
            <h3>{cake.name}</h3>
            <p>Price: RM {cake.price}</p>
            <button onClick={() => addToCart(cake.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="product-description">
          <h3>{selectedProduct.name}</h3>
          <p><strong>Price:</strong> RM {selectedProduct.price}</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <p><strong>Ingredients:</strong> {selectedProduct.ingredients}</p>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Cakes;
