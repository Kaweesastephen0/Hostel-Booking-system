import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  User, Home, MapPin, Calendar, Clock,
  CreditCard, CheckCircle, ArrowLeft, ArrowRight, Mail, Phone,
  UserCircle, Bed, Smartphone
} from 'lucide-react';
import Swal from 'sweetalert2';
import styles from './Booking.module.css';

const steps = [
  {
    id: 'personal',
    title: 'Personal Details',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'accommodation',
    title: 'Accommodation',
    bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'payment',
    title: 'Payment',
    bgImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    bgImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
];

const Booking = () => {
  // Helper function to safely access room properties with fallbacks
  const getRoomProperty = (property, defaultValue = '') => {
    if (!roomDetails) return formData[property] || defaultValue;
    
    // Handle nested properties
    if (property === 'hostel') {
      return roomDetails.hostelId?.name || roomDetails.hostelName || formData.hostel || defaultValue;
    }
    
    // Handle direct properties with fallback to formData
    return roomDetails[property] !== undefined ? roomDetails[property] : (formData[property] || defaultValue);
  };

  // Calculate price with discount for long stays
  const calculateRoomPrice = (months) => {
    const basePrice = parseFloat(roomDetails?.price) || 0;
    if (!basePrice) return 0;
    
    let price = basePrice * months;
    
    // Apply 10% discount for 12-month stays
    if (months === 12) {
      price *= 0.9;
    }
    
    return Math.round(price);
  };

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    idNumber: '',
    checkIn: '',
    hostel: '',
    roomNumber: '',
    roomType: '',
    duration: '1',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const navigate = useNavigate();

  // Function to fetch room details by ID
  const fetchRoomDetails = async (roomId) => {
    if (!roomId) {
      console.warn('No room ID provided to fetchRoomDetails');
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user data from localStorage or sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData') || sessionStorage.getItem('userData') || '{}');
      const token = userData?.token;

      if (!token) {
        // Save the current URL to redirect back after login
        const returnUrl = `/booking?roomId=${roomId}`;
        sessionStorage.setItem('returnUrl', returnUrl);
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies in the request
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, clear user data and redirect to login
          sessionStorage.removeItem('userData');
          sessionStorage.removeItem('userData');
          const returnUrl = `/booking?roomId=${roomId}`;
          sessionStorage.setItem('returnUrl', returnUrl);
          navigate('/login');
          return;
        }
        throw new Error(`Failed to fetch room details: ${response.statusText}`);
      }

      const roomData = await response.json();
      
      if (!roomData) {
        throw new Error('No data received from server');
      }

      if (roomData.success && roomData.data) {
        const room = roomData.data;
        setRoomDetails(room);

        // Format room type for display
        const formatRoomType = (type) => {
          if (!type) return '';
          return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };

        // Set default check-in date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];

        setFormData(prev => ({
          ...prev,
          roomNumber: room.roomNumber || '',
          roomType: formatRoomType(room.roomType) || '',
          hostel: room.hostelId?.name || room.hostelName || '',
          duration: room.minimumStay?.toString() || prev.duration || '1',
          // Set default check-in date to tomorrow if not already set
          checkIn: prev.checkIn || formattedDate,
          // Set price if available
          price: room.price?.toString() || prev.price || ''
        }));

        // Update URL to include roomId for page refresh
        const url = new URL(window.location);
        url.searchParams.set('roomId', roomId);
        window.history.pushState({}, '', url);
      } else {
        throw new Error(roomData.message || 'Failed to load room details');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        await showError('Network error. Please check your internet connection and try again.');
        return;
      }
      
      // Handle authentication errors
      if (error.message === 'Authentication required' || error.message.includes('401')) {
        // Clear any stale auth data
     
        sessionStorage.removeItem('userData');
        
        // Set return URL for after login
        const returnUrl = window.location.pathname + window.location.search;
        sessionStorage.setItem('returnUrl', returnUrl);
        
        // Redirect to login
        navigate('/login');
        return;
      }
      
      // Handle other errors
      const errorMessage = error.message || 'Failed to load room details. Please try again.';
      await showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill user details from session/local storage and handle room data loading
  useEffect(() => {
    const initializeBooking = async () => {
      const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || '{}');
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get('roomId');
      const stateRoomId = window.history.state?.state?.roomId;
      const finalRoomId = roomId || stateRoomId;

      if (!userData?.token) {
        // If no user is logged in, redirect to login with return URL
        const returnUrl = window.location.pathname + (finalRoomId ? `?roomId=${finalRoomId}` : '');
        sessionStorage.setItem('returnUrl', returnUrl);
        navigate('/login');
        return;
      }

      // If we have a room ID, fetch room details
      if (finalRoomId) {
        try {
          await fetchRoomDetails(finalRoomId);
        } catch (error) {
          console.error('Error loading room details:', error);
          // Don't redirect here to prevent loops - the error is already handled in fetchRoomDetails
          return;
        }
      } else {
        // If no room ID is provided, we might want to redirect to room selection
        // or show an error, depending on your application's flow
        console.warn('No room ID provided in URL or state');
      }

      // Update form data with user information
      setFormData(prev => ({
        ...prev,
        fullName: `${userData.firstName || ''} ${userData.surname || ''}`.trim(),
        email: userData.email || '',
        phone: userData.phone || '',
        idNumber: userData.studentNumber || userData.idNumber || userData.studentId || '',
        gender: userData.gender?.toLowerCase() || '',
        checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0]
      }));
    };

    initializeBooking();
  }, []);

  // Watch for URL parameter changes and update room details
  useEffect(() => {
    const handleUrlChange = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get('roomId');
      
      if (roomId) {
        // Only fetch if we don't already have the room details or if the room ID has changed
        if (!roomDetails || roomDetails._id !== roomId) {
          try {
            await fetchRoomDetails(roomId);
          } catch (error) {
            console.error('Error in handleUrlChange:', error);
            // Show error to user but don't redirect to prevent loops
            await showError('Failed to load room details. Please try again.');
          }
        }
      } else if (roomDetails) {
        // If we have room details but no room ID in URL, update the URL
        const url = new URL(window.location);
        url.searchParams.set('roomId', roomDetails._id);
        window.history.replaceState({}, '', url);
      } else {
        // No room ID and no room details - this might be a direct booking URL
        console.warn('No room ID provided in URL');
        setIsLoading(false);
      }
    };

    // Initial load
    handleUrlChange();

    // Set up event listener for URL changes
    window.addEventListener('popstate', handleUrlChange);

    // Clean up
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [navigate]); // Add navigate to dependency array

  // Navigation between steps
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't update read-only fields
    const readOnlyFields = ['roomNumber', 'roomType', 'hostel', 'idNumber', 'gender'];
    if (roomDetails && readOnlyFields.includes(name)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate based on current step
    if (currentStep === 0) { // Personal Details
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone || !formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9+\-\s()]{10,20}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID/Student number is required';
    }
    else if (currentStep === 1) { // Accommodation
      if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required';
      if (!formData.duration) newErrors.duration = 'Please select duration';
    }
    else if (currentStep === 2) { // Payment
      // Card details validation
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      if (!formData.cardExpiry || !formData.cardExpiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        newErrors.cardExpiry = 'Valid expiry date (MM/YY) is required';
      }
      if (!formData.cardCvv || !formData.cardCvv.match(/^\d{3,4}$/)) {
        newErrors.cardCvv = 'Valid CVV is required';
      }
    }

const isValid = Object.keys(newErrors).length === 0;
setErrors(newErrors);
return isValid;
};

  // Helper function to show error messages using SweetAlert2
  const showError = async (message) => {
    return await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'OK'
    });
  };

  // Show success message using SweetAlert2
  const showSuccess = (message) => {
    return Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonColor: '#2563eb',
    });
  };

  // Calculate total price in UGX
  const calculateTotal = (includeBookingFee = true) => {
    try {
      let roomPrice = 0;
      let bookingFee = 50000; // Default booking fee

      if (roomDetails) {
        // Parse room price
        if (roomDetails.roomPrice) {
          roomPrice = typeof roomDetails.roomPrice === 'string'
            ? parseFloat(roomDetails.roomPrice.replace(/[^0-9.]/g, ''))
            : Number(roomDetails.roomPrice);
        }

        // Get booking fee from room details if available
        if (roomDetails.bookingFee) {
          bookingFee = typeof roomDetails.bookingFee === 'string'
            ? parseFloat(roomDetails.bookingFee.replace(/[^0-9.]/g, ''))
            : Number(roomDetails.bookingFee);
        }
      }

      // Calculate total based on room type and duration
      const duration = parseInt(formData.duration) || 1;
      let basePrice = 0;

      if (formData.roomType === 'Single') {
        basePrice = 950000;
      } else if (formData.roomType === 'Double') {
        basePrice = 1710000;
      } else {
        basePrice = 570000;
      }

      let total = basePrice * duration;

      if (includeBookingFee) {
        total += bookingFee;
      }

      return {
        amount: total,
        formatted: `UGX ${total.toLocaleString('en-US')}`,
        bookingFee: `UGX ${bookingFee.toLocaleString('en-US')}`,
        bookingFeeAmount: bookingFee,
        basePrice: basePrice,
        duration: duration,
        roomOnly: `UGX ${(basePrice * duration).toLocaleString('en-US')}`
      };
    } catch (error) {
      console.error('Error calculating total:', error);
      return {
        amount: 0,
        formatted: 'UGX 0',
        bookingFee: 'UGX 0',
        bookingFeeAmount: 0,
        error: error.message,
        roomOnly: 'UGX 0'
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      const firstError = Object.values(errors).find(error => error);
      if (firstError) {
        await showError(firstError);
      }
      return;
    }

    // If not on the final step, go to next step
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }

    // Only proceed with submission on the final step
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const token = Cookies.get('token');
      if (!token) {
        Cookies.set('returnUrl', window.location.pathname);
        navigate('/login');
        return;
      }

      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + (parseInt(formData.duration) || 1));

      const total = calculateTotal();

      const bookingData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        age: formData.age || 0,
        occupation: formData.occupation || '',
        idNumber: formData.idNumber,
        roomNumber: formData.roomNumber || roomDetails?.roomNumber || '',
        roomType: formData.roomType || roomDetails?.roomType || '',
        checkIn: checkInDate,
        duration: parseInt(formData.duration) || 1,
        bookingFee: total.bookingFeeAmount,
        paymentMethod: 'card',
        paymentNumber: formData.cardNumber.replace(/\s/g, '').slice(-4),
        status: 'pending',
        hostelName: formData.hostel || roomDetails?.hostelId?.name || 'Not specified',
        location: formData.location || 'Not specified',
        nights: Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        await showSuccess('Booking created successfully!');
        navigate('/bookings');
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        Cookies.remove('token');
        sessionStorage.setItem('returnUrl', window.location.pathname);
        navigate('/login');
      } else {
        await showError(error.response?.data?.message || error.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Changing background image based on current step
  useEffect(() => {
    document.body.style.backgroundImage = `url(${steps[currentStep].bgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.transition = 'background-image 0.5s ease-in-out';
    document.body.style.paddingTop = '80px';
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.paddingTop = '';
    };
  }, [currentStep]);

  // Helper function to render form field with read-only state when needed
  const renderFormField = (field) => {
    // List of fields that should be auto-filled and disabled
    const autoFilledFields = ['roomNumber', 'roomType', 'hostel', 'idNumber', 'gender'];
    const isReadOnly = roomDetails && autoFilledFields.includes(field.name);
    const inputProps = {
      type: field.type || 'text',
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: handleChange,
      className: `${styles.formInput} ${errors[field.name] ? styles.errorInput : ''} ${isReadOnly ? styles.readOnlyInput : ''}`,
      placeholder: field.placeholder || '',
      readOnly: isReadOnly,
      disabled: isReadOnly,
      style: isReadOnly ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}
    };

    return (
      <div className={styles.formGroup} key={field.name}>
        <label htmlFor={field.name}>{field.label}</label>
        <div className={styles.inputContainer}>
          <input {...inputProps} />
          {field.icon && field.icon}
        </div>
        {errors[field.name] && <span className={styles.error}>{errors[field.name]}</span>}
      </div>
    );
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Details
        return (
          <div className={styles.formSection}>
            <h2>Personal Information</h2>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <div className={styles.inputWithIcon}>
                <User size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <div className={styles.inputWithIcon}>
                <Mail size={20} className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <div className={styles.inputWithIcon}>
                <Smartphone size={20} className={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <div className={styles.inputWithIcon}>
                <UserCircle size={20} className={styles.inputIcon} />
                <select
                  name="gender"
                  value={formData.gender}
                  disabled
                  className={styles.readOnlyInput}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>ID/Student Number</label>
              <div className={styles.inputWithIcon}>
                <CreditCard size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.note}>
              <p>Note: To update your personal information, please go to your profile settings.</p>
            </div>
          </div>
        );
      case 1: // Accommodation
        return (
          <div className={styles.formSection}>
            <h2>Accommodation Details</h2>
            
            {roomDetails && (
              <div className={styles.roomDetails}>
                <div className={styles.roomImageContainer}>
                  {roomDetails.images?.[0] ? (
                    <img 
                      src={roomDetails.images[0]} 
                      alt={`${roomDetails.roomType} room`} 
                      className={styles.roomImage}
                    />
                  ) : (
                    <div className={styles.roomImagePlaceholder}>
                      <Bed size={48} className={styles.roomIcon} />
                    </div>
                  )}
                </div>
                
                <div className={styles.roomInfo}>
                  <h3>{roomDetails.hostelId?.name || formData.hostel}</h3>
                  
                  <div className={styles.roomSpecs}>
                    <div className={styles.specItem}>
                      <DoorOpen size={20} className={styles.specIcon} />
                      <span>Room {roomDetails.roomNumber || formData.roomNumber}</span>
                    </div>
                    <div className={styles.specItem}>
                      <Users size={20} className={styles.specIcon} />
                      <span>{roomDetails.capacity || 1} {roomDetails.capacity === 1 ? 'Person' : 'People'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <Bed size={20} className={styles.specIcon} />
                      <span>{formData.roomType || roomDetails.roomType}</span>
                    </div>
                    {roomDetails.amenities?.length > 0 && (
                      <div className={styles.amenities}>
                        <span className={styles.amenitiesLabel}>Amenities:</span>
                        <div className={styles.amenitiesList}>
                          {roomDetails.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className={styles.amenityTag}>{amenity}</span>
                          ))}
                          {roomDetails.amenities.length > 3 && (
                            <span className={styles.amenityMore}>+{roomDetails.amenities.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Hostel</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="hostel"
                  value={getRoomProperty('hostel')}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Room Type</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="roomType"
                  value={getRoomProperty('roomType')}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Room Number</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="roomNumber"
                  value={getRoomProperty('roomNumber')}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Check-in Date</label>
              <div className={styles.inputWithIcon}>
                <Calendar size={20} className={styles.inputIcon} />
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${styles.formInput} ${errors.checkIn ? styles.errorInput : ''}`}
                  required
                />
              </div>
              {errors.checkIn && <span className={styles.error}>{errors.checkIn}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={styles.formInput}
                required
              >
                <option value="">Select duration</option>
                <option value="1">1 Month - UGX {roomDetails?.price?.toLocaleString() || ''}</option>
                <option value="4">4 Months - UGX {roomDetails?.price ? (roomDetails.price * 4).toLocaleString() : ''}</option>
                <option value="12">12 Months - UGX {roomDetails?.price ? calculateRoomPrice(12).toLocaleString() : ''} (10% off)</option>
              </select>
              {roomDetails?.minimumStay && (
                <div className={styles.note}>
                  Minimum stay: {roomDetails.minimumStay} {roomDetails.minimumStay === 1 ? 'month' : 'months'}
                </div>
              )}
            </div>
            
            <div className={styles.priceSummary}>
              <div className={styles.priceRow}>
                <span>Room Price ({formData.duration || '1'} {formData.duration === '1' ? 'Month' : 'Months'}):</span>
                <span>UGX {roomDetails?.price ? calculateRoomPrice(parseInt(formData.duration || 1)).toLocaleString() : '0'}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Booking Fee:</span>
                <span>UGX 50,000</span>
              </div>
              <div className={styles.priceTotal}>
                <span>Total:</span>
                <span>UGX {roomDetails?.price ? (calculateRoomPrice(parseInt(formData.duration || 1)) + 50000).toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>
        );
      case 2: // Payment
        return (
          <div className={styles.formSection}>
            <h2>Payment Information</h2>

            {roomDetails && (
              <div className={styles.paymentSummary}>
                <h3>Booking Summary</h3>
                <div className={styles.summaryItem}>
                  <span>Room Type:</span>
                  <span>{formData.roomType} Room</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Room Price ({formData.duration || '1'} {formData.duration === '1' ? 'Month' : 'Months'}):</span>
                  <span>UGX {calculateRoomPrice(parseInt(formData.duration || 1)).toLocaleString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Booking Fee:</span>
                  <span>UGX 50,000</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total Amount:</span>
                  <strong>UGX {(calculateRoomPrice(parseInt(formData.duration || 1)) + 50000).toLocaleString()}</strong>
                </div>
              </div>
            )}

            <div className={styles.paymentSection}>
              <h3>Card Details</h3>

              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <div className={styles.inputWithIcon}>
                  <CreditCard size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      // Format card number with spaces every 4 digits
                      const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                      handleChange({ target: { name: 'cardNumber', value: formatted.trim() } });
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={`${styles.formInput} ${errors.cardNumber ? styles.errorInput : ''}`}
                  />
                </div>
                {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`${styles.formInput} ${errors.cardName ? styles.errorInput : ''}`}
                />
                {errors.cardName && <span className={styles.error}>{errors.cardName}</span>}
              </div>

              <div className={styles.cardDetailsRow}>
                <div className={`${styles.formGroup} ${styles.expiryDate}`}>
                  <label htmlFor="cardExpiry">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={(e) => {
                      // Format as MM/YY
                      let value = e.target.value;
                      if (value.length === 2 && !value.includes('/')) {
                        value = value + '/';
                      }
                      if (value.length > 2) {
                        const [month, year] = value.split('/');
                        if (month && month.length === 2 && year && year.length < 3) {
                          value = `${month}/${year}`;
                        } else {
                          value = value.substring(0, 5);
                        }
                      } else {
                        value = value.substring(0, 2);
                      }
                      handleChange({ target: { name: 'cardExpiry', value } });
                    }}
                    placeholder="MM/YY"
                    className={`${styles.formInput} ${errors.cardExpiry ? styles.errorInput : ''}`}
                  />
                  {errors.cardExpiry && <span className={styles.error}>{errors.cardExpiry}</span>}
                </div>

                <div className={`${styles.formGroup} ${styles.cvv}`}>
                  <label htmlFor="cardCvv">CVV</label>
                  <div className={styles.inputWithIcon}>
                    <input
                      type="password"
                      id="cardCvv"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={(e) => {
                        // Limit to 3-4 digits
                        const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                        handleChange({ target: { name: 'cardCvv', value } });
                      }}
                      placeholder="123"
                      className={`${styles.formInput} ${errors.cardCvv ? styles.errorInput : ''}`}
                    />
                    <span className={styles.cvvHelp} title="3 or 4 digit code on the back of your card">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </span>
                  </div>
                  {errors.cardCvv && <span className={styles.error}>{errors.cardCvv}</span>}
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Confirmation
        const bookingReference = `BKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        const total = calculateTotal();

        return (
          <div className={styles.confirmation}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h3>Booking Confirmed!</h3>
            <p>
              Thank you for your booking! We've sent a confirmation to your email.
              Please check your inbox for details about your reservation.
            </p>

            <div className={styles.bookingDetails}>
              <h4>Booking Details</h4>
              <div className={styles.detailItem}>
                <span>Booking Reference:</span>
                <strong>{bookingReference}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Name:</span>
                <strong>{formData.fullName}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Hostel:</span>
                <strong>{formData.hostel || roomDetails?.hostelId?.name || 'Not specified'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Room Type:</span>
                <strong>{formData.roomType || roomDetails?.roomType || 'Not specified'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Room Number:</span>
                <strong>{formData.roomNumber || roomDetails?.roomNumber || 'Not assigned'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Check-in Date:</span>
                <strong>{formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                }) : 'Not specified'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Duration:</span>
                <strong>{formData.duration} {formData.duration === '1' ? 'semester' : 'semesters'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Room Total ({formData.duration} {formData.duration === '1' ? 'semester' : 'semesters'}):</span>
                <strong>{total.roomOnly}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Booking Fee:</span>
                <strong>{total.bookingFee}</strong>
              </div>
              <div className={`${styles.detailItem} ${styles.totalAmount}`}>
                <span>Total Amount:</span>
                <strong>{total.formatted}</strong>
              </div>
            </div>

            <div className={styles.buttonGroup} style={{ marginTop: '2rem', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={prevStep}
                className={styles.secondaryButton}
                style={{ padding: '0.75rem 2rem' }}
              >
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Payment
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingCard}>
        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${currentStep >= index ? styles.active : ''} ${currentStep === index ? styles.current : ''}`}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepTitle}>{step.title}</div>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formContent}>
            {renderStepContent(currentStep)}
          </div>

          {/* Navigation Buttons */}
          {currentStep < steps.length - 1 ? (
            <div className={styles.buttonGroup}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={styles.secondaryButton}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {currentStep === steps.length - 2 ? 'Complete Booking' : 'Continue'}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Booking;