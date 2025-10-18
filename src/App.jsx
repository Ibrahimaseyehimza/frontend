
// // App.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';
// // import ProtectedRoute from './components/ProtectedRoute';
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from './components/Login';
// import Register from './components/Register';
// import Unauthorized from './components/Unauthorized';

// // Import des dashboards
// import ApprenantDashboard from './components/dashboards/ApprenantDashboard';
// import ChefDepartementDashboard from './components/dashboards/ChefDepartementDashboard';
// import ChefMetierDashboard from './components/dashboards/ChefMetierDashboard';
// import MaitreStageDashboard from './components/dashboards/MaitreStagesDashboard';
// import RHDashboard from './components/dashboards/RHDashboard';

// import MetierList from './components/pages/MetierList';
// // Composant pour rediriger vers le login si non connecté
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
// };

// // Composant pour rediriger vers le bon dashboard
// const DashboardRedirect = () => {
//   const { user } = useAuth();
  
//   const roleRoutes = {
//     'apprenant': '/dashboard/apprenant',
//     'chef_departement': '/dashboard/chef-departement',
//     'chef_metier': '/dashboard/chef-metier',
//     'maitre_stage': '/dashboard/maitre-stage',
//     'rh': '/dashboard/rh'
//   };
  
//   const redirectPath = roleRoutes[user?.role] || '/dashboard/apprenant';
//   return <Navigate to={redirectPath} replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <div className="App">
//         <Routes>
//           {/* Routes publiques */}
//           <Route 
//             path="/login" 
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             } 
//           />
//           <Route 
//             path="/register" 
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             } 
//           />

//           {/* Route de redirection dashboard */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <DashboardRedirect />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Routes des dashboards par rôle */}
//           <Route 
//             path="/dashboard/apprenant" 
//             element={
//               <ProtectedRoute allowedRoles={['apprenant']}>
//                 <ApprenantDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/dashboard/chef-departement" 
//             element={
//               <ProtectedRoute allowedRoles={['chef_departement']}>
//                 <ChefDepartementDashboard />
//               </ProtectedRoute>
//             } 
//           />

//             <Route path="/dashboard/chef_departement/metiers"
//              element={
//               <ProtectedRoute allowedRoles={['chef_departement']}>
//                   <MetierList />
//                 </ProtectedRoute>
//             } 
//              />

//              {/* <Route path="/dashboard/chef_departement" element={<DashboardLayout />}>
//               <Route index element={<DashboardHome />} />
//               <Route path="metiers" element={<MetierList />} />
//               <Route path="utilisateurs" element={<UserList />} />
//               <Route path="entreprises" element={<EntrepriseList />} />
//               <Route path="campagnes" element={<CampagneList />} />
//               <Route path="stages" element={<StageList />} />
//             </Route> */}

//           <Route 
//             path="/dashboard/chef-metier" 
//             element={
//               <ProtectedRoute allowedRoles={['chef_metier']}>
//                 <ChefMetierDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/dashboard/maitre-stage" 
//             element={
//               <ProtectedRoute allowedRoles={['maitre_stage']}>
//                 <MaitreStageDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/dashboard/rh" 
//             element={
//               <ProtectedRoute allowedRoles={['rh']}>
//                 <RHDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Route d'accès non autorisé */}
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Redirection par défaut */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
          
//           {/* Route 404 */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;










// // // App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Unauthorized from "./components/Unauthorized";

// // Import des dashboards
// import ApprenantDashboard from "./components/dashboards/ApprenantDashboard";
// import ChefDepartementDashboard from "./components/dashboards/ChefDepartementDashboard";
// import ChefMetierDashboard from "./components/dashboards/ChefMetierDashboard";
// import MaitreStageDashboard from "./components/dashboards/MaitreStagesDashboard";
// import RHDashboard from "./components/dashboards/RHDashboard";
// // import ChefMetierList from "./components/pages/ChefMetierList";

// // Pages spécifiques
// import MetierList from "./components/pages/MetierList";
// import ChefMetierList from "./components/pages/ChefMetierList";

// // ✅ PublicRoute = si connecté => dashboard, sinon accès
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
// };

// // ✅ Redirection automatique selon rôle
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   const roleRoutes = {
//     apprenant: "/dashboard/apprenant",
//     chef_departement: "/dashboard/chef-departement",
//     chef_metier: "/dashboard/chef-metier",
//     maitre_stage: "/dashboard/maitre-stage",
//     rh: "/dashboard/rh",
//   };

//   const redirectPath = roleRoutes[user?.role] || "/dashboard/apprenant";
//   return <Navigate to={redirectPath} replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <div className="App">
//         <Routes>
//           {/* ✅ Routes publiques */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />

//           {/* ✅ Dashboard redirection */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardRedirect />
//               </ProtectedRoute>
//             }
//           />

//           {/* ✅ Dashboards par rôle */}
//           <Route
//             path="/dashboard/apprenant"
//             element={
//               <ProtectedRoute allowedRoles={["apprenant"]}>
//                 <ApprenantDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/dashboard/chef-departement"
//             element={
//               <ProtectedRoute allowedRoles={["chef_departement"]}>
//                 <ChefDepartementDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* ✅ Exemple sous-route chef-departement */}
//           <Route
//             path="/dashboard/chef-departement/metiers"
//             element={
//               // <ProtectedRoute allowedRoles={["chef_departement"]}>
//                 <MetierList />
//               // </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/dashboard/chef-departement/chefs-metier-list"
//             element={
//               <ProtectedRoute allowedRoles={["chef_departement"]}>
//                 <ChefMetierList />
//               </ProtectedRoute>
//             }
//           />


//           <Route
//             path="/dashboard/chef-metier"
//             element={
//               <ProtectedRoute allowedRoles={["chef_metier"]}>
//                 <ChefMetierDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/dashboard/maitre-stage"
//             element={
//               <ProtectedRoute allowedRoles={["maitre_stage"]}>
//                 <MaitreStageDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/dashboard/rh"
//             element={
//               <ProtectedRoute allowedRoles={["rh"]}>
//                 <RHDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* ✅ Route accès interdit */}
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* ✅ Redirections */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;




















// // NEW App.jsx

// // App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Unauthorized from "./components/Unauthorized";

// // Dashboards
// import ApprenantDashboard from "./components/dashboards/ApprenantDashboard";
// import ChefDepartementDashboard from "./components/dashboards/ChefDepartementDashboard";
// import ChefMetierDashboard from "./components/dashboards/ChefMetierDashboard";
// import MaitreStageDashboard from "./components/dashboards/MaitreStagesDashboard";
// import RHDashboard from "./components/dashboards/RHDashboard";

// // Pages spécifiques Chef de département
// import MetierList from "./components/pages/MetierList";
// import ChefMetierList from "./components/pages/ChefMetierList";

// import DashboardHome from "./components/pages/DashboardHome";
// // import EntrepriseForm from "./components/pages/Entreprise";
// import EntrepriseList from "./components/pages/EntrepriseList";
// import RhList from "./components/pages/RhList";
// import CampagneList from "./components/pages/CampagneList";
// import ChefMetierCampagnes from "./components/pages/ChefMetierCampagnes";
// import StageList from "./components/pages/chef_de_metier/StageList";
// import MaitreStageList from "./components/pages/MaitreStageList";

// import ChefMetierDashboard from "./components/pages/chef_de_metier/ChefMetierDashboard";
// import ChefDepartementDashboard from "./components/dashboards/ChefDepartementDashboard";
// import CampagneList from "./components/pages/chef_de_metier/CampagneList";
// import EntrepriseList from "./components/pages/chef_de_metier/EntrepriseList";
// import StageList from "./components/pages/chef_de_metier/StageList";
// // import StageList from "./components/pages/chef_de_metier/StageList";
// // ✅ PublicRoute : si déjà connecté → dashboard
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
// };

// // Redirection automatique selon rôle
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   const roleRoutes = {
//     apprenant: "/dashboard/apprenant",
//     chef_departement: "/dashboard/chef-departement",
//     chef_metier: "/dashboard/chef-metier",
//     maitre_stage: "/dashboard/maitre-stage",
//     rh: "/dashboard/rh",
//   };

//   const redirectPath = roleRoutes[user?.role] || "/dashboard/apprenant";
//   return <Navigate to={redirectPath} replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <div className="App">
//         <Routes>
//           {/* Routes publiques */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />

//           {/* Dashboard redirection */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardRedirect />
//               </ProtectedRoute>
//             }
//           />

//           {/* Dashboard apprenant */}
//           <Route
//             path="/dashboard/apprenant"
//             element={
//               <ProtectedRoute allowedRoles={["apprenant"]}>
//                 <ApprenantDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Dashboard chef de département avec sous-routes */}
//           <Route
//             path="/dashboard/chef-departement"
//             element={
//               <ProtectedRoute allowedRoles={["chef_departement"]}>
//                 <ChefDepartementDashboard />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<h2>📊 Vue générale du département</h2>} />
//             <Route index element={<DashboardHome />} />
//             <Route path="metiers" element={<MetierList />} />
//             <Route path="utilisateurs" element={<ChefMetierList />} />
//             {/* <Route path="entreprises" element={<h2>🏢 Liste des entreprises</h2>} /> */}
//             {/* <Route path="entreprises" element={<h2> <EntrepriseForm /> </h2>} /> */}
//             {/* <Route path="campagnes" element={<h2>📢 Campagnes</h2>} /> */}
//             <Route
//               path="/dashboard/chef-departement/campagnes"
//               element={
//                 <ProtectedRoute allowedRoles={["chef_departement"]}>
//                   <CampagneList />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="stages" element={<h2>🎓 Stages</h2>} />
//             <Route
//               path="/dashboard/chef-departement/entreprises"
//               element={
//                 <ProtectedRoute allowedRoles={["chef_departement"]}>
//                   <EntrepriseList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard/chef-departement/rh"
//               element={
//                 <ProtectedRoute allowedRoles={["chef_departement"]}>
//                   <RhList />
//                 </ProtectedRoute>
//               }
//             />
//           </Route>

//           {/* Autres dashboards */}
//           {/* <Route
//             path="/dashboard/chef-metier"
//             element={
//               <ProtectedRoute allowedRoles={["chef_metier"]}>
//                 <ChefMetierDashboard />
//               </ProtectedRoute>
//             }
//           /> */}
//           <Route
//             path="/dashboard/maitre-stage"
//             element={
//               <ProtectedRoute allowedRoles={["maitre_stage"]}>
//                 <MaitreStageDashboard />
//               </ProtectedRoute>
//             }
//           >
//             {/* <Route index element={<h2>📊 Vue générale du métier</h2>} />
//             <Route path="campagnes" element={<h2>Liste des campagnes</h2>} />
//             <Route path="entreprises" element={<h2>Entreprises liées</h2>} />
//             <Route path="apprenants" element={<h2>Apprenants du métier</h2>} />
//             <Route path="stages" element={<h2>Stages en cours</h2>} /> */}


//         </Route>
//         {/* <Route
//             path="/dashboard/chef-metier/campagnes"
//             element={
//               <ProtectedRoute allowedRoles={["chef_metier"]}>
//                 <ChefMetierCampagnes />
//               </ProtectedRoute>
//             }
//           /> */}


//            <Routes>

//         {/* ✅ Routes du Chef de Métier */}
//         <Route path="/dashboard/chef-metier" element={<ChefMetierDashboard />}>
//           <Route path="campagnes" element={<CampagneList />} />
//           <Route path="entreprises" element={<EntrepriseList />} />
//           <Route path="stages" element={<StageList />} />
//         </Route>

//         {/* ⚙️ Plus tard : on ajoutera les autres acteurs ici */}
//         {/* <Route path="/dashboard/chef-departement" element={<ChefDepartementDashboard />} /> */}

//       </Routes>

//           <Route
//             path="/dashboard/rh"
//             element={
//               <ProtectedRoute allowedRoles={["rh"]}>
//                 <RHDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/stages"
//             element={
//               <ProtectedRoute allowedRoles={["chef_metier"]}>
//                 <StageList />
//               </ProtectedRoute>
//             }
//           />


//           <Route
//             path="/dashboard/rh/maitres"
//             element={
//               <ProtectedRoute allowedRoles={["rh"]}>
//                 <MaitreStageList />
//               </ProtectedRoute>
//             }
//           />




//           {/* ✅ Accès interdit */}
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* ✅ Redirections */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;





































// ===========================
// 🧠 Imports principaux
// ===========================
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ===========================
// 🔐 Pages d'authentification
// ===========================
import Login from "./components/Login";
import Register from "./components/Register";
import Unauthorized from "./components/Unauthorized";

// ===========================
// 🧭 Dashboards principaux
// ===========================
import ApprenantDashboard from "./components/dashboards/ApprenantDashboard";
import ChefDepartementDashboard from "./components/dashboards/ChefDepartementDashboard";
import ChefMetierDashboard from "./components/dashboards/ChefMetierDashboard";
import MaitreStageDashboard from "./components/dashboards/MaitreStagesDashboard";
import RHDashboard from "./components/dashboards/RHDashboard";

// ===========================
// 🏢 Pages Chef de Département
// ===========================
import MetierList from "./components/pages/MetierList";
import ChefMetierList from "./components/pages/ChefMetierList";
import EntrepriseList from "./components/pages/EntrepriseList";
import RhList from "./components/pages/RhList";
import CampagneList from "./components/pages/CampagneList";

// ===========================
// ⚙️ Pages Chef de Métier
// ===========================
import ChefMetierCampagneList from "./components/pages/chef_de_metier/CampagneList";
import ChefMetierEntrepriseList from "./components/pages/chef_de_metier/EntrepriseList";
import ChefMetierStageList from "./components/pages/chef_de_metier/StageList";

// ===========================
// 🎓 Pages Maître de Stage
// ===========================
import MaitreStageList from "./components/pages/MaitreStageList";
import ImportEtudiant from "./components/pages/chef_de_metier/ImportEtudiant";
import MesDemandes from "./components/pages/apprenant/MesDemande";
import MonStage from "./components/pages/apprenant/MonStage";
import ListeCampagne from "./components/pages/apprenant/ListeCampagnes";
import StageList from "./components/pages/chef_de_metier/StageList";

// ===========================
// 🧭 PublicRoute : si déjà connecté → dashboard
// ===========================
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// ===========================
// 🔁 Redirection automatique selon le rôle
// ===========================
const DashboardRedirect = () => {
  const { user } = useAuth();

  const roleRoutes = {
    apprenant: "/dashboard/apprenant",
    chef_departement: "/dashboard/chef-departement",
    chef_metier: "/dashboard/chef-metier",
    maitre_stage: "/dashboard/maitre-stage",
    rh: "/dashboard/rh",
  };

  const redirectPath = roleRoutes[user?.role] || "/dashboard/apprenant";
  return <Navigate to={redirectPath} replace />;
};

// ===========================
// 🚀 Application principale
// ===========================
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* ===========================
              ROUTES PUBLIQUES
          =========================== */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* ===========================
              REDIRECTION AUTOMATIQUE
          =========================== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* ===========================
              APPRENANT
          =========================== */}
          <Route
            path="/dashboard/apprenant"
            element={
              <ProtectedRoute allowedRoles={["apprenant"]}>
                <ApprenantDashboard />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<Campagnes />} /> */}
            <Route path="campagnes" element={<ListeCampagne />} />
            <Route path="mes-demandes" element={<MesDemandes />} />
            <Route path="mon-stage" element={<MonStage />} />
            {/* <Route path="rapport" element={<RapportStage />} /> */}
            {/* <Route path="notes" element={<Notes />} /> */}
          </Route>

          {/* ===========================
              CHEF DE DÉPARTEMENT (CORRIGÉ)
          =========================== */}
          <Route
            path="/dashboard/chef-departement"
            element={
              <ProtectedRoute allowedRoles={["chef_departement"]}>
                <ChefDepartementDashboard />
              </ProtectedRoute>
            }
          >
            {/* Route index pour le tableau de bord principal */}
            <Route index element={<div className="p-6"><h2 className="text-2xl font-bold">Tableau de bord Chef de Département</h2></div>} />
            
            {/* Routes imbriquées */}
            <Route path="metiers" element={<MetierList />} />
            <Route path="utilisateurs" element={<ChefMetierList />} />
            <Route path="entreprises" element={<EntrepriseList />} />
            <Route path="rh" element={<RhList />} />
            <Route path="campagnes" element={<CampagneList />} />
            <Route path="stages" element={<StageList />} />
          </Route>

          {/* ===========================
              CHEF DE MÉTIER
          =========================== */}
          <Route
            path="/dashboard/chef-metier"
            element={
              <ProtectedRoute allowedRoles={["chef_metier"]}>
                <ChefMetierDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="campagnes" element={<ChefMetierCampagneList />} />
            <Route path="entreprises" element={<ChefMetierEntrepriseList />} />
            <Route path="stages" element={<ChefMetierStageList />} />
            <Route path="apprenants" element={<ImportEtudiant />} />
          </Route>

          {/* ===========================
              MAÎTRE DE STAGE
          =========================== */}
          <Route
            path="/dashboard/maitre-stage"
            element={
              <ProtectedRoute allowedRoles={["maitre_stage"]}>
                <MaitreStageDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/rh/maitres"
            element={<MaitreStageList />}
          />

          {/* ===========================
              RESSOURCES HUMAINES (RH)
          =========================== */}
          <Route
            path="/dashboard/rh"
            element={
              <ProtectedRoute allowedRoles={["rh"]}>
                <RHDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="maitresrh" element={<MaitreStageList />} />
            
          </Route>

          {/* ===========================
              AUTRES ROUTES
          =========================== */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;





















// import DashboardLayout from "./components/dashboards/ChefDepartementDashboard";
// import MetierList from "./components/pages/MetierList";

// <Route
//   path="/dashboard/chef-departement"
//   element={
//     <ProtectedRoute allowedRoles={['chef_departement']}>
//       <DashboardLayout />
//     </ProtectedRoute>
//   }
// >
//   <Route index element={<h2>Vue générale du département 📊</h2>} />
//   <Route path="metiers" element={<MetierList />} />
//   <Route path="utilisateurs" element={<h2>Liste des utilisateurs à gérer</h2>} />
//   <Route path="entreprises" element={<h2>Liste des entreprises</h2>} />
//   <Route path="campagnes" element={<h2>Campagnes de stage</h2>} />
//   <Route path="stages" element={<h2>Stages</h2>} />
// </Route>

















































































































// // App.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from './components/Login';
// import Register from './components/Register';
// import Unauthorized from './components/Unauthorized';

// // Import des dashboards
// import ApprenantDashboard from './components/dashboards/ApprenantDashboard';
// import ChefDepartementDashboard from './components/dashboards/ChefDepartementDashboard';
// import ChefMetierDashboard from './components/dashboards/ChefMetierDashboard';
// import MaitreStageDashboard from './components/dashboards/MaitreStagesDashboard';
// import RHDashboard from './components/dashboards/RHDashboard';

// // Import des nouveaux composants pour les routes imbriquées
// import DashboardLayout from './components/layout/DashboardLayout';
// import DashboardHome from './components/dashboard/DashboardHome';
// import MetierList from './components/metiers/MetierList';
// import UserList from './components/users/UserList';
// import EntrepriseList from './components/entreprises/EntrepriseList';
// import CampagneList from './components/campagnes/CampagneList';
// import StageList from './components/stages/StageList';

// // Composant pour rediriger vers le login si non connecté
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
// };

// // Composant pour rediriger vers le bon dashboard
// const DashboardRedirect = () => {
//   const { user } = useAuth();
  
//   const roleRoutes = {
//     'apprenant': '/dashboard/apprenant',
//     'chef_departement': '/dashboard/chef-departement',
//     'chef_metier': '/dashboard/chef-metier',
//     'maitre_stage': '/dashboard/maitre-stage',
//     'rh': '/dashboard/rh'
//   };
  
//   const redirectPath = roleRoutes[user?.role] || '/dashboard/apprenant';
//   return <Navigate to={redirectPath} replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <div className="App">
//         <Routes>
//           {/* Routes publiques */}
//           <Route 
//             path="/login" 
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             } 
//           />
//           <Route 
//             path="/register" 
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             } 
//           />

//           {/* Route de redirection dashboard */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <DashboardRedirect />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Routes des dashboards par rôle */}
//           <Route 
//             path="/dashboard/apprenant" 
//             element={
//               <ProtectedRoute allowedRoles={['apprenant']}>
//                 <ApprenantDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Route principale chef département avec routes imbriquées */}
//           <Route 
//             path="/dashboard/chef-departement" 
//             element={
//               <ProtectedRoute allowedRoles={['chef_departement']}>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* Routes imbriquées pour le chef de département */}
//             <Route index element={<DashboardHome />} />
//             <Route path="metiers" element={<MetierList />} />
//             <Route path="utilisateurs" element={<UserList />} />
//             <Route path="entreprises" element={<EntrepriseList />} />
//             <Route path="campagnes" element={<CampagneList />} />
//             <Route path="stages" element={<StageList />} />
//           </Route>

//           {/* Autres routes des dashboards */}
//           <Route 
//             path="/dashboard/chef-metier" 
//             element={
//               <ProtectedRoute allowedRoles={['chef_metier']}>
//                 <ChefMetierDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/dashboard/maitre-stage" 
//             element={
//               <ProtectedRoute allowedRoles={['maitre_stage']}>
//                 <MaitreStageDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/dashboard/rh" 
//             element={
//               <ProtectedRoute allowedRoles={['rh']}>
//                 <RHDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Route d'accès non autorisé */}
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Redirection par défaut */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
          
//           {/* Route 404 */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;