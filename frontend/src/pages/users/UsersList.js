import React from 'react';
import { useQuery } from 'react-query';
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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

// Service simulé pour récupérer les utilisateurs
const fetchUsers = async () => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  return [
    { 
      id: 'u1', 
      username: 'admin',
      email: 'admin@example.com',
      full_name: 'Administrateur',
      department: 'IT',
      region: 'Global',
      role: 'admin',
      is_active: true,
      created_at: '2025-01-01T10:00:00Z',
      last_login: '2025-03-20T09:15:00Z'
    },
    { 
      id: 'u2', 
      username: 'datascientist',
      email: 'datascientist@example.com',
      full_name: 'Data Scientist',
      department: 'Data Science',
      region: 'Europe',
      role: 'data_scientist',
      is_active: true,
      created_at: '2025-01-15T14:30:00Z',
      last_login: '2025-03-19T16:45:00Z'
    },
    { 
      id: 'u3', 
      username: 'business',
      email: 'business@example.com',
      full_name: 'Business User',
      department: 'Marketing',
      region: 'Amérique du Nord',
      role: 'business_user',
      is_active: true,
      created_at: '2025-02-01T09:00:00Z',
      last_login: '2025-03-18T11:20:00Z'
    },
    { 
      id: 'u4', 
      username: 'viewer',
      email: 'viewer@example.com',
      full_name: 'Viewer User',
      department: 'Finance',
      region: 'Global',
      role: 'viewer',
      is_active: true,
      created_at: '2025-02-15T16:00:00Z',
      last_login: '2025-03-17T14:10:00Z'
    },
    { 
      id: 'u5', 
      username: 'inactive',
      email: 'inactive@example.com',
      full_name: 'Inactive User',
      department: 'RH',
      region: 'Asie',
      role: 'business_user',
      is_active: false,
      created_at: '2025-01-20T11:30:00Z',
      last_login: '2025-02-10T10:05:00Z'
    }
  ];
};

const UsersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState(null);
  
  // Récupérer les utilisateurs avec React Query
  const { data: users, isLoading, error } = useQuery('users', fetchUsers);
  
  // Filtrer les utilisateurs
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
      const matchesRole = roleFilter === '' || user.role === roleFilter;
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'active' && user.is_active) || 
        (statusFilter === 'inactive' && !user.is_active);
      
      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, departmentFilter, roleFilter, statusFilter]);
  
  // Obtenir les options uniques pour les filtres
  const departments = React.useMemo(() => {
    if (!users) return [];
    return [...new Set(users.map(user => user.department))];
  }, [users]);
  
  const roles = React.useMemo(() => {
    if (!users) return [];
    return [...new Set(users.map(user => user.role))];
  }, [users]);
  
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
    
    return <Chip label={label} color={color} size="small" />;
  };
  
  // Fonction pour afficher le statut avec une puce colorée
  const renderStatus = (isActive) => {
    return isActive ? 
      <Chip label="Actif" color="success" size="small" /> : 
      <Chip label="Inactif" color="default" size="small" />;
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
  
  // Gérer le clic sur le bouton d'ajout
  const handleAddClick = () => {
    navigate('/users/create');
  };
  
  // Gérer le clic sur un utilisateur
  const handleUserClick = (id) => {
    navigate(`/users/${id}`);
  };
  
  // Gérer le clic sur le bouton de suppression
  const handleDeleteClick = (user, event) => {
    event.stopPropagation();
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  // Gérer la confirmation de suppression
  const handleDeleteConfirm = () => {
    // Logique de suppression ici
    console.log(`Suppression de l'utilisateur ${userToDelete.username}`);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  if (isLoading) {
    return <Typography>Chargement des utilisateurs...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Utilisateurs</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Ajouter un utilisateur
        </Button>
      </Box>
      
      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={departmentFilter}
                label="Département"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={roleFilter}
                label="Rôle"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role === 'admin' ? 'Administrateur' : 
                     role === 'data_scientist' ? 'Data Scientist' : 
                     role === 'business_user' ? 'Utilisateur Métier' : 
                     role === 'viewer' ? 'Lecteur' : role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Nom complet</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Dernière connexion</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow 
                key={user.id} 
                hover 
                onClick={() => handleUserClick(user.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{renderRole(user.role)}</TableCell>
                <TableCell>{renderStatus(user.is_active)}</TableCell>
                <TableCell>{formatDate(user.last_login)}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/${user.id}`);
                  }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/edit/${user.id}`);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={(e) => handleDeleteClick(user, e)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToDelete && `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.username}" ? Cette action est irréversible.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
