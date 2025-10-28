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
  mainContent: {
    padding: '80px 20px',
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
  roomDescription: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '8px',
    lineHeight: '1.5'
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
  bookingFee: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
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
        console.log('🔍 Fetching rooms for hostel:', hostelId);
        setLoading(true);
        
        const response = await fetch(`http://localhost:5000/api/rooms/hostel/${hostelId}`);
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 API Response:', result);
        
        if (result.success && Array.isArray(result.data)) {
          console.log('✅ Found rooms:', result.data.length);
          setRooms(result.data);
     
          // Set hostel info from first room
          if (result.data.length > 0 && result.data[0].hostelId) {
            setHostelInfo(result.data[0].hostelId);
            console.log('🏨 Hostel info:', result.data[0].hostelId);
          }
        } else {
          console.log('⚠️ No rooms found');
          setRooms([]);
        }
      } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hostelId) {
      fetchRooms();
    } else {
      console.error('❌ No hostelId in URL');
      setError('No hostel ID provided');
      setLoading(false);
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

  const getBookingFeeDisplay = (room) => {
    if (room.bookingPrice && room.bookingPrice > 0) {
      return (
        <div style={styles.bookingFee}>
          + UGX {room.bookingPrice.toLocaleString()} booking fee
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <div style={styles.filterHeader}>
            Filters
            <X size={16} style={{cursor: 'pointer', opacity: 0.5}} />
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>Room Type</div>
            {[
              { label: 'Single', count: rooms.filter(r => r.roomType === 'single').length },
              { label: 'Double', count: rooms.filter(r => r.roomType === 'double').length },
              { label: 'Shared', count: rooms.filter(r => r.roomType === 'shared').length }
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
            <div style={styles.filterTitle}>Gender</div>
            {[
              { label: 'Male', count: rooms.filter(r => r.roomGender === 'male').length },
              { label: 'Female', count: rooms.filter(r => r.roomGender === 'female').length },
              { label: 'Mixed', count: rooms.filter(r => r.roomGender === 'mixed').length }
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
              </select>
            </div>
            <div style={styles.resultsCount}>
              {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'} Found
            </div>
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
                      src={room.roomImage || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'} 
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
                            {room.roomNumber || 'Room N/A'}
                          </h3>
                          <div style={styles.hostelName}>
                            <MapPin size={14} />
                            {room.hostelId?.name || hostelInfo?.name || 'Hostel'}
                          </div>
                          {room.roomDescription && (
                            <div style={styles.roomDescription}>
                              {room.roomDescription}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={styles.features}>
                        <div style={styles.featureTag}>
                          <Users size={12} />
                          {room.maxOccupancy} {room.maxOccupancy === 1 ? 'Person' : 'People'}
                        </div>
                        <div style={styles.featureTag}>
                          <Bed size={12} />
                          {room.roomType ? room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1) : 'Standard'}
                        </div>
                      </div>
                      
                      <div style={styles.badges}>
                        <span style={styles.availabilityBadge}>Available</span>
                        <span style={styles.badge}>
                          {room.roomGender ? room.roomGender.charAt(0).toUpperCase() + room.roomGender.slice(1) : 'Mixed'}
                        </span>
                      </div>
                    </div>

                    <div style={styles.roomFooter}>
                      <div style={styles.roomDetails}>
                        <div style={styles.detailItem}>
                          <DoorOpen size={16} />
                          {room.roomNumber}
                        </div>
                      </div>
                      
                      <div style={styles.priceSection}>
                        <div style={styles.price}>
                          UGX {room.roomPrice ? room.roomPrice.toLocaleString() : '0'}
                        </div>
                        <div style={styles.priceLabel}>
                          /semester
                          {getBookingFeeDisplay(room)}
                        </div>
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
                          onClick={() => navigate(`/room/${room._id}`)}
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