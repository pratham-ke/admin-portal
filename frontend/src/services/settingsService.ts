import apiClient from './apiClient';

const settingsService = {
  getNotificationEmails: () => apiClient.get('/settings/emails'),
  saveNotificationEmails: (emails: string[]) => apiClient.post('/settings/emails', { emails }),
};

export default settingsService; 