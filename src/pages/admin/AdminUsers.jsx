import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { Search, Edit, Trash2, UserPlus, Users, Mail, Phone, Shield } from 'lucide-react';
import Toggle from '../../components/common/Toggle';
import { confirmDelete, showDeleteSuccess } from '../../utils/sweetAlert';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
    page: 1,
    limit: 20,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'restaurant',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllUsers(filters);
      if (response.success) {
        setUsers(response.data.users || []);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'restaurant',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'restaurant',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'restaurant',
      isActive: true,
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      let response;
      if (editingUser) {
        response = await adminAPI.updateUser(editingUser.id, formData);
      } else {
        // Create user - you might need to add this API endpoint
        setError('User creation not implemented. Please use signup.');
        setSubmitting(false);
        return;
      }

      if (response.success) {
        setSuccess(`User ${editingUser ? 'updated' : 'created'} successfully`);
        handleCloseModal();
        fetchUsers();
      } else {
        setError(response.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setError('');
      const response = await adminAPI.updateUser(userId, {
        isActive: !currentStatus,
      });

      if (response.success) {
        setSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        setError(response.message || 'Failed to update user status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete({
      text: 'This user account will be permanently removed from the system.',
      confirmButtonText: 'Yes, delete user',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setError('');
      const response = await adminAPI.deleteUser(id);
      if (response.success) {
        await fetchUsers();
        await showDeleteSuccess({
          text: 'The user has been deleted successfully.',
        });
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'delivery_partner', label: 'Delivery Partner' },
    { value: 'customer', label: 'Customer' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const modalFooter = (
    <div className="modal-footer-actions">
      <Button variant="secondary" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button type="submit" loading={submitting} onClick={handleSubmit}>
        {editingUser ? 'Update User' : 'Create User'}
      </Button>
    </div>
  );

  if (loading && users.length === 0) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage system users and their roles</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <UserPlus size={18} />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="form-label">Search</label>
            <div className="input-with-icon">
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <Select
              label="Role"
              name="role"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              options={roleOptions}
            />
          </div>
          <div className="filter-group">
            <Select
              label="Status"
              name="isActive"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {users.length > 0 ? (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="user-info">
                        <Users size={18} />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <Mail size={18} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      {user.phone ? (
                        <div className="user-info">
                          <Phone size={18} />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="role-badge">
                        <Shield size={14} />
                        <span>{user.role.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td>
                      <Toggle
                        checked={user.isActive}
                        onChange={() => handleToggleStatus(user.id, user.isActive)}
                      />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <h3>No users found</h3>
            <p>Try adjusting your filters or add a new user.</p>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add User'}
        size="lg"
        footer={modalFooter}
      >
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-grid">
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions.filter((opt) => opt.value !== '')}
              required
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
