import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const Card = ({ title, value }) => (
    <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
      <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text-secondary)', fontSize: '16px', fontWeight: '500' }}>
        {title}
      </h3>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px 0', color: 'var(--color-primary)' }}>Admin Dashboard</h1>
      
      {error && <div className="error-text" style={{ padding: '16px', backgroundColor: '#FCE8E8', marginBottom: '16px', borderRadius: '4px' }}>{error}</div>}
      
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading dashboard...</div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Card title="Total Users" value={stats.totalUsers} />
          <Card title="Total Stores" value={stats.totalStores} />
          <Card title="Total Ratings" value={stats.totalRatings} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
