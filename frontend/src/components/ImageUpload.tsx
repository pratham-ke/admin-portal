// ImageUpload.tsx
// Component for uploading and previewing images (e.g., profile pictures) in forms.
// Accepts props for preview image, file change handler, label, avatar size, accepted file types, and shape.
// Usage: Used in user, team, portfolio, and blog forms for image upload.

import React from 'react';
import { Box, Avatar, Button } from '@mui/material';

interface ImageUploadProps {
  imagePreview: string | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  avatarSize?: number;
  square?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onFileChange,
  label = 'Upload Image',
  accept = 'image/png, image/jpeg',
  avatarSize = 100,
  square = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar
        src={imagePreview || undefined}
        sx={{ width: avatarSize, height: avatarSize, mb: 2, borderRadius: square ? '4px' : '50%', objectFit: 'cover', backgroundColor: '#f0f0f0' }}
        variant={square ? 'square' : 'circular'}
      />
      <Button variant="contained" component="label">
        {label}
        <input type="file" hidden onChange={handleChange} accept={accept} />
      </Button>
    </Box>
  );
};

export default ImageUpload; 