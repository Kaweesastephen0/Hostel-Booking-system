import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, X, SlidersHorizontal, Linkedin, Mail } from 'lucide-react';
import styles from './sidebarMenu.module.css';

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const trackGreeting = () => {
    let time = new Date().getHours();
    let message = time < 19 ? "Hi, hope your day is moving well" : "Nights are best in secure locations";
    return message;
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* Menu Button */}
      <div
        onClick={toggleMenu}
        className={styles.sidebarIcon}
      >
        <SlidersHorizontal size={32} />
      </div>

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
          <p className={styles.greeting}>{trackGreeting()}</p>
        </div>

        {/* Menu Content - Centered */}
        <div className={styles.sidebarContent}>
          {/* Menu Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Menu</h3>
            <nav className={styles.menuNav}>
              <Link to="/" className={styles.menuItem} onClick={handleLinkClick}>Home</Link>
              <Link to="/about" className={styles.menuItem} onClick={handleLinkClick}>About us</Link>
              <Link to="/contact" className={styles.menuItem} onClick={handleLinkClick}>Contact us</Link>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}>Partner with us</a>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}>Donate</a>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}>FAQ</a>
            </nav>
          </div>

          {/* Social Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Social</h3>
            <nav className={styles.menuNav}>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}><Facebook /></a>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}><Linkedin /></a>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}><X /></a>
              <a href="#" className={styles.menuItem} onClick={handleLinkClick}><Mail /></a>
            </nav>
          </div>

          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Where we are</h3>
            <nav className={styles.menuNav}>
              <a href="mailto:mukbook@gmail.com" className={styles.menuItem} onClick={handleLinkClick}>mukbook@gmail.com</a>
              <span className={styles.menuItem}>Makerere University</span>
              <span className={styles.menuItem}>Off Sir Apollo Road</span>
              <span className={styles.menuItem}>Plot 3290</span>
            </nav>
          </div>
        </div>
        <div className={styles.getFullYear}>&copy; mukbook {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

export default SidebarMenu;