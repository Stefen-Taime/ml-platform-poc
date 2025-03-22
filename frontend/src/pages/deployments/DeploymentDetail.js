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
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

// Service simulé pour récupérer un déploiement
const fetchDeployment = async (id) => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  const deployments = {
    'd1': { 
      id: 'd1', 
      name: 'Déploiement Europe - Prévision des ventes', 
      description: 'Déploiement du modèle de prévision des ventes pour l\'Europe',
      model_id: '1',
      model_name: 'Prévision des ventes',
      status: 'running',
      schedule: '0 8 * * 1', // Tous les lundis à 8h
      department: 'Ventes', 
      region: 'Europe', 
      created_at: '2025-02-12T09:15:00Z',
      updated_at: '2025-03-10T14:20:00Z',
      last_execution: '2025-03-18T08:00:00Z',
      owner: 'Jean Dupont',
      parameters: {
        input_data_path: 'data/ventes/europe/',
        output_data_path: 'results/ventes/europe/',
        batch_size: 64,
        features: ['date', 'produit', 'région', 'prix', 'promotion']
      },
      executions: [
        { 
          id: 'e1', 
          status: 'success', 
          start_time: '2025-03-18T08:00:00Z', 
          end_time: '2025-03-18T08:10:00Z',
          result_path: 'results/ventes/europe/execution_20250318.csv'
        },
        { 
          id: 'e2', 
          status: 'success', 
          start_time: '2025-03-11T08:00:00Z', 
          end_time: '2025-03-11T08:12:00Z',
          result_path: 'results/ventes/europe/execution_20250311.csv'
        },
        { 
          id: 'e3', 
          status: 'failed', 
          start_time: '2025-03-04T08:00:00Z', 
          end_time: '2025-03-04T08:03:00Z',
          result_path: null
        }
      ]
    },
    'd3': { 
      id: 'd3', 
      name: 'Déploiement global - Segmentation clients', 
      description: 'Déploiement du modèle de segmentation clients pour toutes les régions',
      model_id: '2',
      model_name: 'Segmentation clients',
      status: 'running',
      schedule: '0 0 * * *', // Tous les jours à minuit
      department: 'Marketing', 
      region: 'Global', 
      created_at: '2025-02-25T16:45:00Z',
      updated_at: '2025-03-15T10:30:00Z',
      last_execution: '2025-03-19T00:00:00Z',
      owner: 'Marie Martin',
      parameters: {
        input_data_path: 'data/clients/global/',
        output_data_path: 'results/clients/global/',
        batch_size: 128,
        features: ['âge', 'revenu', 'fréquence_achat', 'montant_moyen', 'catégories_préférées']
      },
      executions: [
        { 
          id: 'e4', 
          status: 'success', 
          start_time: '2025-03-19T00:00:00Z', 
          end_time: '2025-03-19T00:15:00Z',
          result_path: 'results/clients/global/segmentation_20250319.json'
        },
        { 
          id: 'e5', 
          status: 'success', 
          start_time: '2025-03-18T00:00:00Z', 
          end_time: '2025-03-18T00:14:00Z',
          result_path: 'results/clients/global/segmentation_20250318.json'
        }
      ]
    }
  };
  
  if (!deployments[id]) {
    throw new Error('Déploiement non trouvé');
  }
  
  return deployments[id];
};

const DeploymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [stopDialogOpen, setStopDialogOpen] = React.useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = React.useState(false);
  
  // Récupérer le déploiement avec React Query
  const { data: deployment, isLoading, error } = useQuery(['deployment', id], () => fetchDeployment(id));
  
  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
  
  if (isLoading) {
    return <Typography>Chargement du déploiement...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/deployments')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{deployment.name}</Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/deployments/edit/${deployment.id}`)}
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
            <Typography paragraph>{deployment.description}</Typography>
            
            <Typography variant="subtitle1" gutterBottom>Modèle associé</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate(`/models/${deployment.model_id}`)}
            >
              {deployment.model_name}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemText primary="Statut" secondary={renderStatus(deployment.status)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Planification" secondary={formatSchedule(deployment.schedule)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Département" secondary={deployment.department} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Région" secondary={deployment.region} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Propriétaire" secondary={deployment.owner} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Créé le" secondary={formatDate(deployment.created_at)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Mis à jour le" secondary={formatDate(deployment.updated_at)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Dernière exécution" secondary={formatDate(deployment.last_execution)} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {deployment.status === 'running' ? (
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<StopIcon />}
              onClick={() => setStopDialogOpen(true)}
            >
              Arrêter
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<PlayArrowIcon />}
            >
              Démarrer
            </Button>
          )}
          <Button 
            variant="contained" 
            startIcon={<PlayArrowIcon />}
            onClick={() => setExecuteDialogOpen(true)}
          >
            Exécuter maintenant
          </Button>
        </Box>
      </Paper>
      
      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Paramètres" />
          <Tab label="Exécutions" />
        </Tabs>
      </Box>
      
      {/* Contenu des onglets */}
      <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
        <Card>
          <CardHeader title="Paramètres du déploiement" />
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Chemins de données</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Chemin des données d'entrée" secondary={deployment.parameters.input_data_path} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Chemin des résultats" secondary={deployment.parameters.output_data_path} />
              </ListItem>
            </List>
            
            <Typography variant="subtitle1" gutterBottom>Configuration d'exécution</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Taille de lot" secondary={deployment.parameters.batch_size} />
              </ListItem>
            </List>
            
            <Typography variant="subtitle1" gutterBottom>Features</Typography>
            <Box sx={{ mb: 2 }}>
              {deployment.parameters.features.map(feature => (
                <Chip key={feature} label={feature} size="small" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        <Card>
          <CardHeader 
            title="Historique des exécutions" 
            action={
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<PlayArrowIcon />}
                onClick={() => setExecuteDialogOpen(true)}
              >
                Nouvelle exécution
              </Button>
            }
          />
          <CardContent>
            {deployment.executions.length > 0 ? (
              <List>
                {deployment.executions.map(execution => (
                  <ListItem 
                    key={execution.id}
                    secondaryAction={
                      <>
                        <IconButton edge="end" onClick={() => navigate(`/executions/${execution.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        {execution.result_path && (
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText 
                      primary={`Exécution du ${formatDate(execution.start_time)}`} 
                      secondary={`Durée: ${Math.round((new Date(execution.end_time) - new Date(execution.start_time)) / 1000 / 60)} minutes`} 
                    />
                    <Chip 
                      label={execution.status === 'success' ? 'Succès' : 'Échec'} 
                      color={execution.status === 'success' ? 'success' : 'error'} 
                      size="small" 
                      sx={{ mr: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Aucune exécution pour ce déploiement</Typography>
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
            Êtes-vous sûr de vouloir supprimer le déploiement "{deployment.name}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button color="error" onClick={() => {
            // Logique de suppression ici
            setDeleteDialogOpen(false);
            navigate('/deployments');
          }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de confirmation d'arrêt */}
      <Dialog
        open={stopDialogOpen}
        onClose={() => setStopDialogOpen(false)}
      >
        <DialogTitle>Confirmer l'arrêt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir arrêter le déploiement "{deployment.name}" ? Les exécutions planifiées ne seront plus déclenchées.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialogOpen(false)}>Annuler</Button>
          <Button color="error" onClick={() => {
            // Logique d'arrêt ici
            setStopDialogOpen(false);
          }}>
            Arrêter
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue d'exécution */}
      <Dialog
        open={executeDialogOpen}
        onClose={() => setExecuteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exécuter le déploiement</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Configurez les paramètres pour cette exécution spécifique.
          </DialogContentText>
          
          <TextField
            label="Chemin des données d'entrée"
            defaultValue={deployment.parameters.input_data_path}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Chemin des résultats"
            defaultValue={deployment.parameters.output_data_path}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Taille de lot"
            defaultValue={deployment.parameters.batch_size}
            type="number"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => {
            // Logique d'exécution ici
            setExecuteDialogOpen(false);
          }}>
            Exécuter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeploymentDetail;
