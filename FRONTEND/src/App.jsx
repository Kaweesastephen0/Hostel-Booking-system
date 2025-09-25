import React, { useState, useEffect } from 'react';
import HostelList from './components/HostelList';
import Login from './components/Auth/login';
import AddHostelForm from './components/forms/AddHostelForm';
import AddRoomForm from './components/forms/AddRoomForm';
import hostelService from './services/hostelService';
import Header from './components/header/Header';
import About from './components/about/About';
import Footer from './components/footer/footer';
import './App.css';

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // static getDerivedStateFromError(error) {
  //   return { hasError: true };
  // }
  componentDidCatch(error, errorInfo) {
    // log error to an error reporting service 
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
  // const handleAddHostel = () => {
  //   setShowAddHostel(true);
  // };
  // const handleAddRoom = () => {
  //   setShowAddRoom(true);
  // };
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
        <Header 
          onLogin={handleLoginClick} 
          onRegister={handleRegisterClick} 
          renderApiStatus={renderApiStatus}
        />

        <div className="app-nav">
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
        </div>

      

        <main className="app-main">
          {activeTab === 'hostels' ? (
            <HostelList refreshKey={refreshKey} />
          ) : (
            <About/>
          )}
        </main>
      <footer className="app-footer">
            <Footer />
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