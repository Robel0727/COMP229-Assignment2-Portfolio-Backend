import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    alert(
      `Thank you ${formData.firstName} ${formData.lastName}! Your message has been submitted.`
    );

    setSubmitted(true);
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
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Contact Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Message:</label>
            <br />
            <textarea
              name="message"
              rows="5"
              cols="40"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <br />

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Contact;