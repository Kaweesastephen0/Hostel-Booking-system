import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, ChevronRight, Search, X, Wifi, Coffee, Waves, Dumbbell, Wind, Users, Bed, DoorOpen } from 'lucide-react';

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '0',
    color: '#1a1a1a'
  },
  topBar: {
    background: '#1e3a8a',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  heroSection: {
    padding: '60px 20px 40px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: '#ffffff',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '12px'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#e0e7ff',
    marginBottom: '0',
    fontWeight: '400'
  },
  mainContent: {
    padding: '30px 20px',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sidebar: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '100px',
    height: 'fit-content'
  },
  filterHeader: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterSection: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb'
  },
  filterTitle: {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1e3a8a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  priceRange: {
    padding: '15px',
    background: '#eff6ff',
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
    background: '#3b82f6',
    borderRadius: '2px 2px 0 0',
    minHeight: '4px',
    transition: 'all 0.3s ease'
  },
  priceLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e3a8a'
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
    accentColor: '#3b82f6'
  },
  checkboxLabel: {
    flex: 1,
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  },
  count: {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    background: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  resultsHeader: {
    background: '#ffffff',
    padding: '15px 20px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  sortBy: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e3a8a'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#ffffff'
  },
  resultsCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e3a8a'
  },
  roomCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '0',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e5e7eb'
  },
  roomCardInner: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '0'
  },
  imageSection: {
    position: 'relative',
    overflow: 'hidden',
    background: '#f3f4f6'
  },
  roomImage: {
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
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  roomInfo: {
    flex: 1
  },
  roomName: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#1e3a8a'
  },
  hostelName: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: '#6b7280',
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
    padding: '4px 10px',
    background: '#eff6ff',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#1e3a8a'
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },
  badge: {
    padding: '4px 10px',
    background: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280'
  },
  availabilityBadge: {
    padding: '4px 10px',
    background: '#dcfce7',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#166534'
  },
  roomFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb'
  },
  roomDetails: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500'
  },
  priceSection: {
    textAlign: 'right'
  },
  price: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a8a',
    lineHeight: 1
  },
  priceLabel: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '3px',
    marginBottom: '10px'
  },
  viewButton: {
    background: '#3b82f6',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#dc2626',
    background: '#fee2e2',
    borderRadius: '12px',
    margin: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '8px'
  },
  emptyStateText: {
    fontSize: '14px',
    color: '#6b7280'
  }
};

export default function RoomsList() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hostelInfo, setHostelInfo] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/rooms?hostelId=${hostelId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Filter rooms for this specific hostel
          const hostelRooms = result.data.filter(room => 
            room.hostelId?._id === hostelId || room.hostelId === hostelId
          );
          setRooms(hostelRooms);
          
          // Set hostel info from first room
          if (hostelRooms.length > 0 && hostelRooms[0].hostelId) {
            setHostelInfo(hostelRooms[0].hostelId);
          }
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hostelId) {
      fetchRooms();
    }
  }, [hostelId]);

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

  if (loading) {
    return (
      <div></div>
    );
  }

  if (error) {
    return (
      <div></div>
    );
  }

  return (
    <div style={styles.container}>
     

      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          {hostelInfo ? `${hostelInfo.name} - Available Rooms` : 'Available Rooms'}
        </h1>
        <p style={styles.heroSubtitle}>
          {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
        </p>
      </div>

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
                  />
                ))}
              </div>
              <div style={styles.priceLabels}>
                <span>UGX 200K</span>
                <span>UGX 1M+</span>
              </div>
            </div>
            
            {[
              { label: 'Available Now', count: rooms.filter(r => r.availability).length },
              { label: 'Single Rooms', count: rooms.filter(r => r.maxOccupancy === 1).length },
              { label: 'Shared Rooms', count: rooms.filter(r => r.maxOccupancy > 1).length }
            ].map(item => (
              <label 
                key={item.label} 
                style={styles.checkbox}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input type="checkbox" style={styles.checkboxInput} />
                <span style={styles.checkboxLabel}>{item.label}</span>
                <span style={styles.count}>{item.count}</span>
              </label>
            ))}
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>Room Type</div>
            {[
              { label: 'Single', count: rooms.filter(r => r.maxOccupancy === 1).length },
              { label: 'Double', count: rooms.filter(r => r.maxOccupancy === 2).length },
              { label: 'Triple+', count: rooms.filter(r => r.maxOccupancy >= 3).length }
            ].map(item => (
              <label 
                key={item.label} 
                style={styles.checkbox}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input type="checkbox" style={styles.checkboxInput} />
                <span style={styles.checkboxLabel}>{item.label}</span>
                <span style={styles.count}>{item.count}</span>
              </label>
            ))}
          </div>
        </aside>

        <div style={styles.results}>
          <div style={styles.resultsHeader}>
            <div style={styles.sortBy}>
              Sort by:
              <select 
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Availability</option>
              </select>
            </div>
            <div style={styles.resultsCount}>{rooms.length} Rooms Found</div>
          </div>

          {rooms.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateTitle}>No Rooms Available</div>
              <div style={styles.emptyStateText}>
                There are currently no rooms available for this hostel.
              </div>
            </div>
          ) : (
            rooms.map(room => (
              <div 
                key={room._id} 
                style={{
                  ...styles.roomCard,
                  transform: hoveredCard === room._id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === room._id ? '0 8px 20px rgba(59, 130, 246, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                  borderColor: hoveredCard === room._id ? '#3b82f6' : '#e5e7eb'
                }}
                onMouseEnter={() => setHoveredCard(room._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.roomCardInner}>
                  <div style={styles.imageSection}>
                    <img 
                      src={room.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'} 
                      alt={room.roomNumber || 'Room'} 
                      style={{
                        ...styles.roomImage,
                        transform: hoveredCard === room._id ? 'scale(1.05)' : 'scale(1)'
                      }} 
                    />
                    <button 
                      style={{
                        ...styles.heartButton,
                        transform: hoveredCard === room._id ? 'scale(1.1)' : 'scale(1)'
                      }}
                      onClick={(e) => toggleFavorite(room._id, e)}
                    >
                      <Heart 
                        size={16} 
                        fill={favorites.has(room._id) ? '#ef4444' : 'none'}
                        color={favorites.has(room._id) ? '#ef4444' : '#6b7280'}
                      />
                    </button>
                  </div>
                  
                  <div style={styles.contentSection}>
                    <div>
                      <div style={styles.roomHeader}>
                        <div style={styles.roomInfo}>
                          <h3 style={styles.roomName}>
                            Room {room.roomNumber || 'N/A'}
                          </h3>
                          <div style={styles.hostelName}>
                            <MapPin size={14} />
                            {room.hostelId?.name || 'Hostel'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={styles.features}>
                        <div style={styles.featureTag}>
                          <Users size={12} />
                          {room.maxOccupancy} {room.maxOccupancy === 1 ? 'Person' : 'People'}
                        </div>
                        <div style={styles.featureTag}>
                          <Bed size={12} />
                          {room.roomType || 'Standard'}
                        </div>
                      </div>
                      
                      <div style={styles.badges}>
                        {room.availability && (
                          <span style={styles.availabilityBadge}>Available</span>
                        )}
                        <span style={styles.badge}>
                          {room.hostelId?.HostelGender || 'Mixed'}
                        </span>
                      </div>
                    </div>

                    <div style={styles.roomFooter}>
                      <div style={styles.roomDetails}>
                        <div style={styles.detailItem}>
                          <DoorOpen size={16} />
                          Room {room.roomNumber}
                        </div>
                      </div>
                      
                      <div style={styles.priceSection}>
                        <div style={styles.price}>
                          UGX {room.price ? room.price.toLocaleString() : '0'}
                        </div>
                        <div style={styles.priceLabel}>/semester</div>
                        <button 
                          style={styles.viewButton}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                            e.target.style.background = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.3)';
                            e.target.style.background = '#3b82f6';
                          }}
                        >
                          Book Room <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}