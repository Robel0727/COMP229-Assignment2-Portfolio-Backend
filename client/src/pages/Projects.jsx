import React, { useEffect, useState } from 'react';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load projects.');
      }

      setProjects(data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        editingId
          ? `http://localhost:5000/api/projects/${editingId}`
          : 'http://localhost:5000/api/projects',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Project could not be saved.');
      }

      setMessage(editingId ? 'Project updated successfully.' : 'Project created successfully.');

      setForm({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
      });

      setEditingId(null);
      await fetchProjects();

    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      name: project.name,
      description: project.description,
      startDate: project.startDate ? project.startDate.substring(0, 10) : '',
      endDate: project.endDate ? project.endDate.substring(0, 10) : ''
    });

    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Project could not be deleted.');
      }

      setMessage('Project deleted successfully.');
      await fetchProjects();

    } catch (error) {
      setError(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <h1>My Projects</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p>{message}</p>}

      {isAdmin && (
        <section>
          <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>

          <form onSubmit={handleSubmit}>
            <p>
              <label>Project Name: </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <label>Description: </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <label>Start Date: </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </p>

            <p>
              <label>End Date: </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </p>

            <button type="submit">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </section>
      )}

      <hr />

      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((project) => (
          <div key={project._id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>

            {project.startDate && (
              <p>
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </p>
            )}

            {project.endDate && (
              <p>
                End Date: {new Date(project.endDate).toLocaleDateString()}
              </p>
            )}

            {isAdmin && (
              <div>
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button onClick={() => handleDelete(project._id)}>Delete</button>
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;