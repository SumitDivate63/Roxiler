import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotAuthorized from './pages/NotAuthorized';

import { AdminDashboard, AdminUsers, AdminStores } from './pages/admin/Placeholders';
import StoreList from './pages/user/StoreList';
import UpdatePassword from './pages/user/UpdatePassword';
import { OwnerDashboard, OwnerUpdatePassword } from './pages/owner/Placeholders';

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  if (role === 'user') return <Navigate to="/user/stores" replace />;
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['admin']}><AdminStores /></ProtectedRoute>} />

          {/* User Routes */}
          <Route path="/user/stores" element={<ProtectedRoute allowedRoles={['user']}><StoreList /></ProtectedRoute>} />
          <Route path="/user/update-password" element={<ProtectedRoute allowedRoles={['user']}><UpdatePassword /></ProtectedRoute>} />

          {/* Store Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/update-password" element={<ProtectedRoute allowedRoles={['store_owner']}><OwnerUpdatePassword /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
