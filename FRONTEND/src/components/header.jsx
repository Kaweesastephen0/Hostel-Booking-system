import { useState, useEffect } from 'react';
import styles from '../components/homePage/HostelList.module.css';
import { Home, UserPlus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../components/sidebar/sidebarMenu';
import UserProfile from '../components/Auth/UserProfile';
//umaru
const HostelHeader = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    if (token && storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setIsProfileOpen(true);
    } else {
      navigate('/auth');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('lastLoginTime');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('lastLoginTime');

    setUserData(null);
    setIsLoggedIn(false);
    setIsProfileOpen(false);
  };
// end umaru

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <SidebarMenu />

          <div className={styles.sortOptions}>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>price</div>
            </div>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>distance</div>
            </div>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>Amenity</div>
            </div>
          </div>

          <div className={styles.branding}>
            <div className={styles.brandingTop}>
              <Home className={styles.brandIcon} size={24} />
              <h6 className={styles.brandName}>MUK-Book</h6>
            </div>
            <h5 className={styles.brandPhone}>
              <a href="tel:+256709167919">Tel: +256709167919</a>
            </h5>
          </div>

          <button className={styles.userBtn} onClick={handleUserIconClick}>
            {isLoggedIn ? <User size={32} /> : <UserPlus size={32} />}
          </button>
        </div>
      </header>
      
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        onLogout={handleLogout}
      />
    </>
  );
};

export default HostelHeader;