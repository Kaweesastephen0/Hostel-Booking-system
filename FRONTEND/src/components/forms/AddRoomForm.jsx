import React, { useEffect, useState } from 'react';
import hostelService from '../../services/hostelService';

function AddRoomForm({ onClose, onSuccess }) {
  const [hostelId, setHostelId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hostels, setHostels] = useState([]);
  const [search, setSearch] = useState('');

  const formatHostelLabel = (h) => {
    const name = typeof h.name === 'string' ? h.name : '';
    const city = typeof h?.location?.city === 'string' ? h.location.city : '';
    const state = typeof h?.location?.state === 'string' ? h.location.state : '';
    const loc = [city, state].filter(Boolean).join(', ');
    return loc ? `${name} (${loc})` : `${name} (Location N/A)`;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await hostelService.getHostels({ limit: 100, page: 1 });
        if (!cancelled) {
          setHostels(res.data || []);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load hostels for room form', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await hostelService.createRoom({ hostelId, roomNumber, price: Number(price) });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to add room. Please try again.');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Add Room</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label} htmlFor="hostel-search">Search Hostel</label>
            <input
              id="hostel-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
              placeholder="Type to filter by name or location"
            />
          </div>
          <label style={styles.label} htmlFor="hostel-id">Hostel</label>
          <select
            id="hostel-id"
            value={hostelId}
            onChange={(e) => setHostelId(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select hostel</option>
            {hostels
              .filter((h) => {
                const q = search.trim().toLowerCase();
                if (!q) return true;
                return (
                  (h.name || '').toLowerCase().includes(q) ||
                  ((h.location && (h.location.city || '')).toLowerCase().includes(q)) ||
                  ((h.location && (h.location.state || '')).toLowerCase().includes(q))
                );
              })
              .map((h) => (
              <option key={String(h._id)} value={String(h._id)}>
                {formatHostelLabel(h)}
              </option>
            ))}
          </select>

          <label style={styles.label} htmlFor="room-number">Room Number</label>
          <input
            id="room-number"
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., A12"
          />

          <label style={styles.label} htmlFor="room-price">Price (UGX)</label>
          <input
            id="room-price"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., 250000"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Room'}
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

export default AddRoomForm;


