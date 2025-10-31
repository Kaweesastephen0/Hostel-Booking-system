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
                <li><a href="#" className={styles.footerLink}>pack your backpack</a></li>
                <li><a href="#" className={styles.footerLink}>stay first-time in a hostel</a></li>
                <li><a href="#" className={styles.footerLink}>All Articles</a></li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Exclusive Articles <span className={styles.badge}>Plus</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>EXPLORE</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>How Hostelz works</a></li>
                <li><a href="#" className={styles.footerLink}>About Us</a></li>
                <li><a href="#" className={styles.footerLink}>Help</a></li>
                <li><a href="#" className={styles.footerLink}>What's New? The Changelog</a></li>
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
                <li><a href="#" className={styles.footerLink}>Female Solo-Traveler</a></li>
                <li><a href="#" className={styles.footerLink}>Youth Hostels</a></li>
                <li><a href="#" className={styles.footerLink}>Find Hostel Jobs</a></li>
                <li><a href="#" className={styles.footerLink}>Hostel Chains</a></li>
                <li><a href="#" className={styles.footerLink}>All Hostels</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>COMPARE & SAVE</h3>
              <ul className={styles.footerList}>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Hostel Comparison Tool <span className={styles.badgeNew}>NEW</span>
                  </a>
                </li>
                <li><a href="#" className={styles.footerLink}>Best Hostel Booking Sites</a></li>
              </ul>
              <h3 className={styles.footerHeading} style={{marginTop: '32px'}}>TRAVEL ESSENTIALS</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Best Travel Insurances</a></li>
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
              <span className={styles.currency}>UGX | shs</span>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}