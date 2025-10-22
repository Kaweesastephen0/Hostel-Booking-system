import styles from './Booking.module.css'
import { 
  User, 
  Users, 
  Calendar, 
  Briefcase, 
  IdCard, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Hash, 
  Bed, 
  Clock, 
  CreditCard, 
  DollarSign 
} from 'lucide-react'
const Booking = () => {
  return (
    <div className={styles.booking} >
      <h1 className={styles.title}>Make your Booking</h1>
      <div className={styles.form}>
        <form action="" className={styles.form}>
          <div className={styles.pDetails}>

            <h1>Personal Details</h1>
             
          <div className={styles.details}>
            <div className={styles.p2}>
              <label htmlFor="fullName">Full Name (as on ID)</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input type="text" id="fullName" placeholder="Enter your full name" />
              </div>
              
              <label htmlFor="gender">Gender</label>
              <div className={styles.inputWrapper}>
                <Users className={styles.inputIcon} size={20} />
                <input type="text" id="gender" placeholder="Select gender" />
              </div>
              
              <label htmlFor="age">Age</label>
              <div className={styles.inputWrapper}>
                <Calendar className={styles.inputIcon} size={20} />
                <input type="number" id="age" placeholder="Enter your age" />
              </div>
            </div>
            
            <div className={styles.p2}>
              <label htmlFor="occupation">Occupation (if not student)</label>
              <div className={styles.inputWrapper}>
                <Briefcase className={styles.inputIcon} size={20} />
                <input type="text" id="occupation" placeholder="Enter occupation" />
              </div>
              
              <label htmlFor="idNumber">Institution ID or National ID</label>
              <div className={styles.inputWrapper}>
                <IdCard className={styles.inputIcon} size={20} />
                <input type="text" id="idNumber" placeholder="Enter ID number" />
              </div>
              
              <label htmlFor="phone">Phone Number</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={20} />
                <input type="tel" id="phone" placeholder="Enter phone number" />
              </div>
            </div>
            
            <div className={styles.p2}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input type="email" id="email" placeholder="Enter email address" />
              </div>
              
              <label htmlFor="location">Current Location</label>
              <div className={styles.inputWrapper}>
                <MapPin className={styles.inputIcon} size={20} />
                <input type="text" id="location" placeholder="Enter current location" />
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
                  <input type="text" id="hostelName" value="Hostel name" disabled />
                </div>
                
                <label htmlFor="roomNumber">Room Number</label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} size={20} />
                  <input type="text" id="roomNumber" value="001" disabled />
                </div>
              </div>
              
              <div className={styles.p2}>
                <label htmlFor="roomType">Room Type</label>
                <div className={styles.inputWrapper}>
                  <Bed className={styles.inputIcon} size={20} />
                  <input type="text" id="roomType" value="Double" disabled />
                </div>
                
                <label htmlFor="duration">Duration of Stay</label>
                <div className={styles.inputWrapper}>
                  <Clock className={styles.inputIcon} size={20} />
                  <input type="text" id="duration" placeholder="e.g., 1 semester, 6 months" />
                </div>
              </div>
              
              <div className={styles.p2}>
                <label htmlFor="checkIn">Check-in Date</label>
                <div className={styles.inputWrapper}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input type="date" id="checkIn" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rDetails}>
            <h1>Payment Details</h1>
          <div className={styles.details}>
            <div className={styles.p2}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <div className={styles.inputWrapper}>
                <CreditCard className={styles.inputIcon} size={20} />
                <input type="text" id="paymentMethod" placeholder="e.g., Credit Card, Bank Transfer" />
              </div>
            </div>
            
            <div className={styles.p2}>
              <label htmlFor="bookingFee">Booking Fee</label>
              <div className={styles.inputWrapper}>
                <DollarSign className={styles.inputIcon} size={20} />
                <input type="number" id="bookingFee" value="50000" disabled />
              </div>
            </div>
            
            <div className={styles.p2}>
              <label htmlFor="paymentNumber">Payment Number</label>
              <div className={styles.inputWrapper}>
                <Hash className={styles.inputIcon} size={20} />
                <input type="text" id="paymentNumber" placeholder="Enter payment reference number" />
              </div>
            </div>
          </div>
            
          </div>
         
           <button type="submit" className={styles.submitButton}>
             <CreditCard size={24} />
             Book Now
           </button>
        </form>
      </div>
     
    </div>
  )
}

export default Booking

