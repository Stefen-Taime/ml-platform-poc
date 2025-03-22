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
  IconButton,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Service simulé pour récupérer une exécution
const fetchExecution = async (id) => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Données simulées
  const executions = {
    'e1': { 
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
      owner: 'Jean Dupont',
      parameters: {
        input_data_path: 'data/ventes/europe/',
        output_data_path: 'results/ventes/europe/',
        batch_size: 64,
        date_debut: '2025-04-01',
        date_fin: '2025-06-30'
      },
      logs: [
        { timestamp: '2025-03-18T08:00:00Z', level: 'INFO', message: 'Démarrage de l\'exécution' },
        { timestamp: '2025-03-18T08:00:01Z', level: 'INFO', message: 'Chargement des données depuis data/ventes/europe/' },
        { timestamp: '2025-03-18T08:02:15Z', level: 'INFO', message: 'Prétraitement des données terminé' },
        { timestamp: '2025-03-18T08:02:16Z', level: 'INFO', message: 'Exécution du modèle de prévision' },
        { timestamp: '2025-03-18T08:08:45Z', level: 'INFO', message: 'Prédictions générées avec succès' },
        { timestamp: '2025-03-18T08:09:30Z', level: 'INFO', message: 'Résultats sauvegardés dans results/ventes/europe/execution_20250318.csv' },
        { timestamp: '2025-03-18T08:10:00Z', level: 'INFO', message: 'Exécution terminée avec succès' }
      ],
      metrics: {
        mape: 8.2,
        rmse: 235.7,
        r2: 0.89
      },
      results_preview: [
        { date: '2025-04-01', produit: 'Produit A', region: 'Europe Nord', ventes_prevues: 165, intervalle_confiance_bas: 155, intervalle_confiance_haut: 175 },
        { date: '2025-04-02', produit: 'Produit A', region: 'Europe Nord', ventes_prevues: 170, intervalle_confiance_bas: 160, intervalle_confiance_haut: 180 },
        { date: '2025-04-03', produit: 'Produit A', region: 'Europe Nord', ventes_prevues: 175, intervalle_confiance_bas: 165, intervalle_confiance_haut: 185 },
        { date: '2025-04-01', produit: 'Produit B', region: 'Europe Sud', ventes_prevues: 195, intervalle_confiance_bas: 185, intervalle_confiance_haut: 205 },
        { date: '2025-04-02', produit: 'Produit B', region: 'Europe Sud', ventes_prevues: 200, intervalle_confiance_bas: 190, intervalle_confiance_haut: 210 }
      ]
    },
    'e3': { 
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
      owner: 'Jean Dupont',
      parameters: {
        input_data_path: 'data/ventes/europe/',
        output_data_path: 'results/ventes/europe/',
        batch_size: 64,
        date_debut: '2025-04-01',
        date_fin: '2025-06-30'
      },
      logs: [
        { timestamp: '2025-03-04T08:00:00Z', level: 'INFO', message: 'Démarrage de l\'exécution' },
        { timestamp: '2025-03-04T08:00:01Z', level: 'INFO', message: 'Chargement des données depuis data/ventes/europe/' },
        { timestamp: '2025-03-04T08:01:30Z', level: 'ERROR', message: 'Erreur lors du chargement des données: Fichier non trouvé' },
        { timestamp: '2025-03-04T08:03:00Z', level: 'ERROR', message: 'Exécution échouée' }
      ],
      metrics: null,
      results_preview: null
    },
    'e6': { 
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
      owner: 'Sophie Dubois',
      parameters: {
        input_data_path: 'data/rh/employes/',
        output_data_path: 'results/rh/attrition/',
        batch_size: 32
      },
      logs: [
        { timestamp: '2025-03-20T02:00:00Z', level: 'INFO', message: 'Démarrage de l\'exécution' },
        { timestamp: '2025-03-20T02:00:01Z', level: 'INFO', message: 'Chargement des données depuis data/rh/employes/' },
        { timestamp: '2025-03-20T02:01:45Z', level: 'INFO', message: 'Prétraitement des données terminé' },
        { timestamp: '2025-03-20T02:01:46Z', level: 'INFO', message: 'Exécution du modèle de prédiction d\'attrition' },
        { timestamp: '2025-03-20T02:05:00Z', level: 'INFO', message: 'Traitement en cours...' }
      ],
      metrics: null,
      results_preview: null,
      progress: 65
    }
  };
  
  if (!executions[id]) {
    throw new Error('Exécution non trouvée');
  }
  
  return executions[id];
};

const ExecutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Récupérer l'exécution avec React Query
  const { data: execution, isLoading, error } = useQuery(['execution', id], () => fetchExecution(id));
  
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
    
    return <Chip label={label} color={color} />;
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
  
  // Formater l'horodatage des logs
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Obtenir la couleur pour le niveau de log
  const getLogLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'error.main';
      case 'WARNING':
        return 'warning.main';
      case 'INFO':
        return 'info.main';
      default:
        return 'text.primary';
    }
  };
  
  if (isLoading) {
    return <Typography>Chargement de l'exécution...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">Erreur: {error.message}</Typography>;
  }
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/executions')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Détail de l'exécution</Typography>
        </Box>
        {execution.status === 'success' && execution.result_path && (
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
          >
            Télécharger les résultats
          </Button>
        )}
      </Box>
      
      {/* Informations générales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Déploiement</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate(`/deployments/${execution.deployment_id}`)}
            >
              {execution.deployment_name}
            </Button>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>Modèle</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate(`/models/${execution.model_id}`)}
            >
              {execution.model_name}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemText primary="Statut" secondary={renderStatus(execution.status)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Démarré le" secondary={formatDate(execution.start_time)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Terminé le" secondary={formatDate(execution.end_time)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Durée" secondary={formatDuration(execution.duration)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Déclenché par" secondary={execution.triggered_by} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Propriétaire" secondary={execution.owner} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Département" secondary={execution.department} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Région" secondary={execution.region} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        
        {execution.status === 'running' && execution.progress && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Progression</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={execution.progress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(execution.progress)}%`}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Paramètres */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Paramètres d'exécution</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {execution.parameters && Object.entries(execution.parameters).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText 
                  primary={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                  secondary={value} 
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      
      {/* Logs */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Logs d'exécution</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, maxHeight: 300, overflow: 'auto' }}>
            {execution.logs && execution.logs.map((log, index) => (
              <Box key={index} sx={{ mb: 1, fontFamily: 'monospace' }}>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  {formatTimestamp(log.timestamp)}
                </Typography>
                <Typography component="span" sx={{ ml: 2, color: getLogLevelColor(log.level), fontWeight: 'bold' }}>
                  [{log.level}]
                </Typography>
                <Typography component="span" sx={{ ml: 2 }}>
                  {log.message}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Métriques */}
      {execution.metrics && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Métriques de performance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {Object.entries(execution.metrics).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText 
                    primary={key.toUpperCase()} 
                    secondary={value} 
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Aperçu des résultats */}
      {execution.results_preview && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Aperçu des résultats</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {Object.keys(execution.results_preview[0]).map((key) => (
                      <TableCell key={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {execution.results_preview.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/executions')}
        >
          Retour à la liste
        </Button>
        
        {execution.status === 'failed' && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PlayArrowIcon />}
          >
            Relancer l'exécution
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ExecutionDetail;
