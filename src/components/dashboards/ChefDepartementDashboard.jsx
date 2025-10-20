// src/components/dashboards/ChefDepartementDashboard.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import api from "../../api/axios";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { RiSchoolLine } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import { FiLogOut, FiSearch, FiBell, FiSettings, FiUser } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import NotificationBell from '../pages/NotificationBell';

// Composant pour afficher les statistiques
const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, trend }) => (
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
    {trend && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-green-600 font-medium">↗ {trend}</span>
      </div>
    )}
  </div>
);

// Composant pour les métiers
const MetierCard = ({ metier }) => {
  const metierImages = {
    "SRI": "/ASRI BLEU.png",
    "ASRI": "/ASRI BLEU.png",
    "Systèmes & Réseaux Informatiques": "/ASRI BLEU.png",
    "Systèmes et Réseaux Informatiques": "/ASRI BLEU.png",
    "DWM": "/DWM BLEU.png",
    "Développement Web et Mobile": "/DWM BLEU.png",
    "Developpement Web & Mobile": "/DWM BLEU.png",
    "RT": "/RT BLEU.png",
    "Réseau & Télécom": "/RT BLEU.png",
    "Réseau et Télécom": "/RT BLEU.png",
    "Réseaux & Télécommunications": "/RT BLEU.png",
  };

  const imageUrl = metier.logo || metierImages[metier.nom];
  
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
  ];
  
  const randomColor = colors[metier.id % colors.length];

  return (
    <div className="bg-dégradé rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
      <div className={`${!imageUrl ? randomColor : 'bg-gradient-to-br from-dégradé to-white '} h-42 flex items-center justify-center p-6 relative`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={metier.nom} 
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              console.log(`Image non trouvée pour ${metier.nom}: ${imageUrl}`);
              e.target.parentElement.className = `${randomColor} h-32 flex items-center justify-center p-6 relative`;
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.fallback-text');
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        <span 
          className="fallback-text text-white text-4xl font-bold" 
          style={{ display: imageUrl ? 'none' : 'block' }}
        >
          {metier.nom.substring(0, 3).toUpperCase()}
        </span>
      </div>
      <div className="p-4">
        <h4 className="text-center font-semibold text-white text-sm mb-2">{metier.nom}</h4>
        {metier.description && (
          <p className="text-center text-xs text-gray-300 truncate">{metier.description}</p>
        )}
      </div>
    </div>
  );
};

// Composant tableau de bord principal
const TableauDeBordHome = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalStages: 0,
    stagesActifs: 0,
    entreprises: 0,
    etudiants: 0,
    dureeMoyenneStages: 0,
    entreprisesActives: 0
  });
  
  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Début du chargement des données du dashboard...");
      
      // Essayer différents endpoints pour les étudiants
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
      
      // Récupération parallèle des données
      const responses = await Promise.allSettled([
        api.get("/campagnes_global"),
        api.get("/entreprises"),
        api.get("/metiers"),
        etudiantsPromise
      ]);



      
      
      // ========== EXTRACTION DES CAMPAGNES ==========
      let campagnes = [];
      if (responses[0].status === 'fulfilled') {
        const campagnesResponse = responses[0].value?.data;
        
        if (Array.isArray(campagnesResponse)) {
          campagnes = campagnesResponse;
        } else if (campagnesResponse?.data && Array.isArray(campagnesResponse.data)) {
          campagnes = campagnesResponse.data;
        } else if (campagnesResponse?.campagnes && Array.isArray(campagnesResponse.campagnes)) {
          campagnes = campagnesResponse.campagnes;
        }
        
        console.log("✅ Campagnes récupérées:", campagnes.length, campagnes);
      } else {
        console.error("❌ Erreur lors de la récupération des campagnes:", responses[0].reason);
        console.log("Tentative de récupération avec l'autre endpoint...");
        
        try {
          const fallbackResponse = await api.get("/campagnes_global");
          const fallbackData = fallbackResponse.data;
          
          if (Array.isArray(fallbackData)) {
            campagnes = fallbackData;
          } else if (fallbackData?.data && Array.isArray(fallbackData.data)) {
            campagnes = fallbackData.data;
          }
          
          console.log("✅ Campagnes récupérées via fallback:", campagnes.length);
        } catch (fallbackErr) {
          console.error("❌ Échec du fallback:", fallbackErr);
        }
      }
      
      // ========== EXTRACTION DES ENTREPRISES ==========
      const entreprises = responses[1].status === 'fulfilled' 
        ? (responses[1].value?.data?.data || []) 
        : [];
      console.log("✅ Entreprises récupérées:", entreprises.length);
      
      // ========== EXTRACTION DES MÉTIERS ==========
      const metiersData = responses[2].status === 'fulfilled' 
        ? (responses[2].value?.data?.data || []) 
        : [];
      console.log("✅ Métiers récupérés:", metiersData.length);

      // ========== EXTRACTION DES ÉTUDIANTS ==========
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
      
      // ========== CALCUL DES STATISTIQUES ==========
      const totalStages = campagnes.length;
      
      const stagesActifs = campagnes.filter(c => {
        return c.date_fin && new Date(c.date_fin) > new Date();
      }).length;
      
      const entreprisesUniques = new Set();
      campagnes.forEach(campagne => {
        if (campagne.entreprises && Array.isArray(campagne.entreprises)) {
          campagne.entreprises.forEach(ent => {
            if (ent.id) entreprisesUniques.add(ent.id);
          });
        }
      });
      const entreprisesPartenaires = entreprisesUniques.size;
      
      const entreprisesActivesSet = new Set();
      campagnes.filter(c => c.date_fin && new Date(c.date_fin) > new Date()).forEach(campagne => {
        if (campagne.entreprises && Array.isArray(campagne.entreprises)) {
          campagne.entreprises.forEach(ent => {
            if (ent.id) entreprisesActivesSet.add(ent.id);
          });
        }
      });
      
      const nombreEtudiants = etudiantsData.length;
      
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
        totalStages: totalStages,
        stagesActifs: stagesActifs,
        entreprises: entreprisesPartenaires,
        etudiants: nombreEtudiants,
        dureeMoyenneStages: dureeMoyenne.toFixed(1),
        entreprisesActives: entreprisesActivesSet.size
      });
      
      setMetiers(metiersData);
      
      console.log("📊 Statistiques finales:", {
        totalStages,
        stagesActifs,
        entreprisesPartenaires,
        nombreEtudiants,
        entreprisesActives: entreprisesActivesSet.size,
        dureeMoyenne: dureeMoyenne.toFixed(1)
      });
      
    } catch (err) {
      console.error("❌ Erreur critique:", err);
      setError("Impossible de charger les données du tableau de bord");
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
            onClick={fetchDashboardData}
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
          <p className="text-blue-100 text-sm">Tableau de bord - Chef de Département EIT</p>
          <p className="text-xs text-blue-200 mt-1">Gérez et supervisez l'ensemble des activités de stage</p>
        </div>
        <div className="hidden md:block">
          <img src="/LOGO EIT.png" alt="" className="h-20 "/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total des Stages"
          value={stats.totalStages}
          subtitle="Campagnes créées"
          icon={SlPeople}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Stages Actifs"
          value={stats.stagesActifs}
          subtitle="Campagnes en cours"
          icon={TbBrandCampaignmonitor}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Entreprises Partenaires"
          value={stats.entreprises}
          subtitle="Partenaires uniques"
          icon={RiSchoolLine}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Étudiants"
          value={stats.etudiants}
          subtitle="Étudiants actifs"
          icon={FaRegUser}
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-b-4 border-blue-600 pb-2 inline-block">
            Répartition des stages par métier
          </h2>
          <button
            onClick={fetchDashboardData}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
       
        {metiers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {metiers.map((metier) => (
              <MetierCard key={metier.id} metier={metier} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
              <MdOutlineWorkOutline size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Aucun métier disponible</p>
            <p className="text-gray-400 text-sm mt-2">
              Ajoutez des métiers depuis la section "Métiers"
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
          <span>Actions Stratégiques</span>
          <span className="text-yellow-500">⚡</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavLink 
            to="campagnes"
            className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-blue-600 mb-3">
              <TbBrandCampaignmonitor size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Nouvelle Campagne</h4>
            <p className="text-xs text-gray-600">Lancer une campagne de stage</p>
          </NavLink>
          
          <NavLink 
            to="utilisateurs"
            className="block p-6 bg-green-50 hover:bg-green-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-green-600 mb-3">
              <FaRegUser size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Gérer Étudiants</h4>
            <p className="text-xs text-gray-600">Suivi et affectations</p>
          </NavLink>
          
          <NavLink 
            to="entreprises"
            className="block p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-purple-600 mb-3">
              <RiSchoolLine size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Nouveau Partenaire</h4>
            <p className="text-xs text-gray-600">Ajouter une entreprise</p>
          </NavLink>
          
          <NavLink 
            to="stages"
            className="block p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-orange-600 mb-3">
              <SlPeople size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Analytics Avancés</h4>
            <p className="text-xs text-gray-600">Rapports détaillés</p>
          </NavLink>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Aperçu des Performances
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-green-600 mb-1">87%</p>
            <p className="text-sm text-gray-600">Taux de placement</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.entreprisesActives}</p>
            <p className="text-sm text-gray-600">Entreprises actives</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <p className="text-3xl font-bold text-purple-600 mb-1">{stats.dureeMoyenneStages} mois</p>
            <p className="text-sm text-gray-600">Durée moyenne des stages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChefDepartementDashboard = () => {
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

  const isHomePage = location.pathname === "/dashboard/chef-departement" || location.pathname === "/dashboard/chef-departement/";



  
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
          <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="h-16 sm:h-28" />
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <NavLink to="." end className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink to="metiers" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <MdOutlineWorkOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Métiers</span>
            </div>
          </NavLink>

          <NavLink to="utilisateurs" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Chef De Métier</span>
            </div>
          </NavLink>

          <NavLink to="entreprises" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <RiSchoolLine className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Entreprises</span>
            </div>
          </NavLink>

          <NavLink to="rh" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <BsPersonWorkspace className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2 whitespace-nowrap">Ressources Humaines</span>
            </div>
          </NavLink>

          <NavLink to="campagnes" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink to="stages" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100  text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Stages</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        <header className="bg-white shadow-lg p-3 sm:p-4 flex items-center gap-4 sticky top-0 z-10 h-16">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 hover:text-gray-900 flex-shrink-0"
          >
            <HiMenuAlt3 size={28} />
          </button>

          <div className="flex-1 max-w-2xl justify-end hidden sm:flex mx-auto mr-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-50  pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 🔔 Notifications */}
                        <div className="flex-shrink-0 h-10 ml-4">
                          <NotificationBell />
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
                <p className="text-xs text-gray-500">Chef de Département</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'serigne.seye23@isep-thies.edu.sn'}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FiUser size={18} />
                  <span>Mon Profil</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FiSettings size={18} />
                  <span>Paramètres</span>
                </button>
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <FiLogOut size={18} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {isHomePage ? <TableauDeBordHome /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default ChefDepartementDashboard;