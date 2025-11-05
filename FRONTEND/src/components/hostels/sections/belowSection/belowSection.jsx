import React from 'react';

export default function DesignJourney() {
  return (
    <div style={styles.container}>
      {/* Our Design Journey Section */}
      <section style={styles.section}>
        <div style={styles.contentWrapper}>
          <div style={styles.textContent}>
            <h2 style={styles.mainTitle}>OUR DESIGN<br />JOURNEY</h2>
            <p style={styles.description}>
              We believe in creating spaces that inspire and comfort. Our journey began with a simple idea: 
              to transform student accommodation into a home away from home. Every detail is carefully 
              considered to enhance your living experience.
            </p>
            <button style={styles.button}>
              Learn More →
            </button>
          </div>
          <div style={styles.imageContent}>
            <img 
              src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" 
              alt="Interior Design" 
              style={styles.mainImage}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>120+</h3>
            <p style={styles.statLabel}>Happy Students</p>
            <p style={styles.statDescription}>Students have found their perfect accommodation with us</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>25+</h3>
            <p style={styles.statLabel}>Premium Rooms</p>
            <p style={styles.statDescription}>Carefully designed rooms across multiple locations</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>12+</h3>
            <p style={styles.statLabel}>Years Experience</p>
            <p style={styles.statDescription}>Providing quality student accommodation</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>98+</h3>
            <p style={styles.statLabel}>Satisfaction Rate</p>
            <p style={styles.statDescription}>Students rate us highly for comfort and service</p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section style={styles.missionSection}>
        <div style={styles.contentWrapper}>
          <div style={styles.textContentWhite}>
            <h2 style={styles.titleWhite}>OUR MISSION<br />AND VISION</h2>
            <p style={styles.descriptionWhite}>
              Our mission is to provide affordable, comfortable, and secure accommodation that enables 
              students to focus on their academic journey. We envision a community where every student 
              feels at home, supported, and inspired to achieve their dreams.
            </p>
            <button style={styles.buttonWhite}>
              Read More →
            </button>
          </div>
          <div style={styles.imageContent}>
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop" 
              alt="Modern Living Space" 
              style={styles.mainImage}
            />
          </div>
        </div>
      </section>

      {/* Elegant Tranquility Section */}
      <section style={styles.elegantSection}>
        <div style={styles.elegantHeader}>
          <h2 style={styles.elegantTitle}>ELEGANT TRANQUILITY<br />& MODERN FAMILY ESTATE</h2>
          <p style={styles.elegantDescription}>
            Experience the perfect blend of contemporary design and homely comfort. Our spaces are 
            thoughtfully curated to create an environment that promotes both productivity and relaxation.
          </p>
        </div>
        <div style={styles.galleryGrid}>
          <div style={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1565363887715-8884629e09ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" 
              alt="Teal Room" 
              style={styles.galleryImage}
            />
          </div>
          <div style={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1620545785640-54af6b5875ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" 
              alt="Modern Interior" 
              style={styles.galleryImage}
            />
          </div>
          <div style={styles.galleryItem}>
            <img 
              src="https://images.unsplash.com/photo-1560870535-d0347d4681e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" 
              alt="Cozy Living Room" 
              style={styles.galleryImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  section: {
    padding: '5rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'white',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    alignItems: 'center',
    padding: '0 50px',
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  textContentWhite: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#0a3d5c',
    lineHeight: '1.2',
    letterSpacing: '2px',
    margin: '0',
    textTransform: 'uppercase',
  },
  titleWhite: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'white',
    lineHeight: '1.2',
    letterSpacing: '2px',
    margin: '0',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#4b5563',
    margin: '0',
  },
  descriptionWhite: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#e5e7eb',
    margin: '0',
  },
  button: {
    background: 'linear-gradient(135deg, #0a3d5c 0%, #0d5278 50%, #0a3d5c 100%)',
    color: 'white',
    border: 'none',
    padding: '0.875rem 2rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '4px',
    width: 'fit-content',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(10, 61, 92, 0.3)',
  },
  buttonWhite: {
    background: 'white',
    color: '#0a3d5c',
    border: 'none',
    padding: '0.875rem 2rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '4px',
    width: 'fit-content',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
  },
  imageContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 20px 40px rgba(10, 61, 92, 0.2)',
  },
  statsSection: {
    background: 'linear-gradient(135deg, #0a3d5c 0%, #0d5278 50%, #0a3d5c 100%)',
    padding: '5rem 2rem',
  },
  statsGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  statCard: {
    textAlign: 'center',
    padding: '2rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '900',
    color: 'white',
    margin: '0 0 0.5rem 0',
  },
  statLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 0.75rem 0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statDescription: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    lineHeight: '1.6',
    margin: '0',
  },
  missionSection: {
    background: 'linear-gradient(135deg, #0a3d5c 0%, #0d5278 50%, #0a3d5c 100%)',
    padding: '5rem 2rem',
  },
  elegantSection: {
    background: 'white',
    padding: '5rem 2rem',
  },
  elegantHeader: {
    maxWidth: '1400px',
    margin: '0 auto 3rem auto',
    textAlign: 'center',
  },
  elegantTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#12295a ',
    lineHeight: '1.2',
    letterSpacing: '2px',
    margin: '0 0 1.5rem 0',
    textTransform: 'uppercase',
  },
  elegantDescription: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#12295a',
    margin: '0 auto',
    maxWidth: '800px',
  },
  galleryGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  galleryItem: {
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  galleryImage: {
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
};

// Add hover effects
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(10, 61, 92, 0.4) !important;
    }
    
    div[style*="statCard"]:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15) !important;
    }
    
    div[style*="galleryItem"]:hover {
      transform: scale(1.02);
    }
    
    div[style*="galleryItem"]:hover img {
      transform: scale(1.1);
    }
    
    @media (max-width: 1024px) {
      div[style*="contentWrapper"] {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
      
      div[style*="statsGrid"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      
      div[style*="galleryGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
    
    @media (max-width: 768px) {
      div[style*="statsGrid"] {
        grid-template-columns: 1fr !important;
      }
      
      h2, h3 {
        font-size: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}