"use client"

import { useState } from "react"
import { validateFormData } from "./controller"
import "./signup.css"

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(async () => {
      const validationErrors = await validateFormData(formData)
      if (Object.keys(validationErrors).length === 0) {
        alert("Registration successful! Welcome to HostelStay!")
        setFormData({ name: "", email: "", phone: "", password: "" })
      } else {
        setErrors(validationErrors)
      }
      setIsLoading(false)
    }, 1000)
  }

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

        <form onSubmit={onSubmit} className="signup-form">
          {[
            { name: "name", type: "text", placeholder: "Full Name", icon: "👤" },
            { name: "email", type: "email", placeholder: "Email Address", icon: "📧" },
            { name: "phone", type: "tel", placeholder: "Phone Number", icon: "📱" },
            { name: "password", type: "password", placeholder: "Password", icon: "🔒" },
          ].map(({ name, type, placeholder, icon }) => (
            <div key={name} className="input-group">
              <label>
                {icon} {placeholder}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter your ${placeholder.toLowerCase()}`}
                className={errors[name] ? "error" : ""}
              />
              {errors[name] && <span className="error-text">{errors[name]}</span>}
            </div>
          ))}

          <button type="submit" disabled={isLoading} className="submit-btn">
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

export default Signup
