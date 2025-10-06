// components/Unauthorized.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Unauthorized = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    const roleRoutes = {
      'apprenant': '/dashboard/apprenant',
      'chef_departement': '/dashboard/chef-departement',
      'chef_metier': '/dashboard/chef-metier',
      'maitre_stage': '/dashboard/maitre-stage',
      'rh': '/dashboard/rh'
    };
    
    const userDashboard = roleRoutes[user?.role] || '/';
    navigate(userDashboard);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Accès non autorisé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <div>
        <button onClick={goToDashboard} style={{ margin: '10px' }}>
          Retour à mon dashboard
        </button>
        <button onClick={logout} style={{ margin: '10px' }}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;