import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items on page load
  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetch("http://localhost:8080/cart?userId=1");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched cart items:", data);  // Log the response for debugging
        if (Array.isArray(data.items)) {
          setCartItems(data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1  // Ensure quantity exists
          })));
        }
      } else {
        console.error("Failed to fetch cart items");
      }
    };

    fetchCartItems();  // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once

// Handle increasing quantity
const increaseQuantity = async (itemId) => {
  const response = await fetch(
      `http://localhost:8080/updateQuantity?userId=1&productId=${itemId}&quantity=1`,  // Increase by 1
      { method: "POST" }
  );
  if (response.ok) {
      setCartItems((prev) =>
          prev.map((item) =>
              item.id === itemId
                  ? { ...item, quantity: item.quantity + 1 || 1 } // Ensure quantity is valid
                  : item
          )
      );
      
  }
};

// Handle decreasing quantity
const decreaseQuantity = async (itemId) => {
  const response = await fetch(
      `http://localhost:8080/updateQuantity?userId=1&productId=${itemId}&quantity=-1`,  // Decrease by 1
      { method: "POST" }
  );
  if (response.ok) {
      setCartItems((prev) =>
          prev.map((item) =>
              item.id === itemId && item.quantity > 1
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
          )
      );
  } else {
      console.error('Error decreasing quantity');
  }
};


  // Remove item from cart
  const removeItem = async (itemId) => {
    const response = await fetch(
        `http://localhost:8080/removeFromCart?userId=1&productId=${itemId}`,
        { method: "POST" }
    );
    if (response.ok) {
        // Immediately update the cart view by filtering out the removed item from the state
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
        console.error('Failed to remove item from cart');
    }
  };

  // Checkout
  const handleCheckout = async () => {
    const response = await fetch("http://localhost:8080/checkout?userId=1", { method: "POST" });
    if (response.ok) {
      setCartItems([]);
      alert("Payment successful!");
      navigate("/"); // Redirect to homepage
    } else {
      alert("Payment failed");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),  // Ensure quantity exists and fallback to 1 if missing
    0
);

  return (
    <div className="cart-page" style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
                <p><strong>{item.name}</strong></p>
                <p>Price: ${item.price}</p>
                <p>
                    Quantity:
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    {isNaN(item.quantity) ? 1 : item.quantity}  {/* Ensure quantity is a number */}
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                </p>
                <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}


          <hr />
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
