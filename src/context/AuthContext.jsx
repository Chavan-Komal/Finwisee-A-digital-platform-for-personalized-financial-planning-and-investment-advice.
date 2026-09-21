import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UNAUTHORIZED_EVENT } from '../api/client';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const isTokenExpired = (jwt) => {
  try {
    const [, payload] = jwt.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const readStoredUser = () => {
  try {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('userInfo');
    if (!token || !saved || isTokenExpired(token)) return { user: null, token: null };
    return { user: JSON.parse(saved), token };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredUser);
  const { user, token } = session;

  const login = useCallback(({ user: userData, token: jwt }) => {
    if (!jwt || !userData) return;
    localStorage.setItem('token', jwt);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setSession({ user: userData, token: jwt });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setSession({ user: null, token: null });
  }, []);

  /** Keep the cached user (name, phone...) in sync after profile edits. */
  const updateUser = useCallback((changes) => {
    setSession((prev) => {
      if (!prev.user) return prev;
      const next = { ...prev.user, ...changes };
      localStorage.setItem('userInfo', JSON.stringify(next));
      return { ...prev, user: next };
    });
  }, []);

  // Log out when the API reports the session is no longer valid
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const isAuthenticated = useCallback(() => Boolean(token && user && !isTokenExpired(token)), [token, user]);

  const getAuthHeader = useCallback(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading: false,
    login,
    logout,
    updateUser,
    isAuthenticated,
    getAuthHeader,
  }), [user, token, login, logout, updateUser, isAuthenticated, getAuthHeader]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const dashboardPathFor = (user) => (user?.role === 'ADMIN' ? '/admin' : '/user');
