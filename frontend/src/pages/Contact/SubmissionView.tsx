import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardHeader, CardContent, Divider, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import contactService from '../../services/contactService';

const ContactSubmissionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await contactService.getSubmissionDetail(id!);
        setSubmission(res.data);
      } catch {
        setError('Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><Alert severity="error">{error}</Alert></Box>;
  if (!submission) return null;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Card elevation={3} sx={{ width: '100%', maxWidth: 1100, mx: 'auto', borderRadius: 3, overflowX: 'hidden' }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight={600}>Contact Details</Typography>}
          sx={{ pb: 0, alignItems: 'flex-start', mb: 2 }}
        />
        <Divider sx={{ mb: 3 }} />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <Typography variant="body1" color="text.secondary"><b>Name:</b> {submission.firstName} {submission.lastName}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}><b>Email:</b> {submission.email}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}><b>Phone:</b> {submission.phone || '-'}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}><b>Submitted At:</b> {new Date(submission.submittedAt).toLocaleString()}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}><b>IP Address:</b> {submission.ipAddress}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Message</Typography>
            <Box sx={{ p: 2, background: '#f9f9f9', borderRadius: 2, color: 'text.primary', fontSize: 16, minHeight: 60 }}>{submission.message}</Box>
          </Box>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
            Back
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ContactSubmissionView; 