// src/components/dashboards/MaitreStageDashboard.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

const MaitreStageDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-green-500">
          Maître de Stage
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard/maitre-stage"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? "bg-green-900" : "hover:bg-green-600"}`
            }
          >
            Tableau de bord
          </NavLink>

          <NavLink
            to="/dashboard/maitre-stage/stagiaires"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? "bg-green-900" : "hover:bg-green-600"}`
            }
          >
            Stagiaires
          </NavLink>

          <NavLink
            to="/dashboard/maitre-stage/livrables"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? "bg-green-900" : "hover:bg-green-600"}`
            }
          >
            Livrables
          </NavLink>

          <NavLink
            to="/dashboard/maitre-stage/evaluations"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? "bg-green-900" : "hover:bg-green-600"}`
            }
          >
            Évaluations
          </NavLink>

          <NavLink
            to="/dashboard/maitre-stage/profil"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? "bg-green-900" : "hover:bg-green-600"}`
            }
          >
            Mon Profil
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 py-2 px-4 bg-red-500 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Bienvenue, {user?.name}</h1>
          <span className="text-gray-600 text-sm">
            Rôle : {user?.role.replace("_", " ")}
          </span>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MaitreStageDashboard;
