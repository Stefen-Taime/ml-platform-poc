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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

// Service simulé pour récupérer les modèles
const fetchModels = async () => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  return [
    { 
      id: '1', 
      name: 'Prévision des ventes', 
      type: 'forecasting', 
      framework: 'scikit-learn', 
      department: 'Ventes', 
      region: 'Europe', 
      status: 'deployed',
      version: '1.2.0',
      createdAt: '2025-01-15T10:30:00Z'
    },
    { 
      id: '2', 
      name: 'Segmentation clients', 
      type: 'clustering', 
      framework: 'tensorflow', 
      department: 'Marketing', 
      region: 'Amérique du Nord', 
      status: 'ready',
      version: '2.0.1',
      createdAt: '2025-02-20T14:45:00Z'
    },
    { 
      id: '3', 
      name: 'Détection de fraude', 
      type: 'classification', 
      framework: 'pytorch', 
      department: 'Finance', 
      region: 'Global', 
      status: 'deployed',
      version: '1.0.5',
      createdAt: '2025-01-05T09:15:00Z'
    },
    { 
      id: '4', 
      name: 'Optimisation des stocks', 
      type: 'regression', 
      framework: 'scikit-learn', 
      department: 'Chaîne d\'approvisionnement', 
      region: 'Asie', 
      status: 'draft',
      version: '0.9.0',
      createdAt: '2025-03-10T11:20:00Z'
    },
    { 
      id: '5', 
      name: 'Prédiction d\'attrition', 
      type: 'classification', 
      framework: 'xgboost', 
      department: 'RH', 
      region: 'Global', 
      status: 'ready',
      version: '1.1.0',
      createdAt: '2025-02-28T16:30:00Z'
    },
  ];
};

const ModelsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  
  // Récupérer les modèles avec React Query
  const { data: models, isLoading, error } = useQuery('models', fetchModels);
  
  // Filtrer les modèles
  const filteredModels = React.useMemo(() => {
    if (!models) return [];
    
    return models.filter(model => {
      const matchesSearch = searchTerm === '' || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.framework.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === '' || model.department === departmentFilter;
      const matchesRegion = regionFilter === '' || model.region === regionFilter;
      const matchesStatus = statusFilter === '' || model.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesRegion && matchesStatus;
    });
  }, [models, searchTerm, departmentFilter, regionFilter, statusFilter]);
  
  // Obtenir les options uniques pour les filtres
  const departments = React.useMemo(() => {
    if (!models) return [];
    return [...new Set(models.map(model => model.department))];
  }, [models]);
  
  const regions = React.useMemo(() => {
    if (!models) return [];
    return [...new Set(models.map(model => model.region))];
  }, [models]);
  
  // Fonction pour afficher le statut avec une puce colorée
  const renderStatus = (status) => {
    let color;
    let label;
    
    switch (status) {
      case 'deployed':
        color = 'success';
        label = 'Déployé';
        break;
      case 'ready':
        color = 'primary';
        label = 'Prêt';
        break;
      case 'draft':
        color = 'default';
        label = 'Brouillon';
        break;
      default:
        color = 'default';
        label = status;
    }
    
    return <Chip label={label} color={color} size="small" />;
  };
  
  // Gérer le clic sur le bouton d'ajout
  const handleAddClick = () => {
    navigate('/models/create');
  };
  
  // Gérer le clic sur un modèle
  const handleModelClick = (id) => {
    navigate(`/models/${id}`);
  };
  
  if (isLoading) {
    return <Typography>Chargement des modèles...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Modèles</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Ajouter un modèle
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
                <MenuItem value="deployed">Déployé</MenuItem>
                <MenuItem value="ready">Prêt</MenuItem>
                <MenuItem value="draft">Brouillon</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tableau des modèles */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Framework</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Région</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id} hover>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>{model.framework}</TableCell>
                <TableCell>{model.department}</TableCell>
                <TableCell>{model.region}</TableCell>
                <TableCell>{model.version}</TableCell>
                <TableCell>{renderStatus(model.status)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleModelClick(model.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredModels.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun modèle trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ModelsList;
