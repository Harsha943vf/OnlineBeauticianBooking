import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import BeauticianListPage from './pages/public/BeauticianListPage';
import BeauticianDetailPage from './pages/public/BeauticianDetailPage';
import ProfilePage from './pages/public/ProfilePage';

// Client pages
import ClientDashboard from './pages/client/ClientDashboard';
import BookAppointmentPage from './pages/client/BookAppointmentPage';
import BookingHistoryPage from './pages/client/BookingHistoryPage';
import AppointmentDetailsPage from './pages/client/AppointmentDetailsPage';
import SubmitReviewPage from './pages/client/SubmitReviewPage';
import FavoritesPage from './pages/client/FavoritesPage';

// Beautician pages
import BeauticianDashboard from './pages/beautician/BeauticianDashboard';
import ManageServicesPage from './pages/beautician/ManageServicesPage';
import ManageAvailabilityPage from './pages/beautician/ManageAvailabilityPage';
import ViewBookingRequestsPage from './pages/beautician/ViewBookingRequestsPage';
import ViewReviewsPage from './pages/beautician/ViewReviewsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageBeauticiansPage from './pages/admin/ManageBeauticiansPage';
import ViewAllBookingsPage from './pages/admin/ViewAllBookingsPage';
import ManageReviewsPage from './pages/admin/ManageReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="beauticians" element={<BeauticianListPage />} />
          <Route path="beauticians/:id" element={<BeauticianDetailPage />} />
          <Route path="profile" element={<ProtectedRoute allowedRoles={['CLIENT','BEAUTICIAN','ADMIN']}><ProfilePage /></ProtectedRoute>} />

          {/* Client Routes */}
          <Route path="client/dashboard" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="client/book" element={<ProtectedRoute allowedRoles={['CLIENT']}><BookAppointmentPage /></ProtectedRoute>} />
          <Route path="client/bookings" element={<ProtectedRoute allowedRoles={['CLIENT']}><BookingHistoryPage /></ProtectedRoute>} />
          <Route path="client/bookings/:id" element={<ProtectedRoute allowedRoles={['CLIENT']}><AppointmentDetailsPage /></ProtectedRoute>} />
          <Route path="client/review" element={<ProtectedRoute allowedRoles={['CLIENT']}><SubmitReviewPage /></ProtectedRoute>} />
          <Route path="client/favorites" element={<ProtectedRoute allowedRoles={['CLIENT']}><FavoritesPage /></ProtectedRoute>} />

          {/* Beautician Routes */}
          <Route path="beautician/dashboard" element={<ProtectedRoute allowedRoles={['BEAUTICIAN']}><BeauticianDashboard /></ProtectedRoute>} />
          <Route path="beautician/services" element={<ProtectedRoute allowedRoles={['BEAUTICIAN']}><ManageServicesPage /></ProtectedRoute>} />
          <Route path="beautician/availability" element={<ProtectedRoute allowedRoles={['BEAUTICIAN']}><ManageAvailabilityPage /></ProtectedRoute>} />
          <Route path="beautician/bookings" element={<ProtectedRoute allowedRoles={['BEAUTICIAN']}><ViewBookingRequestsPage /></ProtectedRoute>} />
          <Route path="beautician/reviews" element={<ProtectedRoute allowedRoles={['BEAUTICIAN']}><ViewReviewsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageUsersPage /></ProtectedRoute>} />
          <Route path="admin/beauticians" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageBeauticiansPage /></ProtectedRoute>} />
          <Route path="admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><ViewAllBookingsPage /></ProtectedRoute>} />
          <Route path="admin/reviews" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageReviewsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
