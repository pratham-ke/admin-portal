// Sidebar.tsx
// Sidebar navigation component for the admin portal.
// Provides navigation links to all main sections of the admin portal.
// Usage: Used as part of the main layout to allow users to navigate between pages.

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as TeamIcon,
  Article as BlogIcon,
  Work as PortfolioIcon,
  Person as UserIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  People as PeopleIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../ConfirmDialog';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Team', icon: <TeamIcon />, path: '/team' },
  { text: 'Blog', icon: <BlogIcon />, path: '/blog' },
  { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
  { text: 'Contact', icon: <PeopleIcon />, path: '/contact-submissions', adminOnly: true },
  { text: 'Users', icon: <UserIcon />, path: '/users', adminOnly: true },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  };
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          background: '#fff',
          color: '#222',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 56,
          px: 0,
          py: 0,
          cursor: 'pointer',
          width: '100%',
          background: '#fff',
          borderBottom: '1px solid #eee',
        }}
        onClick={() => navigate('/dashboard')}
      >
        {isCollapsed ? (
          <img
            src={process.env.PUBLIC_URL + '/kernel-icon.png'}
            alt="Kernel Icon"
            style={{
              height: 32,
              width: 32,
              objectFit: 'contain',
              transition: 'width 0.3s, height 0.3s',
              display: 'block',
            }}
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + '/kernel-logo.png'}
            alt="Kernel Logo"
            style={{
              height: 32,
              width: 100,
              objectFit: 'contain',
              transition: 'width 0.3s, height 0.3s',
              display: 'block',
            }}
          />
        )}
      </Box>
      {/* End Logo Section */}
      <Box sx={{ flex: 1, overflow: 'hidden', mt: 0, display: 'flex', flexDirection: 'column' }}>
        <List>
          {filteredMenuItems.map((item) => {
            // Highlight as active if the current path starts with the item's path
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Tooltip 
                key={item.path} 
                title={isCollapsed ? item.text : ''} 
                placement="right"
              >
                <ListItem
                  component="li"
                  onClick={() => handleItemClick(item.path)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#488010' : 'transparent',
                    color: isActive ? '#fff' : '#222',
                    '&:hover': {
                      backgroundColor: '#488010',
                      color: '#fff',
                    },
                    '&:hover .sidebar-icon, &:focus .sidebar-icon': {
                      color: '#fff',
                    },
                    transition: 'all 0.2s ease',
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon 
                    className="sidebar-icon"
                    sx={{ 
                      color: isActive ? '#fff' : '#488010',
                      minWidth: isCollapsed ? 40 : 56,
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed ? (
                    <ListItemText 
                      primary={item.text} 
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  ) : null}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>
      {/* Logout at the bottom */}
      <Box sx={{ mb: 2 }}>
        <Divider sx={{ my: 2 }} />
        <List>
          <Tooltip 
            title={isCollapsed ? 'Logout' : ''} 
            placement="right"
          >
            <ListItem
              component="button"
              onClick={handleLogout}
              sx={{
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                width: '100%',
                textAlign: 'left',
                color: '#222',
                '&:hover, &:focus': {
                  backgroundColor: '#488010',
                  color: '#fff',
                },
                '&:hover .logout-icon, &:focus .logout-icon': {
                  color: '#fff',
                },
                transition: 'all 0.2s ease',
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                className="logout-icon"
                sx={{
                  minWidth: isCollapsed ? 40 : 56,
                  color: '#488010',
                  transition: 'color 0.2s',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed ? <ListItemText primary="Logout" /> : null}
            </ListItem>
          </Tooltip>
        </List>
      </Box>
      <ConfirmDialog
        open={logoutDialogOpen}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
        confirmButtonText="Logout"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </Drawer>
  );
};

export default Sidebar; 