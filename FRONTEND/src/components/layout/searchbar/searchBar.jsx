import { useState, useRef, useEffect } from 'react';
import { MapPin, Users, DollarSign, X, ChevronDown } from 'lucide-react';
import styles from './searchBar.module.css';

export default function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('');
  const [roomType, setRoomType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const roomDropdownRef = useRef(null);
  const roomFieldRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const priceFieldRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomDropdownRef.current && 
          !roomDropdownRef.current.contains(event.target) &&
          roomFieldRef.current && 
          !roomFieldRef.current.contains(event.target)) {
        setShowRoomDropdown(false);
      }

      if (priceDropdownRef.current && 
          !priceDropdownRef.current.contains(event.target) &&
          priceFieldRef.current && 
          !priceFieldRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearLocation = () => setLocation('');
  
  const toggleRoomDropdown = () => {
    setShowRoomDropdown(!showRoomDropdown);
    setShowPriceDropdown(false);
  };

  const togglePriceDropdown = () => {
    setShowPriceDropdown(!showPriceDropdown);
    setShowRoomDropdown(false);
  };

  const handleRoomTypeSelect = (type) => {
    setRoomType(type);
    setShowRoomDropdown(false);
  };

  const handleClearRoomType = () => {
    setRoomType('');
  };

  const handleApplyPrice = () => {
    setShowPriceDropdown(false);
  };

  const handleClearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const roomTypes = ['single', 'double', 'shared'];

  const handleSearch = async () => {
    // FLEXIBLE SEARCH: Check if at least one field has a value
    if (!location.trim() && !roomType && !minPrice && !maxPrice) {
      alert('Please enter at least one search criteria (location, room type, or price)');
      return;
    }

    setIsSearching(true);
    
    // Build search params object (only include fields that have values)
    const searchParams = {};
    if (location.trim()) searchParams.location = location;
    if (roomType) searchParams.roomType = roomType;
    if (minPrice) searchParams.minPrice = minPrice;
    if (maxPrice) searchParams.maxPrice = maxPrice;
    
    // Call parent's onSearch callback with flexible params
    if (onSearch) {
      await onSearch(searchParams);
    }
    
    setIsSearching(false);
  };

  // Display text for room type field
  const getRoomTypeDisplay = () => {
    if (!roomType) return 'Any room type';
    return `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} room`;
  };

  // Display text for price field
  const getPriceDisplay = () => {
    if (!minPrice && !maxPrice) return 'Any price';
    if (minPrice && maxPrice) return `UGX ${Number(minPrice).toLocaleString()} - ${Number(maxPrice).toLocaleString()}`;
    if (minPrice) return `From UGX ${Number(minPrice).toLocaleString()}`;
    if (maxPrice) return `Up to UGX ${Number(maxPrice).toLocaleString()}`;
  };

  return (
    <div className={styles.searchContainer}>
      {/* LOCATION FIELD */}
      <div className={`${styles.searchField} ${styles.location}`}>
        <MapPin className={styles.icon} size={20} />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter location (Makerere, Kikoni, Katanga...)"
            className={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {location && (
          <button className={styles.clearBtn} onClick={handleClearLocation}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* ROOM TYPE FIELD */}
      <div 
        className={`${styles.searchField} ${styles.guests}`}
        ref={roomFieldRef}
        onClick={toggleRoomDropdown}
      >
        <Users className={styles.iconUsers} size={20} />
        <div className={styles.inputWrapper}>
          <div className={styles.guestInfo}>
            {getRoomTypeDisplay()}
          </div>
        </div>
        {roomType && (
          <button 
            className={styles.clearBtn} 
            onClick={(e) => {
              e.stopPropagation();
              handleClearRoomType();
            }}
          >
            <X size={16} />
          </button>
        )}
        <ChevronDown 
          className={`${styles.dropdownIcon} ${showRoomDropdown ? styles.rotated : ''}`} 
          size={20} 
        />

        {/* Room Type Dropdown */}
        <div 
          ref={roomDropdownRef}
          className={`${styles.dropdown} ${showRoomDropdown ? styles.active : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.dropdownSection}>
            <h4>Select Room Type</h4>
            <div className={styles.roomTypeOptions}>
              {roomTypes.map(type => (
                <button
                  key={type}
                  className={`${styles.roomTypeBtn} ${roomType === type ? styles.active : ''}`}
                  onClick={() => handleRoomTypeSelect(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRICE RANGE FIELD */}
      <div 
        className={`${styles.searchField} ${styles.price}`}
        ref={priceFieldRef}
        onClick={togglePriceDropdown}
      >
        <DollarSign className={styles.iconPrice} size={20} />
        <div className={styles.inputWrapper}>
          <div className={styles.priceInfo}>
            {getPriceDisplay()}
          </div>
        </div>
        {(minPrice || maxPrice) && (
          <button 
            className={styles.clearBtn} 
            onClick={(e) => {
              e.stopPropagation();
              handleClearPrice();
            }}
          >
            <X size={16} />
          </button>
        )}
        <ChevronDown 
          className={`${styles.dropdownIcon} ${showPriceDropdown ? styles.rotated : ''}`} 
          size={20} 
        />

        {/* Price Dropdown */}
        <div 
          ref={priceDropdownRef}
          className={`${styles.dropdown} ${showPriceDropdown ? styles.active : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.dropdownSection}>
            <h4>Price Range (UGX)</h4>
            
            <div className={styles.priceInputGroup}>
              <div className={styles.priceInput}>
                <label>Min Price</label>
                <input
                  type="number"
                  placeholder="400,000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={styles.priceField}
                />
              </div>
              
              <div className={styles.priceInput}>
                <label>Max Price</label>
                <input
                  type="number"
                  placeholder="1,800,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={styles.priceField}
                />
              </div>
            </div>

            <button className={styles.applyBtn} onClick={handleApplyPrice}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <button 
        className={styles.searchBtn} 
        onClick={handleSearch}
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
