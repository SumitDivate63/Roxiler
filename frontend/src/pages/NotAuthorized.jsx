import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1 style={{ color: 'var(--color-error)' }}>403 - Not Authorized</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        You do not have permission to access this page.
      </p>
      <Link to="/" className="btn-primary" style={{ padding: '8px 16px' }}>Go Home</Link>
    </div>
  );
};

export default NotAuthorized;
