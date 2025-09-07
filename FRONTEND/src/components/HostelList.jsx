import React, { useState, useEffect } from 'react';
import HostelCard from './HostelCard';
import hostelService from '../services/hostelService';
import './HostelList.css';

const HostelList = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    roomType: '',
    rating: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalHostels: 0,
    hasNext: false,
    hasPrev: false
  });
  const [cities, setCities] = useState([]);

  // Load hostels and cities on component mount
  useEffect(() => {
    loadHostels();
    loadCities();
  }, []);

  // Load hostels when filters or page changes
  useEffect(() => {
    loadHostels();
  }, [filters, pagination.currentPage]);

  const loadHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await hostelService.getHostels({
        ...filters,
        page: pagination.currentPage,
        limit: 12
      });
      
      setHostels(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load hostels. Please try again.');
      console.error('Error loading hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const response = await hostelService.getCities();
      setCities(response.data);
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      roomType: '',
      rating: ''
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === pagination.currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
        >
          Previous
        </button>
        {pages}
        <button
          className="page-btn"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading && hostels.length === 0) {
    return (
      <div className="hostel-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading hostels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hostel-list-container">
      <div className="filters-section">
        <h2>Find Your Perfect Hostel in Uganda</h2>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="state">Region</label>
            <input
              type="text"
              id="state"
              placeholder="Enter region"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price (UGX)</label>
            <input
              type="number"
              id="minPrice"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price (UGX)</label>
            <input
              type="number"
              id="maxPrice"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="roomType">Room Type</label>
            <select
              id="roomType"
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="dormitory">Dormitory</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="rating">Min Rating</label>
            <select
              id="rating"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadHostels}>Retry</button>
        </div>
      )}

      <div className="results-header">
        <h3>
          {pagination.totalHostels} hostels found
          {pagination.totalPages > 1 && (
            <span className="page-info">
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
          )}
        </h3>
      </div>

      {hostels.length === 0 && !loading ? (
        <div className="no-results">
          <p>No hostels found matching your criteria.</p>
          <button onClick={clearFilters}>Clear filters to see all hostels</button>
        </div>
      ) : (
        <>
          <div className="hostels-grid">
            {hostels.map(hostel => (
              <HostelCard key={hostel._id} hostel={hostel} />
            ))}
          </div>

          {pagination.totalPages > 1 && renderPagination()}
        </>
      )}

      {loading && hostels.length > 0 && (
        <div className="loading-more">
          <div className="spinner"></div>
          <p>Loading more hostels...</p>
        </div>
      )}
    </div>
  );
};

export default HostelList;

