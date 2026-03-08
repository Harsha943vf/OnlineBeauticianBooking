import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBeauticians } from '../../services/beauticianService';
import { isFavorite, toggleFavorite } from '../../services/favoritesService';

function BeauticianListPage() {
  const [beauticians, setBeauticians] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [favs, setFavs] = useState({});

  useEffect(() => {
    getAllBeauticians().then(res => {
      setBeauticians(res.data);
      const favMap = {};
      res.data.forEach(b => { favMap[b.id] = isFavorite(b.id); });
      setFavs(favMap);
    }).catch(console.error);
  }, []);

  const handleFav = (id) => {
    toggleFavorite(id);
    setFavs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = beauticians
    .filter(b => {
      const q = search.toLowerCase();
      return !q || (b.salonName || '').toLowerCase().includes(q)
        || (b.username || '').toLowerCase().includes(q)
        || (b.specialization || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
      return (a.salonName || a.username || '').localeCompare(b.salonName || b.username || '');
    });

  return (
    <div>
      <h1 className="page-title">Our Beauticians</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Search by name or specialization..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="experience">Sort by Experience</option>
        </select>
      </div>

      <div className="grid-3">
        {filtered.map(b => (
          <div key={b.id} className="card" style={{ position: 'relative' }}>
            <button onClick={() => handleFav(b.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: favs[b.id] ? '#e74c3c' : '#ccc' }}
              title={favs[b.id] ? 'Remove from favorites' : 'Add to favorites'}>
              {favs[b.id] ? '♥' : '♡'}
            </button>
            <h3>{b.salonName || b.username}</h3>
            <p><strong>Specialization:</strong> {b.specialization || 'General'}</p>
            <p><strong>Experience:</strong> {b.experienceYears || 0} years</p>
            <p><strong>Rating:</strong> <span className="stars">{'★'.repeat(Math.round(b.ratingAverage || 0))}{'☆'.repeat(5 - Math.round(b.ratingAverage || 0))}</span> ({b.ratingAverage || 0})</p>
            <p style={{ margin: '10px 0', color: '#666' }}>{b.description}</p>
            <Link to={`/beauticians/${b.id}`} className="btn btn-primary btn-sm">View Details</Link>
          </div>
        ))}
        {filtered.length === 0 && <p>No beauticians found.</p>}
      </div>
    </div>
  );
}

export default BeauticianListPage;
