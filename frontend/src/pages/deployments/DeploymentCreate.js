import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  IconButton,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from 'react-query';

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
      version: '1.2.0'
    },
    { 
      id: '2', 
      name: 'Segmentation clients', 
      type: 'clustering', 
      framework: 'tensorflow', 
      department: 'Marketing', 
      region: 'Amérique du Nord', 
      status: 'ready',
      version: '2.0.1'
    },
    { 
      id: '3', 
      name: 'Détection de fraude', 
      type: 'classification', 
      framework: 'pytorch', 
      department: 'Finance', 
      region: 'Global', 
      status: 'deployed',
      version: '1.0.5'
    },
    { 
      id: '4', 
      name: 'Optimisation des stocks', 
      type: 'regression', 
      framework: 'scikit-learn', 
      department: 'Chaîne d\'approvisionnement', 
      region: 'Asie', 
      status: 'draft',
      version: '0.9.0'
    },
    { 
      id: '5', 
      name: 'Prédiction d\'attrition', 
      type: 'classification', 
      framework: 'xgboost', 
      department: 'RH', 
      region: 'Global', 
      status: 'ready',
      version: '1.1.0'
    },
  ];
};

const DeploymentCreate = () => {
  const navigate = useNavigate();
  const [useCustomSchedule, setUseCustomSchedule] = React.useState(false);
  
  // Récupérer les modèles avec React Query
  const { data: models, isLoading: isLoadingModels } = useQuery('models', fetchModels);
  
  // Configuration du schéma de validation
  const validationSchema = Yup.object({
    name: Yup.string().required('Le nom est requis'),
    description: Yup.string().required('La description est requise'),
    model_id: Yup.string().required('Le modèle est requis'),
    input_data_path: Yup.string().required('Le chemin des données d\'entrée est requis'),
    output_data_path: Yup.string().required('Le chemin des résultats est requis'),
    batch_size: Yup.number().required('La taille de lot est requise').positive('La taille de lot doit être positive'),
    schedule_type: Yup.string().required('Le type de planification est requis'),
    cron_expression: Yup.string().when('schedule_type', {
      is: 'custom',
      then: Yup.string().required('L\'expression cron est requise')
    }),
  });
  
  // Configuration du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      model_id: '',
      department: '',
      region: '',
      input_data_path: 'data/',
      output_data_path: 'results/',
      batch_size: 64,
      schedule_type: 'manual',
      cron_expression: '',
      is_active: true
    },
    validationSchema,
    onSubmit: (values) => {
      // Simuler la soumission du formulaire
      console.log(values);
      
      // Rediriger vers la liste des déploiements
      navigate('/deployments');
    },
  });
  
  // Mettre à jour le département et la région en fonction du modèle sélectionné
  React.useEffect(() => {
    if (formik.values.model_id && models) {
      const selectedModel = models.find(model => model.id === formik.values.model_id);
      if (selectedModel) {
        formik.setFieldValue('department', selectedModel.department);
        formik.setFieldValue('region', selectedModel.region);
      }
    }
  }, [formik.values.model_id, models]);
  
  // Gérer le changement de type de planification
  const handleScheduleTypeChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue('schedule_type', value);
    
    // Définir l'expression cron en fonction du type de planification
    let cronExpression = '';
    switch (value) {
      case 'daily':
        cronExpression = '0 0 * * *'; // Tous les jours à minuit
        break;
      case 'weekly':
        cronExpression = '0 0 * * 1'; // Tous les lundis à minuit
        break;
      case 'monthly':
        cronExpression = '0 0 1 * *'; // Le 1er de chaque mois à minuit
        break;
      case 'custom':
        setUseCustomSchedule(true);
        break;
      default:
        cronExpression = '';
    }
    
    if (value !== 'custom') {
      setUseCustomSchedule(false);
      formik.setFieldValue('cron_expression', cronExpression);
    }
  };
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/deployments')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Créer un nouveau déploiement</Typography>
      </Box>
      
      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Informations générales</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nom du déploiement"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={formik.touched.model_id && Boolean(formik.errors.model_id)}>
                <InputLabel id="model-label">Modèle</InputLabel>
                <Select
                  labelId="model-label"
                  id="model_id"
                  name="model_id"
                  value={formik.values.model_id}
                  onChange={formik.handleChange}
                  label="Modèle"
                  disabled={isLoadingModels}
                >
                  {models && models.map(model => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name} (v{model.version})
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.model_id && formik.errors.model_id && (
                  <FormHelperText>{formik.errors.model_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="department"
                name="department"
                label="Département"
                value={formik.values.department}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="region"
                name="region"
                label="Région"
                value={formik.values.region}
                disabled
                margin="normal"
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Paramètres de configuration</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="input_data_path"
                name="input_data_path"
                label="Chemin des données d'entrée"
                value={formik.values.input_data_path}
                onChange={formik.handleChange}
                error={formik.touched.input_data_path && Boolean(formik.errors.input_data_path)}
                helperText={formik.touched.input_data_path && formik.errors.input_data_path}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="output_data_path"
                name="output_data_path"
                label="Chemin des résultats"
                value={formik.values.output_data_path}
                onChange={formik.handleChange}
                error={formik.touched.output_data_path && Boolean(formik.errors.output_data_path)}
                helperText={formik.touched.output_data_path && formik.errors.output_data_path}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="batch_size"
                name="batch_size"
                label="Taille de lot"
                type="number"
                value={formik.values.batch_size}
                onChange={formik.handleChange}
                error={formik.touched.batch_size && Boolean(formik.errors.batch_size)}
                helperText={formik.touched.batch_size && formik.errors.batch_size}
                margin="normal"
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Planification</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={formik.touched.schedule_type && Boolean(formik.errors.schedule_type)}>
                <InputLabel id="schedule-type-label">Type de planification</InputLabel>
                <Select
                  labelId="schedule-type-label"
                  id="schedule_type"
                  name="schedule_type"
                  value={formik.values.schedule_type}
                  onChange={handleScheduleTypeChange}
                  label="Type de planification"
                >
                  <MenuItem value="manual">Manuel (pas de planification)</MenuItem>
                  <MenuItem value="daily">Quotidien</MenuItem>
                  <MenuItem value="weekly">Hebdomadaire</MenuItem>
                  <MenuItem value="monthly">Mensuel</MenuItem>
                  <MenuItem value="custom">Personnalisé (expression cron)</MenuItem>
                </Select>
                {formik.touched.schedule_type && formik.errors.schedule_type && (
                  <FormHelperText>{formik.errors.schedule_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {useCustomSchedule && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="cron_expression"
                  name="cron_expression"
                  label="Expression cron"
                  value={formik.values.cron_expression}
                  onChange={formik.handleChange}
                  error={formik.touched.cron_expression && Boolean(formik.errors.cron_expression)}
                  helperText={(formik.touched.cron_expression && formik.errors.cron_expression) || "Format: minute heure jour_du_mois mois jour_de_la_semaine"}
                  margin="normal"
                />
              </Grid>
            )}
            
            {formik.values.schedule_type !== 'manual' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="cron_expression"
                  name="cron_expression"
                  label="Expression cron générée"
                  value={formik.values.cron_expression}
                  disabled
                  margin="normal"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    id="is_active"
                    name="is_active"
                    checked={formik.values.is_active}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label="Activer le déploiement immédiatement"
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/deployments')} 
            sx={{ mr: 1 }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            type="submit"
          >
            Créer le déploiement
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default DeploymentCreate;
