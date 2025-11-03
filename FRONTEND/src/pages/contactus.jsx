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
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Muk Book Hostel"
          className={styles.headerImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Contact Muk Book</h1>
          <p className={styles.subtitle}>
            Your trusted hostel booking system in Kampala
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className={styles.main}>
        {/* Left Section: Info */}
        <div className={styles.infoCard}>
          <h2 className={styles.heading}>Get in Touch</h2>
          <p className={styles.text}>
            Have a question or need help with your booking? Our support team is
            ready to assist you. Get in touch through any of the following
            channels.
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

        {/* Right Section: Google Map */}
        <div className={styles.mapCard}>
          <h3 className={styles.mapHeading}>Find Us on the Map</h3>
          <div className={styles.mapContainer}>
            <iframe
              title="Muk Book Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.859209663169!2d32.57254317574396!3d0.332845964069035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc77554e5bb3%3A0x123456789abcd!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1700000000000"
              allowFullScreen
              loading="lazy"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className={styles.bottom}>
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          alt="Hostel exterior"
          className={styles.bottomImage}
        />
        <p className={styles.footerText}>
          Muk Book — Find your perfect hostel stay in Kampala.
        </p>
      </section>
    </div>
  );
}
