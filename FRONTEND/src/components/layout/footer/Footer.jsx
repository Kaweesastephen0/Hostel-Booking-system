import React from 'react';
import { Facebook, Youtube, Instagram, Music } from 'lucide-react';
import styles from './footer.module.css';

export default function MukBookFooter() {
  return (
    <div className={styles.container}>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            
            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>HOW TO...</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>book hostels</a></li>
                <li><a href="#" className={styles.footerLink}>post hostel</a></li>
                <li><a href="#" className={styles.footerLink}>comment on hostel</a></li>
                <li><a href="#" className={styles.footerLink}>rate hostel</a></li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Report hostel <span className={styles.badge}>report</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>EXPLORE</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Opportunities</a></li>
                <li><a href="#" className={styles.footerLink}>About Us</a></li>
                <li><a href="#" className={styles.footerLink}>Help</a></li>
                <li><a href="#" className={styles.footerLink}>FAQs</a></li>
                <li><a href="#" className={styles.footerLink}>Sign up</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>HOSTEL GUIDES FOR YOU</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Best Hostels</a></li>
                <li><a href="#" className={styles.footerLink}>Hostels with Private Rooms</a></li>
                <li><a href="#" className={styles.footerLink}>Party Hostels</a></li>
                <li><a href="#" className={styles.footerLink}>Cheapest Hostels</a></li>
                <li><a href="#" className={styles.footerLink}>Hostels with On roof balcony</a></li>
                <li><a href="#" className={styles.footerLink}>No rules hostel</a></li>
                <li><a href="#" className={styles.footerLink}>Hostel with buses</a></li>
                <li><a href="#" className={styles.footerLink}>All Hostels</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>LIKE & SAVE</h3>
              <ul className={styles.footerList}>
                <li>
                  <a href="#" className={styles.footerLink}>
                    My favorites <span className={styles.badgeNew}>NEW</span>
                  </a>
                </li>
                <li><a href="#" className={styles.footerLink}>Rates and reviews</a></li>
              </ul>
              <h3 className={styles.footerHeading} style={{marginTop: '32px'}}>POST BOOKING</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>safety precautions</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.bottomBar}>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <Youtube size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="TikTok">
                <Music size={24} />
              </a>
            </div>

            <div className={styles.bottomCenter}>
              <a href="#" className={styles.bottomLink}>Privacy Policy</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.bottomLink}>Terms & Conditions</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.bottomLink}>Contact</a>
            </div>

            <div className={styles.currencySelector}>
              <span className={styles.currency}>&copy; MUK-BOOK 2025</span>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}