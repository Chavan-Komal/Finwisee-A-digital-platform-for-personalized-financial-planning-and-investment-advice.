import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';
import './AdminDashboard.styles.css';

const API_URL = 'http://localhost:8080';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, getAuthHeader } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/not-found');
    }
  }, [user, navigate]);

  // Load data from backend
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const statsData = await response.json();
        setStats({
          totalUsers: statsData.users?.total || 0,
          activeUsers: statsData.users?.regular || 0,
          totalOrders: statsData.orders?.total || 0,
          revenue: statsData.orders?.completed * 2999 || 0 // Mock calculation
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadUsers();
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        await loadUsers();
        setShowUserModal(false);
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        await loadUsers();
        setShowCreateUserModal(false);
        alert('User created successfully!');
      } else {
        alert('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role?role=${newRole}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadUsers();
        alert('User role updated successfully!');
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>₹{stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {users.slice(0, 5).map(user => (
            <div key={user.id} className="activity-item">
              <div className="activity-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="activity-content">
                <p><strong>{user.firstName} {user.lastName}</strong> registered</p>
                <small>{new Date(user.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="users-header">
        <h3>User Management</h3>
        <div className="users-header-actions">
          <button 
            className="btn-add-user"
            onClick={() => setShowCreateUserModal(true)}
          >
            <i className="fas fa-plus"></i>
            Add New User
          </button>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search users..." />
          </div>
        </div>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <p className="user-name">{user.firstName} {user.lastName}</p>
                      <small>{user.phone}</small>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      title="Edit"
                      onClick={() => handleEditUser(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete" 
                      title="Delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-settings">
      <h3>Admin Settings</h3>
      
      <div className="settings-section">
        <h4>General Settings</h4>
        <div className="setting-item">
          <label>Site Name</label>
          <input type="text" defaultValue="Finwisee" />
        </div>
        <div className="setting-item">
          <label>Admin Email</label>
          <input type="email" defaultValue="admin@finwisee.com" />
        </div>
        <div className="setting-item">
          <label>Maintenance Mode</label>
          <div className="toggle-switch">
            <input type="checkbox" id="maintenance" />
            <label htmlFor="maintenance"></label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>Security Settings</h4>
        <div className="setting-item">
          <label>Two-Factor Authentication</label>
          <div className="toggle-switch">
            <input type="checkbox" id="2fa" defaultChecked />
            <label htmlFor="2fa"></label>
          </div>
        </div>
        <div className="setting-item">
          <label>Session Timeout (minutes)</label>
          <input type="number" defaultValue="30" min="5" max="120" />
        </div>
      </div>

      <div className="settings-section">
        <h4>Email Settings</h4>
        <div className="setting-item">
          <label>SMTP Server</label>
          <input type="text" defaultValue="smtp.gmail.com" />
        </div>
        <div className="setting-item">
          <label>SMTP Port</label>
          <input type="number" defaultValue="587" />
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save">Save Settings</button>
        <button className="btn-reset">Reset to Default</button>
      </div>
    </div>
  );

  // Don't render if user is not admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => navigate('/home')} className="btn-home">
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center px-2">
        <div className="admin-info">
          <div className="admin-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome back, {user?.firstName || user?.name || 'Admin'}</p>
          </div>
        </div>
        <div className="d-flex h-25 gap-2">
          <button className="btn-notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="d-flex">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-tachometer-alt"></i>
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* User Edit Modal */}
      {showUserModal && (
        <UserEditModal
          user={editingUser}
          onSave={handleUpdateUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <CreateUserModal
          onSave={handleCreateUser}
          onClose={() => setShowCreateUserModal(false)}
        />
      )}
    </div>
  );
};

// User Edit Modal Component
const UserEditModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'USER'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateUserModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New User</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard; 