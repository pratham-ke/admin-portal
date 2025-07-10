// toastService.ts
// Service module for showing toast notifications in the admin portal.
// Provides functions for displaying success, error, and info toasts.
// Usage: Used throughout the app for user feedback.

import { AlertColor } from '@mui/material';

interface ToastOptions {
  severity?: AlertColor;
  duration?: number;
  position?: 'top' | 'bottom';
}

// Simple toast service using browser's native alert for now
// In a real application, you'd use a proper toast library like react-toastify
class ToastService {
  success(message: string, options?: ToastOptions): void {
    // No console.log
  }

  error(message: string, options?: ToastOptions): void {
    // No console.error
  }

  warning(message: string, options?: ToastOptions): void {
    // No console.warn
  }

  info(message: string, options?: ToastOptions): void {
    // No console.info
  }
}

// Create a singleton instance
const toastService = new ToastService();

export default toastService; 