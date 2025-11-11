import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/layout/searchbar/searchBar';
import SearchResultsList from '../components/hostels/sections/searchResults/searchResults';
import { useHostelSearch } from '../hooks/useHostelSearch';
import styles from './SearchResultPage.module.css';

function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, loading, error, searchHostels } = useHostelSearch();
  const [searched, setSearched] = useState(false);
  
  const searchParams = location.state?.searchParams || {};

  // Initial search on mount
  useEffect(() => {
    console.log("🎬 PAGE MOUNTED");
    console.log("📋 Search params from state:", searchParams);
    
    // Check if we have search params
    if (!searchParams || Object.keys(searchParams).length === 0) {
      console.log("❌ No search params, going home");
      navigate('/');
      return;
    }

    // Do the search
    console.log("🚀 Starting search...");
    setSearched(true);
    searchHostels(searchParams);
  }, []); // Empty dependency array - only run once

  // Watch results changes
  useEffect(() => {
    
  }, [results, loading, error, searched]);

  const handleNewSearch = async (newParams) => {
    console.log(" NEW SEARCH:", newParams);
    setSearched(true);
    await searchHostels(newParams);
  };

  console.log(" RENDERING PAGE - Current state:", {
    resultsCount: results?.length || 0,
    loading,
    error,
    searched
  });

  return (
    <div className={styles.searchResultsPage}>
      
      {/* HEADER */}
     

      {/* SEARCH BAR */}
      <div className={styles.searchBarContainer}>
        <SearchBar onSearch={handleNewSearch} />
      </div>

      {/* FILTERS */}
      {searchParams && Object.keys(searchParams).length > 0 && (
        <div className={styles.activeFilters}>
          <span className={styles.filtersLabel}>Searching:</span>
          {searchParams.location && (
            <span className={styles.filterTag}> {searchParams.location}</span>
          )}
          {searchParams.roomType && (
            <span className={styles.filterTag}> {searchParams.roomType}</span>
          )}
          {(searchParams.minPrice || searchParams.maxPrice) && (
            <span className={styles.filterTag}>
               {searchParams.minPrice || '0'} - {searchParams.maxPrice || '∞'}
            </span>
          )}
        </div>
      )}

      
    
      {/* LOADING */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '16px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2>Searching...</h2>
        </div>
      )}

      {/* RESULTS */}
      {!loading && searched && results && results.length > 0 && (
        <div className={styles.resultsContainer}>
          <div style={{
            background: '#e8f5e9',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
             About to render {results.length} results
          </div>
          <SearchResultsList 
            results={results}
            loading={false}
            searchParams={searchParams}
            limit={null}
          />
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && searched && (!results || results.length === 0) && !error && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '16px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😢</div>
          <h2>No hostels found</h2>
          <p>Try different search terms</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#5843e3',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Go Home
          </button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '20px',
          borderRadius: '12px',
          margin: '20px 0'
        }}>
           {error}
        </div>
      )}

    </div>
  );
}

export default SearchResultsPage;