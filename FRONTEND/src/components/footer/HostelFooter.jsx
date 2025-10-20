import React from 'react';
import { Bed, Phone, MapPin, Mail, ArrowRight } from 'lucide-react';
import styles from './footer.module.css';

export default function MukBookFooter() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.iconWrapper}>
          <Bed className={styles.icon} strokeWidth={2} />
        </div>
        
       <h1 className={styles.heading}>
          Book Your Stay Today
        </h1>
        
       <p className={styles.subheading}>
          Find comfortable and affordable hostels in Kampala. Whether you're a student,
          traveler, or professional, book your perfect stay with Muk-Book!
        </p>
        
        <button className={styles.ctaButton}>
          Book Your Hostel
          <ArrowRight className={styles.buttonIcon} />
        </button>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            
           <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Contact</h3>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <Phone className={styles.contactIcon} />
                  </div>
                  <span className={styles.contactText}>+256-774-4735</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <MapPin className={styles.contactIcon} />
                  </div>
                  <span className={styles.contactText}>
                    Makerere University Road<br />
                    Kampala, Uganda
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <Mail className={styles.contactIcon} />
                  </div>
                  <span className={styles.contactText}>hello@mukbook.com</span>
                </div>
              </div>
            </div>

           <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Navigate</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>All Hostels</a></li>
                <li><a href="#" className={styles.footerLink}>Student Reviews</a></li>
                <li><a href="#" className={styles.footerLink}>Locations</a></li>
                <li><a href="#" className={styles.footerLink}>Amenities</a></li>
                <li><a href="#" className={styles.footerLink}>Download App</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Solution</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Book Online</a></li>
                <li><a href="#" className={styles.footerLink}>Virtual Tours</a></li>
                <li><a href="#" className={styles.footerLink}>Who We Are</a></li>
                <li><a href="#" className={styles.footerLink}>Student Support</a></li>
              </ul>
            </div>

           <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Discover</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Latest News</a></li>
                <li><a href="#" className={styles.footerLink}>New Arrivals</a></li>
                <li><a href="#" className={styles.footerLink}>Solution</a></li>
                <li><a href="#" className={styles.footerLink}>List Your Hostel</a></li>
                <li><a href="#" className={styles.footerLink}>Career</a></li>
              </ul>
            </div>

           <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Follow Us</h3>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Facebook</a></li>
                <li><a href="#" className={styles.footerLink}>Instagram</a></li>
                <li><a href="#" className={styles.footerLink}>LinkedIn</a></li>
                <li><a href="#" className={styles.footerLink}>Twitter</a></li>
              </ul>
            </div>
          </div>

         <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              &copy;Copyright <a href="#" className={styles.copyrightLink}>MukBook.com</a> All rights reserved. 2025
            </p>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>Privacy & Policy</a>
              <a href="#" className={styles.legalLink}>Terms & Condition</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}