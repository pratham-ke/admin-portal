import apiClient from './apiClient';

const settingsService = {
  getNotificationEmails: () => apiClient.get('/settings/emails'),
  saveNotificationEmails: (emails: string[]) => apiClient.post('/settings/emails', { emails }),
  changePassword: (currentPassword: string, newPassword: string) => apiClient.post('/users/change-password', { currentPassword, newPassword }),
};

export default settingsService; 