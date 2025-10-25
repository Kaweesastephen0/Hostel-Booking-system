import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './aboutus.module.css';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Stats counter animation
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}</span>;
  };

  return (
    <div className={styles.aboutUsContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.textCenter}>
            <h1 className={styles.heroTitle}>
              ABOUT MUK-BOOK
            </h1>
            <h2 className={styles.heroSubtitle}>
              Your Trusted Hostel Booking Platform
            </h2>
            <p className={styles.heroDescription}>
              Connecting students with safe, affordable, and comfortable hostel accommodations 
              across Uganda. Your perfect stay is just a click away!
            </p>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <Link to="/hostels" className={styles.primaryButton}>
                Find Hostels
              </Link>
              <Link to="/contact" className={styles.secondaryButton}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { number: 50, label: 'Hostels Listed', suffix: '+' },
              { number: 1000, label: 'Happy Students', suffix: '+' },
              { number: 24, label: 'Support', suffix: '/7' },
              { number: 98, label: 'Satisfaction Rate', suffix: '%' }
            ].map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>
                  <Counter end={stat.number} />{stat.suffix}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            {/* Story Content */}
            <div>
              <div className={styles.storyBadge}>
                Our Story
              </div>
              <h2 className={styles.storyTitle}>
                From Student Struggles to{' '}
                <span className={styles.highlight}>
                  Seamless Stays
                </span>
              </h2>

              <div className={styles.storyFeatures}>
                <div className={styles.storyFeature}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                    🎓
                  </div>
                  <p className={styles.featureText}>
                    Founded by university students who understood the challenges of finding quality accommodation near campus.
                  </p>
                </div>

                <div className={styles.storyFeature}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(45deg, #ff6b6b, #ffa726)' }}>
                    🔍
                  </div>
                  <p className={styles.featureText}>
                    We verify every hostel to ensure safety, cleanliness, and student-friendly environments.
                  </p>
                </div>

                <div className={styles.storyFeature}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(45deg, #4ecdc4, #44a08d)' }}>
                    💰
                  </div>
                  <p className={styles.featureText}>
                    Affordable pricing with transparent costs - no hidden fees or surprises.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timelineCard}>
              <h3 className={styles.timelineTitle}>
                Our Journey
              </h3>
              <div className={styles.timelineItems}>
                {[
                  { year: '2023', event: 'Platform Launch', icon: '🚀' },
                  { year: '2024', event: '100+ Hostels', icon: '🏠' },
                  { year: '2024', event: 'Mobile App', icon: '📱' },
                  { year: '2025', event: 'Nationwide', icon: '🌍' }
                ].map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineYear}>
                      {item.icon}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineYearText}>{item.year}</div>
                      <h4 className={styles.timelineEvent}>{item.event}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVisionSection}>
        <div className={styles.container}>
          <div className={styles.missionVisionGrid}>
            {/* Mission */}
            <div className={styles.missionCard}>
              <div className={`${styles.cardIcon} ${styles.missionIcon}`}>
                🎯
              </div>
              <h3 className={styles.cardTitle}>
                MISSION
              </h3>
              <p className={styles.cardText}>
                To provide every student with safe, affordable, and comfortable hostel accommodations 
                through a seamless digital platform that prioritizes trust and convenience.
              </p>
            </div>

            {/* Vision */}
            <div className={styles.visionCard}>
              <div className={`${styles.cardIcon} ${styles.visionIcon}`}>
                🔭
              </div>
              <h3 className={styles.cardTitle}>
                VISION
              </h3>
              <p className={styles.cardText}>
                To become Uganda's most trusted student accommodation platform, connecting students 
                with their perfect home away from home while supporting hostel owners in growing their businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to Find Your
            <span className={`${styles.ctaHighlight} ${styles.block}`}>
              Perfect Hostel?
            </span>
          </h2>
          
          <p className={styles.ctaSubtitle}>
            Join thousands of students who've found their ideal accommodation through Muk-Book
          </p>

          <div className={styles.ctaButtonContainer}>
            <Link to="/hostels" className={styles.primaryButton}>
              Browse Hostels Now
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <div className={styles.statusDot}></div>
              <span>Verified Hostels</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.statusDot}></div>
              <span>Secure Payments</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.statusDot}></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;