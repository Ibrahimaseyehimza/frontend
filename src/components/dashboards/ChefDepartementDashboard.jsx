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
// src/components/dashboards/ChefDepartementDashboard.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { RiSchoolLine } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import { FiLogOut } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const ChefDepartementDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white text-black flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header Sidebar */}
        <div className="relative p-6 text-2xl bg-dégradé font-bold shadow border-b border-blue-500 h-14 flex items-center justify-center">
          <img src="/STAGE LINK BLANC.png" alt="" className="h-16 sm:h-20" />
          {/* Bouton fermer sur mobile */}
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <NavLink
            to="."
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink
            to="metiers"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <MdOutlineWorkOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Metiers</span>
            </div>
          </NavLink>

          <NavLink
            to="utilisateurs"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Utilisateurs</span>
            </div>
          </NavLink>

          <NavLink
            to="entreprises"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <RiSchoolLine className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Entreprises</span>
            </div>
          </NavLink>

          <NavLink
            to="rh"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <BsPersonWorkspace className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2 whitespace-nowrap">Ressources Humaines</span>
            </div>
          </NavLink>

          <NavLink
            to="campagnes"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink
            to="stages"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                isActive ? "bg-dégradé text-white" : "hover:bg-dégradé hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Stages</span>
            </div>
          </NavLink>
        </nav>

        {/* Bouton Déconnexion */}
        <button
          onClick={handleLogout}
          className="m-3 sm:m-4 py-2 px-3 sm:px-4 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
        >
          <FiLogOut className="inline mr-2" />
          Déconnexion
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white shadow p-3 sm:p-4 flex justify-between items-center sticky top-0 z-10">
          {/* Bouton menu hamburger sur mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 hover:text-gray-900 mr-3 flex-shrink-0"
          >
            <HiMenuAlt3 size={28} />
          </button>

          <div className="flex-1">
            <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
              Bienvenue, {user?.name}
            </h1>
            <span className="block sm:hidden text-gray-600 text-xs">
              Rôle : {user?.role.replace("_", " ")}
            </span>
          </div>

          <span className="hidden sm:inline text-gray-600 text-xs sm:text-sm ml-2 flex-shrink-0">
            Rôle : {user?.role.replace("_", " ")}
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ChefDepartementDashboard;