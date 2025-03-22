import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [open, setOpen] = React.useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} toggleDrawer={toggleDrawer} />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          padding: (theme) => theme.spacing(3),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
