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
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';

// Service simulé pour récupérer les exécutions
const fetchExecutions = async () => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  return [
    { 
      id: 'e1', 
      deployment_id: 'd1',
      deployment_name: 'Déploiement Europe - Prévision des ventes',
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'success', 
      start_time: '2025-03-18T08:00:00Z', 
      end_time: '2025-03-18T08:10:00Z',
      duration: 10,
      result_path: 'results/ventes/europe/execution_20250318.csv',
      department: 'Ventes',
      region: 'Europe',
      triggered_by: 'Planification',
      owner: 'Jean Dupont'
    },
    { 
      id: 'e2', 
      deployment_id: 'd1',
      deployment_name: 'Déploiement Europe - Prévision des ventes',
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'success', 
      start_time: '2025-03-11T08:00:00Z', 
      end_time: '2025-03-11T08:12:00Z',
      duration: 12,
      result_path: 'results/ventes/europe/execution_20250311.csv',
      department: 'Ventes',
      region: 'Europe',
      triggered_by: 'Planification',
      owner: 'Jean Dupont'
    },
    { 
      id: 'e3', 
      deployment_id: 'd1',
      deployment_name: 'Déploiement Europe - Prévision des ventes',
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'failed', 
      start_time: '2025-03-04T08:00:00Z', 
      end_time: '2025-03-04T08:03:00Z',
      duration: 3,
      result_path: null,
      department: 'Ventes',
      region: 'Europe',
      triggered_by: 'Planification',
      owner: 'Jean Dupont'
    },
    { 
      id: 'e4', 
      deployment_id: 'd3',
      deployment_name: 'Déploiement global - Segmentation clients',
      model_id: '2',
      model_name: 'Segmentation clients',
      status: 'success', 
      start_time: '2025-03-19T00:00:00Z', 
      end_time: '2025-03-19T00:15:00Z',
      duration: 15,
      result_path: 'results/clients/global/segmentation_20250319.json',
      department: 'Marketing',
      region: 'Global',
      triggered_by: 'Planification',
      owner: 'Marie Martin'
    },
    { 
      id: 'e5', 
      deployment_id: 'd3',
      deployment_name: 'Déploiement global - Segmentation clients',
      model_id: '2',
      model_name: 'Segmentation clients',
      status: 'success', 
      start_time: '2025-03-18T00:00:00Z', 
      end_time: '2025-03-18T00:14:00Z',
      duration: 14,
      result_path: 'results/clients/global/segmentation_20250318.json',
      department: 'Marketing',
      region: 'Global',
      triggered_by: 'Planification',
      owner: 'Marie Martin'
    },
    { 
      id: 'e6', 
      deployment_id: 'd5',
      deployment_name: 'Déploiement RH - Prédiction d\'attrition',
      model_id: '5',
      model_name: 'Prédiction d\'attrition',
      status: 'running', 
      start_time: '2025-03-20T02:00:00Z', 
      end_time: null,
      duration: null,
      result_path: null,
      department: 'RH',
      region: 'Global',
      triggered_by: 'Manuel',
      owner: 'Sophie Dubois'
    }
  ];
};

const ExecutionsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  
  // Récupérer les exécutions avec React Query
  const { data: executions, isLoading, error } = useQuery('executions', fetchExecutions);
  
  // Filtrer les exécutions
  const filteredExecutions = React.useMemo(() => {
    if (!executions) return [];
    
    return executions.filter(execution => {
      const matchesSearch = searchTerm === '' || 
        execution.deployment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        execution.model_name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === '' || execution.department === departmentFilter;
      const matchesRegion = regionFilter === '' || execution.region === regionFilter;
      const matchesStatus = statusFilter === '' || execution.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesRegion && matchesStatus;
    });
  }, [executions, searchTerm, departmentFilter, regionFilter, statusFilter]);
  
  // Obtenir les options uniques pour les filtres
  const departments = React.useMemo(() => {
    if (!executions) return [];
    return [...new Set(executions.map(execution => execution.department))];
  }, [executions]);
  
  const regions = React.useMemo(() => {
    if (!executions) return [];
    return [...new Set(executions.map(execution => execution.region))];
  }, [executions]);
  
  // Fonction pour afficher le statut avec une puce colorée
  const renderStatus = (status) => {
    let color;
    let label;
    
    switch (status) {
      case 'success':
        color = 'success';
        label = 'Succès';
        break;
      case 'running':
        color = 'primary';
        label = 'En cours';
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formater la durée
  const formatDuration = (minutes) => {
    if (minutes === null) return 'N/A';
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };
  
  // Gérer le clic sur une exécution
  const handleExecutionClick = (id) => {
    navigate(`/executions/${id}`);
  };
  
  if (isLoading) {
    return <Typography>Chargement des exécutions...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Exécutions</Typography>
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
                <MenuItem value="success">Succès</MenuItem>
                <MenuItem value="running">En cours</MenuItem>
                <MenuItem value="failed">Échec</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tableau des exécutions */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Déploiement</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Démarré le</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Région</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExecutions.map((execution) => (
              <TableRow key={execution.id} hover>
                <TableCell>{execution.deployment_name}</TableCell>
                <TableCell>{execution.model_name}</TableCell>
                <TableCell>{formatDate(execution.start_time)}</TableCell>
                <TableCell>{formatDuration(execution.duration)}</TableCell>
                <TableCell>{execution.department}</TableCell>
                <TableCell>{execution.region}</TableCell>
                <TableCell>{renderStatus(execution.status)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleExecutionClick(execution.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  {execution.result_path && execution.status === 'success' && (
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredExecutions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucune exécution trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExecutionsList;
