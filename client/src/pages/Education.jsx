import React, { useEffect, useState } from 'react';

const API_URL = 'https://comp229-assignment2-portfolio-backend-jde2.onrender.com/api/qualifications';

function Education() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    institution: '',
    description: '',
    date: ''
  });

  const token = () => localStorage.getItem('token');

  const fetchQualifications = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load qualifications.');
      }

      setQualifications(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not save qualification.');
      }

      setMessage(editingId
        ? 'Education updated successfully.'
        : 'Education added successfully.');

      setEditingId(null);
      setForm({ title: '', institution: '', description: '', date: '' });
      await fetchQualifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (qualification) => {
    setEditingId(qualification._id);
    setForm({
      title: qualification.title || '',
      institution: qualification.institution || '',
      description: qualification.description || '',
      date: qualification.date ? qualification.date.substring(0, 10) : ''
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete qualification.');
      }

      setMessage('Education deleted successfully.');
      await fetchQualifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', institution: '', description: '', date: '' });
  };

  if (loading) return <p>Loading qualifications...</p>;

  return (
    <div>
      <h1>Education</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p>{message}</p>}

      {isAdmin && (
        <section>
          <h2>{editingId ? 'Edit Education' : 'Add Education'}</h2>

          <form onSubmit={handleSubmit}>
            <p>
              <label>Qualification: </label>
              <input name="title" value={form.title}
                onChange={handleChange} required />
            </p>

            <p>
              <label>Institution: </label>
              <input name="institution" value={form.institution}
                onChange={handleChange} required />
            </p>

            <p>
              <label>Description: </label>
              <textarea name="description" value={form.description}
                onChange={handleChange} />
            </p>

            <p>
              <label>Date: </label>
              <input type="date" name="date" value={form.date}
                onChange={handleChange} />
            </p>

            <button type="submit">
              {editingId ? 'Update Education' : 'Add Education'}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>Cancel</button>
            )}
          </form>
        </section>
      )}

      <hr />

      {qualifications.length === 0 ? (
        <p>No qualifications available.</p>
      ) : (
        qualifications.map((qualification) => (
          <div key={qualification._id}>
            <h2>{qualification.institution}</h2>
            <h3>{qualification.title}</h3>
            <p>{qualification.description}</p>

            {qualification.date && (
              <p>{new Date(qualification.date).toLocaleDateString()}</p>
            )}

            {isAdmin && (
              <div>
                <button onClick={() => handleEdit(qualification)}>Edit</button>
                <button onClick={() => handleDelete(qualification._id)}>Delete</button>
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Education;