import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './BookingChart.css';

/**
 * This chart will display booking data.
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - The data to display in the chart.
 */
const BookingChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Bookings</h3>
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
            cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="bookings" fill="#4f46e5" barSize={30} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingChart;