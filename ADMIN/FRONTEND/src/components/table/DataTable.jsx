import React from 'react';
import './DataTable.css';

/**
 * A reusable data table component.
 * @param {object} props - The component props.
 * @param {Array<object>} props.columns - The table column definitions.
 * @param {Array<object>} props.data - The data to display.
 */
const DataTable = ({ columns, data }) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.Cell ? col.Cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;