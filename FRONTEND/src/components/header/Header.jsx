import React from 'react';
import Navbar from '../navbar/navbar';

function Header({ onLogin, onRegister, renderApiStatus }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <Navbar />
        <div className="header-top">
          <div className="auth-buttons">
            <button className="auth-btn login-btn" onClick={onLogin}>🔑 Login</button>
            <button className="auth-btn register-btn" onClick={onRegister}>📝 Register</button>
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
        {renderApiStatus && renderApiStatus()}
      </div>
    </header>
  );
}

export default Header;
