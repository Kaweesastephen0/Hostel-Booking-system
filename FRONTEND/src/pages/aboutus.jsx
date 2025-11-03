import React from "react";
import styles from "./aboutus.module.css";
import { FaHome, FaUsers, FaHandshake, FaGlobe } from "react-icons/fa";

const AboutUs = () => {
  // Public image URLs
  const images = {
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    verified: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    community: "https://cdn-icons-png.flaticon.com/512/1256/1256650.png",
    support: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
    global: "https://cdn-icons-png.flaticon.com/512/484/484582.png",
  };

  return (
    <div
      className={styles.aboutContainer}
      style={{
        backgroundImage: `url(${images.bg})`,
      }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>About StayEase</h1>
          <p className={styles.description}>
            At <strong>StayEase</strong>, we make hostel booking simple, secure, and
            stress-free. Whether you're a student finding long-term stays or a
            traveler seeking short-term comfort — we connect you to the best
            options with transparent pricing and verified listings.
          </p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <img
                src={images.verified}
                alt="Verified Hostels"
                className={styles.cardImg}
              />
              <FaHome className={styles.icon} />
              <h3>Verified Hostels</h3>
              <p>
                We list only verified hostels with genuine reviews and reliable
                facilities — ensuring your peace of mind.
              </p>
            </div>

            <div className={styles.card}>
              <img
                src={images.community}
                alt="Community Focused"
                className={styles.cardImg}
              />
              <FaUsers className={styles.icon} />
              <h3>Community Focused</h3>
              <p>
                Connect with fellow travelers and students — StayEase helps you
                find friendly, social environments.
              </p>
            </div>

            <div className={styles.card}>
              <img
                src={images.support}
                alt="Reliable Support"
                className={styles.cardImg}
              />
              <FaHandshake className={styles.icon} />
              <h3>Reliable Support</h3>
              <p>
                Our team is available 24/7 to assist you with bookings, payments,
                and any issues you may encounter.
              </p>
            </div>

            <div className={styles.card}>
              <img
                src={images.global}
                alt="Global Reach"
                className={styles.cardImg}
              />
              <FaGlobe className={styles.icon} />
              <h3>Global Reach</h3>
              <p>
                StayEase partners with hostels worldwide to give you diverse,
                budget-friendly options wherever you go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
