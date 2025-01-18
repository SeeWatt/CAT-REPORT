import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; 
import { useEffect } from 'react';

function Navbar({ currentUser, setCurrentUser }) {
  const handleLogout = async () => {
    console.log("Logging out...");

    try {
        const response = await fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log("Logged out successfully");

            // Remove user info from localStorage
            localStorage.removeItem("currentUser");

            // Reset the current user state
            setCurrentUser(null);

            //reload the page 
            window.location.reload();
        } else {
            console.error("Failed to log out");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};


  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
  
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));  // Restore user from localStorage if available
    } else {
      setCurrentUser(null);  // No user in localStorage, reset the state to null
    }
  }, [setCurrentUser]); //ensures it runs when the component mounts or when setCurrentUser changes
  
  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Bakery Shop
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Cakes / Cookies</Link></li>
        <li>
          {/* Redirect to cart page when cart icon is clicked */}
          <Link to="/cart" className="cart-icon">
            🛒
          </Link>
        </li>
        {currentUser ? (
          <>
            <li className="user-info">Welcome, {currentUser}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

// Add prop validation
Navbar.propTypes = {
  currentUser: PropTypes.string,
  setCurrentUser: PropTypes.func.isRequired,  // Ensure the setCurrentUser function is passed in
};

export default Navbar;
