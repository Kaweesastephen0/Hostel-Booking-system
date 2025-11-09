import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown, Settings, LogOut, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import searchService from '../../services/searchService';
import SearchResults from './SearchResults';
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const { unreadCount } = useNotifications();

  const user = {
    name: currentUser?.fullName,
    avatar: `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=4f46e5&color=fff&bold=true`,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!query.trim()) {
      setSearchResults(null);
      setIsSearchOpen(false);
      return;
    }

    setIsSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchService.globalSearch(query);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleMenuNavigate = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  const handleNotificationsClick = () => {
    navigate('/settings?tab=notifications');
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
        <div className="navbar-search" ref={searchRef}>
          <Search className="navbar-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users, hostels, rooms, bookings, payments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setIsSearchOpen(true)}
          />
          {isSearchLoading && <Loader size={18} className="navbar-search-loader" />}
          {isSearchOpen && (
            <SearchResults
              results={searchResults}
              loading={isSearchLoading}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </div>

        <div className="navbar-notifications">
          <button
            type="button"
            className="navbar-icon-btn"
            onClick={handleNotificationsClick}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="notification-dot" data-count={unreadCount > 9 ? '9+' : unreadCount}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="navbar-profile" ref={profileRef}>
          <button className="navbar-profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img src={user.avatar} alt="User Avatar" className="navbar-avatar" />
            <span className="navbar-username">{user.name}</span>
            <ChevronDown size={20} className={`navbar-chevron ${isProfileOpen ? 'open' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="navbar-profile-dropdown z-50">
              <button type="button" onClick={() => handleMenuNavigate('/settings')} className="dropdown-item">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button type="button" onClick={() => handleMenuNavigate('/profile')} className="dropdown-item">
                <User size={18} />
                <span>Profile</span>
              </button>
              <div className="dropdown-divider"></div>
              <button type="button" onClick={handleLogout} className="dropdown-item">
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