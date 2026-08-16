import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No store assigned
          setData({ store: null, raters: [] });
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div className="error-text" style={{ padding: '32px', textAlign: 'center' }}>{error}</div>;
  
  if (!data || !data.store) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
          <h2 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Welcome!</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>No store is currently assigned to this account. Please contact an administrator if you believe this is a mistake.</p>
        </div>
      </div>
    );
  }

  const { store, raters } = data;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px 0', color: 'var(--color-primary)' }}>Store Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Store Name</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{store.name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Average Rating</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
            {store.averageRating > 0 ? Number(store.averageRating).toFixed(2) : <span style={{fontSize: '18px', fontWeight: 'normal', color: 'var(--color-text-secondary)'}}>No ratings yet</span>}
          </div>
        </div>
      </div>

      <h2 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>Recent Ratings</h2>
      
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {raters.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No ratings have been submitted yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '16px' }}>Date</th>
                <th style={{ padding: '16px' }}>User</th>
                <th style={{ padding: '16px' }}>Email</th>
                <th style={{ padding: '16px' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {raters.map((rater, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                    {new Date(rater.date).toLocaleDateString()} {new Date(rater.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{rater.name}</td>
                  <td style={{ padding: '16px' }}>{rater.email}</td>
                  <td style={{ padding: '16px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{rater.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
