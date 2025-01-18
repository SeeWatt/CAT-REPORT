// src/components/Cakes.jsx
function Cakes() {
  const cakes = [
    { id: "1", name: "Chocolate Cake", price: 35.0 },
    { id: "2", name: "Vanilla Cake", price: 30.0 },
  ];

  const addToCart = async (cakeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/addToCart?userId=1&productId=${cakeId}`,
        { method: "POST" }
      );
      if (response.ok) {
        alert("Cake added to cart!");
      } else {
        alert("Failed to add cake: " + (await response.text()));
      }
    } catch (error) {
      console.error("Network error adding cake:", error);
      alert("Network error adding cake");
    }
  };

  return (
    <div>
      <h2>Cakes</h2>
      {cakes.map((cake) => (
        <div key={cake.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>{cake.name}</p>
          <p>Price: ${cake.price}</p>
          <button onClick={() => addToCart(cake.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Cakes;
