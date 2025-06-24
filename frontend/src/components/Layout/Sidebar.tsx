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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Team', icon: <TeamIcon />, path: '/team' },
  { text: 'Blog', icon: <BlogIcon />, path: '/blog' },
  { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        },
      }}
    >
      <Box sx={{ overflow: 'hidden', mt: 8 }}>
        <List>
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
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
                    backgroundColor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.main' : 'action.hover',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease',
                    },
                    transition: 'all 0.2s ease',
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.contrastText' : 'inherit',
                      minWidth: isCollapsed ? 40 : 56,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary={item.text} 
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
        
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
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
                transition: 'all 0.2s ease',
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'inherit',
                  minWidth: isCollapsed ? 40 : 56,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Logout" 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                    },
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 