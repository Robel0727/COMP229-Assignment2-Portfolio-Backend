import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to My Portfolio</h1>

      <p>
        Hello! Welcome to my personal portfolio website.
      </p>

      <Link
        to="/about"
        style={{
          color: '#0056b3',
          textDecoration: 'underline'
        }}
      >
        Learn More About Me
      </Link>
    </div>
  );
}

export default Home;