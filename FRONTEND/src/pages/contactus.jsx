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
      {/* ---------- HEADER ---------- */}
      <header className={styles.header}>
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/682779963.jpg?k=acee76c94310b53e1ba9e5af597e3a67fc5a6c7b2fc8679fa5e8dd06bff48bd8&o="
          alt="Hostel Exterior"
          className={styles.headerImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Contact Muk Book Hostel</h1>
          <p className={styles.subtitle}>
            Comfortable, secure, and affordable stay in the heart of Kampala.
          </p>
        </div>
      </header>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className={styles.main}>
        {/* LEFT SECTION: CONTACT INFO */}
        <div className={styles.infoSection}>
          <h2 className={styles.heading}>Get in Touch</h2>
          <p className={styles.text}>
            Whether you want to book a room, ask about facilities, or share feedback —
            we’re always ready to help. Contact us via any of the options below.
          </p>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <FaWhatsapp className={styles.iconGreen} />
              <a href="https://wa.me/256759546308" target="_blank" rel="noopener noreferrer">
                WhatsApp: +256 759 546 308
              </a>
            </div>

            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.iconBlue} />
              <a href="tel:+256759546308">Call: +256 759 546 308</a>
            </div>

            <div className={styles.contactItem}>
              <FaEnvelope className={styles.iconRed} />
              <a href="mailto:info@mukbook.com">Email: info@mukbook.com</a>
            </div>

            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.iconBlue} />
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

        {/* RIGHT SECTION: MAP */}
        <div className={styles.mapWrapper}>
          <h2 className={styles.mapHeading}>Find Us Easily</h2>
          <div className={styles.mapContainer}>
            <iframe
              title="Muk Book Hostel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.745597194307!2d32.56494127370464!3d0.3305339996765335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb37c08f6db3%3A0x1d8a3f10fffa12b3!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1705668916484!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className={styles.bottom}>
        <img
          src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Olympia-hostel.png"
          alt="Hostel Room"
          className={styles.bottomImage}
        />
        <p className={styles.footerText}>
          Muk Book Hostel — Your comfort, our priority.
        </p>
      </footer>
    </div>
  );
}
