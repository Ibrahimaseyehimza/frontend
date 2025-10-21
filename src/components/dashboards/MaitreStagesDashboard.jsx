import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import api from "../../api/axios";
import { IoHomeOutline, IoClose } from "react-icons/io5";
import { FaRegUser, FaDownload } from "react-icons/fa6";
import { BsFileEarmarkText, BsPerson, BsCalendar3, BsBuilding } from "react-icons/bs";
import { MdOutlineWorkOutline, MdAssignmentTurnedIn } from "react-icons/md";
import { FiLogOut, FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { GiVendingMachine } from "react-icons/gi";
import NotificationBell from "../pages/NotificationBell";

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
    totalStages: 0,
    stagesActifs: 0,
    stagiairesSupervises: 0,
    rapportsEnAttente: 0,
    moyenneNotes: 0,
    evaluationsCompletees: 0,
  });
  
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Chargement des données du maître de stage...");
      
      const res = await api.get("/maitre-stage/stages");
      const stagesData = res.data.data || res.data || [];
      
      setStages(stagesData);
      
      // Calculer les statistiques
      const stagesActifs = stagesData.filter(s => {
        if (s.date_fin) {
          return new Date(s.date_fin) > new Date();
        }
        return true;
      }).length;
      
      const rapportsEnAttente = stagesData.filter(s => s.rapport_soumis && !s.note).length;
      
      const notesValides = stagesData.filter(s => s.note && s.note > 0);
      const moyenneNotes = notesValides.length > 0
        ? (notesValides.reduce((sum, s) => sum + parseFloat(s.note), 0) / notesValides.length).toFixed(1)
        : 0;
      
      const evaluationsCompletees = stagesData.filter(s => s.note).length;
      
      setStats({
        totalStages: stagesData.length,
        stagesActifs: stagesActifs,
        stagiairesSupervises: stagesData.length,
        rapportsEnAttente: rapportsEnAttente,
        moyenneNotes: moyenneNotes,
        evaluationsCompletees: evaluationsCompletees,
      });
      
      console.log("✅ Données chargées:", {
        stages: stagesData.length,
        actifs: stagesActifs,
        moyenneNotes: moyenneNotes,
      });
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
      setError("Impossible de charger les données");
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (stageId) => {
    try {
      const res = await api.get(`/maitre-stage/stages/${stageId}/rapport`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rapport_stage_${stageId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("✅ Rapport téléchargé avec succès");
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert("❌ Aucun rapport trouvé pour ce stage");
    }
  };

  const handleNoteChange = async (stageId, note) => {
    if (!note || note < 0 || note > 20) {
      alert("⚠️ La note doit être entre 0 et 20");
      return;
    }

    try {
      await api.put(`/maitre-stage/stages/${stageId}/note`, { note: parseFloat(note) });
      alert("✅ Note enregistrée avec succès !");
      
      setStages((prev) =>
        prev.map((s) => (s.id === stageId ? { ...s, note: parseFloat(note) } : s))
      );
      
      // Recalculer les stats
      fetchDashboardData();
    } catch (err) {
      console.error("Erreur enregistrement note:", err);
      alert("❌ Erreur lors de l'enregistrement de la note");
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
          <p className="text-blue-100 text-sm">Tableau de bord - Maître de Stage</p>
          <p className="text-xs text-blue-200 mt-1">Gérez et supervisez vos stagiaires</p>
        </div>
        <div className="hidden md:block">
          <img src="/LOGO EIT.png" alt="" className="h-20" />
        </div>
      </div>

      {/* Statistiques en cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stages"
          value={stats.totalStages}
          subtitle="Stages supervisés"
          icon={MdOutlineWorkOutline}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Stages Actifs"
          value={stats.stagesActifs}
          subtitle="En cours actuellement"
          icon={MdAssignmentTurnedIn}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Moyenne Notes"
          value={stats.moyenneNotes}
          subtitle="Note moyenne attribuée"
          icon={BsFileEarmarkText}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Rapports en attente"
          value={stats.rapportsEnAttente}
          subtitle="À évaluer"
          icon={FaRegUser}
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Liste des stagiaires */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-b-4 border-blue-600 pb-2 inline-block">
            Mes Stagiaires
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

        {stages.length > 0 ? (
          <div className="space-y-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                {/* En-tête */}
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {stage.etudiant?.prenom?.charAt(0) || 'E'}
                      {stage.etudiant?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {stage.etudiant?.prenom} {stage.etudiant?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stage.etudiant?.email || 'etudiant@isep-thies.edu.sn'}
                      </p>
                    </div>
                  </div>

                  {stage.note ? (
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                      <span className="text-green-700 font-bold text-lg">{stage.note}/20</span>
                      <span className="text-green-600 text-xs">✓ Évalué</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                      <span className="text-yellow-700 text-sm font-semibold">En attente</span>
                    </div>
                  )}
                </div>

                {/* Informations du stage */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-2">
                    <BsBuilding className="text-blue-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Entreprise</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {stage.entreprise?.nom || 'Non spécifiée'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsCalendar3 className="text-green-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Dates</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {stage.date_debut && stage.date_fin
                          ? `${new Date(stage.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} → ${new Date(stage.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`
                          : 'Non définies'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsFileEarmarkText className="text-purple-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Rapport</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {stage.rapport_soumis ? (
                          <span className="text-green-600">✓ Soumis</span>
                        ) : (
                          <span className="text-gray-400">En attente</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsPerson className="text-orange-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Poste</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {stage.poste || 'Stagiaire'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDownload(stage.id)}
                    className="flex-1 min-w-[150px] bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    disabled={!stage.rapport_soumis}
                  >
                    <FaDownload size={16} />
                    <span>Télécharger rapport</span>
                  </button>

                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Note :
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={stage.note || ""}
                      placeholder="0-20"
                      onBlur={(e) => {
                        if (e.target.value) {
                          handleNoteChange(stage.id, e.target.value);
                        }
                      }}
                    />
                    <span className="text-gray-500 text-sm">/20</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
              <BsPerson size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Aucun stagiaire assigné</p>
            <p className="text-gray-400 text-sm mt-2">
              Les stagiaires apparaîtront ici une fois assignés
            </p>
          </div>
        )}
      </div>

      {/* Statistiques d'évaluation */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">📊</span>
          Statistiques d'évaluation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalStages}
            </p>
            <p className="text-sm text-gray-600">Total stagiaires supervisés</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl">
            <p className="text-3xl font-bold text-green-600 mb-1">
              {stats.evaluationsCompletees}
            </p>
            <p className="text-sm text-gray-600">Évaluations complétées</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl">
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {stats.moyenneNotes} ★
            </p>
            <p className="text-sm text-gray-600">Note moyenne attribuée</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal du dashboard
const MaitreStagesDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name) => {
    if (!name) return "MS";
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

  const isHomePage = location.pathname === "/dashboard/maitre-stage" || location.pathname === "/dashboard/maitre-stage/";

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
        <div className="relative p-6 text-2xl bg-dégradé font-bold shadow border-b border-blue-500 h-16 flex items-center justify-center ">
          <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="h-16 sm:h-28" />
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <NavLink to="." end className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink to="mes_stagiaires" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Mes Stagiaires</span>
            </div>
          </NavLink>

          <NavLink to="etudiants_affectes" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Etudiant Affecter</span>
            </div>
          </NavLink>

          <NavLink to="evaluations" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <BsFileEarmarkText className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Évaluations</span>
            </div>
          </NavLink>

          <NavLink to="rapports" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <MdAssignmentTurnedIn className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Rapports</span>
            </div>
          </NavLink>

          <NavLink to="livrables" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <GiVendingMachine className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Livrables</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        {/* Header */}
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
                className="w-50 pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <p className="text-xs text-gray-500">Maître de Stage</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'maitre@entreprise.com'}</p>
                </div>
                
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FiUser size={18} />
                  <span>Mon Profil</span>
                </button>
                
                <button
                  onClick={() => setShowProfileMenu(false)}
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

export default MaitreStagesDashboard;