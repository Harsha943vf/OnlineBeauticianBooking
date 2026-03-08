import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to BeautyBook</h1>
        <p>Book appointments with the best beauticians in your area. Browse services, check availability, and book instantly.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/beauticians" className="btn btn-primary" style={{ background: 'white', color: '#667eea' }}>
            Browse Beauticians
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ border: '2px solid white' }}>
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Find Beauticians</h3>
          <p>Search and discover top-rated beauticians offering a wide range of beauty services.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Book Appointments</h3>
          <p>Select your preferred service, pick a available time slot, and book your appointment instantly.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Rate & Review</h3>
          <p>Share your experience by leaving ratings and reviews after your appointment.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
