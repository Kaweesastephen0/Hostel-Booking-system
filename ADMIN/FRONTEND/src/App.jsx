import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider as MaterialTailwindProvider } from "@material-tailwind/react";
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SidebarProvider } from './context/SidebarContext';
import { NotificationsProvider } from './context/NotificationsProvider';
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
import SettingsPage from './pages/Settings/SettingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',  // System blue color
    }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
  },
});

/**
 * MainLayout component to wrap authenticated pages
 * It includes the Sidebar, Navbar, and a content area for the pages.
 */
const MainLayout = () => {
  return (
    <NotificationsProvider>
      <SidebarProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Navbar />
            <div className="page-content">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </NotificationsProvider>
  );
};

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <MaterialTailwindProvider>
      <MuiThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                  <Route path="hostels/new" element={<Hostels isCreateMode={true} />} />
                  <Route path="rooms" element={<RoomsPage />} />
                  <Route path="rooms/new" element={<RoomsPage isCreateMode={true} />} />
                  <Route path="bookings" element={<BookingsPage />} />
                  <Route path="bookings/:id" element={<BookingDetails />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="users/:id" element={<UserProfile />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Catch all other routes */}
              <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </MuiThemeProvider>
    </MaterialTailwindProvider>
  );
}

export default App;