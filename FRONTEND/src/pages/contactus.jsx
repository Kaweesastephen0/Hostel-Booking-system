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
        <div className={styles.overlay}>
          <h1>Contact MUK BOOK</h1>
          <p>
            Let’s help you find a perfect hostel near Makerere University —
            safe, affordable, and reliable.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactInfo}>
          <h2>Get in Touch</h2>
          <p>
            Our support team is available 24/7 to help with your bookings,
            listings, or any hostel-related inquiries.
          </p>

          <div className={styles.cards}>
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
                <h3>Phone</h3>
                <a href="tel:+256759546308">+256 759 546 308</a>
              </div>
            </div>

            <div className={styles.card}>
              <FaMapMarkerAlt className={`${styles.icon} ${styles.red}`} />
              <div>
                <h3>Location</h3>
                <p>Kikoni, Makerere — Kampala, Uganda</p>
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

        <div className={styles.imageWrapper}>
          <img
            src="https://images.pexels.com/photos/3288103/pexels-photo-3288103.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Customer support"
          />
        </div>
      </section>

      {/* Google Street Map */}
      <section className={styles.mapSection}>
        <h2>Find Us in Kampala</h2>
        <p>
          Visit us near Makerere University or explore our location using Google Street View.
        </p>
        <div className={styles.mapBox}>
          <iframe
            title="Makerere University Street View"
            src="https://www.google.com/maps/embed?pb=!4v1730668800000!6m8!1m7!1sCAoSLEFGMVFpcE55MmJDaWhYUzYyT3FJOWdtNmNsM2JQRHdBNy1QRG9uVWtDSkty!2m2!1d0.332845964069035!2d32.57254317574396!3f0!4f0!5f0.7820865974627469"
            width="100%"
            height="480"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <img
          src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Hostel background"
          className={styles.footerImage}
        />
        <div className={styles.footerOverlay}>
          <h2>Your Hostel Experience, Simplified</h2>
          <p>© 2025 MUK BOOK — Designed for Students by Students</p>
        </div>
      </footer>
    </div>
  );
}
