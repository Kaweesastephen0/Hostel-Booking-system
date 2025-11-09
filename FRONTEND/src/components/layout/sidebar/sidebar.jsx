import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  X,
  SlidersHorizontal,
  Linkedin,
  Mail,
} from "lucide-react";
import styles from "./sidebar.module.css";

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  const trackGreeting = () => {
    const hour = new Date().getHours();
    return hour < 19
      ? "Hi, hope your day is moving well"
      : "Nights are best in secure locations";
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* ☰ Menu Button */}
      <div onClick={toggleMenu} className={styles.sidebarIcon}>
        <SlidersHorizontal size={32} />
      </div>

      {/* 🔲 Overlay */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayVisible}`}
          onClick={toggleMenu}
        />
      )}

      {/* 🧱 Sidebar Drawer */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* ❌ Close Button */}
        <button onClick={toggleMenu} className={styles.closeButton}>
          <X size={42} />
        </button>

        {/* 🏠 Header */}
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Muk-Book Hostels</h2>
          <p className={styles.greeting}>{trackGreeting()}</p>
        </div>

        {/* 📋 Content */}
        <div className={styles.sidebarContent}>
          {/* 🔹 Menu Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Menu</h3>
            <nav className={styles.menuNav}>
              <Link to="/" className={styles.menuItem} onClick={handleLinkClick}>
                Home
              </Link>
              <Link
                to="/about"
                className={styles.menuItem}
                onClick={handleLinkClick}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={styles.menuItem}
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
              <Link
                to="/partner"
                className={styles.menuItem}
                onClick={handleLinkClick}
              >
                Partner With Us
              </Link>
              <Link
                to="/donate"
                className={styles.menuItem}
                onClick={handleLinkClick}
              >
                Donate
              </Link>
              <Link
                to="/faq"
                className={styles.menuItem}
                onClick={handleLinkClick}
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* 🔹 Social Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Social</h3>
            <nav className={styles.menuNav}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className={styles.menuItem}
              >
                <Facebook />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className={styles.menuItem}
              >
                <Linkedin />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={styles.menuItem}
              >
                <X />
              </a>
              <a
                href="mailto:mukbook@gmail.com"
                className={styles.menuItem}
              >
                <Mail />
              </a>
            </nav>
          </div>

          {/* 🔹 Address Column */}
          <div className={styles.menuColumn}>
            <h3 className={styles.columnTitle}>Where We Are</h3>
            <nav className={styles.menuNav}>
              <a
                href="mailto:mukbook@gmail.com"
                className={styles.menuItem}
              >
                mukbook@gmail.com
              </a>
              <span className={styles.menuItem}>Makerere University</span>
              <span className={styles.menuItem}>Off Sir Apollo Road</span>
              <span className={styles.menuItem}>Plot 3290</span>
            </nav>
          </div>
        </div>

        {/* 🕒 Footer */}
        <div className={styles.getFullYear}>
          &copy; MukBook {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;
