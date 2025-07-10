// ConfirmDialog.tsx
// Component for showing a confirmation dialog/modal for critical user actions (e.g., delete, logout).
// Accepts props for open state, title, description, confirm/cancel button text, and callbacks.
// Usage: Used in lists and sidebars for confirming destructive or important actions.

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: '#488010',
            color: '#488010',
            '&:hover': {
              borderColor: '#36610c',
              color: '#36610c',
              backgroundColor: 'rgba(72, 128, 16, 0.04)',
            },
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
          sx={{
            backgroundColor: '#488010',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#36610c',
            },
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 