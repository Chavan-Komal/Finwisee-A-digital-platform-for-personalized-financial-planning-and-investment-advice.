import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isRegistered = () => {
    // Check if user exists in localStorage users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) return false;
    
    const currentUser = JSON.parse(userInfo);
    return users.some(u => u.email === currentUser.email);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isRegistered
  };
}; 