import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
import { useQuery } from 'react-query';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrement des composants ChartJS nécessaires
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Simuler des données pour les graphiques
  const pieData = {
    labels: ['Classification', 'Régression', 'Clustering', 'Prévision', 'Recommandation'],
    datasets: [
      {
        data: [120, 80, 40, 35, 25],
        backgroundColor: [
          '#1976d2',
          '#00acc1',
          '#ff9800',
          '#4caf50',
          '#f44336',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Ventes', 'Marketing', 'R&D', 'Chaîne d\'approvisionnement', 'Finance', 'RH'],
    datasets: [
      {
        label: 'Nombre de modèles',
        data: [65, 85, 50, 45, 35, 20],
        backgroundColor: '#1976d2',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Modèles par département',
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      
      {/* Statistiques générales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#1976d2',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Modèles
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              300
            </Typography>
            <Typography variant="body2">
              +15 ce mois-ci
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#00acc1',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Déploiements
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              185
            </Typography>
            <Typography variant="body2">
              +8 ce mois-ci
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#4caf50',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Exécutions
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              1250
            </Typography>
            <Typography variant="body2">
              +120 cette semaine
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#ff9800',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Utilisateurs
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              42
            </Typography>
            <Typography variant="body2">
              +3 ce mois-ci
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Graphiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Types de modèles" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={pieData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Modèles par département" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
