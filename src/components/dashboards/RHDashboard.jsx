// // components/dashboards/RHDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const RHDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Ressources Humaines</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Gérer les utilisateurs</li>
//           <li>Superviser les stages</li>
//           <li>Gérer les conventions</li>
//           <li>Analyser les statistiques</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default RHDashboard;













import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const RHDashboard = () => {
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
          Tableau RH
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard/rh"
            end
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Vue d’ensemble
          </NavLink>

          <NavLink
            to="/dashboard/rh/maitres"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Maîtres de Stage
          </NavLink>

          <NavLink
            to="/dashboard/rh/campagnes"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Campagnes
          </NavLink>

          <NavLink
            to="/dashboard/rh/stages"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Stages
          </NavLink>
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
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Bienvenue, {user?.name}</h1>
          <span className="text-gray-600 text-sm">
            Rôle : {user?.role?.replace("_", " ")}
          </span>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RHDashboard;
