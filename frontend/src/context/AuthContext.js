import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('apexdrive_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('apexdrive_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('apexdrive_token', token);
    } else {
      localStorage.removeItem('apexdrive_token');
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('apexdrive_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('apexdrive_user');
    }
  }, [user]);

  // Background profile refresh and token verification on mount
  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('apexdrive_token');
      if (!savedToken) return;

      try {
        const res = await authAPI.getProfile();
        if (isMounted && res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('apexdrive_user', JSON.stringify(res.user));
        }
      } catch (err) {
        // Only clear session if backend explicitly reports invalid / expired token (401)
        if (
          err.message &&
          (err.message.includes('401') ||
            err.message.toLowerCase().includes('expired') ||
            err.message.toLowerCase().includes('invalid'))
        ) {
          console.warn('[AuthContext] Session expired:', err.message);
          if (isMounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('apexdrive_token');
            localStorage.removeItem('apexdrive_user');
            localStorage.removeItem('apexdrive_current_page');
          }
        } else {
          // Network errors or dev server restart: do NOT log out!
          console.warn('[AuthContext] Profile verification deferred (offline or server restarting):', err.message);
        }
      }
    };

    verifyToken();
    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('apexdrive_token', response.token);
        localStorage.setItem('apexdrive_user', JSON.stringify(response.user));
        return { success: true, user: response.user, token: response.token };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.register(userData);
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('apexdrive_token', response.token);
        localStorage.setItem('apexdrive_user', JSON.stringify(response.user));
        return { success: true, user: response.user, token: response.token };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('apexdrive_token');
    localStorage.removeItem('apexdrive_user');
    localStorage.removeItem('apexdrive_current_page');
  };

  // Refresh profile manually
  const refreshProfile = async () => {
    if (!token) return null;
    try {
      const res = await authAPI.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('apexdrive_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (err) {
      console.warn('[AuthContext] Manual refresh profile failed:', err.message);
    }
    return null;
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        authError,
        login,
        register,
        logout,
        setUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
