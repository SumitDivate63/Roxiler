import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { APP_NAME, COMPANY_NAME, LOGO_PATH } from '../config/branding';

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src={LOGO_PATH} alt="Logo" style={{ height: '32px' }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--color-primary)' }}>
            {APP_NAME}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            by {COMPANY_NAME}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isAuthenticated ? (
          <>
            {role === 'admin' && (
              <>
                <Link to="/admin/dashboard" style={{ fontWeight: '500' }}>Dashboard</Link>
                <Link to="/admin/users" style={{ fontWeight: '500' }}>Users</Link>
                <Link to="/admin/stores" style={{ fontWeight: '500' }}>Stores</Link>
              </>
            )}
            
            {role === 'user' && (
              <>
                <Link to="/user/stores" style={{ fontWeight: '500' }}>Stores</Link>
                <Link to="/user/update-password" style={{ fontWeight: '500' }}>Update Password</Link>
              </>
            )}
            
            {role === 'store_owner' && (
              <>
                <Link to="/owner/dashboard" style={{ fontWeight: '500' }}>Dashboard</Link>
                <Link to="/owner/update-password" style={{ fontWeight: '500' }}>Update Password</Link>
              </>
            )}
            
            <div style={{ marginLeft: '16px', borderLeft: '1px solid var(--color-border)', paddingLeft: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                {user?.name}
              </span>
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: '500' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', color: 'white' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
