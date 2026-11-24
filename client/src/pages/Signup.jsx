import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Registration successful! You can now sign in.');
      setName('');
      setEmail('');
      setPassword('');

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create an Account</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>Full Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>

        <p>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>

        <p>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </p>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}

export default Signup;