import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';

// Service simulé pour récupérer un utilisateur
const fetchUser = async (id) => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  const users = {
    'u1': { 
      id: 'u1', 
      username: 'admin',
      email: 'admin@example.com',
      full_name: 'Administrateur',
      department: 'IT',
      region: 'Global',
      role: 'admin',
      is_active: true,
      created_at: '2025-01-01T10:00:00Z',
      last_login: '2025-03-20T09:15:00Z',
      models_count: 5,
      deployments_count: 8,
      executions_count: 25,
      recent_activity: [
        { type: 'model_create', name: 'Nouveau modèle de prévision', date: '2025-03-19T14:30:00Z' },
        { type: 'deployment_update', name: 'Mise à jour du déploiement Europe', date: '2025-03-18T11:45:00Z' },
        { type: 'execution_run', name: 'Exécution manuelle du modèle de segmentation', date: '2025-03-17T16:20:00Z' },
        { type: 'user_create', name: 'Création d\'un nouvel utilisateur', date: '2025-03-15T10:10:00Z' }
      ]
    },
    'u2': { 
      id: 'u2', 
      username: 'datascientist',
      email: 'datascientist@example.com',
      full_name: 'Data Scientist',
      department: 'Data Science',
      region: 'Europe',
      role: 'data_scientist',
      is_active: true,
      created_at: '2025-01-15T14:30:00Z',
      last_login: '2025-03-19T16:45:00Z',
      models_count: 12,
      deployments_count: 5,
      executions_count: 18,
      recent_activity: [
        { type: 'model_create', name: 'Nouveau modèle de clustering', date: '2025-03-19T15:30:00Z' },
        { type: 'model_update', name: 'Mise à jour du modèle de prévision', date: '2025-03-17T11:20:00Z' },
        { type: 'execution_run', name: 'Exécution du modèle de clustering', date: '2025-03-16T09:45:00Z' }
      ]
    },
    'u3': { 
      id: 'u3', 
      username: 'business',
      email: 'business@example.com',
      full_name: 'Business User',
      department: 'Marketing',
      region: 'Amérique du Nord',
      role: 'business_user',
      is_active: true,
      created_at: '2025-02-01T09:00:00Z',
      last_login: '2025-03-18T11:20:00Z',
      models_count: 0,
      deployments_count: 3,
      executions_count: 12,
      recent_activity: [
        { type: 'execution_run', name: 'Exécution du modèle de segmentation clients', date: '2025-03-18T10:15:00Z' },
        { type: 'execution_run', name: 'Exécution du modèle de prévision des ventes', date: '2025-03-15T14:30:00Z' },
        { type: 'deployment_view', name: 'Consultation du déploiement Marketing', date: '2025-03-14T11:45:00Z' }
      ]
    }
  };
  
  if (!users[id]) {
    throw new Error('Utilisateur non trouvé');
  }
  
  return users[id];
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  
  // Récupérer l'utilisateur avec React Query
  const { data: user, isLoading, error } = useQuery(['user', id], () => fetchUser(id));
  
  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fonction pour afficher le rôle avec une puce colorée
  const renderRole = (role) => {
    let color;
    let label;
    
    switch (role) {
      case 'admin':
        color = 'error';
        label = 'Administrateur';
        break;
      case 'data_scientist':
        color = 'primary';
        label = 'Data Scientist';
        break;
      case 'business_user':
        color = 'success';
        label = 'Utilisateur Métier';
        break;
      case 'viewer':
        color = 'default';
        label = 'Lecteur';
        break;
      default:
        color = 'default';
        label = role;
    }
    
    return <Chip label={label} color={color} />;
  };
  
  // Fonction pour afficher le statut avec une puce colorée
  const renderStatus = (isActive) => {
    return isActive ? 
      <Chip label="Actif" color="success" /> : 
      <Chip label="Inactif" color="default" />;
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtenir l'icône pour le type d'activité
  const getActivityIcon = (type) => {
    switch (type) {
      case 'model_create':
      case 'model_update':
        return <i className="fas fa-brain" />;
      case 'deployment_create':
      case 'deployment_update':
      case 'deployment_view':
        return <i className="fas fa-rocket" />;
      case 'execution_run':
        return <i className="fas fa-play" />;
      case 'user_create':
      case 'user_update':
        return <i className="fas fa-user" />;
      default:
        return <i className="fas fa-info-circle" />;
    }
  };
  
  // Obtenir la première lettre du nom pour l'avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
  
  if (isLoading) {
    return <Typography>Chargement de l'utilisateur...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/users')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Profil utilisateur</Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/users/edit/${user.id}`)}
          >
            Modifier
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<LockIcon />}
            onClick={() => setPasswordDialogOpen(true)}
          >
            Changer le mot de passe
          </Button>
        </Box>
      </Box>
      
      {/* Informations générales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                fontSize: 40,
                bgcolor: user.role === 'admin' ? 'error.main' : 
                         user.role === 'data_scientist' ? 'primary.main' : 
                         user.role === 'business_user' ? 'success.main' : 'grey.500'
              }}
            >
              {getInitial(user.full_name)}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h5" gutterBottom>{user.full_name}</Typography>
            <Typography variant="subtitle1" gutterBottom>@{user.username}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">{user.full_name}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">{user.department}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PublicIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">{user.region}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ mr: 1 }}>Rôle:</Typography>
              {renderRole(user.role)}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ mr: 1 }}>Statut:</Typography>
              {renderStatus(user.is_active)}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Créé le {formatDate(user.created_at)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Dernière connexion le {formatDate(user.last_login)}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Paper sx={{ p: 1, textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6">{user.models_count}</Typography>
                <Typography variant="body2">Modèles</Typography>
              </Paper>
              <Paper sx={{ p: 1, textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6">{user.deployments_count}</Typography>
                <Typography variant="body2">Déploiements</Typography>
              </Paper>
              <Paper sx={{ p: 1, textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6">{user.executions_count}</Typography>
                <Typography variant="body2">Exécutions</Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Activité récente" />
          <Tab label="Modèles" />
          <Tab label="Déploiements" />
          <Tab label="Exécutions" />
        </Tabs>
      </Box>
      
      {/* Contenu des onglets */}
      <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Activité récente" />
          <CardContent>
            <List>
              {user.recent_activity.map((activity, index) => (
                <ListItem key={index} divider={index < user.recent_activity.length - 1}>
                  <ListItemText 
                    primary={activity.name} 
                    secondary={formatDate(activity.date)} 
                  />
                </ListItem>
              ))}
              {user.recent_activity.length === 0 && (
                <Typography>Aucune activité récente</Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Modèles" />
          <CardContent>
            <Typography>
              {user.models_count > 0 
                ? `L'utilisateur a créé ${user.models_count} modèle(s).` 
                : "L'utilisateur n'a pas encore créé de modèle."}
            </Typography>
            {/* Liste des modèles ici */}
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Déploiements" />
          <CardContent>
            <Typography>
              {user.deployments_count > 0 
                ? `L'utilisateur a ${user.deployments_count} déploiement(s).` 
                : "L'utilisateur n'a pas encore de déploiement."}
            </Typography>
            {/* Liste des déploiements ici */}
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 3 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Exécutions" />
          <CardContent>
            <Typography>
              {user.executions_count > 0 
                ? `L'utilisateur a lancé ${user.executions_count} exécution(s).` 
                : "L'utilisateur n'a pas encore lancé d'exécution."}
            </Typography>
            {/* Liste des exécutions ici */}
          </CardContent>
        </Card>
      </Box>
      
      {/* Dialogue de changement de mot de passe */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Entrez un nouveau mot de passe pour l'utilisateur {user.username}.
          </DialogContentText>
          
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => {
            // Logique de changement de mot de passe ici
            setPasswordDialogOpen(false);
          }}>
            Changer le mot de passe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
