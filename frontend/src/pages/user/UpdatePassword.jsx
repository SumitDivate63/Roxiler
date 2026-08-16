import React, { useState } from 'react';
import api from '../../services/api';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const { newPassword, confirmPassword } = formData;
    
    if (newPassword.length < 8 || newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters');
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('New password must contain at least one uppercase letter');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('New password must contain at least one special character');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirm password must match the new password');
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await api.put('/auth/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (response.data.success) {
        setSuccess('Password updated successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update password. Please check your current password and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', height: 'fit-content' }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--color-primary)' }}>Update Password</h2>
        
        {error && <div className="error-text" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FCE8E8', borderRadius: '4px' }}>{error}</div>}
        {success && <div className="success-text" style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '4px', border: '1px solid var(--color-success)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword} 
              onChange={handleChange} 
              required 
            />
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              8-16 characters, 1 uppercase, 1 special character
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
