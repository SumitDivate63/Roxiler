import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotAuthorized from './pages/NotAuthorized';

import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import AddUser from './pages/admin/AddUser';
import UserDetail from './pages/admin/UserDetail';
import AdminStoreList from './pages/admin/StoreList';
import AddStore from './pages/admin/AddStore';

import StoreList from './pages/user/StoreList';
import UpdatePassword from './pages/user/UpdatePassword';

import OwnerDashboard from './pages/owner/Dashboard';

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
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
          <Route path="/admin/users/add" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['admin']}><UserDetail /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['admin']}><AdminStoreList /></ProtectedRoute>} />
          <Route path="/admin/stores/add" element={<ProtectedRoute allowedRoles={['admin']}><AddStore /></ProtectedRoute>} />

          {/* User Routes */}
          <Route path="/user/stores" element={<ProtectedRoute allowedRoles={['user']}><StoreList /></ProtectedRoute>} />
          <Route path="/user/update-password" element={<ProtectedRoute allowedRoles={['user']}><UpdatePassword /></ProtectedRoute>} />

          {/* Store Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/update-password" element={<ProtectedRoute allowedRoles={['store_owner']}><UpdatePassword /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
