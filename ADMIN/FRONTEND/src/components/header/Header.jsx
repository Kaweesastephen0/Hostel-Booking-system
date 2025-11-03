import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import ActionMenu from '../common/ActionMenu';
import userService from '../../services/userService';
import './Header.css';

// Importing additional components if needed
import Modal from '../modal/Modal';

/**
 * Enhanced header component with user info and action menu
 * @param {object} props - The component props
 * @param {string} props.title - The main title of the page
 * @param {string} [props.subtitle] - Optional subtitle or description
 * @param {React.ReactNode} [props.centerContent] - Content for the center zone
 * @param {boolean} [props.showActions] - Whether to show the action menu
 * @param {function} [props.onAction] - Callback for action menu items
 */
const Header = ({ 
  title, 
  subtitle, 
  centerContent, 
  showActions = false, 
  onAction,
  showGreeting = true,
  showUserProfile = true,
  children 
}) => {
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
      <div className="header-content">
        <div className="header-main">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        {showGreeting && !loading && user && (
          <div className="greeting-section">
            <p className="greeting-text">
              {getGreeting()}, {user.name}
              <span className="user-role">({user.role})</span>
            </p>
          </div>
        )}
      </div>

      <div className="header-actions">
        {children}
        
        {showActions && user && (
          <ActionMenu userType={user.role} onAction={onAction} />
        )}
        
        {showUserProfile && !loading && user && (
          <div className="user-profile">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar" 
              />
            ) : (
              <UserCircle className="user-avatar-icon" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;