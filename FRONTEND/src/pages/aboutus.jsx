import React from "react";
import styles from "./aboutus.module.css";
import { FaHome, FaUsers, FaHandshake, FaGlobe, FaBullseye, FaEye } from "react-icons/fa";

const AboutUs = () => {
  const bgImage =
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80"; // Modern hostel image

  const features = [
    {
      icon: <FaHome />,
      title: "Verified Hostels",
      text: "We list only verified hostels with genuine reviews and reliable facilities — ensuring your peace of mind.",
    },
    {
      icon: <FaUsers />,
      title: "Community Focused",
      text: "Connect with fellow students and travelers — Muk Book helps you find friendly, social environments.",
    },
    {
      icon: <FaHandshake />,
      title: "Reliable Support",
      text: "Our team is available 24/7 to assist you with bookings, payments, and any issues you may encounter.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      text: "Muk Book partners with hostels and accommodation services to provide affordable, quality stays everywhere.",
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
            <strong>Muk Book</strong> is your trusted hostel booking platform —
            designed to make finding, booking, and managing your stay simple and
            secure. Whether you’re a student at Makerere or a traveler exploring
            new cities, Muk Book connects you to verified, affordable, and
            comfortable hostels.
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

          {/* Mission and Vision Section */}
          <div className={styles.missionVision}>
            <div className={styles.missionCard}>
              <FaBullseye className={styles.mvIcon} />
              <h2>Our Mission</h2>
              <p>
                To simplify hostel booking through digital innovation and create
                a trustworthy platform where students and travelers can find
                safe, affordable accommodation effortlessly.
              </p>
            </div>

            <div className={styles.visionCard}>
              <FaEye className={styles.mvIcon} />
              <h2>Our Vision</h2>
              <p>
                To become the leading digital hostel booking system in Africa —
                connecting millions to comfortable, reliable, and affordable
                accommodation with just one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
