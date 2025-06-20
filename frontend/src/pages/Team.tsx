import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  email: string;
  social_links: {
    [key: string]: string;
  };
  order: number;
  status: 'active' | 'inactive';
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Team&background=random&size=48';

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    image: '',
    bio: '',
    email: '',
    social_links: {},
    order: 0,
    status: 'active',
  });
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof TeamMember>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/team', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const handleOpen = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData(member);
      setImagePreview(member.image ? `/uploads/team/${member.image}` : null);
      setImageFile(null);
    } else {
      setSelectedMember(null);
      setFormData({
        name: '',
        position: '',
        image: '',
        bio: '',
        email: '',
        social_links: {},
        order: 0,
        status: 'active',
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMember(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value as string);
        }
      });
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (selectedMember) {
        await axios.put(
          `http://localhost:5000/api/team/${selectedMember.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/team', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchMembers();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/team/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleRequestSort = (property: keyof TeamMember) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(order: 'asc' | 'desc', orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedMembers = members.slice().sort(getComparator(order, orderBy));
  const paginatedMembers = sortedMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Team Management
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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Team Member
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell sortDirection={orderBy === 'name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'position' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'position'}
                  direction={orderBy === 'position' ? order : 'asc'}
                  onClick={() => handleRequestSort('position')}
                >
                  Position
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
              <TableCell sortDirection={orderBy === 'status' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMembers.map((member: TeamMember, idx: number) => (
              <TableRow key={member.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>
                  {member.image && (
                    <img
                      src={/^https?:\/\//.test(member.image) ? member.image : `http://localhost:5000/uploads/team/${member.image}`}
                      alt={member.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
                    />
                  )}
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(member)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={members.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMember ? 'Edit Team Member' : 'Add Team Member'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name ?? ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Position"
              value={formData.position ?? ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Bio"
              value={formData.bio ?? ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email ?? ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Order"
              type="number"
              value={formData.order ?? 0}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              margin="normal"
            />
            <Box sx={{ my: 2 }}>
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" accept="image/png, image/jpeg" hidden onChange={handleImageChange} />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 1 }}>
                  <img src={imagePreview} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedMember ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Team; 