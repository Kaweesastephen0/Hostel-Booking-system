import React from 'react'

function About() {
  return (
    <div>
       <div className="about-section">
              <div className="about-content">
                <h2>About Hostel Booking System</h2>
                <p>
                  Welcome to our comprehensive hostel booking platform for Uganda, This application 
                  allows you to discover and book hostels across Uganda's cities near many universities.
                </p>
                
                <div className="features">
                  <h3>Features:</h3>
                  <ul>
                    <li>🔍 Search and filter hostels by location, price, and amenities</li>
                    <li>⭐ View ratings and reviews for each hostel</li>
                    <li>🏠 Browse different room types and availability</li>
                    <li>📱 Fully responsive design for all devices</li>
                    <li>⚡ Fast and reliable booking experience</li>
                    <li>🇺🇬 Localized for Uganda with UGX pricing</li>
                  </ul>
                </div>

                <div className="tech-stack">
                  <h3>Built with:</h3>
                  <div className="tech-badges">
                    <span className="tech-badge">MongoDB</span>
                    <span className="tech-badge">Express.js</span>
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">Node.js</span>
                    <span className="tech-badge">Mongoose</span>
                    <span className="tech-badge">Axios</span>
                  </div>
                </div>

                <div className="cities-info">
                  <h3>Available Cities:</h3>
                  <div className="city-badges">
                    <span className="city-badge">🏙️ Kampala</span>
                    <span className="city-badge">🌊 Mukono</span>
                    <span className="city-badge">🚣 Jinja</span>
                    <span className="city-badge">🎭 Gulu</span>
                  </div>
                </div>

   
                  <div className="setup-instructions">
                    <h3>🚀 Getting Started:</h3>
                    <ol>
                      <li>Make sure MongoDB is running on your system</li>
                      <li>Start the backend server: <code>cd BACKEND && npm run dev</code></li>
                      <li>Start the frontend: <code>cd FRONTEND && npm run dev</code></li>
                      <li>Visit <code>http://localhost:5001/api/health</code> to verify the API</li>
                    </ol>
                  </div>
  
              </div>
            </div>
    </div>
  )
}

export default About
