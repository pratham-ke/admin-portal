// authService.ts
// Service module for authentication-related API calls in the admin portal.
// Provides functions for login, fetching current user, password reset, etc.
// Usage: Used by auth context and pages for authentication flows.

import apiClient from './apiClient';

export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  const response = await apiClient.post('/auth/reset-password', { token, password, confirmPassword });
  return response.data;
}; 