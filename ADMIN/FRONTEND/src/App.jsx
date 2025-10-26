
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import UserProfile from './pages/Users/UserProfile'
import Sidebar from './components/sidebar/Sidebar';
// import Navbar from './components/navbar/Navbar';
import Users from './pages/Users/Users'
import Bookings from './pages/Bookings/Bookings'
import BookingDetails from './pages/Bookings/BookingDetails'
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import './App.css';
//THESE ARE JUST PLACEHOLDERS FOR PAGES THAT ARE YET TO BE DEVELOPED
const PlaceholderPage = ({ title }) => <div style={{ padding: '2rem' }}><h1>{title}</h1><p>This page has not been Developed yet</p></div>;
const HostelsPage = () => <PlaceholderPage title="Manage Hostels" />;
const RoomsPage = () => <PlaceholderPage title="Manage Rooms" />;
const PaymentsPage = () => <PlaceholderPage title="Manage Payments" />;
const SettingsPage = () => <PlaceholderPage title="Settings" />;
const ProfilePage = () => <PlaceholderPage title="User Profile" />;

/**
 * MainLayout component to wrap authenticated pages
 * It includes the Sidebar, Navbar, and a content area for the pages.
 */
const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* <Navbar /> */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected routes with layout */}
  <Route element={<MainLayout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/hostels" element={<HostelsPage />} />
    <Route path="/rooms" element={<RoomsPage />} />
    <Route path="/bookings" element={<Bookings />} />
    <Route path="/bookings/:id" element={<BookingDetails />} />
    <Route path="/users" element={<Users />} />
    <Route path="/users/:id" element={<UserProfile />} />
    <Route path="/payments" element={<PaymentsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>
  
  {/* Catch all route */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  )
};





export default App;
