import React from "react";
import styles from "./aboutus.module.css";
import { FaHome, FaUsers, FaHandshake, FaGlobe } from "react-icons/fa";

const AboutUs = () => {
  const bgImage =
    "https://images.unsplash.com/photo-1560448071-9a37f1c3c2c6?auto=format&fit=crop&w=1400&q=80"; // modern hostel background

  const features = [
    {
      icon: <FaHome />,
      title: "Verified Hostels",
      text: "We list only verified hostels with genuine reviews and reliable facilities — ensuring your peace of mind.",
    },
    {
      icon: <FaUsers />,
      title: "Community Focused",
      text: "Connect with fellow travelers and students — StayEase helps you find friendly, social environments.",
    },
    {
      icon: <FaHandshake />,
      title: "Reliable Support",
      text: "Our team is available 24/7 to assist you with bookings, payments, and any issues you may encounter.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      text: "StayEase partners with hostels worldwide to give you diverse, budget-friendly options wherever you go.",
    },
  ];

  return (
    <div
      className={styles.aboutContainer}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>About StayEase</h1>
          <p className={styles.description}>
            At <strong>StayEase</strong>, we make hostel booking simple, secure,
            and stress-free. Whether you're a student finding long-term stays or
            a traveler seeking short-term comfort — we connect you to the best
            options with transparent pricing and verified listings.
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
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
