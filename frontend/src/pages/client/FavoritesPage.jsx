import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBeauticians } from '../../services/beauticianService';
import { getFavoriteIds, toggleFavorite } from '../../services/favoritesService';

function FavoritesPage() {
  const [beauticians, setBeauticians] = useState([]);
  const [favIds, setFavIds] = useState(getFavoriteIds());

  useEffect(() => {
    getAllBeauticians().then(res => {
      setBeauticians(res.data);
    }).catch(console.error);
  }, []);

  const handleToggle = (id) => {
    toggleFavorite(id);
    setFavIds(getFavoriteIds());
  };

  const favorites = beauticians.filter(b => favIds.includes(b.id));

  return (
    <div>
      <h1 className="page-title">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No favorites yet. Browse beauticians and add some!</p>
          <Link to="/beauticians" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Browse Beauticians</Link>
        </div>
      ) : (
        <div className="grid-3">
          {favorites.map(b => (
            <div key={b.id} className="card" style={{ position: 'relative' }}>
              <button onClick={() => handleToggle(b.id)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#e74c3c' }}
                title="Remove from favorites">♥</button>
              <h3>{b.salonName || b.username}</h3>
              <p><strong>Specialization:</strong> {b.specialization || 'General'}</p>
              <p><strong>Experience:</strong> {b.experienceYears || 0} years</p>
              <p><strong>Rating:</strong> <span className="stars">{'★'.repeat(Math.round(b.ratingAverage || 0))}{'☆'.repeat(5 - Math.round(b.ratingAverage || 0))}</span> ({b.ratingAverage || 0})</p>
              <Link to={`/beauticians/${b.id}`} className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
