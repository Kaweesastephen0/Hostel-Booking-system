import React, { useState } from 'react';
import { useHostelSearch } from '../hooks/useHostelSearch';
import FeaturedHostels from '../components/hostels/sections/FeaturedHostels';
import AffordableHostels from '../components/hostels/sections/AffordableHostels';
import MidRangeHostels from '../components/hostels/sections/MidRangeHostels';
import Hero from '../components/layout/hero/Hero';
import Gallery from '../components/hostels/sections/Gallery/gallery';
import SearchResults from '../components/hostels/sections/searchResults/searchResults';
import BelowSection from '../components/hostels/sections/belowSection/belowSection'

function HomePage() {
  const { results, loading, error, searchHostels, clearResults } = useHostelSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (location, roomType) => {
    setHasSearched(true);
    await searchHostels(location, roomType);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('search-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="home-page">
      <Hero onSearch={handleSearch} />
      
      {/* Search Results Section - Only show after search */}
      {hasSearched && (
        <div id="search-results">
          <SearchResults 
            results={results} 
            loading={loading} 
            error={error}
            onClose={clearResults}
          />
        </div>
      )}
      
      <FeaturedHostels />
      <MidRangeHostels />
      <AffordableHostels />
      <BelowSection />
    </div>
  );
}

export default HomePage;