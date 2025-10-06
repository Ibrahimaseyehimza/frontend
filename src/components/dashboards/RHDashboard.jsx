// components/dashboards/RHDashboard.jsx
import React from 'react';
import { useAuth } from '../../AuthContext';

const RHDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Ressources Humaines</h1>
      <p>Bienvenue, {user?.name}</p>
      <div>
        <h2>Vos fonctionnalités :</h2>
        <ul>
          <li>Gérer les utilisateurs</li>
          <li>Superviser les stages</li>
          <li>Gérer les conventions</li>
          <li>Analyser les statistiques</li>
        </ul>
      </div>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default RHDashboard;