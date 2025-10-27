import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  BedDouble,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  UserCog,
  Wallet,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Stephan I think this is you to Implement the logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/hostels', icon: <Building size={20} />, label: 'Hostels' },
    { to: '/rooms', icon: <BedDouble size={20} />, label: 'Rooms' },
    { to: '/bookings', icon: <CalendarCheck size={20} />, label: 'Bookings' },
    { to: '/payments', icon: <Wallet size={20} />, label: 'Payments' },
    { to: '/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" onDoubleClick={toggleSidebar} title="Double-click to toggle sidebar">
        <UserCog className="sidebar-logo" size={32} />
        <h1 className="sidebar-title">Admin Panel</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="sidebar-link-icon">{item.icon}</div>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div
          onClick={handleLogout}
          className="sidebar-link logout"
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-link-icon">
            <LogOut size={20} />
          </div>
          <span className="sidebar-link-label">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;