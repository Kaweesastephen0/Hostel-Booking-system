import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  itemsPerPage,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of <strong>{totalRecords}</strong> results
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-button">
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="pagination-page-display">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-button">
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;