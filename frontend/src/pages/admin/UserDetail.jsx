import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading user details...</div>;
  if (error) return <div className="error-text" style={{ padding: '32px', textAlign: 'center' }}>{error}</div>;
  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>User not found.</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin/users" style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Back to Users
        </Link>
        <h1 style={{ margin: '8px 0 0 0', color: 'var(--color-primary)' }}>User Profile</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Name:</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>{user.name}</div>
          
          <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Email:</div>
          <div>{user.email}</div>
          
          <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Address:</div>
          <div>{user.address || '—'}</div>
          
          <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Role:</div>
          <div>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px',
              backgroundColor: user.role === 'admin' ? '#E3F2FD' : user.role === 'store_owner' ? '#FFF3E0' : '#E8F5E9',
              color: user.role === 'admin' ? '#1565C0' : user.role === 'store_owner' ? '#E65100' : '#2E7D32'
            }}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {user.role === 'store_owner' && (
        <>
          <h2 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>Assigned Store</h2>
          <div className="card">
            {user.store ? (
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Store Name:</div>
                <div style={{ fontWeight: '500' }}>{user.store.name}</div>
                
                <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Email:</div>
                <div>{user.store.email}</div>
                
                <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Address:</div>
                <div>{user.store.address || '—'}</div>
                
                <div style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>Average Rating:</div>
                <div style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                  {user.store.averageRating > 0 ? Number(user.store.averageRating).toFixed(2) : <span style={{color: 'var(--color-text-secondary)', fontWeight: 'normal'}}>No ratings yet</span>}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No store is assigned to this owner yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetail;
