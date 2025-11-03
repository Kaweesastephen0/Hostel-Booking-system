import React from "react";
import styles from "./contactUs.module.css";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className={styles.contactPage}>
      {/* Header Section */}
      <section className={styles.header}>
        <img
          src="https://images.unsplash.com/photo-1592595896616-c37162298686?auto=format&fit=crop&w=1920&q=80"
          alt="Hostel exterior background"
          className={styles.headerImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Contact Muk Book Hostel</h1>
          <p className={styles.subtitle}>
            Reach us for booking inquiries or support anytime.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className={styles.main}>
        {/* Left Section: Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.heading}>Get in Touch</h2>
          <p className={styles.text}>
            Have a question or need help with your booking? Our team is ready to
            assist you 24/7. Contact us through WhatsApp, call, or visit us in
            person.
          </p>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <FaWhatsapp className={styles.iconGreen} />
              <a
                href="https://wa.me/256759546308"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp (+256 759 546 308)
              </a>
            </div>

            <div className={styles.contactItem}>
              <FaEnvelope className={styles.iconBlue} />
              <a href="mailto:support@mukbook.com">support@mukbook.com</a>
            </div>

            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.iconBlue} />
              <a href="tel:+256759546308">+256 759 546 308</a>
            </div>

            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.iconRed} />
              <p>Kikoni, Makerere — Kampala, Uganda</p>
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

        {/* Right Section: Map */}
        <div className={styles.mapWrapper}>
          <h3 className={styles.mapHeading}>Find Us on Google Map</h3>
          <div className={styles.mapContainer}>
            <iframe
              title="Muk Book Hostel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.859209663169!2d32.57254317574396!3d0.332845964069035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc77554e5bb3%3A0x123456789abcd!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className={styles.bottom}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
          alt="Hostel view"
          className={styles.bottomImage}
        />
        <p className={styles.footerText}>
          Muk Book — Simplifying hostel booking in Kampala.
        </p>
      </section>
    </div>
  );
}
