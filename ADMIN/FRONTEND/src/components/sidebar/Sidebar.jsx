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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'manager';

  const allNavItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['admin', 'manager'] },
    { to: '/hostels', icon: <Building size={20} />, label: 'Hostels', roles: ['admin', 'manager'] },
    { to: '/rooms', icon: <BedDouble size={20} />, label: 'Rooms', roles: ['admin', 'manager'] },
    { to: '/bookings', icon: <CalendarCheck size={20} />, label: 'Bookings', roles: ['admin', 'manager'] },
    { to: '/payments', icon: <Wallet size={20} />, label: 'Payments', roles: ['admin', 'manager'] },
    { to: '/users', icon: <Users size={20} />, label: 'Users', roles: ['admin'] },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings', roles: ['admin', 'manager'] },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMouseEnter = () => setIsCollapsed(false);
  const handleMouseLeave = () => setIsCollapsed(true);

  return (
    <aside 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
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
            <button onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
          <span className="sidebar-link-label">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;