// components/dashboards/ApprenantDashboard.jsx
import React from 'react';
import { useAuth } from '../../AuthContext';

const ApprenantDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Apprenant</h1>
      <p>Bienvenue, {user?.name}</p>
      <div>
        <h2>Vos fonctionnalités :</h2>
        <ul>
          <li>Consulter les offres de stage</li>
          <li>Postuler à un stage</li>
          <li>Suivre vos candidatures</li>
          <li>Télécharger vos documents</li>
        </ul>
      </div>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default ApprenantDashboard;