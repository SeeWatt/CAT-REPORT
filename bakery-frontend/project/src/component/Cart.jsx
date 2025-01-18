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
        console.log("Fetched cart items:", data);
        if (Array.isArray(data.items)) {
          setCartItems(data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1
          })));
        }
      } else {
        console.error("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, []);

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
            ? { ...item, quantity: item.quantity + 1 || 1 }
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
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    const response = await fetch(
        `http://localhost:8080/removeFromCart?userId=1&productId=${itemId}`,
        { method: "POST" }
    );
    if (response.ok) {
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
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  return (
    <div className="cart-page" style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>My Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img
              src="/image/cart.png"  //empty cart image
              alt="Empty Cart"
              style={{ width: "300px", marginBottom: "40px" }}
            />
            <p>Your cart is empty.</p>
            <p>Looks like you have not added anything to your cart. Go ahead & explore top categories.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
        <div
          key={item.id}
          className="cart-item"  // Use a class for styling
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p><strong>{item.name}</strong></p>
            <p>Price: RM {item.price}</p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => decreaseQuantity(item.id)}
              style={{ margin: "0 5px", padding: "5px 10px", fontSize: "16px" }}
            >
              -
            </button>
            <span>{isNaN(item.quantity) ? 1 : item.quantity}</span>
            <button
              onClick={() => increaseQuantity(item.id)}
              style={{ margin: "0 5px", padding: "5px 10px", fontSize: "16px" }}
            >
              +
            </button>
          </div>

          <div>
            <button
              onClick={() => removeItem(item.id)}
              style={{ backgroundColor: "orange", color: "#fff", padding: "5px 10px" }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

          <hr />
          <h3>Total: RM {totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout} style={{ backgroundColor: "orange", color: "#fff", padding: "10px 20px" }}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
