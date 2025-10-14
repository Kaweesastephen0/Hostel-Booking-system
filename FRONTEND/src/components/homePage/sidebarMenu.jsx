import { useState } from 'react';
import { Facebook, X, SlidersHorizontal, Linkedin, Mail } from 'lucide-react';
import styles from './sidebarMenu.module.css';

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const trackGreeting=()=>{
    let time = new Date().getTime()
    let message = time < 19 ? "Hi, hope your day is moving well" : "Nights are best in secure locations"
    return message;
  }
   

  return (
    <div className={styles.sidebarContainer}>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className={styles.menuButton}
      >
        
        <SlidersHorizontal size={32} />
      </button>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`}
        onClick={toggleMenu}
      />

      {/* Sidebar - Full Screen */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          className={styles.closeButton}
        >
          <X size={42} />
        </button>

        {/* Header */}
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Muk-Book Hostels</h2>
        </div>

        {/* Menu Content - Centered */}
        <div className={styles.sidebarContent}>
          {/* Menu Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Menu</h3>
            <nav className={styles.menuNav}>
              <a href="#" className={styles.menuItem}>Home</a>
              <a href="#" className={styles.menuItem} >About us</a>
              <a href="#" className={styles.menuItem}>Contact us</a>
              <a href="#" className={styles.menuItem}>pattern with us</a>
              <a href="#" className={styles.menuItem}>Donate</a>
              <a href="#" className={styles.menuItem}>FAQ</a>
            </nav>
          </div>

          {/* Social Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Social</h3>
            <nav className={styles.menuNav}>
              <a href="#" className={styles.menuItem}><Facebook /></a>
              <a href="#" className={styles.menuItem}><Linkedin /></a>
              <a href="#" className={styles.menuItem}><X /></a>
              <a href="#" className={styles.menuItem}><Mail /></a>
            </nav>
          </div>

           <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Where we are</h3>
            <nav className={styles.menuNav}>
              <a href="#" className={styles.menuItem}>mukbook@gmail.com</a>
              <a href="#" className={styles.menuItem}>Makerere University</a>
              <a href="#" className={styles.menuItem}>Off Sir Apollo Road</a>
              <a href="#" className={styles.menuItem}>Plot 3290</a>
            </nav>
          </div>
        
        </div>
        <div className={styles.getFullYear}>&copy; mukbook {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

export default SidebarMenu;