import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Home, UserPlus, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarMenu from '../sidebar/sidebar';
//umaru
const HostelHeader = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName]=useState('')

  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    if (token && storedUserData) {
      setIsLoggedIn(true)
      try {
        const userData = JSON.parse(storedUserData);
        setUserName(userData.firstName || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate('/profile')
    } else {
      navigate('/auth');
    }
  };
 
// end umaru

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.userIcons}>
            <SidebarMenu />
          </div>
          

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
            <div className={styles.topBranding}>
              <Home className={styles.brandIcon} size={24} /><Link className={styles.brandNameLink} to="/">MUK-Book</Link>
            </div>
            
            <h5 className={styles.brandPhone}>
                  <a href="tel:+256709167919">Tel: +256709167919</a>
                </h5>
          </div>

          <div className={styles.userIcons} onClick={handleUserIconClick}>
            {/* {isLoggedIn ? <User size={32} /> : <UserPlus size={32} />} */}
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
    </>
  );
};

export default HostelHeader;
