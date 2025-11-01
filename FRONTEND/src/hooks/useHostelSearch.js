// hooks/useHostelSearch.js
import { useState, useCallback } from 'react';

export const useHostelSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHostels = useCallback(async (location, roomType) => {
    console.log('🔍 Search started with:', { location, roomType });
    
    if (!location || !roomType) {
      setError('Location and room type are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        location: location.trim(),
        roomType: roomType.toLowerCase()
      });

      const url = `http://localhost:5000/api/hostels/search?${params}`;
      console.log('📡 Fetching from:', url);

      const response = await fetch(url);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setResults(data.data);
        return data;
      } else {
        setResults([]);
        setError(data.message || 'No results found');
        return data;
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Failed to search hostels. Please try again.');
      setResults([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { 
    results, 
    loading, 
    error, 
    searchHostels,
    clearResults 
  };
};