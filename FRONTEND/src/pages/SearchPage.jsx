// pages/SearchPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/layout/searchbar/searchBar';
import SearchResults from '../components/hostels/sections/searchResults/searchResults';
import { useHostelSearch } from '../hooks/useHostelSearch';

function SearchPage() {
  const { results, loading, error, searchHostels } = useHostelSearch();
  const location = useLocation();
  
  // Get search params from navigation state or URL
  const initialSearchParams = location.state?.searchParams || {};

  const handleSearch = async (searchParams) => {
    await searchHostels(
      searchParams.location || '',
      searchParams.roomType || '',
      searchParams.minPrice || '',
      searchParams.maxPrice || ''
    );
  };

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Find Your Perfect Hostel</h1>
        <p>Search across all available hostels and rooms</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <SearchResults 
        results={results} 
        loading={loading} 
        error={error}
        showViewMore={false} // Don't show "View More" on search page
      />
    </div>
  );
}

export default SearchPage;