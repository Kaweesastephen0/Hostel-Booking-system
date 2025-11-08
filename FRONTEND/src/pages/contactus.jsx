import React from "react";
import styles from "./contactus.module.css";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function Contactus() {
  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h1>Contact MUK BOOK</h1>
          <p>
            Your trusted companion for hostel discovery around Makerere
            University. Reach out for support, listings, or collaborations.
          </p>
        </div>
      </section>

      {/* Contact Details */}
      <section className={styles.mainSection}>
        <div className={styles.leftPanel}>
          <img
            src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Support team"
            className={styles.sideImage}
          />
        </div>

        <div className={styles.rightPanel}>
          <h2>Get in Touch</h2>
          <p className={styles.intro}>
            We’re here to help — choose your preferred method of contact.
          </p>

          <div className={styles.contactGrid}>
            <div className={styles.card}>
              <FaWhatsapp className={`${styles.icon} ${styles.green}`} />
              <div>
                <h3>WhatsApp</h3>
                <a
                  href="https://wa.me/256759546308"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +256 759 546 308
                </a>
              </div>
            </div>

            <div className={styles.card}>
              <FaEnvelope className={`${styles.icon} ${styles.blue}`} />
              <div>
                <h3>Email</h3>
                <a href="mailto:support@mukbook.com">support@mukbook.com</a>
              </div>
            </div>

            <div className={styles.card}>
              <FaPhoneAlt className={`${styles.icon} ${styles.orange}`} />
              <div>
                <h3>Call Us</h3>
                <a href="tel:+256759546308">+256 759 546 308</a>
              </div>
            </div>

            <div className={styles.card}>
              <FaMapMarkerAlt className={`${styles.icon} ${styles.red}`} />
              <div>
                <h3>Address</h3>
                <p>Kikoni, Makerere University — Kampala, Uganda</p>
              </div>
            </div>
          </div>

          <div className={styles.socials}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialIcon} ${styles.facebook}`}
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialIcon} ${styles.instagram}`}
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialIcon} ${styles.twitter}`}
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </section>

      {/* Google Street Map */}
      <section className={styles.mapSection}>
        <h2>Find Us on Google Street View</h2>
        <p className={styles.mapText}>
          Explore the Makerere University area using the live Google Street Map below.
        </p>
        <div className={styles.mapContainer}>
          <iframe
            title="Makerere University Street View"
            src="https://www.google.com/maps/embed?pb=!4v1730668800000!6m8!1m7!1sCAoSLEFGMVFpcE55MmJDaWhYUzYyT3FJOWdtNmNsM2JQRHdBNy1QRG9uVWtDSkty!2m2!1d0.332845964069035!2d32.57254317574396!3f0!4f0!5f0.7820865974627469"
            width="100%"
            height="480"
            style={{ border: 0, borderRadius: "20px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <section className={styles.footerBanner}>
        <img
          src="https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Modern hostel"
          className={styles.footerImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.footerText}>
          <h2>Your Hostel Experience, Simplified</h2>
          <p>© 2025 MUK BOOK — All Rights Reserved</p>
        </div>
      </section>
    </div>
  );
}
