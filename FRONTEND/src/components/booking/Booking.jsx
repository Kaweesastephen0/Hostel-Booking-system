import { useState, useEffect } from 'react';
import {
  User, Home, MapPin, Calendar, Clock,
  CreditCard, CheckCircle, ArrowLeft, ArrowRight, Mail, Phone,
  UserCircle, Bed, Smartphone
} from 'lucide-react';
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
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    checkIn: '',
    hostel: 'Main Hostel',
    roomNumber: '',
    roomType: 'Single',
    duration: '1',
    paymentMethod: 'bank',
    cardNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation between steps
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }
    if (currentStep === 1) {
      if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required';
    }
    if (currentStep === 2 && formData.paymentMethod === 'card' && !formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }
    setIsSubmitting(true);
    try {
      // Add your submission logic here
      console.log('Form submitted:', formData);
      nextStep();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price in UGX
  const calculateTotal = () => {
    // Convert prices to UGX (assuming 1 USD = 3800 UGX as an example rate)
    const pricePerNightUGX = formData.roomType === 'Single' ? 2500 * 3800 :
      formData.roomType === 'Double' ? 4500 * 3800 : 1500 * 3800;
    const total = pricePerNightUGX * (parseInt(formData.duration) || 0);
    return total.toLocaleString('en-US');
  };
  
  // Get price per night in UGX for display
  const getPricePerNight = () => {
    return formData.roomType === 'Single' ? '9,500,000' :
      formData.roomType === 'Double' ? '17,100,000' : '5,700,000';
  };

  // Set background image based on current step
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

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Details
        return (
          <div className={styles.formSection}>
            <h2>Personal Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <div className={styles.inputWithIcon}>
                <UserCircle size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.fullName ? styles.errorInput : ''}`}
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWithIcon}>
                <Mail size={20} className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <div className={styles.inputWithIcon}>
                <Phone size={20} className={styles.inputIcon} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.phone ? styles.errorInput : ''}`}
                  placeholder="+254 700 000000"
                />
              </div>
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>
          </div>
        );
      case 1: // Accommodation
        return (
          <div className={styles.formSection}>
            <h2>Accommodation Details</h2>
            <div className={styles.formGroup}>
              <label>Room Type</label>
              <div className={styles.roomOptions}>
                {['Single', 'Double'].map((type) => (
                  <label key={type} className={styles.roomOption}>
                    <input
                      type="radio"
                      name="roomType"
                      value={type}
                      checked={formData.roomType === type}
                      onChange={handleChange}
                    />
                    <span>
                      <Bed size={20} className={styles.optionIcon} />
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hostel">Select Hostel</label>
              <div className={styles.inputWithIcon}>
                <Home size={20} className={styles.inputIcon} />
                <select
                  id="hostel"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className={styles.formInput}
                >
                  <option value="Main Hostel">Main Hostel</option>
                  <option value="North Wing">North Wing</option>
                  <option value="South Wing">South Wing</option>
                  <option value="East Wing">East Wing</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="roomNumber">Room Number</label>
              <div className={styles.inputWithIcon}>
                <Home size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g., 101A"
                  className={`${styles.formInput} ${errors.roomNumber ? styles.errorInput : ''}`}
                />
              </div>
              {errors.roomNumber && <span className={styles.error}>{errors.roomNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="checkIn">Check-in Date</label>
              <div className={styles.inputWithIcon}>
                <Calendar size={20} className={styles.inputIcon} />
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${styles.formInput} ${errors.checkIn ? styles.errorInput : ''}`}
                />
              </div>
              {errors.checkIn && <span className={styles.error}>{errors.checkIn}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration">Duration (Nights)</label>
              <div className={styles.inputWithIcon}>
                <Clock size={20} className={styles.inputIcon} />
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.duration ? styles.errorInput : ''}`}
                />
              </div>
              {errors.duration && <span className={styles.error}>{errors.duration}</span>}
            </div>
          </div>
        );
      case 2: // Payment
        return (
          <div className={styles.formSection}>
            <h2>Payment Information</h2>
            
            <div className={styles.paymentMethods}>
              <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'bank' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                />
                <div className={styles.paymentDetails}>
                  <span><CreditCard size={18} className={styles.paymentIcon} /> Bank Transfer</span>
                  <small>Make payment via bank transfer</small>
                </div>
              </label>

              <label className={`${styles.paymentMethod} ${formData.paymentMethod === 'card' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <div className={styles.paymentDetails}>
                  <span><CreditCard size={18} className={styles.paymentIcon} /> Credit/Debit Card</span>
                  <small>Pay with your Visa/Mastercard</small>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <div className={styles.inputWithIcon}>
                  <CreditCard size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={`${styles.formInput} ${errors.cardNumber ? styles.errorInput : ''}`}
                  />
                  <img 
                    src="/visa-mastercard.png" 
                    alt="Visa/Mastercard" 
                    className={styles.cardLogo}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
              </div>
            )}

            <div className={styles.bankDetails}>
              <h4>Bank Transfer Details</h4>
              <div className={styles.bankInfo}>
                <p><strong>Bank Name:</strong> Centenary Bank Uganda</p>
                <p><strong>Account Name:</strong> Hostel Booking System</p>
                <p><strong>Account Number:</strong> 3100000000000</p>
                <p><strong>Swift Code:</strong> CBUGUGKA</p>
                <p><strong>Branch:</strong> Kampala Road</p>
              </div>
              <div className={styles.note}>
                <p>Please include your full name as the payment reference. Your booking will be confirmed once payment is received.</p>
              </div>
            </div>
          </div>
        );
      case 3: // Confirmation
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
                <strong>BKG-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Name:</span>
                <strong>{formData.fullName}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Room Type:</span>
                <strong>{formData.roomType} Room</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Check-in:</span>
                <strong>{formData.checkIn || 'Not specified'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Duration:</span>
                <strong>{formData.duration} night{formData.duration !== '1' ? 's' : ''}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Total Amount:</span>
                <strong>Ksh {calculateTotal()}</strong>
              </div>
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
        <div className={styles.formContainer}>
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
              type="button"
              onClick={handleSubmit}
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
              type="button"
              onClick={() => setCurrentStep(0)}
              className={styles.primaryButton}
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;