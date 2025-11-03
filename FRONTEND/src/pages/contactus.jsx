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

      {/* Main Content */}
      <section className={styles.main}>
        {/* Left: Contact Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.heading}>Get in Touch</h2>
          <p className={styles.text}>
            Have a question or need help with your booking? We’re happy to assist
            you! Reach out via WhatsApp, phone, or email.
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
              <p>support@mukbook.com</p>
            </div>

            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.iconBlue} />
              <p>+256 759 546 308</p>
            </div>

            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.iconRed} />
              <p>Kampala, Uganda</p>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.socials}>
            <a href="#" className={`${styles.socialIcon} ${styles.facebook}`}>
              <FaFacebook />
            </a>
            <a href="#" className={`${styles.socialIcon} ${styles.instagram}`}>
              <FaInstagram />
            </a>
            <a href="#" className={`${styles.socialIcon} ${styles.twitter}`}>
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Right: Google Street View */}
        <div className={styles.mapContainer}>
          <iframe
            title="Muk Book Street View"
            src="https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFGMVFpcE5Pb2Mtb2Fta2pDNE5QNUlaeFRvTGdXSkdXeUJ1S3ZfZVNmSG1k!2m2!1d0.347596664047084!2d32.58252087454503!3f160!4f0!5f0.7820865974627469"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Bottom Image Section */}
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
