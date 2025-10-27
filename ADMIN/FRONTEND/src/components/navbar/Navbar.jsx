import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const user = {
    name: currentUser?.fullName,
    avatar: `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=4f46e5&color=fff&bold=true`,
  };

  useEffect(() => {
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-greeting">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search className="navbar-search-icon" size={20} />
          <input type="text" placeholder="Search bookings, users, hostels..." />
        </div>

        <button className="navbar-icon-btn">
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile" ref={profileRef}>
          <button className="navbar-profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img src={user.avatar} alt="User Avatar" className="navbar-avatar" />
            <span className="navbar-username">{user.name}</span>
            <ChevronDown size={20} className={`navbar-chevron ${isProfileOpen ? 'open' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="navbar-profile-dropdown">
              <a href="/settings" className="dropdown-item">
                <Settings size={18} />
                <span>Settings</span>
              </a>
              <a href="/profile" className="dropdown-item">
                <User size={18} />
                <span>Profile</span>
              </a>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;