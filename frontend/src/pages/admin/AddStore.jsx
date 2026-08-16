import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get('/admin/users?role=store_owner&limit=1000');
        if (response.data.success) {
          setOwners(response.data.data);
        }
      } catch (err) {
        setServerError('Failed to load store owners list.');
      } finally {
        setOwnersLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    setErrors({});
    
    // Basic frontend validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Invalid email address' });
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        ownerId: formData.ownerId ? parseInt(formData.ownerId, 10) : null
      };
      
      const response = await api.post('/admin/stores', payload);
      if (response.data.success) {
        setSuccess('Store created successfully!');
        setFormData({ name: '', email: '', address: '', ownerId: '' });
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
        <Link to="/admin/stores" style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Back to Stores
        </Link>
        <h1 style={{ margin: '8px 0 0 0', color: 'var(--color-primary)' }}>Add New Store</h1>
      </div>

      <div className="card">
        {serverError && <div className="error-text" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FCE8E8', borderRadius: '4px' }}>{serverError}</div>}
        {success && <div className="success-text" style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '4px', border: '1px solid var(--color-success)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Store Name</label>
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
          
          <div className="input-group">
            <label>Store Owner</label>
            {ownersLoading ? (
              <div style={{ padding: '10px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Loading owners...</div>
            ) : owners.length === 0 ? (
              <div style={{ padding: '10px', fontSize: '14px', color: 'var(--color-error)' }}>No store owners found in the system.</div>
            ) : (
              <select name="ownerId" value={formData.ownerId} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'white', fontSize: '16px' }}>
                <option value="">Unassigned</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            )}
            {errors.ownerId && <div className="error-text">{errors.ownerId}</div>}
          </div>
          
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px', marginTop: '8px' }} disabled={loading || ownersLoading}>
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
