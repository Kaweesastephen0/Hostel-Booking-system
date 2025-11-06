import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import './BookingChart.css';

/**
 * A chart component that displays monthly booking statistics.
 * Fetches and updates data automatically.
 */
const BookingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const monthlyData = await dashboardService.getMonthlyBookings();
      setData(monthlyData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch booking stats:', err);
      setError('Failed to load booking statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Bookings</h3>
        {!loading && !error && (
          <button 
            onClick={fetchData} 
            className="refresh-button"
            title="Refresh data"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {loading && (
        <div className="chart-loading">
          <Loader2 className="animate-spin" size={32} />
          <p>Loading booking statistics...</p>
        </div>
      )}
      
      {error && (
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchData} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
          <YAxis tick={{ fill: '#6b7280' }} />
          <Tooltip
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar 
            dataKey="bookings" 
            fill="#3b82f6"
            fillOpacity={0.9}
            barSize={30} 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

export default BookingChart;