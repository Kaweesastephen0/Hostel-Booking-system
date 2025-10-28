import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">{cancelText}</button>
          <button onClick={onConfirm} className="btn btn-danger">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;