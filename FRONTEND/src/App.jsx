import React, { useState, useEffect } from 'react';
import HostelList from './components/HostelList';
import Login from './components/Auth/login';
import Register from './components/Auth/signup';
import AddHostelForm from './components/forms/AddHostelForm';
import AddRoomForm from './components/forms/AddRoomForm';
import hostelService from './services/hostelService';
import './App.css';

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong in the app. Please refresh or contact support.</h2>;
    }
    return this.props.children;
  }
}

function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [activeTab, setActiveTab] = useState('hostels');
  const [showLogin, setShowLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await hostelService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API connection failed:', error);
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setIsRegisterMode(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(true);
    setIsRegisterMode(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setIsRegisterMode(false);
  };

  // Show forms, refresh list after success
  const handleAddHostel = () => {
    setShowAddHostel(true);
  };
  const handleAddRoom = () => {
    setShowAddRoom(true);
  };
  const closeAddHostel = () => {
    setShowAddHostel(false);
  };
  const closeAddRoom = () => {
    setShowAddRoom(false);
  };
  const refreshHostels = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderApiStatus = () => {
    switch (apiStatus) {
      case 'checking':
        return <div className="api-status checking">🔄 Checking API connection...</div>;
      case 'connected':
        return <div className="api-status connected">✅ API Connected</div>;
      case 'disconnected':
        return (
          <div className="api-status disconnected">
            ❌ API Disconnected
            <button onClick={checkApiHealth} className="retry-btn">Retry</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-top">
              <h1>🏨 Hostel Booking System</h1>
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
        </header>

        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'hostels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hostels')}
          >
            🏨 Browse Hostels
          </button>
          <button 
            className="nav-btn"
            onClick={() => setShowAddHostel(true)}
          >
            ➕ Add Hostel
          </button>
          <button 
            className="nav-btn"
            onClick={() => setShowAddRoom(true)}
          >
            🛏️ Add Room
          </button>
          <button 
            className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'hostels' ? (
            <HostelList refreshKey={refreshKey} />
          ) : (
            <div className="about-section">
              <div className="about-content">
                <h2>About Hostel Booking System</h2>
                <p>
                  Welcome to our comprehensive hostel booking platform for Uganda, This application 
                  allows you to discover and book hostels across Uganda's beautiful cities near many universities.
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

                {apiStatus === 'disconnected' && (
                  <div className="setup-instructions">
                    <h3>🚀 Getting Started:</h3>
                    <ol>
                      <li>Make sure MongoDB is running on your system</li>
                      <li>Start the backend server: <code>cd BACKEND && npm run dev</code></li>
                      <li>Start the frontend: <code>cd FRONTEND && npm run dev</code></li>
                      <li>Visit <code>http://localhost:5001/api/health</code> to verify the API</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-section">
                <h3>🏨 Uganda Hostels</h3>
                <ul>
                  <li><a href="#hostels">Browse Hostels</a></li>
                  <li><a href="#kampala">Kampala Hostels</a></li>
                  <li><a href="#mukono">Mukono Hostels</a></li>
                  <li><a href="#jinja">Jinja Hostels</a></li>
                  <li><a href="#gulu">Gulu Hostels</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>📋 Services</h3>
                <ul>
                  <li><a href="#booking">Online Booking</a></li>
                  <li><a href="#support">24/7 Support</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>📞 Contact Info</h3>
                <div className="footer-contact">
                  <div className="contact-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>Kampala, Uganda</span>
                  </div>
                  <div className="contact-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span>+256 700 123 456</span>
                  </div>
                  <div className="contact-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>info@ugandahostels.com</span>
                  </div>
                </div>
              </div>
              
              <div className="footer-section">
                <h3>🔗 Quick Links</h3>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#blog">Travel Blog</a></li>
                </ul>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a href="#whatsapp" className="social-link" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2025 Hostel Booking System.</p>
              <p>Supporting and making Hostel booking services accessible and affordable around many Ugandan Universities.</p>
            </div>
          </div>
        </footer>
          {/* Login Component */}
          {showLogin && (
            <Login 
              onClose={closeLogin} 
              isRegisterMode={isRegisterMode}
            />
          )}
          {/* Add Hostel Modal */}
          {showAddHostel && (
            <AddHostelForm 
              onClose={closeAddHostel}
              onSuccess={() => {
                closeAddHostel();
                refreshHostels();
              }}
            />
          )}
          {/* Add Room Modal */}
          {showAddRoom && (
            <AddRoomForm 
              onClose={closeAddRoom}
              onSuccess={() => {
                closeAddRoom();
                refreshHostels();
              }}
            />
          )}
      </div>
    </ErrorBoundary>
  );
}

export default App;