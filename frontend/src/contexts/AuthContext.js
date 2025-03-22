import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Récupérer le token du localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Simuler une vérification du token
          // En production, il faudrait vérifier le token auprès du backend
          const userData = {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            fullName: 'Administrateur',
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Fonction de connexion
  const login = async (username, password) => {
    try {
      // Simuler une requête d'authentification
      // En production, il faudrait envoyer une requête au backend
      if (username === 'admin' && password === 'password') {
        const userData = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          fullName: 'Administrateur',
        };
        
        // Stocker le token dans le localStorage
        localStorage.setItem('token', 'fake-jwt-token');
        
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: 'Identifiants invalides' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Valeur du contexte
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
