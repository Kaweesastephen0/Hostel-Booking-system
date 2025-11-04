import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Home, UserPlus, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarMenu from '../sidebar/sidebar';

const HostelHeader = ({ onSortChange }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeSort, setActiveSort] = useState(''); // 🧠 Added active sort state

  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    if (token && storedUserData) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(storedUserData);
        setUserName(userData.firstName || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) navigate('/profile');
    else navigate('/auth');
  };

  // 🧠 Handles which sort option is clicked and highlights it
  const handleSortClick = (criteria) => {
    setActiveSort(criteria);
    if (onSortChange) onSortChange(criteria);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.userIcons}>
          <SidebarMenu />
        </div>

        {/* Sort Options */}
        <div className={styles.sortOptions}>
          <div
            className={`${styles.sortOption} ${activeSort === 'price' ? styles.activeSort : ''}`}
            onClick={() => handleSortClick('price')}
          >
            <div className={styles.sortLabel}>Sort by</div>
            <div className={styles.sortValue}>Price</div>
          </div>

          <div
            className={`${styles.sortOption} ${activeSort === 'distance' ? styles.activeSort : ''}`}
            onClick={() => handleSortClick('distance')}
          >
            <div className={styles.sortLabel}>Sort by</div>
            <div className={styles.sortValue}>Distance</div>
          </div>

          <div
            className={`${styles.sortOption} ${activeSort === 'amenity' ? styles.activeSort : ''}`}
            onClick={() => handleSortClick('amenity')}
          >
            <div className={styles.sortLabel}>Sort by</div>
            <div className={styles.sortValue}>Amenity</div>
          </div>
        </div>

        {/* Branding Section */}
        <div className={styles.branding}>
          <div className={styles.topBranding}>
            <Home className={styles.brandIcon} size={24} />
            <Link className={styles.brandNameLink} to="/">MUK-Book</Link>
          </div>
          <h5 className={styles.brandPhone}>
            <a href="tel:+256709167919">Tel: +256709167919</a>
          </h5>
        </div>

        {/* User Profile/Login */}
        <div className={styles.userIcons} onClick={handleUserIconClick}>
          {isLoggedIn ? (
            <>
              <span className={styles.userName}>{userName}</span>
              <User size={32} />
            </>
          ) : (
            <UserPlus size={32} />
          )}
        </div>
      </div>
    </header>
  );
};

export default HostelHeader;
