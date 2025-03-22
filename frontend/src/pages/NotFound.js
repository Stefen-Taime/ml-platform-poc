import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper,
  Grid
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          mt: 10, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" component="h1" gutterBottom>
              404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Page non trouvée
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              La page que vous recherchez n'existe pas ou a été déplacée.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Retour à l'accueil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFound;
