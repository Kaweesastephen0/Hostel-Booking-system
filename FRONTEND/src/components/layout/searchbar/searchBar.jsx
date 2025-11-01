import { useState, useRef, useEffect } from 'react';
import { MapPin, GraduationCap, Users, X, ChevronDown } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('Makerere');
  const [university, setUniversity] = useState('University');
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState('single');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const roomDropdownRef = useRef(null);
  const guestFieldRef = useRef(null);
  const universityDropdownRef = useRef(null);
  const dateFieldRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomDropdownRef.current && 
          !roomDropdownRef.current.contains(event.target) &&
          guestFieldRef.current && 
          !guestFieldRef.current.contains(event.target)) {
        setShowRoomDropdown(false);
      }

      if (universityDropdownRef.current && 
          !universityDropdownRef.current.contains(event.target) &&
          dateFieldRef.current && 
          !dateFieldRef.current.contains(event.target)) {
        setShowUniversityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearLocation = () => setLocation('');
  const toggleRoomDropdown = () => {
    setShowRoomDropdown(!showRoomDropdown);
    setShowUniversityDropdown(false);
  };
  const toggleUniversityDropdown = () => {
    setShowUniversityDropdown(!showUniversityDropdown);
    setShowRoomDropdown(false);
  };

  const handleRoomChange = (operation) => {
    if (operation === 'increment') {
      setRooms(prev => prev + 1);
    } else if (operation === 'decrement' && rooms > 1) {
      setRooms(prev => prev - 1);
    }
  };

  const handleRoomTypeSelect = (type) => setRoomType(type);
  const handleUniversitySelect = (uni) => {
    setUniversity(uni);
    setShowUniversityDropdown(false);
  };
  const handleApply = () => setShowRoomDropdown(false);

  const universityOptions = [
    'Makerere University', 'Victoria University', 'Isibati University',
    'Muteesa 1 Royal University', 'UCU', 'IUIU', 'MUBS', 'KIU'
  ];

  const roomTypes = ['single', 'double', 'shared dorm'];

  const handleSearch = async () => {
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    setIsSearching(true);
    
    // Call parent's onSearch callback
    if (onSearch) {
      await onSearch(location, roomType);
    }
    
    setIsSearching(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={`${styles.searchField} ${styles.location}`}>
        <MapPin className={styles.icon} size={20} />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter campus location..."
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

      <div 
        className={`${styles.searchField} ${styles.dates}`}
        ref={dateFieldRef}
        onClick={toggleUniversityDropdown}
      >
        <GraduationCap className={styles.iconCalendar} size={20} /> 
        <div className={styles.inputWrapper}>
          <div className={styles.dateRange}>{university}</div>
        </div>
        <ChevronDown 
          className={`${styles.dropdownIcon} ${showUniversityDropdown ? styles.rotated : ''}`} 
          size={20} 
        />

        {showUniversityDropdown && (
          <div 
            ref={universityDropdownRef}
            className={`${styles.semesterDropdown} ${showUniversityDropdown ? styles.active : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {universityOptions.map((option, index) => (
              <button
                key={index}
                className={`${styles.semesterOption} ${university === option ? styles.active : ''}`}
                onClick={() => handleUniversitySelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        className={`${styles.searchField} ${styles.guests}`}
        ref={guestFieldRef}
        onClick={toggleRoomDropdown}
      >
        <Users className={styles.iconUsers} size={20} />
        <div className={styles.inputWrapper}>
          <div className={styles.guestInfo}>
            {rooms} {roomType} room{rooms > 1 ? 's' : ''}
          </div>
        </div>
        <ChevronDown 
          className={`${styles.dropdownIcon} ${showRoomDropdown ? styles.rotated : ''}`} 
          size={20} 
        />

        <div 
          ref={roomDropdownRef}
          className={`${styles.dropdown} ${showRoomDropdown ? styles.active : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.dropdownSection}>
            <h4>Number of Rooms</h4>
            <div className={styles.counter}>
              <button 
                className={styles.counterBtn}
                onClick={() => handleRoomChange('decrement')}
                disabled={rooms <= 1}
              >
                -
              </button>
              <span className={styles.counterValue}>{rooms}</span>
              <button 
                className={styles.counterBtn}
                onClick={() => handleRoomChange('increment')}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.dropdownSection}>
            <h4>Room Type</h4>
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

          <button className={styles.applyBtn} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>

      <button 
        className={styles.searchBtn} 
        onClick={handleSearch}
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Find Hostels'}
      </button>
    </div>
  );
}