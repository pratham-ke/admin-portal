import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { CircularProgress, Box } from '@mui/material';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await authService.fetchCurrentUser();
      setUser(userData.user || userData); // support both {user} and user
      setLoading(false);
    } catch (error) {
      logout();
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const { token: newToken, user: userData } = await authService.login({ email, password });
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', newToken);
        localStorage.removeItem('token');
      }
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
      await authService.resetPassword(token, password, confirmPassword);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup: async (username: string, email: string, password: string) => {
          // Implementation of signup function
        },
        forgotPassword,
        resetPassword,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 