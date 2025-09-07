"use client"

// Import React hooks - these are special functions that let us add features to our component
import { useState } from "react"
import "./signup.css"
import axios from 'axios'


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
    password: "", // User's password (starts empty)
  })

  // This state keeps track of any validation errors for each form field
  const [errors, setErrors] = useState({})

  // This state tracks whether the form is currently being submitted (loading state)
  const [isLoading, setIsLoading] = useState(false)

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

  // This function runs when the user submits the form (clicks the submit button)
  const onSubmit = async (e) => {
    // Prevent the default form submission behavior (which would reload the page)
    e.preventDefault()

    // Set loading state to true (this will show "Creating Account..." on the button)
    setIsLoading(true)

    try {
      // Use axios to send form data to the backend
      const response = await axios.post('https://your-api-endpoint.com/signup', formData)

      // If the server returns success (e.g., 200 status), show success message
      if (response.status === 200) {
        alert("Registration successful! Welcome to HostelStay!")
        // Reset the form by clearing all input values
        setFormData({ name: "", email: "", phone: "", password: "" })
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
          {/* ARRAY MAP METHOD - This creates multiple input fields from an array */}
          {/* Instead of writing 4 separate input elements, we use .map() to generate them */}
          {[
            { name: "name", type: "text", placeholder: "Full Name", icon: "👤" },
            { name: "email", type: "email", placeholder: "Email Address", icon: "📧" },
            { name: "phone", type: "tel", placeholder: "Phone Number", icon: "📱" },
            { name: "password", type: "password", placeholder: "Password", icon: "🔒" },
          ].map(({ name, type, placeholder, icon }) => (
            // Each input field gets wrapped in a div with class "input-group"
            // 'key' is required by React when creating lists of elements
            <div key={name} className="input-group">
              <label>
                {icon} {placeholder}
              </label>
              <input
                type={type} // Input type (text, email, tel, password)
                name={name} // Name attribute (matches our state keys)
                value={formData[name]} // Current value from our state
                onChange={handleChange} // Function to call when user types
                placeholder={`Enter your ${placeholder.toLowerCase()}`} // Placeholder text
                className={errors[name] ? "error" : ""} // Add 'error' class if there's an error
              />
              {/* CONDITIONAL RENDERING - Only show error message if there's an error for this field */}
              {errors[name] && <span className="error-text">{errors[name]}</span>}
            </div>
          ))}

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