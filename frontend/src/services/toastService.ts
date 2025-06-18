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
    console.log(`✅ ${message}`);
    // For now, use console.log. In production, integrate with a proper toast library
  }

  error(message: string, options?: ToastOptions): void {
    console.error(`❌ ${message}`);
    // For now, use console.error. In production, integrate with a proper toast library
  }

  warning(message: string, options?: ToastOptions): void {
    console.warn(`⚠️ ${message}`);
    // For now, use console.warn. In production, integrate with a proper toast library
  }

  info(message: string, options?: ToastOptions): void {
    console.info(`ℹ️ ${message}`);
    // For now, use console.info. In production, integrate with a proper toast library
  }
}

// Create a singleton instance
const toastService = new ToastService();

export default toastService; 