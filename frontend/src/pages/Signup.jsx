import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          // Field-level express-validator errors
          const apiErrors = {};
          err.response.data.errors.forEach(e => {
            apiErrors[e.path] = e.msg;
          });
          setErrors(apiErrors);
        } else if (err.response.data.message) {
          setServerError(err.response.data.message);
        }
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--color-primary)' }}>Create an Account</h2>
        
        {serverError && <div className="error-text" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FCE8E8', borderRadius: '4px' }}>{serverError}</div>}
        {success && <div className="success-text" style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '4px', border: '1px solid var(--color-success)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="input-group">
            <label>Address (Optional)</label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
            />
            {errors.address && <div className="error-text">{errors.address}</div>}
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '12px' }}
            disabled={loading || success}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
