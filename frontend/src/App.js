import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ModelsList from './pages/models/ModelsList';
import ModelDetail from './pages/models/ModelDetail';
import ModelCreate from './pages/models/ModelCreate';
import DeploymentsList from './pages/deployments/DeploymentsList';
import DeploymentDetail from './pages/deployments/DeploymentDetail';
import DeploymentCreate from './pages/deployments/DeploymentCreate';
import ExecutionsList from './pages/executions/ExecutionsList';
import ExecutionDetail from './pages/executions/ExecutionDetail';
import UsersList from './pages/users/UsersList';
import UserProfile from './pages/users/UserProfile';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
  // Simuler l'authentification (à remplacer par une véritable logique d'authentification)
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        
        <Route path="models">
          <Route index element={<ModelsList />} />
          <Route path=":id" element={<ModelDetail />} />
          <Route path="create" element={<ModelCreate />} />
        </Route>
        
        <Route path="deployments">
          <Route index element={<DeploymentsList />} />
          <Route path=":id" element={<DeploymentDetail />} />
          <Route path="create" element={<DeploymentCreate />} />
        </Route>
        
        <Route path="executions">
          <Route index element={<ExecutionsList />} />
          <Route path=":id" element={<ExecutionDetail />} />
        </Route>
        
        <Route path="users">
          <Route index element={<UsersList />} />
          <Route path=":id" element={<UserProfile />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;