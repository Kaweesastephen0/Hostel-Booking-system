
// Temporary version without Material-UI
import React from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.aboutUsContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>ABOUT MUK-BOOK</h1>
          <p>Your Trusted Hostel Booking Platform</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;