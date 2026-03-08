import { useState, useEffect } from 'react';
import { getAllBeauticians } from '../../services/beauticianService';

function ManageBeauticiansPage() {
  const [beauticians, setBeauticians] = useState([]);

  useEffect(() => {
    getAllBeauticians().then(res => setBeauticians(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Manage Beauticians</h2>

      {beauticians.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><p>No beauticians registered yet.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Salon Name</th><th>Specialization</th><th>Experience</th><th>Location</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {beauticians.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.salonName || '-'}</td>
                  <td>{b.specialization || '-'}</td>
                  <td>{b.experienceYears ? `${b.experienceYears} yrs` : '-'}</td>
                  <td>{b.location || '-'}</td>
                  <td>{b.averageRating ? `${b.averageRating} ★` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageBeauticiansPage;
