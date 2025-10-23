import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';


import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';


import './App.css';
//THESE ARE JUST PLACEHOLDERS FOR PAGES THAT ARE YET TO BE DEVELOPED
const PlaceholderPage = ({ title }) => <div style={{ padding: '2rem' }}><h1>{title}</h1><p>This page has not been Developed yet</p></div>;
const HostelsPage = () => <PlaceholderPage title="Manage Hostels" />;
const RoomsPage = () => <PlaceholderPage title="Manage Rooms" />;
const BookingsPage = () => <PlaceholderPage title="Manage Bookings" />;
const UsersPage = () => <PlaceholderPage title="Manage Users" />;
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
        
        <Route path="/login" element={<LoginPage />} />

        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hostels" element={<HostelsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
