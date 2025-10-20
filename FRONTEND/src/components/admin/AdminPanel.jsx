import React, { useState } from 'react';
import AddHostelForm from '../forms/AddHostelForm';
import AddRoomForm from '../forms/AddRoomForm';
import HostelList from '../HostelList';

function AdminPanel() {
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const closeAddHostel = () => setShowAddHostel(false);
  const closeAddRoom = () => setShowAddRoom(false);
  const refreshHostels = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-actions">
        <button className="nav-btn" onClick={() => setShowAddHostel(true)}>
          ➕ Add Hostel
        </button>
        <button className="nav-btn" onClick={() => setShowAddRoom(true)}>
          🛏️ Add Room
        </button>
      </div>
      <div className="admin-list">
        <HostelList refreshKey={refreshKey} />
      </div>
      {/* Add Hostel Modal */}
      {showAddHostel && (
        <AddHostelForm
          onClose={closeAddHostel}
          onSuccess={() => {
            closeAddHostel();
            refreshHostels();
          }}
        />
      )}
      {/* Add Room Modal */}
      {showAddRoom && (
        <AddRoomForm
          onClose={closeAddRoom}
          onSuccess={() => {
            closeAddRoom();
            refreshHostels();
          }}
        />
      )}
    </div>
  );
}

export default AdminPanel;
