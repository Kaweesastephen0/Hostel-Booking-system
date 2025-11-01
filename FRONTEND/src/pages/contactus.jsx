import React, { useState, useEffect, useRef } from 'react';
import styles from './contactus.module.css';
import {
  Phone,
  Email,
  LocationOn,
  Chat,
  Business,
  Schedule,
  Public,
  FlashOn,
  Map,
  School,
  Send,
  Check,
  Close,
  Person,
  SupportAgent,
  BookOnline,
  Groups
} from '@mui/icons-material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        
        // Handle validation errors
        if (result.errors) {
          const errorMessages = result.errors.map(error => Object.values(error)[0]).join(', ');
          setSubmitMessage(errorMessages);
        } else {
          setSubmitMessage(result.message || 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusMessage = () => {
    if (!submitStatus) return null;

    return (
      <div className={`${styles.statusMessage} ${
        submitStatus === 'success' ? styles.statusSuccess : styles.statusError
      }`}>
        <div className={styles.statusContent}>
          <div className={styles.statusIcon}>
            {submitStatus === 'success' ? (
              <Check style={{ fontSize: '20px' }} />
            ) : (
              <Close style={{ fontSize: '20px' }} />
            )}
          </div>
          <p className={styles.statusText}>{submitMessage}</p>
        </div>
      </div>
    );
  };

  const contactMethods = [
    {
      icon: <Phone style={{ fontSize: '2.5rem' }} />,
      title: 'Call Us',
      details: ['+256 709 167919', '+256 707 366082'],
      description: 'Available 24/7 for urgent inquiries',
      color: 'linear-gradient(45deg, #1976d2, #1565c0)',
      link: 'tel:+256709167919'
    },
    {
      icon: <Email style={{ fontSize: '2.5rem' }} />,
      title: 'Email Us',
      details: ['kampala@mukbook.com', 'support@mukbook.ug'],
      description: 'Typically respond within 2 hours',
      color: 'linear-gradient(45deg, #1976d2, #1565c0)',
      link: 'mailto:kampala@mukbook.com'
    },
    {
      icon: <LocationOn style={{ fontSize: '2.5rem' }} />,
      title: 'Visit Us',
      details: ['Makerere University', 'Kampala, Uganda'],
      description: 'Walk-ins welcome 8AM-8PM',
      color: 'linear-gradient(45deg, #1976d2, #1565c0)',
      link: 'https://maps.google.com/?q=Makerere+University,+Kampala'
    },
    {
      icon: <Chat style={{ fontSize: '2.5rem' }} />,
      title: 'WhatsApp',
      details: ['+256 759 546308', 'Instant messaging'],
      description: 'Quick responses via WhatsApp',
      color: 'linear-gradient(45deg, #1976d2, #1565c0)',
      link: 'https://wa.me/256759546308'
    }
  ];

  const teamMembers = [
    {
      name: 'Sam M.',
      role: 'Customer Support Manager',
      email: 'support@mukbook.com',
      phone: '+256 709 167919',
      icon: <SupportAgent style={{ fontSize: '2rem' }} />
    },
    {
      name: 'Umar B.',
      role: 'Booking Specialist',
      email: 'bookings@mukbook.ug',
      phone: '+256 707 366082',
      icon: <BookOnline style={{ fontSize: '2rem' }} />
    },
    {
      name: 'Sarah K.',
      role: 'Hostel Relations',
      email: 'partners@mukbook.ug',
      phone: '+256 782 555 666',
      icon: <Groups style={{ fontSize: '2rem' }} />
    }
  ];

  return (
    <div className={styles.contactUsContainer}>
      {/* Hero Section */}
      <section className={styles.contactHeroSection}>
        <div className={styles.contactHeroContent}>
          <div className={styles.textCenter}>
            <h1 className={styles.contactHeroTitle}>
              CONTACT US
            </h1>
            <p className={styles.contactHeroDescription}>
              Get in touch with our team for any hostel booking inquiries, support, or partnership opportunities. 
              We're here to help you find your perfect student accommodation!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className={styles.contactMethodsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            <p className={styles.sectionSubtitle}>
              Multiple ways to reach our Kampala-based team dedicated to helping students find perfect accommodations. 
              Choose your preferred method!
            </p>
          </div>

          <div className={styles.contactMethodsGrid}>
            {contactMethods.map((method, index) => (
              <a 
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactMethodCard}
              >
                <div 
                  className={styles.methodIcon} 
                  style={{ background: method.color }}
                >
                  {method.icon}
                </div>
                <h3 className={styles.methodTitle}>{method.title}</h3>
                <div className={styles.methodDetails}>
                  {method.details.map((detail, idx) => (
                    <p key={idx} className={styles.methodDetail}>{detail}</p>
                  ))}
                </div>
                <p className={styles.methodDescription}>{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainContactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.formSection} ref={formRef}>
              <div className={styles.contactFormBadge}>
                <Send style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Send us a Message
              </div>
              <h2 className={styles.contactFormTitle}>
                Need Help Finding a Hostel?
              </h2>
              <p className={styles.contactFormDescription}>
                Our team specializes in helping students find safe, affordable, and comfortable hostel accommodations. 
                Tell us your preferences and we'll help you find the perfect match!
              </p>

              <StatusMessage />

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Person style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={styles.formInput}
                      placeholder="Enter your full name"
                      minLength="2"
                      maxLength="100"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Email style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Email Address *
                    </label>
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
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={styles.formInput}
                    placeholder="e.g., Hostel Booking Inquiry, Room Availability"
                    minLength="5"
                    maxLength="200"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows="6"
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    placeholder="Tell us about your accommodation needs: preferred location, budget, room type, duration of stay, etc."
                    minLength="10"
                    maxLength="2000"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Team Contact Cards */}
              <div className={styles.teamSection}>
                <h3 className={styles.teamTitle}>
                  <Groups style={{ marginRight: '12px', fontSize: '2rem' }} />
                  Meet Our Kampala Team
                </h3>
                <div className={styles.teamGrid}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className={styles.teamCard}>
                      <div className={styles.teamMemberHeader}>
                        <div className={styles.teamMemberIcon}>
                          {member.icon}
                        </div>
                        <div>
                          <h4 className={styles.teamMemberName}>{member.name}</h4>
                          <p className={styles.teamMemberRole}>{member.role}</p>
                        </div>
                      </div>
                      <div className={styles.teamMemberContacts}>
                        <p className={styles.teamMemberContact}>
                          <Email style={{ marginRight: '8px', fontSize: '1rem' }} />
                          {member.email}
                        </p>
                        <p className={styles.teamMemberContact}>
                          <Phone style={{ marginRight: '8px', fontSize: '1rem' }} />
                          {member.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information & Map Section */}
            <div className={styles.contactInfoSection}>
              {/* Office Information */}
              <div className={styles.officeCard}>
                <h3 className={styles.officeTitle}>
                  <Business style={{ marginRight: '12px', fontSize: '2rem' }} />
                  Our Kampala Office
                </h3>
                
                <div className={styles.officeInfo}>
                  <div className={styles.officeItem}>
                    <div className={styles.officeIcon}>
                      <Business style={{ fontSize: '1.8rem' }} />
                    </div>
                    <div>
                      <h4 className={styles.officeItemTitle}>Main Office</h4>
                      <p className={styles.officeItemDetail}>
                        <LocationOn style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Makerere University Campus
                      </p>
                      <p className={styles.officeItemDetail}>
                        <LocationOn style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Off Sir Apollo Kaggwa Road
                      </p>
                      <p className={styles.officeItemDetail}>
                        <LocationOn style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Kampala, Uganda
                      </p>
                    </div>
                  </div>

                  <div className={styles.officeItem}>
                    <div className={styles.officeIcon}>
                      <Schedule style={{ fontSize: '1.8rem' }} />
                    </div>
                    <div>
                      <h4 className={styles.officeItemTitle}>Business Hours</h4>
                      <p className={styles.officeItemDetail}>
                        <Schedule style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Monday - Friday: 8:00 AM - 8:00 PM
                      </p>
                      <p className={styles.officeItemDetail}>
                        <Schedule style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Saturday: 9:00 AM - 6:00 PM
                      </p>
                      <p className={styles.officeItemDetail}>
                        <Schedule style={{ marginRight: '8px', fontSize: '1rem' }} />
                        Sunday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>

                  <div className={styles.officeItem}>
                    <div className={styles.officeIcon}>
                      <Public style={{ fontSize: '1.8rem' }} />
                    </div>
                    <div>
                      <h4 className={styles.officeItemTitle}>Student Expertise</h4>
                      <p className={styles.officeItemDetail}>
                        <School style={{ marginRight: '8px', fontSize: '1rem' }} />
                        University Accommodation Specialists
                      </p>
                      <p className={styles.officeItemDetail}>
                        💰 Budget-Friendly Options
                      </p>
                      <p className={styles.officeItemDetail}>
                        🛡️ Safety & Security Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className={styles.mapContainer}>
                <div className={styles.mapFrame}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63846.66076215463!2d32.52940395820313!3d0.3475961999999945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb93dc34a0a5%3A0x8f243991e5dc0fae!2sKampala%2C%20Uganda!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    className={styles.mapIframe}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kampala Map - Muk-Book Hostels"
                  ></iframe>
                </div>
                
                <div className={styles.mapFooter}>
                  <div className={styles.mapFooterContent}>
                    <div className={styles.mapFooterText}>
                      <h4>
                        <Map style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                        Visit Our Kampala Office
                      </h4>
                      <p>Located near Makerere University for student convenience!</p>
                    </div>
                    <a 
                      href="https://maps.google.com/?q=Makerere+University,+Kampala"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsButton}
                    >
                      <Map style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Response Info */}
              <div className={`${styles.infoCard} ${styles.responseCard}`}>
                <div className={styles.infoCardHeader}>
                  <div className={`${styles.infoCardIcon} ${styles.responseIcon}`}>
                    <FlashOn style={{ fontSize: '1.8rem' }} />
                  </div>
                  <h4 className={styles.infoCardTitle}>Student Response Time</h4>
                </div>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div className={styles.statusDot}></div>
                    <span>Email: Response within 1 hour</span>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.statusDot}></div>
                    <span>Phone: Immediate assistance</span>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.statusDot}></div>
                    <span>WhatsApp: Instant messaging</span>
                  </div>
                </div>
              </div>

              {/* Local Landmarks */}
              <div className={`${styles.infoCard} ${styles.landmarksCard}`}>
                <div className={styles.infoCardHeader}>
                  <div className={`${styles.infoCardIcon} ${styles.landmarksIcon}`}>
                    <School style={{ fontSize: '1.8rem' }} />
                  </div>
                  <h4 className={styles.infoCardTitle}>Nearby Universities</h4>
                </div>
                <div className={styles.infoList}>
                  <div className={styles.landmarkItem}>
                    <span>
                      <School style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Makerere University
                    </span>
                    <span className={styles.landmarkDistance}>0.5 km</span>
                  </div>
                  <div className={styles.landmarkItem}>
                    <span>
                      <School style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Kyambogo University
                    </span>
                    <span className={styles.landmarkDistance}>3.2 km</span>
                  </div>
                  <div className={styles.landmarkItem}>
                    <span>
                      <School style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Uganda Christian University
                    </span>
                    <span className={styles.landmarkDistance}>12 km</span>
                  </div>
                  <div className={styles.landmarkItem}>
                    <span>
                      <School style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                      Uganda Martyrs University
                    </span>
                    <span className={styles.landmarkDistance}>21 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h2 className={styles.faqTitle}>Student Accommodation FAQs</h2>
            <div className={styles.faqDivider}></div>
            
            <div className={styles.faqGrid}>
              {[
                {
                  question: "How do I book a hostel through Muk-Book?",
                  answer: "Simply browse our listed hostels, check availability, and book directly through our platform. You'll receive instant confirmation and hostel details."
                },
                {
                  question: "Are the hostels safe for students?",
                  answer: "Yes! We personally verify every hostel for safety, security measures, cleanliness, and student-friendly environment before listing. Your safety is our priority!"
                },
                {
                  question: "Can I visit the hostel before booking?",
                  answer: "Absolutely! We encourage students to visit hostels beforehand. Contact us to arrange a viewing with the hostel management."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept mobile money (MTN, Airtel), bank transfers, and cash payments for your convenience and security."
                },
                {
                  question: "Do you help with roommate matching?",
                  answer: "Yes! We can help match you with compatible roommates based on your preferences, study habits, and lifestyle."
                },
                {
                  question: "What if I have issues with my accommodation?",
                  answer: "Our 24/7 support team is always available to help resolve any issues with your accommodation quickly and efficiently."
                }
              ].map((faq, index) => (
                <div key={index} className={styles.faqCard}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;