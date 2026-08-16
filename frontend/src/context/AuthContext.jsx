import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (e) {
        logout();
      }
    }
    setLoading(false);

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (jwt, userData) => {
    const safeUserData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    
    setToken(jwt);
    setUser(safeUserData);
    setRole(userData.role);
    
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(safeUserData));
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
