import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://comp229-assignment2-portfolio-backend-jde2.onrender.com/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit contact form.');
      }

      setSubmitted(true);

    } catch (error) {
      setError(error.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Contact Me</h1>

      <p>Email: robel@example.com</p>
      <p>Phone: 416-555-0123</p>

      {submitted ? (
        <div>
          <h2>Thank You!</h2>
          <p>Your message has been submitted successfully.</p>
          <Link to="/">Return to Home</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p role="alert">{error}</p>}

          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="phone">Contact Number:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="message">Message:</label>
            <br />
            <textarea
              id="message"
              name="message"
              rows="5"
              cols="40"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;