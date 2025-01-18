// src/components/Cookies.jsx
function Cookies() {
  const cookies = [
    { id: "3", name: "Chocolate Chip Cookie", price: 15.0 },
    { id: "4", name: "Oatmeal Cookie", price: 12.0 },
  ];

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

  return (
    <div>
      <h2>Cookies</h2>
      {cookies.map((cookie) => (
        <div key={cookie.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>{cookie.name}</p>
          <p>Price: ${cookie.price}</p>
          <button onClick={() => addToCart(cookie.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Cookies;
