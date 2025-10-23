
  import React, { useState } from 'react';
import { Heart, MapPin, Star, ChevronRight, Search, Calendar, Users, Menu, Bell, User, Wifi, Coffee, Waves, Dumbbell, Wind, X } from 'lucide-react';
import SearchBar from '../homePage/SearchBar';
const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '0',
    color: '#1a1a1a'
  },
  topBar: {
    background: '#ffffff',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  topBarRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#f0f2f5',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  heroSection: {
    padding: '140px 20px',
    textAlign: 'center',
    color: '#1a1a1a'
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '16px'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    fontWeight: '400'
  },
  searchCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '15px',
    alignItems: 'end'
  },
  searchField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  searchLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#2c3e50',
    opacity: 0.6
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  searchButton: {
    background: '#2c3e50',
    color: '#ffffff',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  mainContent: {
    padding: '30px 20px',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sidebar: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '80px'
  },
  filterHeader: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterSection: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  filterTitle: {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#34495e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  priceRange: {
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  priceChart: {
    height: '50px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    marginBottom: '10px'
  },
  chartBar: {
    flex: 1,
    background: '#2c3e50',
    borderRadius: '2px 2px 0 0',
    minHeight: '4px',
    transition: 'all 0.3s ease'
  },
  priceLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    marginBottom: '6px'
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#2c3e50'
  },
  checkboxLabel: {
    flex: 1,
    fontSize: '13px',
    fontWeight: '500',
    color: '#34495e'
  },
  count: {
    color: '#7f8c8d',
    fontSize: '12px',
    fontWeight: '600',
    background: '#ecf0f1',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  showMore: {
    color: '#2c3e50',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    display: 'inline-block',
    transition: 'all 0.2s ease'
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  resultsHeader: {
    background: '#ffffff',
    padding: '15px 20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  sortBy: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  resultsCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  hotelCard: {
    background: '#f5f6f5',
    borderRadius: '10px',
    padding: '0',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    border: '1px solid #e0e0e0'
  },
  hotelCardInner: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '0'
  },
  imageSection: {
    position: 'relative',
    overflow: 'hidden'
  },
  hotelImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  heartButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    background: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    zIndex: 10
  },
  contentSection: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  hotelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  hotelInfo: {
    flex: 1
  },
  hotelName: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#2c3e50'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: '#7f8c8d',
    marginBottom: '10px'
  },
  features: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px'
  },
  featureTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    background: '#ecf0f1',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  rating: {
    display: 'flex',
    gap: '3px',
    marginBottom: '8px'
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '3px 8px',
    background: '#ecf0f1',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#7f8c8d'
  },
  hotelFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '15px',
    borderTop: '1px solid #e0e0e0'
  },
  reviewSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  ratingScore: {
    background: '#2c3e50',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 2px 6px rgba(44, 62, 80, 0.2)'
  },
  reviewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  ratingLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2c3e50'
  },
  reviewCount: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  priceSection: {
    textAlign: 'right'
  },
  nights: {
    fontSize: '11px',
    color: '#7f8c8d',
    marginBottom: '3px'
  },
  price: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
    lineHeight: 1
  },
  priceLabel: {
    fontSize: '11px',
    color: '#7f8c8d',
    marginTop: '3px',
    marginBottom: '10px'
  },
  viewButton: {
    background: '#2c3e50',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    boxShadow: '0 2px 6px rgba(44, 62, 80, 0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
};

const hotels = [
  {
    id: 1,
    name: 'Narcissus Hotel',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    distance: '1 km from City Centre',
    rating: 5,
    ratingScore: 9.1,
    ratingLabel: 'Extraordinary',
    reviews: 876,
    price: 100,
    nights: '1 night, 2 adults',
    features: ['wifi', 'pool', 'breakfast']
  },
  {
    id: 2,
    name: 'Viva Hotel',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    distance: '1.2 km from City Centre',
    rating: 4,
    ratingScore: 7.5,
    ratingLabel: 'Good',
    reviews: 702,
    price: 98,
    nights: '1 night, 2 adults',
    features: ['wifi', 'gym', 'parking']
  },
  {
    id: 3,
    name: 'Lila Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    distance: '0.4 km from City Centre',
    rating: 5,
    ratingScore: 8.5,
    ratingLabel: 'Excellent',
    reviews: 600,
    price: 120,
    nights: '1 night, 2 adults',
    features: ['wifi', 'pool', 'ac']
  },
  {
    id: 4,
    name: 'Marin Hotel',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
    distance: '0.5 km from City Centre',
    rating: 5,
    ratingScore: 8.7,
    ratingLabel: 'Excellent',
    reviews: 702,
    price: 150,
    nights: '1 night, 2 adults',
    features: ['wifi', 'breakfast', 'pool']
  }
];

const featureIcons = {
  wifi: <Wifi size={12} />,
  pool: <Waves size={12} />,
  breakfast: <Coffee size={12} />,
  gym: <Dumbbell size={12} />,
  ac: <Wind size={12} />,
  parking: <MapPin size={12} />
};

export default function HotelListing() {
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div style={styles.container}>
      <SearchBar/>

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <div style={styles.filterHeader}>
            Filters
            <X size={16} style={{cursor: 'pointer', opacity: 0.5}} />
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>Price Range</div>
            <div style={styles.priceRange}>
              <div style={styles.priceChart}>
                {[25, 50, 70, 90, 100, 85, 70, 55, 40, 30, 20, 15, 10, 8, 5].map((height, i) => (
                  <div 
                    key={i} 
                    style={{...styles.chartBar, height: `${height}%`}}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  />
                ))}
              </div>
              <div style={styles.priceLabels}>
                <span>$40</span>
                <span>$500+</span>
              </div>
            </div>
            
            {[
              { label: 'Free Cancellation', count: 90 },
              { label: '5 Stars', count: 7 },
              { label: '4 Stars', count: 52 },
              { label: 'Book Without Card', count: 3 }
            ].map(item => (
              <label 
                key={item.label} 
                style={styles.checkbox}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f2f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input type="checkbox" style={styles.checkboxInput} />
                <span style={styles.checkboxLabel}>{item.label}</span>
                <span style={styles.count}>{item.count}</span>
              </label>
            ))}
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>Amenities</div>
            {[
              { label: 'Free WiFi', count: 103 },
              { label: 'Breakfast Included', count: 100 },
              { label: 'Pool', count: 48 },
              { label: 'Free Parking', count: 49 }
            ].map(item => (
              <label 
                key={item.label} 
                style={styles.checkbox}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f2f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input type="checkbox" style={styles.checkboxInput} />
                <span style={styles.checkboxLabel}>{item.label}</span>
                <span style={styles.count}>{item.count}</span>
              </label>
            ))}
            <span 
              style={styles.showMore}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Show More ↓
            </span>
          </div>
        </aside>

        <div style={styles.results}>
          <div style={styles.resultsHeader}>
            <div style={styles.sortBy}>
              Sort by:
              <select 
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
            <div style={styles.resultsCount}>322 Facilities Found</div>
          </div>

          {hotels.map(hotel => (
            <div 
              key={hotel.id} 
              style={{
                ...styles.hotelCard,
                transform: hoveredCard === hotel.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredCard === hotel.id ? '0 8px 20px rgba(44, 62, 80, 0.1)' : '0 4px 12px rgba(0,0,0,0.05)',
                borderColor: hoveredCard === hotel.id ? '#2c3e50' : '#e0e0e0'
              }}
              onMouseEnter={() => setHoveredCard(hotel.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.hotelCardInner}>
                <div style={styles.imageSection}>
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    style={{
                      ...styles.hotelImage,
                      transform: hoveredCard === hotel.id ? 'scale(1.05)' : 'scale(1)'
                    }} 
                  />
                  <button 
                    style={{
                      ...styles.heartButton,
                      transform: hoveredCard === hotel.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onClick={(e) => toggleFavorite(hotel.id, e)}
                  >
                    <Heart 
                      size={16} 
                      fill={favorites.has(hotel.id) ? '#e74c3c' : 'none'}
                      color={favorites.has(hotel.id) ? '#e74c3c' : '#7f8c8d'}
                    />
                  </button>
                </div>
                
                <div style={styles.contentSection}>
                  <div>
                    <div style={styles.hotelHeader}>
                      <div style={styles.hotelInfo}>
                        <h3 style={styles.hotelName}>{hotel.name}</h3>
                        <div style={styles.location}>
                          <MapPin size={14} />
                          {hotel.distance}
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.features}>
                      {hotel.features.map(feature => (
                        <div key={feature} style={styles.featureTag}>
                          {featureIcons[feature]}
                          {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </div>
                      ))}
                    </div>
                    
                    <div style={styles.rating}>
                      {[...Array(hotel.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f1c40f" color="#f1c40f" />
                      ))}
                    </div>
                    
                    <div style={styles.badges}>
                      <span style={styles.badge}>Hotel</span>
                      <span style={styles.badge}>All-Inclusive</span>
                    </div>
                  </div>

                  <div style={styles.hotelFooter}>
                    <div style={styles.reviewSection}>
                      <div style={styles.ratingScore}>{hotel.ratingScore}</div>
                      <div style={styles.reviewInfo}>
                        <div style={styles.ratingLabel}>{hotel.ratingLabel}</div>
                        <div style={styles.reviewCount}>{hotel.reviews} Reviews</div>
                      </div>
                    </div>
                    
                    <div style={styles.priceSection}>
                      <div style={styles.nights}>{hotel.nights}</div>
                      <div style={styles.price}>${hotel.price}</div>
                      <div style={styles.priceLabel}>Taxes included</div>
                      <button 
                        style={styles.viewButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(44, 62, 80, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 6px rgba(44, 62, 80, 0.2)';
                        }}
                      >
                        View Hotel <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}