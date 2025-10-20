// // components/dashboards/RHDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../AuthContext";
// import api from "../../api/axios";
// import { IoHomeOutline, IoClose } from "react-icons/io5";
// import { FaRegUser } from "react-icons/fa6";
// import { TbBrandCampaignmonitor } from "react-icons/tb";
// import { SlPeople } from "react-icons/sl";
// import { BsPersonWorkspace } from "react-icons/bs";
// import { FiLogOut, FiSearch, FiSettings, FiUser } from "react-icons/fi";
// import { HiMenuAlt3 } from "react-icons/hi";

// // Composant Stat Card
// const StatCard = ({ title, value, subtitle, icon: Icon, iconBg }) => (
//   <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
//     <div className="flex items-start justify-between">
//       <div className="flex-1">
//         <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
//         <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
//         <p className="text-xs text-gray-400">{subtitle}</p>
//       </div>
//       <div className={`${iconBg} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}>
//         <Icon className="text-white" size={24} />
//       </div>
//     </div>
//   </div>
// );

// // Composant accueil RH
// const TableauDeBordRH = () => {
//   const { user } = useAuth();

//   const [stats, setStats] = useState({
//     totalStages: 0,
//     stagesEnCours: 0,
//     maitresStage: 0,
//     etudiants: 0,
//     tauxAffectation: 0,
//     dureeMoyenne: 0
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchRHData();
//   }, []);

//   const fetchRHData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Endpoints possibles pour les étudiants selon les permissions
//       const etudiantsEndpoints = [
//         "/apprenants",
//         "/utilisateurs?role=apprenant",
//         "/etudiants",
//         "/users?role=apprenant"
//       ];
      
//       let etudiantsPromise = api.get(etudiantsEndpoints[0]).catch(() => 
//         api.get(etudiantsEndpoints[1]).catch(() => 
//           api.get(etudiantsEndpoints[2]).catch(() => 
//             api.get(etudiantsEndpoints[3]).catch(() => ({ data: [] }))
//           )
//         )
//       );

//       // Récupération parallèle des données
//       const responses = await Promise.allSettled([
//         api.get("/campagnes_rh"),
//         api.get("/maitres"),
//         api.get("/entreprises"),
//         etudiantsPromise
//       ]);

//       // Extraction des campagnes
//       const campagnes = responses[0].status === 'fulfilled' 
//         ? (responses[0].value?.data?.data || []) 
//         : [];

//       // Extraction des maîtres de stage
//       const maitres = responses[1].status === 'fulfilled' 
//         ? (responses[1].value?.data?.data || []) 
//         : [];

//       // Extraction des entreprises
//       const entreprises = responses[2].status === 'fulfilled' 
//         ? (responses[2].value?.data?.data || []) 
//         : [];

//       // Extraction des étudiants
//       let etudiantsData = [];
//       if (responses[3].status === 'fulfilled') {
//         const etudiantsResponse = responses[3].value?.data;
        
//         if (Array.isArray(etudiantsResponse)) {
//           etudiantsData = etudiantsResponse;
//         } else if (etudiantsResponse?.data && Array.isArray(etudiantsResponse.data)) {
//           etudiantsData = etudiantsResponse.data;
//         } else if (etudiantsResponse?.apprenants && Array.isArray(etudiantsResponse.apprenants)) {
//           etudiantsData = etudiantsResponse.apprenants;
//         } else if (etudiantsResponse?.utilisateurs && Array.isArray(etudiantsResponse.utilisateurs)) {
//           etudiantsData = etudiantsResponse.utilisateurs;
//         }
        
//         console.log("✅ Étudiants récupérés:", etudiantsData.length);
//       } else {
//         console.warn("⚠️ Impossible de récupérer les étudiants directement");
        
//         // Alternative : Compter depuis les campagnes
//         const etudiantsSet = new Set();
//         campagnes.forEach(campagne => {
//           if (campagne.etudiants && Array.isArray(campagne.etudiants)) {
//             campagne.etudiants.forEach(etudiant => {
//               if (etudiant.id) etudiantsSet.add(etudiant.id);
//             });
//           }
//           if (campagne.apprenants && Array.isArray(campagne.apprenants)) {
//             campagne.apprenants.forEach(apprenant => {
//               if (apprenant.id) etudiantsSet.add(apprenant.id);
//             });
//           }
//         });
//         etudiantsData = Array.from(etudiantsSet).map(id => ({ id }));
//         console.log("📊 Étudiants comptés depuis les campagnes:", etudiantsData.length);
//       }

//       // Calcul des statistiques
//       const totalStages = campagnes.length;
      
//       const stagesEnCours = campagnes.filter(c => {
//         return c.date_fin && new Date(c.date_fin) > new Date();
//       }).length;

//       const nombreMaitres = maitres.length;
//       const nombreEtudiants = etudiantsData.length;

//       // Calcul du taux d'affectation
//       let tauxAffectation = 0;
//       if (nombreEtudiants > 0) {
//         const etudiantsAffectes = new Set();
//         campagnes.forEach(campagne => {
//           if (campagne.etudiants && Array.isArray(campagne.etudiants)) {
//             campagne.etudiants.forEach(etudiant => {
//               if (etudiant.id) etudiantsAffectes.add(etudiant.id);
//             });
//           }
//         });
//         tauxAffectation = Math.round((etudiantsAffectes.size / nombreEtudiants) * 100);
//       }

//       // Calcul de la durée moyenne
//       let dureeMoyenne = 0;
//       if (campagnes.length > 0) {
//         const durees = campagnes
//           .filter(c => c.date_debut && c.date_fin)
//           .map(c => {
//             const debut = new Date(c.date_debut);
//             const fin = new Date(c.date_fin);
//             const diffTime = Math.abs(fin - debut);
//             const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
//             return diffMonths;
//           });
        
//         if (durees.length > 0) {
//           dureeMoyenne = durees.reduce((a, b) => a + b, 0) / durees.length;
//         }
//       }

//       setStats({
//         totalStages,
//         stagesEnCours,
//         maitresStage: nombreMaitres,
//         etudiants: nombreEtudiants,
//         tauxAffectation,
//         dureeMoyenne: dureeMoyenne.toFixed(1)
//       });

//       console.log("📊 Données RH chargées:", {
//         totalStages,
//         stagesEnCours,
//         nombreMaitres,
//         nombreEtudiants,
//         tauxAffectation: `${tauxAffectation}%`,
//         dureeMoyenne: `${dureeMoyenne.toFixed(1)} mois`
//       });

//     } catch (err) {
//       console.error("❌ Erreur lors du chargement des données RH:", err);
//       setError("Impossible de charger les données");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Chargement des données...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center bg-red-50 p-6 rounded-lg">
//           <p className="text-red-600 font-semibold">{error}</p>
//           <button
//             onClick={fetchRHData}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-dégradé rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold mb-1">Bienvenue, {user?.name}</h1>
//           <p className="text-blue-100 text-sm">Tableau de bord - Ressources Humaines</p>
//           <p className="text-xs text-blue-200 mt-1">Gérez et supervisez les stages et maîtres de stage</p>
//         </div>
//         <div className="hidden md:block">
//           <img src="/LOGO EIT.png" alt="" className="h-20" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total des Stages"
//           value={stats.totalStages}
//           subtitle="Stages enregistrés"
//           icon={SlPeople}
//           iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
//         />
//         <StatCard
//           title="Stages en Cours"
//           value={stats.stagesEnCours}
//           subtitle="Actuellement actifs"
//           icon={TbBrandCampaignmonitor}
//           iconBg="bg-gradient-to-br from-green-500 to-green-600"
//         />
//         <StatCard
//           title="Maîtres de Stage"
//           value={stats.maitresStage}
//           subtitle="Superviseurs"
//           icon={FaRegUser}
//           iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
//         />
//         <StatCard
//           title="Étudiants"
//           value={stats.etudiants}
//           subtitle="En stage"
//           icon={BsPersonWorkspace}
//           iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
//         />
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
//           <span>Actions Principales</span>
//           <span className="text-yellow-500">⚡</span>
//         </h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <NavLink
//             to="maitresrh"
//             className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-all hover:shadow-md"
//           >
//             <div className="text-blue-600 mb-3">
//               <FaRegUser size={32} />
//             </div>
//             <h4 className="font-semibold text-gray-900 mb-1">Maîtres de Stage</h4>
//             <p className="text-xs text-gray-600">Gérer les superviseurs</p>
//           </NavLink>

//           <NavLink
//             to="campagnes"
//             className="block p-6 bg-green-50 hover:bg-green-100 rounded-2xl text-left transition-all hover:shadow-md"
//           >
//             <div className="text-green-600 mb-3">
//               <TbBrandCampaignmonitor size={32} />
//             </div>
//             <h4 className="font-semibold text-gray-900 mb-1">Campagnes</h4>
//             <p className="text-xs text-gray-600">Suivi des campagnes</p>
//           </NavLink>

//           <NavLink
//             to="stages"
//             className="block p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl text-left transition-all hover:shadow-md"
//           >
//             <div className="text-purple-600 mb-3">
//               <SlPeople size={32} />
//             </div>
//             <h4 className="font-semibold text-gray-900 mb-1">Stages</h4>
//             <p className="text-xs text-gray-600">Gérer les affectations</p>
//           </NavLink>

//           <NavLink
//             to="/dashboard/chef-departement"
//             className="block p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl text-left transition-all hover:shadow-md"
//           >
//             <div className="text-orange-600 mb-3">
//               <IoHomeOutline size={32} />
//             </div>
//             <h4 className="font-semibold text-gray-900 mb-1">Retour Général</h4>
//             <p className="text-xs text-gray-600">Vue d'ensemble</p>
//           </NavLink>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center">
//             <span className="mr-2">📊</span>
//             Aperçu RH
//           </h3>
//           <button
//             onClick={fetchRHData}
//             className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Actualiser
//           </button>
//         </div>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
//             <p className="text-3xl font-bold text-green-600 mb-1">{stats.tauxAffectation}%</p>
//             <p className="text-sm text-gray-600">Taux d'affectation</p>
//           </div>
//           <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
//             <p className="text-3xl font-bold text-blue-600 mb-1">{stats.maitresStage}</p>
//             <p className="text-sm text-gray-600">Maîtres actifs</p>
//           </div>
//           <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
//             <p className="text-3xl font-bold text-purple-600 mb-1">{stats.dureeMoyenne} mois</p>
//             <p className="text-sm text-gray-600">Durée moyenne des stages</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Composant principal RHDashboard
// const RHDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const getInitials = (name) => {
//     if (!name) return "U";
//     const parts = name.trim().split(" ");
//     if (parts.length >= 2) {
//       return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
//     }
//     return parts[0][0].toUpperCase();
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   useEffect(() => {
//     if (window.innerWidth < 1024) {
//       setIsSidebarOpen(false);
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showProfileMenu]);

//   const isHomePage = location.pathname === "/dashboard/rh" || location.pathname === "/dashboard/rh/";

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//           onClick={closeSidebar}
//         ></div>
//       )}

//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white text-black flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0`}
//       >
//         <div className="relative p-6 text-2xl bg-dégradé font-bold shadow border-b border-blue-500 h-16 flex items-center justify-center">
//           <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="h-12 sm:h-16" />
//           <button
//             onClick={closeSidebar}
//             className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
//           >
//             <IoClose size={24} />
//           </button>
//         </div>

//         {/* <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
//           <NavLink to="." end className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"}`}>
//             <div className="flex items-center">
//               <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
//               <span className="ml-2">Tableau de bord</span>
//             </div>
//           </NavLink>

//           <NavLink to="maitresrh" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"}`}>
//             <div className="flex items-center">
//               <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
//               <span className="ml-2">Maîtres de Stage</span>
//             </div>
//           </NavLink>

//           <NavLink to="campagnes_rh" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"}`}>
//             <div className="flex items-center">
//               <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
//               <span className="ml-2">Campagnes</span>
//             </div>
//           </NavLink>

//           <NavLink to="stages" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"}`}>
//             <div className="flex items-center">
//               <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
//               <span className="ml-2">Stages</span>
//             </div>
//           </NavLink>
//         </nav> */}

//         // Remplacez la section <nav> dans RHDashboard.jsx (lignes ~370-405)

// <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
//   {/* ✅ Tableau de bord */}
//   <NavLink 
//     to="." 
//     end 
//     className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
//       isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
//     }`}
//   >
//     <div className="flex items-center">
//       <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
//       <span className="ml-2">Tableau de bord</span>
//     </div>
//   </NavLink>

//   {/* ✅ CORRIGÉ : Maîtres de stage */}
//   <NavLink 
//     to="maitres" 
//     className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
//       isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
//     }`}
//   >
//     <div className="flex items-center">
//       <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
//       <span className="ml-2">Maîtres de Stage</span>
//     </div>
//   </NavLink>

//   {/* ✅ CORRIGÉ : Campagnes */}
//     <NavLink 
//       to="campagnes" 
//       className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
//         isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
//       }`}
//     >
//       <div className="flex items-center">
//         <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
//         <span className="ml-2">Campagnes</span>
//       </div>
//     </NavLink>

//     {/* ✅ Stages */}
//     <NavLink 
//       to="stages" 
//       className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
//         isActive ? "bg-blue-100 text-blue-600 shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
//       }`}
//     >
//       <div className="flex items-center">
//         <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
//         <span className="ml-2">Stages</span>
//       </div>
//     </NavLink>
//   </nav>
//       </aside>

//       <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
//         <header className="bg-white shadow-sm p-3 sm:p-4 flex items-center gap-4 sticky top-0 z-10">
//           <button onClick={toggleSidebar} className="lg:hidden text-gray-700 hover:text-gray-900 flex-shrink-0">
//             <HiMenuAlt3 size={28} />
//           </button>

//           <div className="flex-1 max-w-2xl justify-end hidden sm:flex mx-auto">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-50 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="relative profile-menu-container flex-shrink-0">
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <div className="w-10 h-10 bg-dégradé text-white rounded-full flex items-center justify-center font-bold text-sm">
//                 {getInitials(user?.name)}
//               </div>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
//                 <p className="text-xs text-gray-500">Ressources Humaines</p>
//               </div>
//             </button>

//             {showProfileMenu && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                 <div className="px-4 py-3 border-b border-gray-200">
//                   <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
//                   <p className="text-xs text-gray-500">{user?.email}</p>
//                 </div>
//                 <button onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
//                   <FiUser size={18} />
//                   <span>Mon Profil</span>
//                 </button>
//                 <button onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
//                   <FiSettings size={18} />
//                   <span>Paramètres</span>
//                 </button>
//                 <div className="border-t border-gray-200 mt-2 pt-2">
//                   <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
//                     <FiLogOut size={18} />
//                     <span>Se déconnecter</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>

//         <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
//           {isHomePage ? <TableauDeBordRH /> : <Outlet />}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RHDashboard;



















// components/dashboards/RHDashboard.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import api from "../../api/axios";
import { IoHomeOutline, IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import { BsPersonWorkspace } from "react-icons/bs";
import { FiLogOut, FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";

// Composant Stat Card
const StatCard = ({ title, value, subtitle, icon: Icon, iconBg }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className={`${iconBg} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

// Composant accueil RH
const TableauDeBordRH = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalStages: 0,
    stagesEnCours: 0,
    maitresStage: 0,
    etudiants: 0,
    tauxAffectation: 0,
    dureeMoyenne: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRHData();
  }, []);

  const fetchRHData = async () => {
    try {
      setLoading(true);
      setError(null);

      const etudiantsEndpoints = [
        "/apprenants",
        "/utilisateurs?role=apprenant",
        "/etudiants",
        "/users?role=apprenant"
      ];
      
      let etudiantsPromise = api.get(etudiantsEndpoints[0]).catch(() => 
        api.get(etudiantsEndpoints[1]).catch(() => 
          api.get(etudiantsEndpoints[2]).catch(() => 
            api.get(etudiantsEndpoints[3]).catch(() => ({ data: [] }))
          )
        )
      );

      const responses = await Promise.allSettled([
        api.get("/campagnes_rh"),
        api.get("/maitres"),
        api.get("/entreprises"),
        etudiantsPromise
      ]);

      const campagnes = responses[0].status === 'fulfilled' 
        ? (responses[0].value?.data?.data || []) 
        : [];

      const maitres = responses[1].status === 'fulfilled' 
        ? (responses[1].value?.data?.data || []) 
        : [];

      const entreprises = responses[2].status === 'fulfilled' 
        ? (responses[2].value?.data?.data || []) 
        : [];

      let etudiantsData = [];
      if (responses[3].status === 'fulfilled') {
        const etudiantsResponse = responses[3].value?.data;
        
        if (Array.isArray(etudiantsResponse)) {
          etudiantsData = etudiantsResponse;
        } else if (etudiantsResponse?.data && Array.isArray(etudiantsResponse.data)) {
          etudiantsData = etudiantsResponse.data;
        } else if (etudiantsResponse?.apprenants && Array.isArray(etudiantsResponse.apprenants)) {
          etudiantsData = etudiantsResponse.apprenants;
        } else if (etudiantsResponse?.utilisateurs && Array.isArray(etudiantsResponse.utilisateurs)) {
          etudiantsData = etudiantsResponse.utilisateurs;
        }
        
        console.log("✅ Étudiants récupérés:", etudiantsData.length);
      } else {
        console.warn("⚠️ Impossible de récupérer les étudiants directement");
        
        const etudiantsSet = new Set();
        campagnes.forEach(campagne => {
          if (campagne.etudiants && Array.isArray(campagne.etudiants)) {
            campagne.etudiants.forEach(etudiant => {
              if (etudiant.id) etudiantsSet.add(etudiant.id);
            });
          }
          if (campagne.apprenants && Array.isArray(campagne.apprenants)) {
            campagne.apprenants.forEach(apprenant => {
              if (apprenant.id) etudiantsSet.add(apprenant.id);
            });
          }
        });
        etudiantsData = Array.from(etudiantsSet).map(id => ({ id }));
        console.log("📊 Étudiants comptés depuis les campagnes:", etudiantsData.length);
      }

      const totalStages = campagnes.length;
      
      const stagesEnCours = campagnes.filter(c => {
        return c.date_fin && new Date(c.date_fin) > new Date();
      }).length;

      const nombreMaitres = maitres.length;
      const nombreEtudiants = etudiantsData.length;

      let tauxAffectation = 0;
      if (nombreEtudiants > 0) {
        const etudiantsAffectes = new Set();
        campagnes.forEach(campagne => {
          if (campagne.etudiants && Array.isArray(campagne.etudiants)) {
            campagne.etudiants.forEach(etudiant => {
              if (etudiant.id) etudiantsAffectes.add(etudiant.id);
            });
          }
        });
        tauxAffectation = Math.round((etudiantsAffectes.size / nombreEtudiants) * 100);
      }

      let dureeMoyenne = 0;
      if (campagnes.length > 0) {
        const durees = campagnes
          .filter(c => c.date_debut && c.date_fin)
          .map(c => {
            const debut = new Date(c.date_debut);
            const fin = new Date(c.date_fin);
            const diffTime = Math.abs(fin - debut);
            const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
            return diffMonths;
          });
        
        if (durees.length > 0) {
          dureeMoyenne = durees.reduce((a, b) => a + b, 0) / durees.length;
        }
      }

      setStats({
        totalStages,
        stagesEnCours,
        maitresStage: nombreMaitres,
        etudiants: nombreEtudiants,
        tauxAffectation,
        dureeMoyenne: dureeMoyenne.toFixed(1)
      });

      console.log("📊 Données RH chargées:", {
        totalStages,
        stagesEnCours,
        nombreMaitres,
        nombreEtudiants,
        tauxAffectation: `${tauxAffectation}%`,
        dureeMoyenne: `${dureeMoyenne.toFixed(1)} mois`
      });

    } catch (err) {
      console.error("❌ Erreur lors du chargement des données RH:", err);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={fetchRHData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-dégradé rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Bienvenue, {user?.name}</h1>
          <p className="text-blue-100 text-sm">Tableau de bord - Ressources Humaines</p>
          <p className="text-xs text-blue-200 mt-1">Gérez et supervisez les stages et maîtres de stage</p>
        </div>
        <div className="hidden md:block">
          <img src="/LOGO EIT.png" alt="" className="h-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total des Stages"
          value={stats.totalStages}
          subtitle="Stages enregistrés"
          icon={SlPeople}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Stages en Cours"
          value={stats.stagesEnCours}
          subtitle="Actuellement actifs"
          icon={TbBrandCampaignmonitor}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Maîtres de Stage"
          value={stats.maitresStage}
          subtitle="Superviseurs"
          icon={FaRegUser}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Étudiants"
          value={stats.etudiants}
          subtitle="En stage"
          icon={BsPersonWorkspace}
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
          <span>Actions Principales</span>
          <span className="text-yellow-500">⚡</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavLink
            to="maitres"
            className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-all hover:shadow-md"
          >
            <div className="text-blue-600 mb-3">
              <FaRegUser size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Maîtres de Stage</h4>
            <p className="text-xs text-gray-600">Gérer les superviseurs</p>
          </NavLink>

          <NavLink
            to="campagnes"
            className="block p-6 bg-green-50 hover:bg-green-100 rounded-2xl text-left transition-all hover:shadow-md"
          >
            <div className="text-green-600 mb-3">
              <TbBrandCampaignmonitor size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Campagnes</h4>
            <p className="text-xs text-gray-600">Suivi des campagnes</p>
          </NavLink>

          <NavLink
            to="stages"
            className="block p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl text-left transition-all hover:shadow-md"
          >
            <div className="text-purple-600 mb-3">
              <SlPeople size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Stages</h4>
            <p className="text-xs text-gray-600">Gérer les affectations</p>
          </NavLink>

          <NavLink
            to="/dashboard/chef-departement"
            className="block p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl text-left transition-all hover:shadow-md"
          >
            <div className="text-orange-600 mb-3">
              <IoHomeOutline size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Retour Général</h4>
            <p className="text-xs text-gray-600">Vue d'ensemble</p>
          </NavLink>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="mr-2">📊</span>
            Aperçu RH
          </h3>
          <button
            onClick={fetchRHData}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-green-600 mb-1">{stats.tauxAffectation}%</p>
            <p className="text-sm text-gray-600">Taux d'affectation</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.maitresStage}</p>
            <p className="text-sm text-gray-600">Maîtres actifs</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-purple-600 mb-1">{stats.dureeMoyenne} mois</p>
            <p className="text-sm text-gray-600">Durée moyenne des stages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal RHDashboard
const RHDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

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

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const isHomePage = location.pathname === "/dashboard/rh" || location.pathname === "/dashboard/rh/";

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white text-black flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="relative p-6 text-2xl bg-dégradé font-bold shadow border-b border-blue-500 h-16 flex items-center justify-center">
          <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="h-12 sm:h-16" />
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <NavLink 
            to="." 
            end 
            className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
              isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink 
            to="maitres" 
            className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
              isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Maîtres de Stage</span>
            </div>
          </NavLink>

          <NavLink 
            to="campagnes" 
            className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
              isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink 
            to="stages" 
            className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
              isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center">
              <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Stages</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        <header className="bg-white shadow-sm p-3 sm:p-4 flex items-center gap-4 sticky top-0 z-10">
          <button onClick={toggleSidebar} className="lg:hidden text-gray-700 hover:text-gray-900 flex-shrink-0">
            <HiMenuAlt3 size={28} />
          </button>

          <div className="flex-1 max-w-2xl justify-end hidden sm:flex mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-50 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
                <p className="text-xs text-gray-500">Ressources Humaines</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FiUser size={18} />
                  <span>Mon Profil</span>
                </button>
                <button onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FiSettings size={18} />
                  <span>Paramètres</span>
                </button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                    <FiLogOut size={18} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {isHomePage ? <TableauDeBordRH /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default RHDashboard;