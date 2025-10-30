// ===========================
// 🧠 Imports principaux
// ===========================
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import DemandeList from "./components/pages/chef_de_metier/DemandeList";

// ===========================
// 🎓 Pages Maître de Stage & Apprenant
// ===========================
import MaitreStageList from "./components/pages/rh/MaitreStageList";
import ImportEtudiant from "./components/pages/chef_de_metier/ImportEtudiant";
import MesDemandes from "./components/pages/apprenant/MesDemande";
import MonStage from "./components/pages/apprenant/MonStage";
import ListeCampagne from "./components/pages/apprenant/ListeCampagnes";

// ===========================
// 📋 Pages RH
// ===========================
import CampagneRH from "./components/pages/rh/CampagneRH";
import StageList from "./components/pages/chef_de_metier/StageList";
import Affectations from "./components/pages/chef_de_metier/Affectations";
import RhNotifications from "./components/pages/rh/RhNotifications";
import EtudiantsAffectes from "./components/pages/rh/EtudiantsAffectes";
import EtudiantsAfectesAuStage from "./components/pages/maitre_de_stage/EtudiantsAffectesAuStage";
import MesStagiaire from "./components/pages/maitre_de_stage/MesStagiaire";

// ===========================
// 📋 Pages Maitre_de_stage
// ===========================
import MaitreStageEvaluationsList from "./components/pages/maitre_de_stage/EvaluationsList";
import MaitreStageMesStagiaire from "./components/pages/maitre_de_stage/MesStagiaire";
import MaitreStageLivablesList from "./components/pages/maitre_de_stage/LivrablesList";
import MaitreStageRapportsList from "./components/pages/maitre_de_stage/RapportsList";
import MaitreStageTachesMaitre from "./components/pages/maitre_de_stage/TachesMaitre";
import MesLivrables from "./components/pages/apprenant/MesLivrables";
import MesLivrablesApprenant from "./components/pages/apprenant/MesLivrablesApprenant";
import LivrablesMaitre from "./components/pages/apprenant/LivrablesMaitre";
import StageListChefDepartement from "./components/pages/StageListChefDepartement";


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
            <Route path="campagnes" element={<ListeCampagne />} />
            <Route path="mes-demandes" element={<MesDemandes />} />
            <Route path="mon-stage" element={<MonStage />} />
            {/* <Route path="mes-livrables" element={<MesLivrables />} /> */}
            <Route path="mes-livrables" element={<MesLivrablesApprenant />} />
          </Route>

          {/* ===========================
              CHEF DE DÉPARTEMENT
          =========================== */}
          <Route
            path="/dashboard/chef-departement"
            element={
              <ProtectedRoute allowedRoles={["chef_departement"]}>
                <ChefDepartementDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<div className="p-6"><h2 className="text-2xl font-bold">Tableau de bord Chef de Département</h2></div>} />
            <Route path="metiers" element={<MetierList />} />
            <Route path="utilisateurs" element={<ChefMetierList />} />
            <Route path="entreprises" element={<EntrepriseList />} />
            <Route path="rh" element={<RhList />} />
            <Route path="campagnes-chefDepartement" element={<CampagneList />} />
            <Route path="StageListChefDepartement" element={<StageListChefDepartement />} />
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
            <Route path="demandes" element={<DemandeList />} />
            <Route path="affectations" element={<Affectations />} />
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
           >
            {/* <Route path="evaluations" element={<MaitreStageEvaluationsList />} /> */}
            <Route path="mes_stagiaires" element={<MaitreStageMesStagiaire />} />
            {/* <Route path="livrables" element={<MaitreStageLivablesList />} /> */}
            <Route path="livrables" element={<LivrablesMaitre />} />
            <Route path="rapports" element={<MaitreStageRapportsList />} />
            {/* <Route path="notifications" element={<MaitreNotifications />} /> */}
            <Route path="etudiants_affectes" element={<EtudiantsAfectesAuStage />} />
            <Route path="taches_maitre" element={<MaitreStageTachesMaitre />} />
          </Route>

          {/* ===========================
              RESSOURCES HUMAINES (RH) - ✅ CORRIGÉ
          =========================== */}
          <Route 
            path="/dashboard/rh" 
            element={
              <ProtectedRoute allowedRoles={["rh"]}>
                <RHDashboard />
              </ProtectedRoute>
            }
          >
            {/* ✅ Route pour les maîtres de stage */}
            <Route path="maitres" element={<MaitreStageList />} />
            
            {/* ✅ Route pour les campagnes RH */}
            <Route path="campagnes" element={<CampagneRH />} />
            
            {/* ✅ Route pour les stages (si nécessaire) */}
            <Route path="stages" element={<StageList />} />
            <Route path="notifications" element={<RhNotifications />} />
            <Route path="affectations_rh" element={<EtudiantsAffectes />} />
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