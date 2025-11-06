// pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/layout/searchbar/searchBar';
import SearchResultsList from '../components/hostels/sections/searchResults/SearchResultsList';
import { useHostelSearch } from '../hooks/useHostelSearch';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { results, loading, error, searchHostels } = useHostelSearch();
  const [currentSearchParams, setCurrentSearchParams] = useState(null);

  const handleSearch = async (searchParams) => {
    setCurrentSearchParams(searchParams);
    await searchHostels(searchParams);
  };

  const handleViewAllResults = () => {
    navigate('/search-results', { 
      state: { 
        results,
        searchParams: currentSearchParams 
      } 
    });
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Student Hostel</h1>
          <p>Search hostels near Makerere University with flexible options</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="search-section">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Search Results - Show only 3 on homepage */}
      {(results.length > 0 || loading) && (
        <section className="results-section">
          <div className="results-header">
            <h2>Search Results</h2>
            {results.length > 3 && (
              <p className="results-count">
                Showing 3 of {results.length} results
              </p>
            )}
          </div>

          <SearchResultsList 
            results={results}
            loading={loading}
            searchParams={currentSearchParams}
            limit={3}  // Only show 3 results on homepage
          />

          {/* View All Button */}
          {results.length > 3 && (
            <div className="view-all-wrapper">
              <button 
                className="view-all-btn"
                onClick={handleViewAllResults}
              >
                View All {results.length} Results →
              </button>
            </div>
          )}
        </section>
      )}

      {/* No Results Message */}
      {!loading && results.length === 0 && currentSearchParams && (
        <section className="no-results-section">
          <div className="no-results-content">
            <h3>No hostels found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        </section>
      )}

      {/* Error Message */}
      {error && (
        <section className="error-section">
          <div className="error-content">
            <p>{error}</p>
          </div>
        </section>
      )}

      {/* Featured Hostels Section (shown when no search) */}
      {!currentSearchParams && (
        <section className="featured-section">
          <h2>Featured Hostels</h2>
          <p>Popular choices near campus</p>
          {/* Add your featured hostels component here */}
        </section>
      )}
    </div>
  );
}

export default HomePage;