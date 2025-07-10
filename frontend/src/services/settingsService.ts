// settingsService.ts
// Service module for settings-related API calls in the admin portal.
// Provides functions for notification emails, password change, and other settings.
// Usage: Used by settings pages for managing application settings.

import apiClient from './apiClient';

const settingsService = {
  getNotificationEmails: () => apiClient.get('/settings/emails'),
  saveNotificationEmails: (emails: string[]) => apiClient.post('/settings/emails', { emails }),
  changePassword: (currentPassword: string, newPassword: string) => apiClient.post('/users/change-password', { currentPassword, newPassword }),
};

export default settingsService; 