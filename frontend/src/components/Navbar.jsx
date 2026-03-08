import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    localStorage.removeItem('user');
  }

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'BEAUTICIAN': return '/beautician/dashboard';
      case 'CLIENT': return '/client/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">BeautyBook</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/beauticians">Beauticians</Link>
        {user ? (
          <>
            <Link to={getDashboardLink()}>Dashboard</Link>
            {user.role === 'CLIENT' && <Link to="/client/favorites">Favorites</Link>}
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
