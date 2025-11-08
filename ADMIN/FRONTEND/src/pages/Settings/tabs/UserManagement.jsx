import React, { useEffect, useState } from 'react';
import * as frontUserService from '../../../services/frontUserService';
import { Edit, Trash2, Eye } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await frontUserService.getAllFrontUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to load front users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleView = (u) => setSelected(u);

    const handleEdit = (u) => { setSelected(u); setForm(u); setEditing(true); };

    const handleDelete = async (u) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await frontUserService.deleteFrontUser(u._id);
            setUsers(prev => prev.filter(p => p._id !== u._id));
        } catch (err) {
            alert(err.message || 'Failed to delete user');
        }
    };

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const updated = await frontUserService.updateFrontUser(selected._id, form);
            setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
            setEditing(false);
            setSelected(updated);
            alert('User updated');
        } catch (err) {
            alert(err.message || 'Failed to update');
        }
    };

    return (
        <div className="user-management">
            <h3>Front Users</h3>
            {loading && <p>Loading users...</p>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>User Type</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.firstName} {u.surname}</td>
                                    <td>{u.email}</td>
                                    <td>{u.userType}</td>
                                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A'}</td>
                                    <td className="actions-cell">
                                        <button title="View" onClick={() => handleView(u)}><Eye size={14} /></button>
                                        <button title="Edit" onClick={() => handleEdit(u)}><Edit size={14} /></button>
                                        <button title="Delete" onClick={() => handleDelete(u)} className="danger"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && !editing && (
                <>
                    <div className="modal-backdrop" onClick={() => setSelected(null)} />
                    <div className="user-view">
                        <h4>View User</h4>
                        <p><strong>Name:</strong> {selected.firstName} {selected.surname}</p>
                        <p><strong>Email:</strong> {selected.email}</p>
                        <p><strong>Gender:</strong> {selected.gender}</p>
                        <p><strong>User Type:</strong> {selected.userType}</p>
                        {selected.studentNumber && <p><strong>Student No:</strong> {selected.studentNumber}</p>}
                        {selected.nin && <p><strong>NIN:</strong> {selected.nin}</p>}
                        <div className="view-actions">
                            <button className="btn btn-primary" onClick={() => handleEdit(selected)}>
                                <Edit size={16} /> Edit
                            </button>
                            <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}

            {editing && selected && (
                <div className="user-edit">
                    <h4>Edit User</h4>
                    <form onSubmit={handleSave} className="user-edit-form">
                        <label>First Name<input name="firstName" value={form.firstName || ''} onChange={handleChange} required /></label>
                        <label>Surname<input name="surname" value={form.surname || ''} onChange={handleChange} required /></label>
                        <label>Email<input name="email" value={form.email || ''} onChange={handleChange} type="email" required /></label>
                        <label>Gender
                            <select name="gender" value={form.gender || ''} onChange={handleChange} required>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>
                        <label>User Type
                            <select name="userType" value={form.userType || ''} onChange={handleChange} required>
                                <option value="student">student</option>
                                <option value="non-student">non-student</option>
                            </select>
                        </label>
                        {form.userType === 'student' && <label>Student No<input name="studentNumber" value={form.studentNumber || ''} onChange={handleChange} /></label>}
                        {form.userType === 'non-student' && <label>NIN<input name="nin" value={form.nin || ''} onChange={handleChange} /></label>}
                        <div className="edit-actions">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setSelected(null); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
