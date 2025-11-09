import React from 'react';
import { Users, Building2, Bed, BookOpen, CreditCard, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, onClose, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="search-results-loading">
        <div className="loading-spinner"></div>
        <p>Searching...</p>
      </div>
    );
  }

  if (!results || results.total === 0) {
    return (
      <div className="search-results-empty">
        <p>No results found</p>
      </div>
    );
  }

  const handleItemClick = (item, type) => {
    onClose();
    switch (type) {
      case 'users':
        navigate(`/users/${item._id}`);
        break;
      case 'frontUsers':
        navigate(`/users/${item._id}`);
        break;
      case 'hostels':
        navigate(`/hostels/${item._id}`);
        break;
      case 'rooms':
        navigate(`/rooms/${item._id}`);
        break;
      case 'bookings':
        navigate(`/bookings/${item._id}`);
        break;
      case 'payments':
        navigate(`/payments/${item._id}`);
        break;
      default:
        break;
    }
  };

  const renderResultCategory = (title, items, type, icon) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="search-result-category" key={type}>
        <div className="category-header">
          {icon}
          <h4>{title}</h4>
        </div>
        <div className="category-items">
          {items.map((item) => (
            <div
              key={item._id}
              className="result-item"
              onClick={() => handleItemClick(item, type)}
            >
              {type === 'users' && (
                <>
                  <span className="result-name">{item.fullName}</span>
                  <span className="result-meta">{item.email}</span>
                  <span className="result-badge">{item.role}</span>
                </>
              )}
              {type === 'frontUsers' && (
                <>
                  <span className="result-name">{`${item.firstName} ${item.surname}`}</span>
                  <span className="result-meta">{item.email}</span>
                  <span className="result-badge">{item.userType}</span>
                </>
              )}
              {type === 'hostels' && (
                <>
                  <span className="result-name">{item.name}</span>
                  <span className="result-meta">{item.location}</span>
                </>
              )}
              {type === 'rooms' && (
                <>
                  <span className="result-name">Room {item.roomNumber}</span>
                  <span className="result-meta">{item.roomType}</span>
                  <span className="result-badge">{`UGX ${item.roomPrice.toLocaleString()}`}</span>
                </>
              )}
              {type === 'bookings' && (
                <>
                  <span className="result-name">{item.guestName}</span>
                  <span className="result-meta">{item.reference}</span>
                  <span className="result-badge">{item.status}</span>
                </>
              )}
              {type === 'payments' && (
                <>
                  <span className="result-name">{item.reference}</span>
                  <span className="result-meta">{`UGX ${item.amount.toLocaleString()}`}</span>
                  <span className="result-badge">{item.status}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="search-results-modal">
      <div className="search-results-content">
        <div className="results-header">
          <h3>Search Results ({results.total})</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="results-body">
          {renderResultCategory('Admin Users', results.users, 'users', <Users size={18} />)}
          {renderResultCategory('Front Users', results.frontUsers, 'frontUsers', <User size={18} />)}
          {renderResultCategory('Hostels', results.hostels, 'hostels', <Building2 size={18} />)}
          {renderResultCategory('Rooms', results.rooms, 'rooms', <Bed size={18} />)}
          {renderResultCategory('Bookings', results.bookings, 'bookings', <BookOpen size={18} />)}
          {renderResultCategory('Payments', results.payments, 'payments', <CreditCard size={18} />)}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
