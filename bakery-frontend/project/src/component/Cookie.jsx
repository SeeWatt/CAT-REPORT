import { useState, useEffect } from 'react';

function Cookies() {
  const [selectedCookie, setSelectedCookie] = useState(null); // Track selected cookie for modal
  const [cookies, setCookies] = useState([]); // Store cookies data fetched from backend

  // Fetch the cookies data from the backend
  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch("http://localhost:8080/cookies"); // Change this URL to your actual backend API endpoint
        if (response.ok) {
          const data = await response.json();
          setCookies(data); // Set the fetched cookies data to state
        } else {
          console.error("Failed to fetch cookies data");
        }
      } catch (error) {
        console.error("Error fetching cookies data:", error);
      }
    };

    fetchCookies();
  }, []); // Empty dependency array to only fetch once on component mount

  const addToCart = async (cookieId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/addToCart?userId=1&productId=${cookieId}`,
        { method: "POST" }
      );
      if (response.ok) {
        alert("Cookie added to cart!");
      } else {
        alert("Failed to add cookie: " + (await response.text()));
      }
    } catch (error) {
      console.error("Network error adding cookie:", error);
      alert("Network error adding cookie");
    }
  };

  const showProductDetails = (cookie) => {
    setSelectedCookie(cookie); // Show the selected product details in the modal
  };

  return (
    <div>
      <h2>Cookies</h2>
      <div className="product-grid">
        {cookies.map((cookie) => (
          <div key={cookie.id} className="product-item">
            <img
              src={cookie.image}  // Use the image URL from your backend
              alt={cookie.name}
              onClick={() => showProductDetails(cookie)} // Show details when image is clicked
            />
            <h3>{cookie.name}</h3>
            <p>Price: RM {cookie.price}</p>
            <button onClick={() => addToCart(cookie.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedCookie && (
        <div className="product-description">
          <h3>{selectedCookie.name}</h3>
          <p><strong>Price:</strong> RM {selectedCookie.price}</p>
          <p><strong>Description:</strong> {selectedCookie.description}</p>
          <p><strong>Ingredients:</strong> {selectedCookie.ingredients}</p>
          <button onClick={() => setSelectedCookie(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Cookies;
