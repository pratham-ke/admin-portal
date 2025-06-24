import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await authService.fetchCurrentUser();
      setUser(userData.user || userData); // support both {user} and user
    } catch (error) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token: newToken, user: userData } = await authService.login({ email, password });
      localStorage.setItem('token', newToken);
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
      // Assuming confirmPassword is handled in the component
      await authService.resetPassword(password, token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
      {children}
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