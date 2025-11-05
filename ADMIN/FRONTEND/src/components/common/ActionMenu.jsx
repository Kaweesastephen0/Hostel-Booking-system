import React, { useState } from 'react';
import { Plus, ChevronDown, Settings, UserPlus, Building, BedDouble, FileText } from 'lucide-react';
import './ActionMenu.css';

const ActionMenu = ({ userType, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getMenuItems = () => {
    const items = [];

    switch (userType) {
      case 'admin':
        items.push(
          { id: 'add-hostel', icon: Building, label: 'Add Hostel', action: 'add-hostel' },
          { id: 'add-room', icon: BedDouble, label: 'Add Room', action: 'add-room' },
          { id: 'add-user', icon: UserPlus, label: 'Add User', action: 'add-user' },
          { id: 'settings', icon: Settings, label: 'Settings', action: 'settings' }
        );
        break;
      case 'manager':
        items.push(
          { id: 'add-room', icon: BedDouble, label: 'Add Room', action: 'add-room' },
          { id: 'create-report', icon: FileText, label: 'Create Report', action: 'create-report' }
        );
        break;
      default:
        items.push(
          { id: 'view-reports', icon: FileText, label: 'View Reports', action: 'view-reports' }
        );
    }

    return items;
  };

  const handleClick = (action) => {
    setIsOpen(false);
    onAction(action);
  };

  return (
    <div className="action-menu">
      <button 
        className="action-menu-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus size={16} />
        <span>Actions</span>
        <ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} />
      </button>

      {isOpen && (
        <div className="action-menu-dropdown">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              className="action-menu-item"
              onClick={() => handleClick(item.action)}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;