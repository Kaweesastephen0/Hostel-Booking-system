import styles from './Booking.module.css'
import { useState } from 'react'
import {
  User, Users, Calendar, Briefcase, IdCard, Phone, Mail, MapPin, Home, Hash,
  Bed, Clock, CreditCard, DollarSign
} from 'lucide-react'
import hostelService from '../../services/hostelService'

const Booking = () => {
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false)

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
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus("");
    setLoading(true);

    try {
      // Fixed: Send the actual form data instead of hardcoded empty values
      const res = await hostelService.createBooking(form);
      
      setStatus(res.data.message);
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
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setStatus("Server error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.booking}>
      <h1 className={styles.title}>Make your Booking</h1>
      <div className={styles.form}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.pDetails}>
            <h1>Personal Details</h1>

            <div className={styles.details}>
              <div className={styles.p2}>
                <label htmlFor="fullName">Full Name (as on ID)</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    value={form.fullName} 
                    onChange={handleChange} 
                    placeholder="Enter your full name" 
                    required
                  />
                </div>

                <label htmlFor="gender">Gender</label>
                <div className={styles.inputWrapper}>
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
                </div>

                <label htmlFor="age">Age</label>
                <div className={styles.inputWrapper}>
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
                    required
                  />
                </div>
              </div>

              <div className={styles.p2}>
                <label htmlFor="occupation">Occupation (if not student)</label>
                <div className={styles.inputWrapper}>
                  <Briefcase className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="occupation" 
                    name="occupation" 
                    value={form.occupation} 
                    onChange={handleChange} 
                    placeholder="Enter occupation" 
                  />
                </div>

                <label htmlFor="idNumber">Institution ID or National ID</label>
                <div className={styles.inputWrapper}>
                  <IdCard className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="idNumber" 
                    name="idNumber" 
                    value={form.idNumber} 
                    onChange={handleChange} 
                    placeholder="Enter ID number" 
                    required
                  />
                </div>

                <label htmlFor="phone">Phone Number</label>
                <div className={styles.inputWrapper}>
                  <Phone className={styles.inputIcon} size={20} />
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    placeholder="Enter phone number" 
                    required
                  />
                </div>
              </div>

              <div className={styles.p2}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="Enter email address" 
                    required
                  />
                </div>

                <label htmlFor="location">Current Location</label>
                <div className={styles.inputWrapper}>
                  <MapPin className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="location" 
                    name="location" 
                    value={form.location} 
                    onChange={handleChange} 
                    placeholder="Enter current location" 
                    required
                  />
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
              </div>

              <div className={styles.p2}>
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

                <label htmlFor="duration">Duration of Stay</label>
                <div className={styles.inputWrapper}>
                  <Clock className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="duration" 
                    name="duration" 
                    value={form.duration} 
                    onChange={handleChange} 
                    placeholder="e.g., 1 semester, 6 months" 
                    required
                  />
                </div>
              </div>

              <div className={styles.p2}>
                <label htmlFor="checkIn">Check-in Date</label>
                <div className={styles.inputWrapper}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input 
                    type="date" 
                    id="checkIn" 
                    name="checkIn" 
                    value={form.checkIn} 
                    onChange={handleChange} 
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rDetails} style={{ borderLeft: "5px solid rgb(140, 66, 230)" }}>
            <h1>Payment Details</h1>
            <div className={styles.details}>
              <div className={styles.p2}>
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className={styles.inputWrapper}>
                  <CreditCard className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="paymentMethod" 
                    name="paymentMethod" 
                    value={form.paymentMethod} 
                    onChange={handleChange} 
                    placeholder="e.g., Credit Card, Bank Transfer" 
                    required
                  />
                </div>
              </div>

              <div className={styles.p2}>
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
              </div>

              <div className={styles.p2}>
                <label htmlFor="paymentNumber">Payment Number</label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    id="paymentNumber" 
                    name="paymentNumber" 
                    value={form.paymentNumber} 
                    onChange={handleChange} 
                    placeholder="Enter payment reference number" 
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            <CreditCard size={24} />
            {loading ? 'Submitting...' : 'Book Now'}
          </button>

          {status && (
            <p style={{ color: status.includes('error') ? 'red' : 'green' }}>
              {status}
            </p>
          )}
          {errors.length > 0 && (
            <ul className="text-red-500 list-disc list-inside">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  )
}

export default Booking