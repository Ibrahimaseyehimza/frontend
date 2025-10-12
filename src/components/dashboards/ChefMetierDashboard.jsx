// src/components/dashboards/ChefMetierDashboard.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import api from "../../api/axios";
import { IoHomeOutline, IoClose } from "react-icons/io5";
import { RiSchoolLine } from "react-icons/ri";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import { FiLogOut, FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { BsBuilding, BsBriefcase } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";

// Composant pour afficher les statistiques
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

// Composant tableau de bord principal
const TableauDeBordHome = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalCampagnes: 0,
    campagnesActives: 0,
    entreprisesPartenaires: 0,
    stagesConfirmes: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Récupérer le metier_id du chef connecté
      const metierId = user?.metier_id;
      
      if (!metierId) {
        // Données par défaut si pas de métier
        setStats({
          totalCampagnes: 0,
          campagnesActives: 0,
          entreprisesPartenaires: 0,
          stagesConfirmes: 0,
        });
        setLoading(false);
        return;
      }

      // TODO: Adapter ces appels selon votre backend
      // Exemple d'appels API à implémenter :
      // const campagnesResponse = await api.get(`/metiers/${metierId}/campagnes`);
      // const entreprisesResponse = await api.get(`/metiers/${metierId}/entreprises`);
      
      // Pour l'instant, données statiques pour le design
      setStats({
        totalCampagnes: 8,
        campagnesActives: 3,
        entreprisesPartenaires: 15,
        stagesConfirmes: 45,
      });
      
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
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
      {/* Bannière de bienvenue */}
      <div className="bg-dégradé rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Bienvenue, {user?.name}</h1>
          <p className="text-blue-100 text-sm">Tableau de bord - Chef de Métier</p>
          <p className="text-xs text-blue-200 mt-1">
            Gérez et supervisez les activités de votre métier
          </p>
        </div>
        <div className="hidden md:block">
          <img src="/LOGO EIT.png" alt="" className="h-20" />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campagnes"
          value={stats.totalCampagnes}
          subtitle="Toutes les campagnes"
          icon={TbBrandCampaignmonitor}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Campagnes Actives"
          value={stats.campagnesActives}
          subtitle="En cours"
          icon={BsBriefcase}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Entreprises"
          value={stats.entreprisesPartenaires}
          subtitle="Partenaires"
          icon={RiSchoolLine}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Stages Confirmés"
          value={stats.stagesConfirmes}
          subtitle="Placements validés"
          icon={SlPeople}
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Actions Stratégiques */}
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
            <h4 className="font-semibold text-gray-900 mb-1">Gérer Campagnes</h4>
            <p className="text-xs text-gray-600">Voir les campagnes de stage</p>
          </NavLink>
          
          <NavLink 
            to="entreprises"
            className="block p-6 bg-green-50 hover:bg-green-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-green-600 mb-3">
              <BsBuilding size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Entreprises</h4>
            <p className="text-xs text-gray-600">Voir les partenaires</p>
          </NavLink>
          
          <NavLink 
            to="apprenants"
            className="block p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-purple-600 mb-3">
              <FaRegUser size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Apprenants</h4>
            <p className="text-xs text-gray-600">Gérer les étudiants</p>
          </NavLink>
          
          <NavLink 
            to="stages"
            className="block p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl text-left transition-all hover:shadow-md group"
          >
            <div className="text-orange-600 mb-3">
              <SlPeople size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Stages</h4>
            <p className="text-xs text-gray-600">Suivre les stages</p>
          </NavLink>
        </div>
      </div>

      {/* Aperçu des activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Activités Récentes
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">Nouvelle campagne créée</p>
              <p className="text-xs text-gray-500 mt-1">Il y a 2 jours</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">5 étudiants placés</p>
              <p className="text-xs text-gray-500 mt-1">Il y a 3 jours</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">Nouvelle entreprise partenaire</p>
              <p className="text-xs text-gray-500 mt-1">Il y a 5 jours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Aperçu des Performances
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-3xl font-bold text-green-600 mb-1">92%</p>
              <p className="text-sm text-gray-600">Taux de placement</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-3xl font-bold text-blue-600 mb-1">{stats.entreprisesPartenaires}</p>
              <p className="text-sm text-gray-600">Entreprises actives</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-3xl font-bold text-purple-600 mb-1">4.5 mois</p>
              <p className="text-sm text-gray-600">Durée moyenne des stages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChefMetierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name) => {
    if (!name) return "CM";
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

  const isHomePage = location.pathname === "/dashboard/chef-metier" || location.pathname === "/dashboard/chef-metier/";

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
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
            className={({ isActive }) => 
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
                isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"
              }`
            }
          >
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink 
            to="campagnes" 
            className={({ isActive }) => 
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
                isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"
              }`
            }
          >
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink 
            to="entreprises" 
            className={({ isActive }) => 
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
                isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"
              }`
            }
          >
            <div className="flex items-center">
              <RiSchoolLine className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Entreprises</span>
            </div>
          </NavLink>

          <NavLink 
            to="apprenants" 
            className={({ isActive }) => 
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
                isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"
              }`
            }
          >
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Apprenants</span>
            </div>
          </NavLink>

          <NavLink 
            to="stages" 
            className={({ isActive }) => 
              `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${
                isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"
              }`
            }
          >
            <div className="flex items-center">
              <SlPeople className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Stages</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-3 sm:p-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 hover:text-gray-900 flex-shrink-0"
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
                <p className="text-xs text-gray-500">Chef de Métier</p>
              </div>
            </button>

            {/* Menu déroulant */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'chef.metier@isep-thies.edu.sn'}</p>
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

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {isHomePage ? <TableauDeBordHome /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default ChefMetierDashboard;