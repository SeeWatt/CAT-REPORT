import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Products from './Product';
import CakeDetail from './Cake';
import CookieDetail from './Cookie';
import Cart from './Cart';
import Login from './Login';
import SignUp from './Signup';
import Footer from './Footer';  

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/currentUser");

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);  // Set the current user
        } else {
          console.error("Failed to fetch current user:", response.status);
          setCurrentUser(null);  // Ensure the currentUser is set to null if not found
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);  // Ensure the currentUser is set to null if there's an error
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cakes/:cakeId" element={<CakeDetail />} />
        <Route path="/cookies/:cookieId" element={<CookieDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />  
    </Router>
  );
}

export default App;
