import { useState, useEffect } from 'react';

export const useHostels = (endpoint) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setHostels(result.data);
        } else {
          setHostels([]);
        }
      } catch (error) {
        console.error(`Error fetching hostels from ${endpoint}:`, error);
        setError('Failed to load hostels, please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, [endpoint]);

  return { hostels, loading, error };
};