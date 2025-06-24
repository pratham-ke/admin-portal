import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getImageUrl = (image: string | undefined) => {
    const DEFAULT_IMAGE = `https://ui-avatars.com/api/?name=${user?.username ?? 'User'}&background=random`;
    if (!image) return DEFAULT_IMAGE;
    return `http://localhost:5000/uploads/user/${image}`;
  };

  const drawerWidth = 240;
  const collapsedDrawerWidth = 64;
  const currentDrawerWidth = isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: 'width 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar 
            src={getImageUrl(user?.image)} 
            alt={user?.username} 
            sx={{ width: 32, height: 32, mr: 1.5 }}
          />
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: 'width 0.3s ease',
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 