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
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import ConfirmDialog from '../../components/ConfirmDialog';

// --- Embedded Team Service ---
const teamService = {
  getMembers: () => apiClient.get('/v1/team?admin=true'),
  deleteMember: (id: string) => apiClient.delete(`/v1/team/${id}`),
  toggleMemberStatus: (id: string) => apiClient.patch(`/v1/team/${id}/toggle-status`),
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

const TEAM_ROWS_PER_PAGE_KEY = 'teamRowsPerPage';
const TEAM_PAGE_KEY = 'teamPage';

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof TeamMember>('name');
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem(TEAM_ROWS_PER_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 10;
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(TEAM_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuMemberId, setMenuMemberId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setDeleteMemberId(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (deleteMemberId !== null) {
      try {
        await teamService.deleteMember(String(deleteMemberId));
        fetchMembers();
      } catch (error) {
        setError('Failed to delete team member');
      }
    }
    setDeleteDialogOpen(false);
    setDeleteMemberId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteMemberId(null);
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
    localStorage.setItem(TEAM_PAGE_KEY, newPage.toString());
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
    localStorage.setItem(TEAM_ROWS_PER_PAGE_KEY, value.toString());
    localStorage.setItem(TEAM_PAGE_KEY, '0');
  };

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
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={getImageUrl(member.image)}
                        alt={member.name}
                        style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12 }}
                      />
                      <Typography variant="subtitle1">{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={member.status === 'active'}
                      onChange={() => handleToggleStatus(member.id)}
                      color="primary"
                    />
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/team/view/${member.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(member.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={(e) => handleMenuOpen(e, member.id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuMemberId === member.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleDeleteClick(member.id)}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
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
      </Paper>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Team; 