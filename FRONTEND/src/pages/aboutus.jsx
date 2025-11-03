import React from "react";
import styles from "./aboutus.module.css";
import {
  FaHome,
  FaUsers,
  FaHandshake,
  FaGlobe,
  FaBullseye,
  FaEye,
} from "react-icons/fa";

const AboutUs = () => {
  const bgImage =
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80"; // Hostel background

  const features = [
    {
      icon: <FaHome />,
      title: "Verified Hostels",
      text: "Muk Book lists only verified hostels with trusted reviews and genuine facilities — ensuring your comfort and safety.",
    },
    {
      icon: <FaUsers />,
      title: "Community Focused",
      text: "We connect students and travelers to friendly hostel communities where you can feel at home.",
    },
    {
      icon: <FaHandshake />,
      title: "Reliable Support",
      text: "Our support team is available 24/7 to help with your bookings, payments, and inquiries.",
    },
    {
      icon: <FaGlobe />,
      title: "Expanding Reach",
      text: "Muk Book aims to expand across campuses and cities — offering a network of affordable, verified hostels.",
    },
  ];

  return (
    <div
      className={styles.aboutContainer}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>About Muk Book</h1>
          <p className={styles.description}>
            <strong>Muk Book</strong> is a modern digital platform that helps
            students and travelers easily find, book, and manage hostel
            accommodation. Designed for convenience, affordability, and trust,
            we bring every comfort closer to you.
          </p>

          <div className={styles.cards}>
            {features.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.icon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Mission & Vision Section */}
          <div className={styles.missionVision}>
            <div className={styles.missionCard}>
              <FaBullseye className={styles.mvIcon} />
              <h2>Our Mission</h2>
              <p>
                To simplify hostel booking for students and travelers through
                reliable digital tools that connect people with safe,
                affordable, and quality hostels.
              </p>
            </div>

            <div className={styles.visionCard}>
              <FaEye className={styles.mvIcon} />
              <h2>Our Vision</h2>
              <p>
                To become Africa’s most trusted hostel booking system — where
                every student and traveler can find a comfortable place with one
                click.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <h2>Join the Muk Book Community</h2>
            <p>
              Discover verified hostels, connect with others, and enjoy
              hassle-free booking anytime, anywhere.
            </p>
            <button className={styles.ctaButton}>Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
