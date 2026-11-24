import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  );

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setIsLoggedIn(false);

    alert('You have successfully signed out.');

    navigate('/login');
  };

  return (
    <div>
      <h1>RT | My Portfolio</h1>

      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/about">About</Link> |{' '}
        <Link to="/projects">Projects</Link> |{' '}
        <Link to="/education">Education</Link> |{' '}
        <Link to="/services">Services</Link> |{' '}
        <Link to="/contact">Contact</Link>

        {' | '}

        {isLoggedIn ? (
          <button onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>

        )}
      </nav>

      <hr />
    </div>
  );
}