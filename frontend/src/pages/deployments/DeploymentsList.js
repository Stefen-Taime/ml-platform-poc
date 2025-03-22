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
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useNavigate } from 'react-router-dom';

// Service simulé pour récupérer les déploiements
const fetchDeployments = async () => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  return [
    { 
      id: 'd1', 
      name: 'Déploiement Europe - Prévision des ventes', 
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'running',
      schedule: '0 8 * * 1', // Tous les lundis à 8h
      department: 'Ventes', 
      region: 'Europe', 
      created_at: '2025-02-12T09:15:00Z',
      last_execution: '2025-03-18T08:00:00Z'
    },
    { 
      id: 'd2', 
      name: 'Déploiement test - Prévision des ventes', 
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'stopped',
      schedule: null,
      department: 'Ventes', 
      region: 'Europe', 
      created_at: '2025-01-20T11:30:00Z',
      last_execution: '2025-01-25T14:20:00Z'
    },
    { 
      id: 'd3', 
      name: 'Déploiement global - Segmentation clients', 
      model_id: '2',
      model_name: 'Segmentation clients',
      status: 'running',
      schedule: '0 0 * * *', // Tous les jours à minuit
      department: 'Marketing', 
      region: 'Global', 
      created_at: '2025-02-25T16:45:00Z',
      last_execution: '2025-03-19T00:00:00Z'
    },
    { 
      id: 'd4', 
      name: 'Déploiement Asie - Optimisation des stocks', 
      model_id: '4',
      model_name: 'Optimisation des stocks',
      status: 'running',
      schedule: '0 1 * * 1,4', // Lundis et jeudis à 1h
      department: 'Chaîne d\'approvisionnement', 
      region: 'Asie', 
      created_at: '2025-03-05T08:30:00Z',
      last_execution: '2025-03-18T01:00:00Z'
    },
    { 
      id: 'd5', 
      name: 'Déploiement RH - Prédiction d\'attrition', 
      model_id: '5',
      model_name: 'Prédiction d\'attrition',
      status: 'failed',
      schedule: '0 2 1 * *', // 1er jour du mois à 2h
      department: 'RH', 
      region: 'Global', 
      created_at: '2025-03-01T10:15:00Z',
      last_execution: '2025-03-01T02:00:00Z'
    },
  ];
};

const DeploymentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  
  // Récupérer les déploiements avec React Query
  const { data: deployments, isLoading, error } = useQuery('deployments', fetchDeployments);
  
  // Filtrer les déploiements
  const filteredDeployments = React.useMemo(() => {
    if (!deployments) return [];
    
    return deployments.filter(deployment => {
      const matchesSearch = searchTerm === '' || 
        deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deployment.model_name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === '' || deployment.department === departmentFilter;
      const matchesRegion = regionFilter === '' || deployment.region === regionFilter;
      const matchesStatus = statusFilter === '' || deployment.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesRegion && matchesStatus;
    });
  }, [deployments, searchTerm, departmentFilter, regionFilter, statusFilter]);
  
  // Obtenir les options uniques pour les filtres
  const departments = React.useMemo(() => {
    if (!deployments) return [];
    return [...new Set(deployments.map(deployment => deployment.department))];
  }, [deployments]);
  
  const regions = React.useMemo(() => {
    if (!deployments) return [];
    return [...new Set(deployments.map(deployment => deployment.region))];
  }, [deployments]);
  
  // Fonction pour afficher le statut avec une puce colorée
  const renderStatus = (status) => {
    let color;
    let label;
    
    switch (status) {
      case 'running':
        color = 'success';
        label = 'En cours';
        break;
      case 'stopped':
        color = 'default';
        label = 'Arrêté';
        break;
      case 'failed':
        color = 'error';
        label = 'Échec';
        break;
      default:
        color = 'default';
        label = status;
    }
    
    return <Chip label={label} color={color} size="small" />;
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
  
  // Formater le planning cron
  const formatSchedule = (cronExpression) => {
    if (!cronExpression) return 'Manuel';
    
    // Analyse simplifiée de l'expression cron
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return cronExpression;
    
    const minute = parts[0];
    const hour = parts[1];
    const dayOfMonth = parts[2];
    const month = parts[3];
    const dayOfWeek = parts[4];
    
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Tous les jours à minuit';
    } else if (minute === '0' && dayOfMonth === '*' && month === '*') {
      if (dayOfWeek === '*') {
        return `Tous les jours à ${hour}h`;
      } else if (dayOfWeek === '1') {
        return `Tous les lundis à ${hour}h`;
      } else if (dayOfWeek === '1,4') {
        return `Tous les lundis et jeudis à ${hour}h`;
      }
    } else if (minute === '0' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
      return `Le 1er du mois à ${hour}h`;
    }
    
    return cronExpression;
  };
  
  // Gérer le clic sur le bouton d'ajout
  const handleAddClick = () => {
    navigate('/deployments/create');
  };
  
  // Gérer le clic sur un déploiement
  const handleDeploymentClick = (id) => {
    navigate(`/deployments/${id}`);
  };
  
  if (isLoading) {
    return <Typography>Chargement des déploiements...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Déploiements</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Nouveau déploiement
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
              <InputLabel>Région</InputLabel>
              <Select
                value={regionFilter}
                label="Région"
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                {regions.map(region => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
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
                <MenuItem value="running">En cours</MenuItem>
                <MenuItem value="stopped">Arrêté</MenuItem>
                <MenuItem value="failed">Échec</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tableau des déploiements */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Planification</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Région</TableCell>
              <TableCell>Dernière exécution</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeployments.map((deployment) => (
              <TableRow key={deployment.id} hover>
                <TableCell>{deployment.name}</TableCell>
                <TableCell>{deployment.model_name}</TableCell>
                <TableCell>{formatSchedule(deployment.schedule)}</TableCell>
                <TableCell>{deployment.department}</TableCell>
                <TableCell>{deployment.region}</TableCell>
                <TableCell>{formatDate(deployment.last_execution)}</TableCell>
                <TableCell>{renderStatus(deployment.status)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeploymentClick(deployment.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  {deployment.status === 'running' ? (
                    <IconButton color="error">
                      <StopIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="success">
                      <PlayArrowIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredDeployments.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun déploiement trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeploymentsList;
