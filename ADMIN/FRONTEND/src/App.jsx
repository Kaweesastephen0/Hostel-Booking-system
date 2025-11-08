import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import UsersPage from './pages/Users/Users';
import BookingsPage from './pages/Bookings/Bookings';
import PaymentsPage from './pages/Payments/Payments';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Hostels from './pages/Hostels/Hostels';
import RoomsPage from './pages/Rooms/Rooms.jsx';
import Profile from './pages/Profile/Profile';
import BookingDetails from './pages/Bookings/BookingDetails';
import UserProfile from './pages/Users/UserProfile';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css';

/**
 * MainLayout component to wrap authenticated pages
 * It includes the Sidebar, Navbar, and a content area for the pages.
 */
const MainLayout = () => {
  return (
   
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (

    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hostels" element={<Hostels />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
            <Route path="users/:id" element={<ProtectedRoute allowedRoles={['admin']}><UserProfile /></ProtectedRoute>} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>

  );
}

export default App;
