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
  TableSortLabel,
  TablePagination,
  Menu,
  MenuItem,
  Switch,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';

// --- Embedded Team Service ---
const teamService = {
  getMembers: () => apiClient.get('/team'),
  deleteMember: (id: string) => apiClient.delete(`/team/${id}`),
  toggleMemberStatus: (id: string) => apiClient.patch(`/team/${id}/toggle-status`),
};
// -------------------------

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  email: string;
  status: 'active' | 'inactive';
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Team&background=random&size=48';

const getImageUrl = (image: string | undefined) => {
    if (!image) return DEFAULT_IMAGE;
    if (/^https?:\/\//.test(image)) return image;
    return `http://localhost:5000/uploads/team/${image}`;
};

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof TeamMember>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuMemberId, setMenuMemberId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await teamService.getMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError('Failed to fetch team members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: number) => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamService.deleteMember(String(id));
        fetchMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
        setError('Failed to delete team member');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
        await teamService.toggleMemberStatus(String(id));
        // Optimistic update
        setMembers(prevMembers =>
            prevMembers.map(m => (m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m))
        );
    } catch (error) {
        console.error('Error toggling status:', error);
        setError('Failed to toggle status');
        // Revert on error
        fetchMembers();
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

  function getComparator<Key extends keyof TeamMember>(order: 'asc' | 'desc', orderBy: Key): (a: TeamMember, b: TeamMember) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedMembers = members.slice().sort((a, b) => getComparator(order, orderBy)(a,b));
  const paginatedMembers = sortedMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, memberId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuMemberId(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMemberId(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/team/edit/${id}`);
    handleMenuClose();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/team/add')}
        >
          Add Member
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
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
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMembers.map((member, index) => (
              <TableRow key={member.id} hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                    <img src={getImageUrl(member.image)} alt={member.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <Switch
                    checked={member.status === 'active'}
                    onChange={() => handleToggleStatus(member.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/team/view/${member.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, member.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuMemberId === member.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleEdit(member.id)}>Edit</MenuItem>
                    <MenuItem onClick={() => handleDelete(member.id)}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={members.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Team; 