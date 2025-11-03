import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import ActionMenu from '../common/ActionMenu';
import userService from '../../services/userService';
import './Header.css';

/**
 * Enhanced header component with user info and action menu
 * @param {object} props - The component props
 * @param {string} props.title - The main title of the page
 * @param {string} [props.subtitle] - Optional subtitle or description
 * @param {React.ReactNode} [props.centerContent] - Content for the center zone
 * @param {boolean} [props.showActions] - Whether to show the action menu
 * @param {function} [props.onAction] - Callback for action menu items
 */
const Header = ({ title, subtitle, centerContent, showActions = false, onAction }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      {centerContent && <div className="header-center">{centerContent}</div>}

      <div className="header-right">
        {showActions && user && (
          <ActionMenu userType={user.role} onAction={onAction} />
        )}
        
        {!loading && user && (
          <div className="user-info">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar" 
              />
            ) : (
              <UserCircle className="user-avatar-placeholder" />
            )}
            <div className="user-details">
              <p className="user-greeting">{getGreeting()}, {user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;