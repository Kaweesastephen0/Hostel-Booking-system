import React from "react";
import styles from "./aboutus.module.css";
import { FaHome, FaUsers, FaHandshake, FaGlobe } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.heroSection}>
        <h1>About MUK BOOK</h1>
        <p>Your trusted partner in hostel booking and accommodation management.</p>
      </div>

      <div className={styles.missionSection}>
        <h2>Our Mission</h2>
        <p>
          To simplify hostel booking for Makerere University students by providing an easy,
          secure, and reliable online system.
        </p>
      </div>

      <div className={styles.visionSection}>
        <h2>Our Vision</h2>
        <p>
          To be the leading platform in East Africa for smart, digital hostel management and
          student housing solutions.
        </p>
      </div>

      <div className={styles.valuesSection}>
        <h2>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueBox}>
            <FaHome className={styles.icon} />
            <h3>Reliability</h3>
            <p>We provide accurate and up-to-date hostel listings to help you make informed choices.</p>
          </div>
          <div className={styles.valueBox}>
            <FaUsers className={styles.icon} />
            <h3>Community</h3>
            <p>We connect students with safe, social, and supportive accommodation environments.</p>
          </div>
          <div className={styles.valueBox}>
            <FaHandshake className={styles.icon} />
            <h3>Trust</h3>
            <p>We maintain transparent relationships between hostel owners and tenants.</p>
          </div>
          <div className={styles.valueBox}>
            <FaGlobe className={styles.icon} />
            <h3>Innovation</h3>
            <p>We use technology to make hostel booking fast, digital, and stress-free.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
