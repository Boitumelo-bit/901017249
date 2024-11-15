// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeFromLocalStorage } from './LocalStorageHelper';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate(); // Hook for navigation
  
  const handleLogout = () => {
    // Remove current user from Local Storage
    removeFromLocalStorage('currentUser');
    // Trigger the logout action in the parent component
    onLogout();
    // Redirect to the sign-up page
    navigate('/signup'); // Adjust the route according to your setup
  };

  // Internal styles for the logout button
  const buttonStyle = {
    backgroundColor: '#ffa600',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#e68900',
  };


    // Style for positioning the logout button
    const logoutContainerStyle = {
      position: 'absolute', // Absolute positioning
      top: '20px', // Change the value to adjust vertical position
      right: '20px', // Change the value to adjust horizontal position
      zIndex: '1000', // Ensures the button is on top of other elements
    };

  return (
    <div className="logout">
      <button 
        onClick={handleLogout}
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
