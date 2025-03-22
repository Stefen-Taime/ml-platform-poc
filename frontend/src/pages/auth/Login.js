import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Link,
  Avatar,
  Container,
  CssBaseline
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  // Configuration du schéma de validation
  const validationSchema = Yup.object({
    username: Yup.string().required('Le nom d\'utilisateur est requis'),
    password: Yup.string().required('Le mot de passe est requis'),
  });
  
  // Configuration du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: false
    },
    validationSchema,
    onSubmit: (values) => {
      // Simuler l'authentification
      console.log('Tentative de connexion avec:', values);
      
      // Rediriger vers la page d'origine ou la page d'accueil
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    },
  });
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Plateforme ML Centralisée
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nom d'utilisateur"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox 
                name="remember" 
                color="primary" 
                checked={formik.values.remember}
                onChange={formik.handleChange}
              />
            }
            label="Se souvenir de moi"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Se connecter
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Mot de passe oublié?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Contacter l'administrateur"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Utilisateurs de démonstration:"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"admin / admin123"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"datascientist / password123"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"business / password123"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"viewer / password123"}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
