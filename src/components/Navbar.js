import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(true); // Assuming a default value

  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <div className="flex items-center space-x-4">
      <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
      <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">Dashboard</Link>
      <Link to="/find-tutors" className="text-gray-700 hover:text-primary-600">Find Tutors</Link>
      <Link to="/qa-forum" className="text-gray-700 hover:text-primary-600">Q&A Forum</Link>
      {currentUser ? (
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-primary-600"
        >
          Logout
        </button>
      ) : (
        <Link to="/login" className="text-gray-700 hover:text-primary-600">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar; 