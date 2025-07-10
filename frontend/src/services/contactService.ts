// contactService.ts
// Service module for contact form submissions and related API calls.
// Provides functions for fetching, deleting, and exporting contact submissions.
// Usage: Used by contact pages for managing submissions.

import apiClient from './apiClient';

const contactService = {
  submit: (data: any) => apiClient.post('/contact', data),
  getSubmissions: (params: any) => apiClient.get('/contact/submissions', { params }),
  getSubmissionDetail: (id: string) => apiClient.get(`/contact/submissions/${id}`),
  exportCsv: (params: any) => apiClient.get('/contact/submissions', { params: { ...params, exportCsv: true }, responseType: 'blob' }),
};

export default contactService; 