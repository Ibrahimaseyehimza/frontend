// components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { path: `/dashboard/${user?.role}`, label: 'Mon Dashboard' }
    ];

    switch (user?.role) {
      case 'apprenant':
        return [...baseItems, 
          { path: '/stages', label: 'Stages disponibles' },
          { path: '/mes-candidatures', label: 'Mes candidatures' }
        ];
      case 'chef_departement':
        return [...baseItems,
          { path: '/gestion-apprenants', label: 'Gérer les apprenants' },
          { path: '/validation-stages', label: 'Valider les stages' }
        ];
      case 'rh':
        return [...baseItems,
          { path: '/gestion-utilisateurs', label: 'Gérer les utilisateurs' },
          { path: '/statistiques', label: 'Statistiques' }
        ];
      default:
        return baseItems;
    }
  };

  return (
    <nav>
      {getNavigationItems().map((item, index) => (
        <Link key={index} to={item.path}>{item.label}</Link>
      ))}
      <button onClick={logout}>Déconnexion</button>
    </nav>
  );
};

export default Navigation;