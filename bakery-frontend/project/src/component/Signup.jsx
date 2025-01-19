import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleSignUp = (e) => {
    e.preventDefault();

    // Send signup request to backend
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);  // Log the server's response
        alert('User registered successfully!');
        navigate('/login'); // Redirect to login after successful registration
      })
      .catch((error) => {
        console.error('Sign up error:', error);
        alert('An error occurred during registration');
      });
  };

  return (
    <div className="page-container">
      <div className="login-register-container">
        <div className="form-section">
          <h2 style={{ color: 'black', textDecoration: 'none', fontWeight:'bold', lineHeight:'70px', fontSize:'50px',fontFamily: 'Caveat, cursive', padding:'1.5rem', textAlign:'center'}}>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div>
              <label>Username : </label>
              <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
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
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
