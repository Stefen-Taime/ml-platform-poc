import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';

// Service simulé pour récupérer un modèle
const fetchModel = async (id) => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  const models = {
    '1': { 
      id: '1', 
      name: 'Prévision des ventes', 
      description: 'Ce modèle utilise des séries temporelles pour prédire les ventes futures basées sur les données historiques et les facteurs saisonniers.',
      type: 'forecasting', 
      framework: 'scikit-learn', 
      department: 'Ventes', 
      region: 'Europe', 
      status: 'deployed',
      version: '1.2.0',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-02-10T14:20:00Z',
      owner: 'Jean Dupont',
      tags: ['ventes', 'prévision', 'série temporelle'],
      parameters: {
        features: ['date', 'produit', 'région', 'prix', 'promotion'],
        algorithm: 'Prophet',
        hyperparameters: {
          seasonality_mode: 'multiplicative',
          changepoint_prior_scale: 0.05
        }
      },
      metrics: {
        mape: 8.5,
        rmse: 245.3,
        r2: 0.87
      },
      deployments: [
        { id: 'd1', name: 'Déploiement Europe', status: 'active', createdAt: '2025-02-12T09:15:00Z' },
        { id: 'd2', name: 'Déploiement test', status: 'inactive', createdAt: '2025-01-20T11:30:00Z' }
      ],
      executions: [
        { id: 'e1', status: 'success', startTime: '2025-03-15T08:00:00Z', endTime: '2025-03-15T08:10:00Z' },
        { id: 'e2', status: 'success', startTime: '2025-03-08T08:00:00Z', endTime: '2025-03-08T08:12:00Z' },
        { id: 'e3', status: 'failed', startTime: '2025-03-01T08:00:00Z', endTime: '2025-03-01T08:03:00Z' }
      ]
    },
    // Autres modèles...
  };
  
  if (!models[id]) {
    throw new Error('Modèle non trouvé');
  }
  
  return models[id];
};

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  // Récupérer le modèle avec React Query
  const { data: model, isLoading, error } = useQuery(['model', id], () => fetchModel(id));
  
  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
    
    return <Chip label={label} color={color} />;
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
  
  if (isLoading) {
    return <Typography>Chargement du modèle...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/models')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{model.name}</Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Supprimer
          </Button>
        </Box>
      </Box>
      
      {/* Informations générales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography paragraph>{model.description}</Typography>
            
            <Box sx={{ mt: 2 }}>
              {model.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemText primary="Statut" secondary={renderStatus(model.status)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Type" secondary={model.type} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Framework" secondary={model.framework} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Version" secondary={model.version} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Département" secondary={model.department} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Région" secondary={model.region} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Propriétaire" secondary={model.owner} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Créé le" secondary={formatDate(model.createdAt)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Mis à jour le" secondary={formatDate(model.updatedAt)} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudUploadIcon />}
          >
            Déployer
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PlayArrowIcon />}
          >
            Exécuter
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
          >
            Télécharger
          </Button>
        </Box>
      </Paper>
      
      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Paramètres" />
          <Tab label="Métriques" />
          <Tab label="Déploiements" />
          <Tab label="Exécutions" />
        </Tabs>
      </Box>
      
      {/* Contenu des onglets */}
      <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Paramètres du modèle" />
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Features</Typography>
            <Box sx={{ mb: 2 }}>
              {model.parameters.features.map(feature => (
                <Chip key={feature} label={feature} size="small" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>Algorithme</Typography>
            <Typography paragraph>{model.parameters.algorithm}</Typography>
            
            <Typography variant="subtitle1" gutterBottom>Hyperparamètres</Typography>
            <List dense>
              {Object.entries(model.parameters.hyperparameters).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={key} secondary={value} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Métriques de performance" />
          <CardContent>
            <List dense>
              {Object.entries(model.metrics).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText 
                    primary={key.toUpperCase()} 
                    secondary={value} 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
        <Card>
          <CardHeader 
            title="Déploiements" 
            action={
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<CloudUploadIcon />}
              >
                Nouveau déploiement
              </Button>
            }
          />
          <CardContent>
            {model.deployments.length > 0 ? (
              <List>
                {model.deployments.map(deployment => (
                  <ListItem 
                    key={deployment.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => navigate(`/deployments/${deployment.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={deployment.name} 
                      secondary={`Créé le ${formatDate(deployment.createdAt)}`} 
                    />
                    <Chip 
                      label={deployment.status === 'active' ? 'Actif' : 'Inactif'} 
                      color={deployment.status === 'active' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Aucun déploiement pour ce modèle</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 3 ? 'block' : 'none' }}>
        <Card>
          <CardHeader 
            title="Historique des exécutions" 
            action={
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<PlayArrowIcon />}
              >
                Nouvelle exécution
              </Button>
            }
          />
          <CardContent>
            {model.executions.length > 0 ? (
              <List>
                {model.executions.map(execution => (
                  <ListItem 
                    key={execution.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => navigate(`/executions/${execution.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={`Exécution du ${formatDate(execution.startTime)}`} 
                      secondary={`Durée: ${Math.round((new Date(execution.endTime) - new Date(execution.startTime)) / 1000 / 60)} minutes`} 
                    />
                    <Chip 
                      label={execution.status === 'success' ? 'Succès' : 'Échec'} 
                      color={execution.status === 'success' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Aucune exécution pour ce modèle</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le modèle "{model.name}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button color="error" onClick={() => {
            // Logique de suppression ici
            setDeleteDialogOpen(false);
            navigate('/models');
          }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelDetail;
