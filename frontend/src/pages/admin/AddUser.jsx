import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.address && formData.address.length > 400) {
      newErrors.address = 'Address must be maximum 400 characters';
    }
    
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/admin/users', formData);
      if (response.data.success) {
        setSuccess('User created successfully!');
        setFormData({ name: '', email: '', address: '', password: '', role: 'user' });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const apiErrors = {};
          err.response.data.errors.forEach(e => {
            apiErrors[e.path] = e.msg;
          });
          setErrors(apiErrors);
        } else if (err.response.data.message) {
          setServerError(err.response.data.message);
        }
      } else {
        setServerError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin/users" style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Back to Users
        </Link>
        <h1 style={{ margin: '8px 0 0 0', color: 'var(--color-primary)' }}>Add New User</h1>
      </div>

      <div className="card">
        {serverError && <div className="error-text" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FCE8E8', borderRadius: '4px' }}>{serverError}</div>}
        {success && <div className="success-text" style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '4px', border: '1px solid var(--color-success)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>

          <div className="input-group">
            <label>Address (Optional)</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <div className="error-text">{errors.address}</div>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="input-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'white', fontSize: '16px' }}>
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
