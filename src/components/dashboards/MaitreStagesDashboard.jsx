// components/dashboards/MaitreStagesDashboard.jsx
import React from 'react';
import { useAuth } from '../../AuthContext';

const MaitreStageDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Maître de Stage</h1>
      <p>Bienvenue, {user?.name}</p>
      <div>
        <h2>Vos fonctionnalités :</h2>
        <ul>
          <li>Encadrer les stagiaires</li>
          <li>Évaluer les performances</li>
          <li>Rédiger les rapports d'évaluation</li>
          <li>Communiquer avec l'établissement</li>
        </ul>
      </div>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default MaitreStageDashboard;