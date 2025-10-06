// src/components/dashboards/ChefDepartementDashboard.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const ChefDepartementDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-500">
          Chef Dept
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard/chef-departement"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Tableau de bord
          </Link>
          <Link
            to="/dashboard/chef-departement/metiers"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Métiers
          </Link>
          <Link
            to="/dashboard/chef-departement/utilisateurs"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Utilisateurs
          </Link>
          <Link
            to="/dashboard/chef-departement/entreprises"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Entreprises
          </Link>
          <Link
            to="/dashboard/chef-departement/campagnes"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Campagnes
          </Link>
          <Link
            to="/dashboard/chef-departement/stages"
            className="block py-2 px-4 rounded hover:bg-blue-600"
          >
            Stages
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 py-2 px-4 bg-red-500 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Bienvenue, {user?.name}</h1>
          <span className="text-gray-600 text-sm">
            Rôle : {user?.role.replace("_", " ")}
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ChefDepartementDashboard;
