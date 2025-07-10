// Submissions.tsx
// Contact form submissions list page for the admin portal.
// Displays all contact form submissions in a table with options to view or delete.
// Fetches submission data from the API and manages user actions.

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  TextField,
  Button,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import contactService from '../../services/contactService';

interface Submission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  ipAddress: string;
}

type Order = 'asc' | 'desc';

const ContactSubmissions: React.FC = () => {
  // --- State management ---
  // State for submissions data, loading, error, etc.
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Submission>('submittedAt');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Data fetching ---
  // Fetches the list of contact submissions from the API
  const fetchSubmissions = async () => {
    try {
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
        email: emailFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      };
      const res = await contactService.getSubmissions(params);
      setSubmissions(res.data.submissions);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch submissions');
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line
  }, [page, rowsPerPage, emailFilter, dateFrom, dateTo]);

  // --- Handlers for actions (view, delete, etc.) ---
  // Helper function to compare two values for sorting
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
    }
    if (bValue == null) return -1;
    if (aValue == null) return 1;
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }

  // Function to get a comparator for sorting based on order and orderBy
  function getComparator<Key extends keyof Submission>(
    order: Order,
    orderBy: Key
  ): (a: Submission, b: Submission) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Sorts the submissions based on the current order and orderBy
  const sortedSubmissions = submissions
    .slice()
    .sort(getComparator(order, orderBy));

  // Handler for sorting column headers
  const handleRequestSort = (property: keyof Submission) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handler for changing pagination page
  const handleChangePage = (_: unknown, newPage: number) =>
    setPage(newPage);

  // Handler for changing rows per page
  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Handler for exporting submissions to CSV
  const handleExport = async () => {
    try {
      const params: any = {
        email: emailFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        exportCsv: true,
      };
      const res = await contactService.exportCsv(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contact_submissions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('Failed to export CSV');
    }
  };

  // --- Render ---
  // Renders the submissions table and action buttons
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Contact Submissions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: 2, width: '100%', mb: 3 }}>
        <TextField
          label="Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          size="small"
        />
        <TextField
          label="From"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ width: '100%', mx: 0, borderRadius: 0, boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell sortDirection={orderBy === 'firstName' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'firstName'}
                  direction={orderBy === 'firstName' ? order : 'asc'}
                  onClick={() => handleRequestSort('firstName')}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'lastName' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'lastName'}
                  direction={orderBy === 'lastName' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastName')}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'email' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Phone</TableCell>
              <TableCell sortDirection={orderBy === 'submittedAt' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'submittedAt'}
                  direction={orderBy === 'submittedAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('submittedAt')}
                >
                  Submitted At
                </TableSortLabel>
              </TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSubmissions.map((s, idx) => (
              <TableRow key={s.id} hover>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{s.firstName}</TableCell>
                <TableCell>{s.lastName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>
                  {new Date(s.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>{s.ipAddress}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/contact/${s.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ContactSubmissions; 