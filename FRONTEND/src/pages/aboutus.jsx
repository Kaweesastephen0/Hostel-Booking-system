import React from "react";
import styles from "./aboutus.module.css";
import { FaHome, FaUsers, FaHandshake, FaGlobe } from "react-icons/fa";

const Aboutus = () => {
  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>About MUK BOOK</h1>
          <p className={styles.heroSubtitle}>
            Empowering students with seamless, secure, and smart hostel booking experiences.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p className={styles.sectionText}>
          To revolutionize hostel booking for Makerere University students through a digital
          platform that ensures ease, security, and reliability — helping every student find a
          perfect home away from home.
        </p>
      </section>

      {/* Vision */}
      <section className={styles.infoSectionAlt}>
        <h2 className={styles.sectionTitle}>Our Vision</h2>
        <p className={styles.sectionText}>
          To be East Africa’s leading digital platform for modern, technology-driven hostel
          management and student housing innovation.
        </p>
      </section>

      {/* Core Values */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueBox}>
            <FaHome className={styles.icon} />
            <h3>Reliability</h3>
            <p>Accurate, updated listings to help students make informed accommodation choices.</p>
          </div>

          <div className={styles.valueBox}>
            <FaUsers className={styles.icon} />
            <h3>Community</h3>
            <p>We connect students to safe, social, and supportive living environments.</p>
          </div>

          <div className={styles.valueBox}>
            <FaHandshake className={styles.icon} />
            <h3>Trust</h3>
            <p>Transparency between hostel owners and tenants is our top priority.</p>
          </div>

          <div className={styles.valueBox}>
            <FaGlobe className={styles.icon} />
            <h3>Innovation</h3>
            <p>Harnessing technology to make booking faster, smarter, and stress-free.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Meet Our Team</h2>
        <p className={styles.sectionText}>
          A passionate group of developers and innovators dedicated to transforming hostel life.
        </p>

        <div className={styles.teamGrid}>
          <div className={styles.teamCard}>
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Team Member"
            />
            <h3>KAWEESA STEPHEN</h3>
            <p>Lead Developer</p>
          </div>

          <div className={styles.teamCard}>
            <img
              src="https://res.cloudinary.com/dtpyrqass/image/upload/v1762774247/WhatsApp_Image_2025-11-09_at_13.15.11_054beef8_y6pvxr.jpg"
              alt="Team Member"
            />
            <h3>BUKENYA UMAR</h3>
            <p>Team member</p>
          </div>

          <div className={styles.teamCard}>
            <img
              src="https://res.cloudinary.com/dtpyrqass/image/upload/v1762773804/WhatsApp_Image_2025-11-09_at_13.06.38_2ed8dfe8_m8nuwp.jpg"
              alt="Team Member"
            />
            <h3>MULINDWA RAYMOND</h3>
            <p>Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;
