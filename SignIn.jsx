import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Signin.css';

const SignIn = ({ onSignIn }) => {
  const [user, setUser] = useState({ name: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user.name || !user.password) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('User already exists.');
      }

      const result = await response.json();
      setMessage('Sign in successful!');
      
      // Clear form fields after successful login
      setUser({ name: '', password: '' });

      setTimeout(() => {
        onSignIn(result); // Update user state in App component
        navigate('/dashboard'); // Navigate to the dashboard after successful sign-in
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="sign-in">
      <h3>Sign Up</h3>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <div className="social-media-icons">
        <p>Or sign up with:</p>
        <div className="icons">
          <FontAwesomeIcon icon={faGoogle} className="icon" />
          <FontAwesomeIcon icon={faFacebook} className="icon" />
          <FontAwesomeIcon icon={faTwitter} className="icon" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
