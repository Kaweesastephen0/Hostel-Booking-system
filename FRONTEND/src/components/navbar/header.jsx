import React from 'react'

function header() {
  return (
    <div>
       <div className="header-content">
         
            <div className="header-top">
              
              <div className="auth-buttons">
                <button className="auth-btn login-btn" onClick={handleLoginClick}>🔑 Login</button>
                <button className="auth-btn register-btn" onClick={handleRegisterClick}>📝 Register</button>
              </div>
            </div>
            <p>Discover affordable and comfortable hostels across Uganda - from Kampala to Gulu</p>
        
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Hostels</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4</div>
                <div className="stat-label">Cities</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Guests</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
            
            {renderApiStatus()}
          </div>
    </div>
  )
}

export default header
