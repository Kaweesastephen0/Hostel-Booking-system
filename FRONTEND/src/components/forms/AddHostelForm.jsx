import React, { useState } from 'react';
import hostelService from '../../services/hostelService';

function AddHostelForm({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await hostelService.createHostel({ name, location, description });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to add hostel. Please try again.');

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Add Hostel</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="hostel-name">Hostel Name</label>
          <input
            id="hostel-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., Victoria Courts"
          />

          <label style={styles.label} htmlFor="hostel-location">Location</label>
          <input
            id="hostel-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., Kampala, Uganda"
          />

          <label style={styles.label} htmlFor="hostel-description">Description</label>
          <textarea
            id="hostel-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
            placeholder="Brief description of the hostel"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Hostel'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '100%',
    maxWidth: 520,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    fontSize: 20,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1,
  },
  form: {
    padding: 20,
    display: 'grid',
    gap: 12,
  },
  label: {
    fontWeight: 600,
  },
  input: {
    height: 38,
    borderRadius: 8,
    border: '1px solid #ddd',
    padding: '0 12px',
    fontSize: 14,
  },
  textarea: {
    minHeight: 90,
    borderRadius: 8,
    border: '1px solid #ddd',
    padding: 12,
    fontSize: 14,
    resize: 'vertical',
  },
  submitBtn: {
    marginTop: 8,
    height: 40,
    borderRadius: 8,
    border: 'none',
    background: '#111',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    color: '#b00020',
    fontSize: 13,
  },
};

export default AddHostelForm;


