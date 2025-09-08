"use client"

// Import React hooks - these are special functions that let us add features to our component
import { useState } from "react"
import "./signup.css"
import axios from "axios"

// This is a React Functional Component - think of it as a blueprint for creating UI elements
function Signup() {
  // MODEL (M) - Data management and state
  // This section handles the data and state of the application
  // useState is like a memory box that remembers values and can update the UI when they change

  // This creates a state variable 'formData' that holds all our form input values
  // setFormData is the function we use to update this state
  // The object inside useState({...}) is the initial/starting value
  const [formData, setFormData] = useState({
    name: "", // User's full name (starts empty)
    email: "", // User's email address (starts empty)
    phone: "", // User's phone number (starts empty)
    gender: "", // Added gender field
    password: "", // User's password (starts empty)
    confirmPassword: "", // Added confirm password field
  })

  // This state keeps track of any validation errors for each form field
  const [errors, setErrors] = useState({})

  // This state tracks whether the form is currently being submitted (loading state)
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // CONTROLLER (C) - Interaction and logic
  // This section handles user interactions and business logic, connecting Model and View
  // These are functions that respond to user interactions (like typing or clicking)

  // This function runs every time a user types in any input field
  const handleChange = (e) => {
    // 'e' is the event object - it contains information about what happened
    // e.target is the specific input field that was changed
    const { name, value } = e.target // Destructuring: extract 'name' and 'value' from e.target

    // Update the formData state with the new value
    // ...formData means "keep all existing data" and then update the specific field
    setFormData({ ...formData, [name]: value })

    // If there was an error for this field, clear it when user starts typing
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const validatePasswords = () => {
    const newErrors = {}

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  // This function runs when the user submits the form (clicks the submit button)
  const onSubmit = async (e) => {
    // Prevent the default form submission behavior (which would reload the page)
    e.preventDefault()

    const passwordErrors = validatePasswords()
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors)
      return
    }

    // Set loading state to true (this will show "Creating Account..." on the button)
    setIsLoading(true)

    try {
      // Check if email or phone is already in use by querying the backend
      const checkResponse = await axios.get("http://localhost:5000/signup", {
        params: { email: formData.email, phone: formData.phone },
      })

      // If duplicates are found, the backend returns an object with taken fields
      if (checkResponse.data.taken) {
        setErrors(checkResponse.data.taken) // e.g., { email: "Email already in use", phone: "Phone already in use" }
        setIsLoading(false)
        return // Stop submission if duplicates are found
      }

      const { confirmPassword, ...dataToSend } = formData

      // Use axios to send form data to the backend for registration
      const response = await axios.post("http://localhost:5000/signup", dataToSend)

      // If the server returns success (e.g., 200 status), show success message
      if (response.status === 200) {
        alert("Registration successful! Welcome to HostelStay!")
        // Reset the form by clearing all input values
        setFormData({ name: "", email: "", phone: "", gender: "", password: "", confirmPassword: "" })
      }
    } catch (error) {
      // Handle any errors from the API (e.g., 400 or 500 status)
      setErrors({ general: "Registration failed. Please try again." })
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors) // Set specific errors if the server provides them
      }
    } finally {
      // Set loading back to false (button will show normal text again)
      setIsLoading(false)
    }
  }

  // VIEW (V) - User interface
  // This section defines what the user sees on the screen
  // JSX looks like HTML but it's actually JavaScript that creates React elements
  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-container">
            <div className="logo">🏨</div>
            <h1 className="brand-name">HostelStay</h1>
          </div>
          <h2>Join Our Community</h2>
          <p>Book your perfect hostel experience today!</p>
        </div>

        {/* FORM ELEMENT - onSubmit connects to our onSubmit function */}
        <form onSubmit={onSubmit} className="signup-form">
          {/* Name Field */}
          <div className="input-group">
            <label>👤 Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone Field */}
          <div className="input-group">
            <label>📱 Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label>⚧ Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? "error" : ""}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>

          <div className="input-group">
            <label>🔒 Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label>🔒 Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* SUBMIT BUTTON - disabled when loading to prevent multiple submissions */}
          <button type="submit" disabled={isLoading} className="submit-btn">
            {/* CONDITIONAL RENDERING - Show different text based on loading state */}
            {isLoading ? "⏳ Creating Account..." : "🏨 Join HostelStay"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>

        <div className="benefits">
          <p className="benefits-text">✨ Exclusive hostel deals • 🌍 Global network • 💬 Traveler community</p>
        </div>
      </div>
    </div>
  )
}

// Export the component so it can be imported and used in other files
export default Signup
