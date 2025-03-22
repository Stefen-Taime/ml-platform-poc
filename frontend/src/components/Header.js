import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Header = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ marginRight: '36px' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Plateforme ML Centralisée
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/profile')}>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
