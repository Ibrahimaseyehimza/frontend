// // components/dashboards/ApprenantDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const ApprenantDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Apprenant</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Consulter les offres de stage</li>
//           <li>Postuler à un stage</li>
//           <li>Suivre vos candidatures</li>
//           <li>Télécharger vos documents</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default ApprenantDashboard;















// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";

// const DashboardApprenant = () => {
//   const [campagnes, setCampagnes] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [form, setForm] = useState({ adresse_1: "", adresse_2: "" });
//   const [success, setSuccess] = useState("");

//   useEffect(() => {

//       if (!token) return; // ⛔ n’appelle pas l’API sans token

//     const fetchCampagnes = async () => {
//       try {
//         const res = await api.get("/apprenant/campagnes");
//         setCampagnes(res.data.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCampagnes();
//   }, []);

//   const handlePostuler = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/apprenant/postuler", {
//         campagne_id: selected.id,
//         entreprise_id: selected.entreprise_id,
//         adresse_1: form.adresse_1,
//         adresse_2: form.adresse_2,
//       });
//       setSuccess("Candidature envoyée avec succès ✅");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Campagnes disponibles 🎯</h1>

//       {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {campagnes.map((campagne) => (
//           <div key={campagne.id} className="bg-white shadow-lg rounded-xl p-4">
//             <h2 className="font-semibold text-lg">{campagne.titre}</h2>
//             <p className="text-gray-500">{campagne.metier?.nom}</p>
//             <button
//               onClick={() => setSelected(campagne)}
//               className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Postuler
//             </button>
//           </div>
//         ))}
//       </div>

//       {selected && (
//         <div className="mt-6 bg-gray-100 p-4 rounded-xl">
//           <h3 className="text-lg font-bold mb-3">Postuler à {selected.titre}</h3>
//           <form onSubmit={handlePostuler}>
//             <input
//               type="text"
//               placeholder="Adresse 1"
//               className="border p-2 w-full mb-2 rounded"
//               value={form.adresse_1}
//               onChange={(e) => setForm({ ...form, adresse_1: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Adresse 2 (facultatif)"
//               className="border p-2 w-full mb-2 rounded"
//               value={form.adresse_2}
//               onChange={(e) => setForm({ ...form, adresse_2: e.target.value })}
//             />
//             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
//               Soumettre la demande
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardApprenant;








// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../AuthContext";

// const ApprenantDashboard = () => {
//   const { token, user } = useAuth(); // ✅ Récupère le token et le user depuis le contexte
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🧠 Appel API pour charger les campagnes
//   useEffect(() => {
//     if (!token) {
//       console.warn("⏳ En attente du token...");
//       return; // Ne rien faire tant qu’on n’a pas le token
//     }


// const fetchCampagnes = async () => {
//   try {
//     setLoading(true);
//     console.log("📡 Chargement des campagnes pour :", user?.email);

//     const response = await api.get("/campagnes/apprenant");
    
//     // Gérer différentes structures de réponse
//     if (response.data && response.data.success !== false) {
//       const campagnesData = response.data.data || response.data || [];
//       setCampagnes(campagnesData);
//       console.log(`✅ ${campagnesData.length} campagne(s) chargée(s)`);
//     } else {
//       // Si success: false ou structure inattendue
//       console.warn("⚠️ Réponse inattendue:", response.data);
//       setCampagnes([]);
//     }
    
//   } catch (error) {
//     console.error("❌ Erreur chargement campagnes:", error);
    
//     // Gérer spécifiquement le cas "campagne non trouvée"
//     if (error.response?.status === 404) {
//       console.log("ℹ️ Aucune campagne disponible");
//       setCampagnes([]);
//     } else {
//       // Pour les autres erreurs
//       setCampagnes([]);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//     fetchCampagnes();
//   }, [token, user]);

//   if (loading) {
//     return <p className="text-center mt-10">Chargement des campagnes...</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Bienvenue, {user?.prenom || user?.nom}
//       </h1>

//       <h2 className="text-xl font-semibold mb-3 text-blue-700">
//         Campagnes disponibles
//       </h2>

//       {campagnes.length === 0 ? (
//         <p>Aucune campagne disponible pour ton métier.</p>
//       ) : (
//         <ul className="space-y-4">
//           {campagnes.map((campagne) => (
//             <li
//               key={campagne.id}
//               className="border rounded-lg p-4 shadow-md hover:bg-gray-50"
//             >
//               <h3 className="text-lg font-semibold text-blue-600">
//                 {campagne.titre}
//               </h3>
//               <p>{campagne.description}</p>
//               <p className="text-sm text-gray-500">
//                 📅 Du {campagne.date_debut} au {campagne.date_fin}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ApprenantDashboard;







import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate, Outlet, NavLink } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiUser, FiSettings, FiLogOut, FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { MdAssignmentTurnedIn, MdNoteAlt } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";

const ApprenantDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name) => {
    if (!name) return "AP";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  const isHomePage =
    location.pathname === "/dashboard/apprenant" ||
    location.pathname === "/dashboard/apprenant/";

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white text-black flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="relative p-6 text-2xl bg-dégradé font-bold shadow border-b border-blue-500 h-14 flex items-center justify-center">
          <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="h-16 sm:h-20" />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <NavLink to="campagnes" end className={({ isActive }) => navStyle(isActive)}>
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink to="mes-demandes" className={({ isActive }) => navStyle(isActive)}>
            <div className="flex items-center">
              <MdAssignmentTurnedIn className="text-lg sm:text-xl" />
              <span className="ml-2">Mes demandes</span>
            </div>
          </NavLink>

          <NavLink to="mon-stage" className={({ isActive }) => navStyle(isActive)}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl" />
              <span className="ml-2">Mon stage</span>
            </div>
          </NavLink>

          <NavLink to="rapport" className={({ isActive }) => navStyle(isActive)}>
            <div className="flex items-center">
              <BsFileEarmarkText className="text-lg sm:text-xl" />
              <span className="ml-2">Rapport</span>
            </div>
          </NavLink>

          <NavLink to="notes" className={({ isActive }) => navStyle(isActive)}>
            <div className="flex items-center">
              <MdNoteAlt className="text-lg sm:text-xl" />
              <span className="ml-2">Notes</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-3 sm:p-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900"
          >
            <HiMenuAlt3 size={28} />
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-2xl justify-end hidden sm:flex mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-50 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Menu profil */}
          <div className="relative profile-menu-container flex-shrink-0">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-dégradé text-white rounded-full flex items-center justify-center font-bold text-sm">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">Apprenant</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || "apprenant@isep-thies.edu.sn"}</p>
                </div>

                <button onClick={() => setShowProfileMenu(false)} className="menu-item">
                  <FiUser size={18} />
                  <span>Mon Profil</span>
                </button>

                <button onClick={() => setShowProfileMenu(false)} className="menu-item">
                  <FiSettings size={18} />
                  <span>Paramètres</span>
                </button>

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button onClick={handleLogout} className="menu-item text-red-600 hover:bg-red-50">
                    <FiLogOut size={18} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {isHomePage ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">Bienvenue, {user?.prenom || user?.nom}</h1>
              <p className="text-gray-600">Sélectionne une section dans le menu à gauche pour commencer.</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}

export default ApprenantDashboard;

const navStyle = (isActive) =>
  `flex items-center p-3 rounded-lg hover:bg-blue-100 transition-colors ${
    isActive ? "bg-blue-200 font-semibold text-blue-700" : "text-gray-700"
  }`;