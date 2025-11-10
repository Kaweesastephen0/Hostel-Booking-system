import React, { useMemo } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import DataTable from '../table/DataTable';
import './HostelTable.css';

const formatLabel = (value, fallback = '') => {
  const normalized = (value || fallback).toString().toLowerCase();
  return normalized.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const HostelTable = ({ hostels, onEdit, onDelete }) => {
  const columns = useMemo(() => [
    { Header: 'Hostel Name', accessor: 'name', Cell: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
    { Header: 'Location', accessor: 'location' },
    { Header: 'Gender', accessor: 'HostelGender' },
    {
      Header: 'Category',
      accessor: 'category',
      Cell: (row) => (
        <span className={`category-badge category-${(row.category || 'standard').toString().toLowerCase()}`}>
          {formatLabel(row.category, 'standard')}
        </span>
      ),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: (row) => (
        <span className={`status-badge status-${(row.status || 'operational').toString().toLowerCase()}`}>
          {formatLabel(row.status, 'operational')}
        </span>
      ),
    },
    { Header: 'Rooms', accessor: 'roomCount' },
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