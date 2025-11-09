import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, X, TrendingUp, Calendar } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import './BookingChart.css';

const ChartDetailsModal = ({ data, onClose }) => {
  if (!data) return null;

  const total = data.bookings || 0;
  const previousMonth = data.previousBookings || 0;
  const change = previousMonth ? Math.round(((total - previousMonth) / previousMonth) * 100) : 0;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-header">
          <h2>{data.name} Bookings</h2>
          <p className="modal-subtitle">Detailed insights and analytics</p>
        </div>
        <div className="modal-stats">
          <div className="stat-box">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Previous Month</span>
            <span className="stat-value-secondary">{previousMonth}</span>
          </div>
          <div className={`stat-box trend-${trend}`}>
            <span className="stat-label">Change</span>
            <div className="trend-display">
              <TrendingUp size={16} />
              <span className={`trend-value ${trend}`}>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          </div>
        </div>
        <div className="modal-details">
          <div className="detail-item">
            <Calendar size={16} />
            <div>
              <span className="detail-label">Month</span>
              <span className="detail-value">{data.name}</span>
            </div>
          </div>
          <div className="detail-item">
            <TrendingUp size={16} />
            <div>
              <span className="detail-label">Performance</span>
              <span className="detail-value">
                {change > 0 ? '📈 Improving' : change < 0 ? '📉 Declining' : '➡️ Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

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
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBarClick = (data) => {
    setSelectedBar(data);
  };

  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">Monthly Bookings Trend</h3>
          <p className="chart-subtitle">Click on any bar for detailed insights</p>
        </div>
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
          <button onClick={fetchData} className="chart-retry-btn">
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              vertical={false}
              style={{ opacity: 0.5 }}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#718096', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#718096', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 600 }}
              formatter={(value) => [`${value} bookings`, 'Bookings']}
            />
            <Bar 
              dataKey="bookings" 
              fill="url(#colorBookings)"
              barSize={40}
              radius={[8, 8, 0, 0]}
              onClick={(data) => handleBarClick(data)}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {selectedBar && (
        <ChartDetailsModal 
          data={selectedBar} 
          onClose={() => setSelectedBar(null)}
        />
      )}
    </div>
  );
};

export default BookingChart;