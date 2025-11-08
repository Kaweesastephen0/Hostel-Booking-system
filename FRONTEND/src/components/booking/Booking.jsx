import styles from './Booking.module.css'
import { useState, useEffect } from 'react'
import {
  User, Users, Calendar, Briefcase, IdCard, Phone, Mail, MapPin, Home, Hash,
  Bed, Clock, CreditCard, DollarSign, AlertCircle, Loader
} from 'lucide-react'
import hostelService from '../../services/hostelService';
import Swal from "sweetalert2";

const Booking = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Add any initial data loading here
        // For example: await hostelService.getInitialData();
        setPageLoading(false);
      } catch (error) {
        console.error('Error loading page:', error);
        setFormErrors({ general: 'Failed to load page data' });
        setPageLoading(false);
      }
    };

    initializePage();
  }, []);

  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    age: '',
    occupation: '',
    idNumber: '',
    phone: '',
    email: '',
    location: '',
    hostelName: 'Hostel name',
    roomNumber: '001',
    roomType: 'Double',
    duration: '',
    checkIn: '',
    paymentMethod: '',
    bookingFee: 50000,
    paymentNumber: ''
  });

  // Real-time validation on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Perform validation for the changed field
    validateField(name, value);
  };

  // Validate a single field
  const validateField = (name, value) => {
    const newErrors = { ...fieldErrors };

    // Clear previous error for this field
    delete newErrors[name];

    if (!value && !['occupation'].includes(name)) {
      setFieldErrors(newErrors);
      return;
    }

    // Field-specific validation
    switch (name) {
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!/^[0-9\-+()\s]+$/.test(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else if (value.replace(/\D/g, '').length < 10) {
          newErrors.phone = 'Phone number is too short';
        }
        break;
      case 'age':
        if (isNaN(value) || value < 1 || value > 100) {
          newErrors.age = 'Please enter a valid age (1-100)';
        }
        break;
      case 'duration':
        if (isNaN(value) || value < 1) {
          newErrors.duration = 'Duration must be at least 1 day';
        }
        break;
      case 'paymentNumber':
        if (!/^\d+$/.test(value)) {
          newErrors.paymentNumber = 'Please enter a valid number';
        } else if (value.length < 10) {
          newErrors.paymentNumber = 'Number is too short';
        }
        break;
      default:
        break;
    }

    setFieldErrors(newErrors);
  };

  // Check if a field is valid (has no errors and has a value)
  const isFieldValid = (name, value = form[name]) => {
    if (!value) return false;

    // Skip validation for optional fields
    if (name === 'occupation') return true;

    // Check if the field has any validation errors
    if (fieldErrors[name]) return false;

    // Additional checks for specific fields
    switch (name) {
      case 'email':
        return /^\S+@\S+\.\S+$/.test(value);
      case 'phone':
        return /^[0-9\-+()\s]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
      case 'age':
        const age = parseInt(value, 10);
        return !isNaN(age) && age >= 1 && age <= 100;
      case 'duration':
        return !isNaN(value) && value >= 1;
      case 'paymentNumber':
        return /^\d+$/.test(value) && value.length >= 10;
      default:
        return true;
    }
  };

  // Get the appropriate input class based on validation state
  const getInputClass = (name, value = form[name]) => {
    if (!value) return '';
    return isFieldValid(name, value) ? 'valid' : fieldErrors[name] ? 'error' : '';
  };

  // Form submission validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      'fullName', 'gender', 'age', 'idNumber', 'phone', 'email',
      'location', 'duration', 'checkIn', 'paymentMethod', 'paymentNumber'
    ];

    requiredFields.forEach(field => {
      if (!form[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        isValid = false;
      } else if (!isFieldValid(field)) {
        // If field has a value but fails validation
        isValid = false;
      }
    });

    // Check-in date validation
    if (form.checkIn) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = new Date(form.checkIn);
      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
        isValid = false;
      }
    }

    setFieldErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setFieldErrors({});
    setFormErrors({});

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      const res = await hostelService.createBooking(form);

      // Show success message
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking Successful!",
        text: `Your booking has been confirmed. Reference: ${res.booking?.id || ''}`,
        showConfirmButton: true,
        timer: 5000
      });

      // Reset form on successful submission
      setForm({
        fullName: '',
        gender: '',
        age: '',
        occupation: '',
        idNumber: '',
        phone: '',
        email: '',
        location: '',
        hostelName: 'Hostel name',
        roomNumber: '001',
        roomType: 'Double',
        duration: '',
        checkIn: '',
        paymentMethod: '',
        bookingFee: 50000,
        paymentNumber: ''
      });

      setStatus('Booking created successfully!');
    } catch (err) {
      // Handle field-specific errors
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);

        // Show general error message if there are form-level errors
        if (err.response.data.message) {
          setFormErrors({ general: err.response.data.message });

          Swal.fire({
            position: "top-end",
            icon: "error",
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 3000
          });
        }
      } else {
        // Handle other errors
        setFormErrors({
          general: err.message || 'An error occurred. Please try again.'
        });

        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred. Please try again.",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.loadingSpinner} size={40} />
        <p>Loading booking form...</p>
      </div>
    );
  }

  return (
    <div className={styles.booking}>
      <h1 className={styles.title}>Make your Booking</h1>
      <div className={styles.form}>

        {formErrors.general && (
          <div className={styles.formError}>
            <AlertCircle size={18} />
            <span>{formErrors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.pDetails}>
            <h1>Personal Details</h1>

            <div className={styles.details}>
              <div className={styles.p2}>
                <label htmlFor="fullName">Full Name (as on ID)</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.fullName ? 'error' : ''}`}>
                  <User className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${getInputClass('fullName')}`}
                    required
                  />
                  {fieldErrors.fullName && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.fullName}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="gender">Gender</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.gender ? 'error' : ''}`}>
                  <Users className={styles.inputIcon} size={20} />
                  <select
                    name="gender"
                    id="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>

                  </select>
                  {fieldErrors.gender && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.gender}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="age">Age</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.age ? 'error' : ''}`}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    min="1"
                    max="100"
                    className={`${getInputClass('age')}`}
                    required
                  />
                  {fieldErrors.age && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.age}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="idNumber">ID/Passport Number</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.idNumber ? 'error' : ''}`}>
                  <IdCard className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={form.idNumber}
                    onChange={handleChange}
                    placeholder="Enter your ID/Passport number"
                    className={`${getInputClass('idNumber')}`}
                    required
                  />
                  {fieldErrors.idNumber && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.idNumber}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="phone">Phone Number</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.phone ? 'error' : ''}`}>
                  <Phone className={styles.inputIcon} size={20} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`${getInputClass('phone')}`}
                    required
                  />
                  {fieldErrors.phone && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.phone}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="email">Email Address</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.email ? 'error' : ''}`}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`${getInputClass('email')}`}
                    required
                  />
                  {fieldErrors.email && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="occupation">Occupation (Optional)</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.occupation ? 'error' : ''}`}>
                  <Briefcase className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    placeholder="Enter your occupation"
                    className={`${getInputClass('occupation')}`}
                  />
                  {fieldErrors.occupation && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.occupation}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="location">Current Location</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.location ? 'error' : ''}`}>
                  <MapPin className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Enter current location"
                    className={`${getInputClass('location')}`}
                    required
                  />
                  {fieldErrors.location && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rDetails}>
            <h1>Room Details</h1>
            <div className={styles.details}>
              <div className={styles.p2}>
                <label htmlFor="hostelName">Hostel Name</label>
                <div className={styles.inputWrapper}>
                  <Home className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="hostelName"
                    name="hostelName"
                    value={form.hostelName}
                    disabled
                  />
                </div>

                <label htmlFor="roomType">Room Type</label>
                <div className={styles.inputWrapper}>
                  <Bed className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="roomType"
                    name="roomType"
                    value={form.roomType}
                    disabled
                  />
                </div>

                <label htmlFor="roomNumber">Room Number</label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    value={form.roomNumber}
                    disabled
                  />
                </div>

                <label htmlFor="duration">Duration (days)</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.duration ? 'error' : ''}`}>
                  <Clock className={styles.inputIcon} size={20} />
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Enter duration in days"
                    min="1"
                    className={`${getInputClass('duration')}`}
                    required
                  />
                  {fieldErrors.duration && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.duration}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="checkIn">Check-in Date</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.checkIn ? 'error' : ''}`}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`${getInputClass('checkIn')}`}
                    required
                  />
                  {fieldErrors.checkIn && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.checkIn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rDetails} style={{ borderLeft: "5px solid rgb(140, 66, 230)" }}>
            <h1>Payment Details</h1>
            <div className={styles.details}>
              <div className={styles.p2}>
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.paymentMethod ? 'error' : ''}`}>
                  <CreditCard className={styles.inputIcon} size={20} />
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className={`${getInputClass('paymentMethod')}`}
                    required
                  >
                    <option value="">Select payment method</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                  {fieldErrors.paymentMethod && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.paymentMethod}</span>
                    </div>
                  )}
                </div>

                <label htmlFor="bookingFee">Booking Fee</label>
                <div className={styles.inputWrapper}>
                  <DollarSign className={styles.inputIcon} size={20} />
                  <input
                    type="number"
                    id="bookingFee"
                    name="bookingFee"
                    value={form.bookingFee}
                    disabled
                  />
                </div>

                <label htmlFor="paymentNumber">Payment Number/ Card Number</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.paymentNumber ? 'error' : ''}`}>
                  <Hash className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="paymentNumber"
                    name="paymentNumber"
                    value={form.paymentNumber}
                    onChange={handleChange}
                    placeholder="Enter card number"
                    className={`${getInputClass('paymentNumber')}`}
                    required
                  />
                  {fieldErrors.paymentNumber && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      <span>{fieldErrors.paymentNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            <CreditCard size={24} />
            {isSubmitting ? 'Processing...' : 'Complete Booking'}
          </button>

          {status && !formErrors.general && (
            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: status.includes('error') ? '#ef4444' : '#10b981',
              fontWeight: 500
            }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Booking