import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './midrangehostels.module.css';

const MidRangeHostel = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  // Fetch hostels from API
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/hostels/midrangeHostels');
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch hostels');
        }
        
        if (!result.data || result.data.length === 0) {
          setError('No mid-range hostels available at the moment');
          setHostels([]);
          return;
        }
        
        // Map hostels to match the component structure
        const mappedHostels = result.data.map(hostel => {
          // Validate required fields
          if (!hostel._id || !hostel.name) {
            console.warn('Invalid hostel data:', hostel);
            return null;
          }
          
          // Get minimum price from rooms if available
          let minPrice = 0;
          if (hostel.rooms && hostel.rooms.length > 0) {
            const prices = hostel.rooms.map(r => r.roomPrice).filter(p => p > 0);
            if (prices.length > 0) {
              minPrice = Math.min(...prices);
            }
          }
          
          // Get image URL - handle different possible formats
          let imageUrl = null;
          if (hostel.images && hostel.images.length > 0) {
            imageUrl = hostel.images[0];
            // If it's a relative path, make it absolute
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
            }
          } else if (hostel.image) {
            // Sometimes the field might be 'image' instead of 'images'
            imageUrl = hostel.image;
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
            }
          }
          
          console.log('Hostel:', hostel.name, 'Image URL:', imageUrl);
          
          return {
            name: hostel.name,
            price: minPrice > 0 ? `FROM UGX ${minPrice.toLocaleString()}` : 'Contact for Price',
            gender: hostel.HostelGender,
            image: imageUrl,
            id: hostel._id,
            location: hostel.location || 'Location not specified'
          };
        }).filter(hostel => hostel !== null); // Remove any invalid hostels
        
        if (mappedHostels.length === 0) {
          setError('No valid hostel data found');
          setHostels([]);
          return;
        }
        
        setHostels(mappedHostels);
        
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setError(err.message || 'Failed to load hostels. Please try again later.');
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Scroll functions for horizontal scrolling
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.hostelHeroSection}>
      <div className={styles.hostelContainer}>
        {/* Header Section */}
        <div className={styles.hostelHeader}>
          <p className={styles.hostelSubtitle}>
            Mid Range Hostels
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.hostelLoading}>
            Loading mid-range hostels...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.hostelError}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State - No Hostels Available */}
        {!loading && !error && hostels.length === 0 && (
          <div className={styles.hostelError}>
            <p>No mid-range hostels available at the moment.</p>
            <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
              Please check back later or contact support.
            </p>
          </div>
        )}

        {/* Cards Carousel - Only show if we have real data */}
        {!loading && !error && hostels.length > 0 && (
          <div className={styles.hostelCarouselWrapper}>
            <div 
              className={styles.hostelCarouselContainer}
              ref={carouselRef}
            >
              <div className={styles.hostelCarouselTrack}>
                {hostels.map((hostel, index) => (
                  <div key={hostel.id} className={styles.hostelCityCard}>
                    {hostel.image ? (
                      <img 
                        src={hostel.image} 
                        alt={hostel.name}
                        className={styles.hostelCardImage}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', hostel.name, hostel.image);
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', hostel.name, hostel.image);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            parent.style.background = 'linear-gradient(135deg, #0a3d5c 0%, #0d5278 100%)';
                            // Add placeholder icon
                            const placeholder = document.createElement('div');
                            placeholder.style.cssText = `
                              position: absolute;
                              inset: 0;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              font-size: 64px;
                              color: rgba(255, 255, 255, 0.2);
                            `;
                            placeholder.textContent = '🏠';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div 
                        className={styles.hostelCardImage}
                        style={{
                          background: 'linear-gradient(135deg, #0a3d5c 0%, #0d5278 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px',
                          color: 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        🏠
                      </div>
                    )}
                    <div className={styles.hostelCardOverlay} />
                    
                    {/* Gender Badge - CRITICAL INFO */}
                    <div className={styles.hostelGenderBadge}>
                      {hostel.gender}
                    </div>
                    
                    {/* Hostel Name */}
                    <h3 className={styles.hostelCityName}>
                      {hostel.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons - Only show if more than 3 hostels */}
            {hostels.length > 3 && (
              <>
                <button
                  onClick={scrollLeft}
                  className={`${styles.hostelNavButton} ${styles.prev}`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={24} color="#333" />
                </button>
                
                <button
                  onClick={scrollRight}
                  className={`${styles.hostelNavButton} ${styles.next}`}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={24} color="#333" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={styles.hostelScrollTop}
        aria-label="Scroll to top"
      >
        <svg 
          width="24" 
          height="24" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </div>
  );
};

export default MidRangeHostel;