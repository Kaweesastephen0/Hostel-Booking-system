import React, { useMemo } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import DataTable from '../table/DataTable';
import './HostelTable.css';

const HostelTable = ({ hostels, onEdit, onDelete }) => {
  // will  fetch hostels from API: GET /api/hostels

  const columns = useMemo(() => [
    { Header: 'Hostel Name', accessor: 'name', Cell: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
    { Header: 'Location', accessor: 'location' },
    { Header: 'Gender', accessor: 'HostelGender' },
    { Header: 'Rooms', accessor: (row) => row.rooms?.length || 0 },
    {
      Header: 'Availability',
      accessor: 'availability',
      Cell: (row) => (
        <span className={`status-badge status-${row.availability ? 'available' : 'full'}`}>
          {row.availability ? 'Available' : 'Full'}
        </span>
      ),
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: (row) => (
        <div className="hostel-table-actions">
          <button onClick={() => onEdit(row)} className="action-btn edit-btn">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(row._id)} className="action-btn delete-btn">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [onEdit, onDelete]);

  return (
    <DataTable
      columns={columns}
      data={hostels}
    />
  );
};

export default HostelTable;