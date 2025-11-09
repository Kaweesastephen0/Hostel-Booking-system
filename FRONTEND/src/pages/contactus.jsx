import React from "react";
import styles from "./contactus.module.css";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contactus() {
  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Let Connect With Us</h1>
          <p>We’re here to help you anytime. Reach us for any inquiries or collaborations.</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className={styles.infoSection}>
        <h2>Our Office</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <MapPin size={36} />
            <h3>Address</h3>
            <p>Makerere, Kampala, Uganda</p>
          </div>
          <div className={styles.infoCard}>
            <Phone size={36} />
            <h3>Call Us</h3>
            <p>+256 759546308</p>
          </div>
          <div className={styles.infoCard}>
            <Mail size={36} />
            <h3>Email</h3>
            <p>mukbok@yourcompany.com</p>
          </div>
          <div className={styles.infoCard}>
            <Clock size={36} />
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <h2>Our Environment</h2>
        <div className={styles.gallery}>
          <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" alt="Office" />
          <img src="https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg" alt="Meeting Room" />
          <img src="https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg" alt="Team" />
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <h2>Find Us on Google Maps</h2>
        <div className={styles.mapContainer}>
          <iframe
            title="Company Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.748696685988!2d32.57533887403925!3d0.33225756404600617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb63fefb1d37%3A0x226c62d6b8255d5d!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1695560803143!5m2!1sen!2sug"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/256700000000?text=Hello%20there!%20I%27d%20like%20to%20inquire%20about%20your%20services."
        className={styles.whatsappFloat}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className={styles.whatsappIcon}
        />
      </a>
    </div>
  );
}
