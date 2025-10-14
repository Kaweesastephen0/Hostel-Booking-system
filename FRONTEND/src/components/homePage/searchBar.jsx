import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, X, ChevronDown } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [location, setLocation] = useState('Wandegeya');
  const [semester, setSemester] = useState('Semester');
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState('Single');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  
  const roomDropdownRef = useRef(null);
  const guestFieldRef = useRef(null);
  const semesterDropdownRef = useRef(null);
  const dateFieldRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close room dropdown
      if (roomDropdownRef.current && 
          !roomDropdownRef.current.contains(event.target) &&
          guestFieldRef.current && 
          !guestFieldRef.current.contains(event.target)) {
        setShowRoomDropdown(false);
      }

      // Close semester dropdown
      if (semesterDropdownRef.current && 
          !semesterDropdownRef.current.contains(event.target) &&
          dateFieldRef.current && 
          !dateFieldRef.current.contains(event.target)) {
        setShowSemesterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearLocation = () => {
    setLocation('');
  };

  const toggleRoomDropdown = () => {
    setShowRoomDropdown(!showRoomDropdown);
    setShowSemesterDropdown(false); // Close other dropdown
  };

  const toggleSemesterDropdown = () => {
    setShowSemesterDropdown(!showSemesterDropdown);
    setShowRoomDropdown(false); // Close other dropdown
  };

  const handleRoomChange = (operation) => {
    if (operation === 'increment') {
      setRooms(prev => prev + 1);
    } else if (operation === 'decrement' && rooms > 1) {
      setRooms(prev => prev - 1);
    }
  };

  const handleRoomTypeSelect = (type) => {
    setRoomType(type);
  };

  const handleSemesterSelect = (semesterOption) => {
    setSemester(semesterOption);
    setShowSemesterDropdown(false);
  };

  const handleApply = () => {
    setShowRoomDropdown(false);
  };

  // Semester options for student hostels
  const semesterOptions = [
    '1 Semester',
    '2 Semesters',
    'Semester holiday',
    
  ];

  const roomTypes = ['Single', 'Double', 'Shared Dorm'];

  const handleSearch = () => {
    const searchData = {
      location,
      semester,
      rooms,
      roomType
    };
    console.log('Searching for student hostels:', searchData);
    alert(`Searching for ${rooms} ${roomType} room(s) in ${location} for ${semester}`);
  };

  return (
    <div className={styles.searchContainer}>
      {/* Location Field */}
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
          <button 
            className={styles.clearBtn} 
            aria-label="Clear location"
            onClick={handleClearLocation}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Semester Field */}
      <div 
        className={`${styles.searchField} ${styles.dates}`}
        ref={dateFieldRef}
        onClick={toggleSemesterDropdown}
      >
        <Calendar className={styles.iconCalendar} size={20} />
        <div className={styles.inputWrapper}>
          <div className={styles.dateRange}>{semester}</div>
        </div>
        <ChevronDown 
          className={`${styles.dropdownIcon} ${showSemesterDropdown ? styles.rotated : ''}`} 
          size={20} 
        />

        {/* Semester Dropdown */}
        {showSemesterDropdown && (
          <div 
             ref={semesterDropdownRef}
          className={`${styles.semesterDropdown} ${showSemesterDropdown ? styles.active : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
            {semesterOptions.map((option, index) => (
              <div
                key={index}
                className={`${styles.semesterOption} ${semester === option ? styles.active : ''}`}
                onClick={() => handleSemesterSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Selection Field */}
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

        {/* Room Selection Dropdown */}
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
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button 
            className={styles.applyBtn}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>

      <button className={styles.searchBtn} onClick={handleSearch}>
        Find Hostels
      </button>
    </div>
  );
}
// 😉