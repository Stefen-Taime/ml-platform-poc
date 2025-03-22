import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Toolbar
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DeploymentUnitIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

const drawerWidth = 240;

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Modèles', icon: <ModelTrainingIcon />, path: '/models' },
    { text: 'Déploiements', icon: <DeploymentUnitIcon />, path: '/deployments' },
    { text: 'Exécutions', icon: <PlayArrowIcon />, path: '/executions' },
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
    { text: 'Rapports', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Intégrations', icon: <LayersIcon />, path: '/integrations' },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          boxSizing: 'border-box',
          ...(!open && {
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            width: (theme) => theme.spacing(7),
          }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
