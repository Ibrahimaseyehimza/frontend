// // components/dashboards/ChefMetierDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const ChefMetierDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Chef de Métier</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Superviser les formations techniques</li>
//           <li>Évaluer les compétences</li>
//           <li>Coordonner avec les entreprises</li>
//           <li>Suivre les progressions</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default ChefMetierDashboard;













import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const ChefMetierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-emerald-500">
          Chef Métier
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard/chef-metier"
            end
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
              }`
            }
          >
            Tableau de bord
          </NavLink>

          <NavLink
            to="/dashboard/chef-metier/campagnes"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
              }`
            }
          >
            Campagnes
          </NavLink>

          <NavLink
            to="/dashboard/chef-metier/entreprises"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
              }`
            }
          >
            Entreprises
          </NavLink>

          <NavLink
            to="/dashboard/chef-metier/apprenants"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
              }`
            }
          >
            Apprenants
          </NavLink>

          <NavLink
            to="/dashboard/chef-metier/stages"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
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

      {/* ✅ Contenu principal */}
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

export default ChefMetierDashboard;
