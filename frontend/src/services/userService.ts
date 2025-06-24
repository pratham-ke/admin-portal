import apiClient from './apiClient';

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: FormData) => {
  const response = await apiClient.post('/users', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (id: string, userData: FormData) => {
  const response = await apiClient.put(`/users/${id}`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const toggleUserStatus = async (id: string) => {
  const response = await apiClient.patch(`/users/${id}/toggle-status`);
  return response.data;
}; 