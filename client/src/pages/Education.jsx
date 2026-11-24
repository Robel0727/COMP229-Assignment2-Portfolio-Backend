import React, { useEffect, useState } from 'react';

function Education() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/qualifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load qualifications.');
        }

        setQualifications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, []);

  if (loading) {
    return <p>Loading qualifications...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <div>
      <h1>Education</h1>

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
          </div>
        ))
      )}
    </div>
  );
}

export default Education;