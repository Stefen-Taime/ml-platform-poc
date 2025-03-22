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
  Chip,
  IconButton,
  Divider,
  FormHelperText,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';

const ModelCreate = () => {
  const navigate = useNavigate();
  const [tags, setTags] = React.useState([]);
  const [currentTag, setCurrentTag] = React.useState('');
  const [file, setFile] = React.useState(null);
  
  // Configuration du schéma de validation
  const validationSchema = Yup.object({
    name: Yup.string().required('Le nom est requis'),
    description: Yup.string().required('La description est requise'),
    type: Yup.string().required('Le type est requis'),
    framework: Yup.string().required('Le framework est requis'),
    department: Yup.string().required('Le département est requis'),
    region: Yup.string().required('La région est requise'),
    version: Yup.string().required('La version est requise'),
  });
  
  // Configuration du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: '',
      framework: '',
      department: '',
      region: '',
      version: '1.0.0',
    },
    validationSchema,
    onSubmit: (values) => {
      // Simuler la soumission du formulaire
      console.log({
        ...values,
        tags,
        file
      });
      
      // Rediriger vers la liste des modèles
      navigate('/models');
    },
  });
  
  // Configuration de la zone de dépôt de fichiers
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/octet-stream': ['.pkl', '.h5', '.joblib', '.pt', '.pb'],
      'application/x-python': ['.py'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });
  
  // Gérer l'ajout d'un tag
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };
  
  // Gérer la suppression d'un tag
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/models')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Créer un nouveau modèle</Typography>
      </Box>
      
      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Informations générales</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nom du modèle"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="version"
                name="version"
                label="Version"
                value={formik.values.version}
                onChange={formik.handleChange}
                error={formik.touched.version && Boolean(formik.errors.version)}
                helperText={formik.touched.version && formik.errors.version}
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
              <FormControl fullWidth margin="normal" error={formik.touched.type && Boolean(formik.errors.type)}>
                <InputLabel id="type-label">Type de modèle</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  label="Type de modèle"
                >
                  <MenuItem value="classification">Classification</MenuItem>
                  <MenuItem value="regression">Régression</MenuItem>
                  <MenuItem value="clustering">Clustering</MenuItem>
                  <MenuItem value="forecasting">Prévision</MenuItem>
                  <MenuItem value="recommendation">Recommandation</MenuItem>
                  <MenuItem value="custom">Personnalisé</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <FormHelperText>{formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={formik.touched.framework && Boolean(formik.errors.framework)}>
                <InputLabel id="framework-label">Framework</InputLabel>
                <Select
                  labelId="framework-label"
                  id="framework"
                  name="framework"
                  value={formik.values.framework}
                  onChange={formik.handleChange}
                  label="Framework"
                >
                  <MenuItem value="scikit-learn">Scikit-learn</MenuItem>
                  <MenuItem value="tensorflow">TensorFlow</MenuItem>
                  <MenuItem value="pytorch">PyTorch</MenuItem>
                  <MenuItem value="xgboost">XGBoost</MenuItem>
                  <MenuItem value="r">R</MenuItem>
                  <MenuItem value="custom">Personnalisé</MenuItem>
                </Select>
                {formik.touched.framework && formik.errors.framework && (
                  <FormHelperText>{formik.errors.framework}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={formik.touched.department && Boolean(formik.errors.department)}>
                <InputLabel id="department-label">Département</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  label="Département"
                >
                  <MenuItem value="Ventes">Ventes</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="R&D">R&D</MenuItem>
                  <MenuItem value="Chaîne d'approvisionnement">Chaîne d'approvisionnement</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="RH">RH</MenuItem>
                </Select>
                {formik.touched.department && formik.errors.department && (
                  <FormHelperText>{formik.errors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={formik.touched.region && Boolean(formik.errors.region)}>
                <InputLabel id="region-label">Région</InputLabel>
                <Select
                  labelId="region-label"
                  id="region"
                  name="region"
                  value={formik.values.region}
                  onChange={formik.handleChange}
                  label="Région"
                >
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Amérique du Nord">Amérique du Nord</MenuItem>
                  <MenuItem value="Amérique du Sud">Amérique du Sud</MenuItem>
                  <MenuItem value="Asie">Asie</MenuItem>
                  <MenuItem value="Afrique">Afrique</MenuItem>
                  <MenuItem value="Océanie">Océanie</MenuItem>
                  <MenuItem value="Global">Global</MenuItem>
                </Select>
                {formik.touched.region && formik.errors.region && (
                  <FormHelperText>{formik.errors.region}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Tags</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              label="Ajouter un tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddTag}
              disabled={!currentTag}
            >
              <AddIcon />
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
            {tags.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Aucun tag ajouté
              </Typography>
            )}
          </Box>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Fichier du modèle</Typography>
          
          <Box 
            {...getRootProps()} 
            sx={{ 
              border: '2px dashed #ccc', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center',
              bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box>
                <Typography variant="body1">{file.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  sx={{ mt: 1 }}
                >
                  Supprimer
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1">
                  Glissez-déposez le fichier du modèle ici, ou cliquez pour sélectionner un fichier
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Formats acceptés: .pkl, .h5, .joblib, .pt, .pb, .py, .json
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/models')} 
            sx={{ mr: 1 }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            type="submit"
          >
            Créer le modèle
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ModelCreate;
