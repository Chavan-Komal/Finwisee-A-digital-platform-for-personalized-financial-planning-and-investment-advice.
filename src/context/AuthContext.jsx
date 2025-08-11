import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') console.log(...args);
};

const isTokenExpired = (jwt) => {
  try {
    const [, payload] = jwt.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const login = useCallback(({ user: userData, token: jwt }) => {
    if (!jwt || !userData) return;
    localStorage.setItem('token', jwt);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    if (mountedRef.current) {
      setToken(jwt);
      setUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    if (mountedRef.current) {
      setUser(null);
      setToken(null);
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    if (!token || !user) return false;
    if (isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  }, [token, user, logout]);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getAuthHeader,
  }), [user, token, isLoading, login, logout, isAuthenticated, getAuthHeader]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
