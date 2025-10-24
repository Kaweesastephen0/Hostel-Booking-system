import React, { useState, useEffect, useRef } from 'react';
import styles from './contactus.module.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className={styles.contactUsContainer}>
      {/* Hero Section */}
      <section className={styles.contactHeroSection}>
        <div className="container">
          <h1 className={styles.contactHeroTitle}>CONTACT US</h1>
          <p>Connect with our local experts and discover the authentic beauty of Uganda.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.contactFormSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              <h2>Send us a Message</h2>
              <p>Our local experts are ready to help you discover the best hostels in Uganda.</p>

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={styles.formInput}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={styles.formInput}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={styles.formInput}
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows="6"
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    placeholder="Tell us about your travel plans in Uganda..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <h3>Our Kampala Office</h3>
              <div className={styles.contactItem}>
                <strong>Address:</strong>
                <p>Plot 123, Kampala Road</p>
                <p>Nakasero, Kampala, Uganda</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Phone:</strong>
                <p>+256 709 167919</p>
                <p>+256 707 366082</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Email:</strong>
                <p>kampala@hostelbook.com</p>
                <p>support@hostelbook.ug</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;