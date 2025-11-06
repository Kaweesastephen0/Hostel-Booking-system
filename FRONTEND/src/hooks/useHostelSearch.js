import { useState } from 'react';
import axios from 'axios';

export const useHostelSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHostels = async (searchParams) => {
    try {
      console.log("🔍 FRONTEND SEARCH - Params:", searchParams);
      
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      
      if (searchParams.location?.trim()) {
        params.append('location', searchParams.location.trim());
      }
      if (searchParams.roomType?.trim()) {
        params.append('roomType', searchParams.roomType.trim());
      }
      if (searchParams.minPrice) {
        params.append('minPrice', searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        params.append('maxPrice', searchParams.maxPrice);
      }

      const url = `/api/hostels/search?${params.toString()}`;
      console.log("🌐 Calling API:", url);

      const response = await axios.get(url);
      
      console.log("✅ Response received:", response.data);
      console.log("📦 Data:", response.data.data);
      console.log("📊 Count:", response.data.data?.length);

      if (response.data.success && response.data.data) {
        console.log(`✅ Setting ${response.data.data.length} results`);
        setResults(response.data.data);
      } else {
        console.log("❌ No data in response");
        setResults([]);
        setError(response.data.message || 'No results found');
      }

    } catch (err) {
      console.error('❌ ERROR:', err);
      console.error('❌ Error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Search failed');
      setResults([]);
    } finally {
      console.log("🏁 Search complete, setting loading to false");
      setLoading(false);
    }
  };

  return { results, loading, error, searchHostels };
};
