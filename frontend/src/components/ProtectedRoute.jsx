import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    localStorage.removeItem('user');
  }

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
