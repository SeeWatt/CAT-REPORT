import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setCurrentUser({ username: data.user });  // Update the current user state
        navigate('/');  // Redirect to home page
        setTimeout(() => {
          window.location.reload();  // Refresh the page
        }, 100);
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div className="login-register-container">
        <div className="form-section">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Email: </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label>Password: </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
