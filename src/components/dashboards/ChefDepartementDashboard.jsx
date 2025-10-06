// // components/dashboards/ChefDepartementDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const ChefDepartementDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Chef de Département</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Gérer les apprenants du département</li>
//           <li>Valider les stages</li>
//           <li>Consulter les rapports</li>
//           <li>Gérer les partenariats entreprises</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default ChefDepartementDashboard;








// import React from "react";

// const DashboardChefDepartement = () => {
//   return (
//     <div className="min-h-screen flex">
//       <aside className="w-64 bg-white shadow-lg p-5">
//         <h2 className="text-2xl font-bold mb-6">Chef de Département</h2>
//         <ul className="space-y-3">
//           <li className="p-2 rounded hover:bg-blue-100 cursor-pointer">Ajouter Étudiant</li>
//           <li className="p-2 rounded hover:bg-blue-100 cursor-pointer">Créer Campagne</li>
//           <li className="p-2 rounded hover:bg-blue-100 cursor-pointer">Liste Étudiants</li>
//         </ul>
//       </aside>
//       <main className="flex-1 p-10">
//         <header className="mb-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold">Dashboard Chef de Département</h1>
//         </header>
//         <section className="bg-white p-6 rounded-xl shadow">
//           <p>Bienvenue Chef de Département ! Gérez vos étudiants et campagnes ici.</p>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardChefDepartement;





// // src/components/dashboards/ChefDepartementDashboard.jsx
// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../../AuthContext";

// const ChefDepartementDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-700 text-white flex flex-col">
//         <div className="p-6 text-2xl font-bold border-b border-blue-500">
//           Chef Dept
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           <Link
//             to="/dashboard/chef-departement"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Tableau de bord
//           </Link>
//           <Link
//             to="/dashboard/chef-departement/metiers"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Métiers
//           </Link>
//           <Link
//             to="/dashboard/chef-departement/utilisateurs"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Utilisateurs
//           </Link>
//           <Link
//             to="/dashboard/chef-departement/entreprises"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Entreprises
//           </Link>
//           <Link
//             to="/dashboard/chef-departement/campagnes"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Campagnes
//           </Link>
//           <Link
//             to="/dashboard/chef-departement/stages"
//             className="block py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Stages
//           </Link>
//         </nav>
//         <button
//           onClick={handleLogout}
//           className="m-4 py-2 px-4 bg-red-500 rounded hover:bg-red-600"
//         >
//           Déconnexion
//         </button>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow p-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold">Bienvenue, {user?.name}</h1>
//           <span className="text-gray-600 text-sm">
//             Rôle : {user?.role.replace("_", " ")}
//           </span>
//         </header>

//         {/* Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ChefDepartementDashboard;




// NEW CHEF DE DEOARTEMENT



// src/components/dashboards/ChefDepartementDashboard.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
          Chef Département
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Tableau de bord
          </NavLink>
          <NavLink
            to="metiers"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Métiers
          </NavLink>
          <NavLink
            to="utilisateurs"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Utilisateurs
          </NavLink>
          <NavLink
            to="entreprises"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Entreprises
          </NavLink>
          <NavLink
              to="rh"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${
                  isActive ? "bg-blue-900" : "hover:bg-blue-600"
                }`
              }
            >
              Ressources Humaines
            </NavLink>

          <NavLink
            to="campagnes"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            Campagnes
          </NavLink>
          <NavLink
            to="stages"
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
