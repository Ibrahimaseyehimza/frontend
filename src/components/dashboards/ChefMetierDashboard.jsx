// components/dashboards/ChefMetierDashboard.jsx
import React from 'react';
import { useAuth } from '../../AuthContext';

const ChefMetierDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Chef de Métier</h1>
      <p>Bienvenue, {user?.name}</p>
      <div>
        <h2>Vos fonctionnalités :</h2>
        <ul>
          <li>Superviser les formations techniques</li>
          <li>Évaluer les compétences</li>
          <li>Coordonner avec les entreprises</li>
          <li>Suivre les progressions</li>
        </ul>
      </div>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default ChefMetierDashboard;