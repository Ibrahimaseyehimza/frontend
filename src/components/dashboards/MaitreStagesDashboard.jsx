import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { IoHomeOutline, IoClose } from "react-icons/io5";
import { FaRegUser, FaDownload } from "react-icons/fa6";
import { BsFileEarmarkText, BsPerson, BsCalendar3, BsBuilding } from "react-icons/bs";
import { MdOutlineWorkOutline, MdAssignmentTurnedIn } from "react-icons/md";
import { FiLogOut, FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { GiVendingMachine } from "react-icons/gi";
import NotificationBell from "../pages/NotificationBell";
import { IoDocumentAttachOutline } from "react-icons/io5";

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
    tachesAssignees: 0,
    tachesTerminees: 0,
    enAttente: 0,
  });
  
  const [stages, setStages] = useState([]);
  const [livrables, setLivrables] = useState([]);
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
      
      // Charger les stages
      const resStages = await api.get("/maitre-stage/stages");
      const stagesData = resStages.data.data || resStages.data || [];
      
      // Charger les livrables
      let livrablesData = [];
      try {
        // const resLivrables = await api.get("/maitre-stage/livrables");
        // const resLivrables = await api.get("/maitre-stage/livrables");
        livrablesData = resLivrables.data.data || resLivrables.data || [];
      } catch (err) {
        console.warn("⚠️ Impossible de charger les livrables:", err);
        livrablesData = [];
      }
      
      setStages(stagesData);
      setLivrables(livrablesData);
      
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
      
      // Stats livrables
      const livrablesEnAttente = livrablesData.filter(l => l.statut === 'À réviser').length;
      const tachesTerminees = livrablesData.filter(l => l.statut === 'Approuvé' || l.statut === 'Révisé').length;
      
      setStats({
        totalStages: stagesData.length,
        stagesActifs: stagesActifs,
        stagiairesSupervises: stagesData.length,
        rapportsEnAttente: rapportsEnAttente,
        moyenneNotes: moyenneNotes,
        evaluationsCompletees: evaluationsCompletees,
        tachesAssignees: livrablesData.length,
        tachesTerminees: tachesTerminees,
        enAttente: livrablesEnAttente,
      });
      
      console.log("✅ Données chargées:", {
        stages: stagesData.length,
        livrables: livrablesData.length,
        actifs: stagesActifs,
        moyenneNotes: moyenneNotes,
      });
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
      setError("Impossible de charger les données");
      setStages([]);
      setLivrables([]);
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

  const handleLivrableAction = async (livrableId, action) => {
    try {
      await api.put(`/maitre-stage/livrables/${livrableId}/statut`, { statut: action });
      alert(`✅ Livrable ${action === 'Approuvé' ? 'approuvé' : 'révisé'} avec succès !`);
      fetchDashboardData();
    } catch (err) {
      console.error("Erreur action livrable:", err);
      alert("❌ Erreur lors de l'action sur le livrable");
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
          <h1 className="text-2xl font-bold mb-1">Bienvenue, {user?.prenom} {user?.name}</h1>
          <p className="text-blue-100 text-sm">Tableau de bord - Maitre de Stage</p>
          <p className="text-xs text-blue-200 mt-1">Encadrez et évaluez vos stagiaires</p>
        </div>
        <div className="hidden md:block">
          <img src="/LOGO EIT.png" alt="Logo" className="h-20" />
        </div>
      </div>

      {/* Statistiques en cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Stagiaires actifs"
          value={stats.stagesActifs}
          subtitle={`${stats.stagesActifs} actifs`}
          icon={BsPerson}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Tâches Assignées"
          value={stats.tachesAssignees}
          subtitle={`${stats.tachesTerminees} terminées`}
          icon={MdAssignmentTurnedIn}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="En Attente"
          value={stats.enAttente}
          subtitle="À superviser"
          icon={BsCalendar3}
          iconBg="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Performance"
          value={stats.moyenneNotes}
          subtitle="Note moyenne"
          icon={FaRegUser}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Grille à 2 colonnes: Stagiaires + Actions/Livrables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne Gauche: Mes Stagiaires */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Mes Stagiaires</h2>
            <button className="text-sm text-blue-600 hover:underline">Voir tous</button>
          </div>

          {stages.length > 0 ? (
            <div className="space-y-3">
              {stages.slice(0, 3).map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {stage.etudiant?.prenom?.charAt(0) || 'E'}
                    {stage.etudiant?.name?.charAt(0) || 'T'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {stage.etudiant?.prenom} {stage.etudiant?.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {stage.poste || 'Développeur Web'}
                    </p>
                    <p className="text-xs text-gray-500">{stage.etudiant?.email || 'email@example.com'}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    stage.date_fin && new Date(stage.date_fin) > new Date()
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stage.date_fin && new Date(stage.date_fin) > new Date() ? 'Actif' : 'Terminé'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BsPerson size={40} className="mx-auto mb-2 text-gray-300" />
              <p>Aucun stagiaire</p>
            </div>
          )}
        </div>

        {/* Colonne Droite: Actions Rapides + Livrables */}
        <div className="space-y-6">
          {/* Actions Rapides */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MdAssignmentTurnedIn className="text-white" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-blue-900">Assigner Tâche</p>
                  <p className="text-xs text-blue-600">Nouvelle mission</p>
                </div>
              </button>

              <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <BsPerson className="text-white" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-green-900">Évaluer</p>
                  <p className="text-xs text-green-600">Performance stagiaire</p>
                </div>
              </button>

              <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <BsFileEarmarkText className="text-white" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-purple-900">Message Groupe</p>
                  <p className="text-xs text-purple-600">Tous les stagiaires</p>
                </div>
              </button>

              <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaDownload className="text-white" size={18} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-orange-900">Rapport</p>
                  <p className="text-xs text-orange-600">Suivi mensuel</p>
                </div>
              </button>
            </div>
          </div>

          {/* Livrables à Réviser */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Livrables à Réviser</h2>
                <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {stats.enAttente} en attente
                </span>
              </div>
            </div>

            {livrables.filter(l => l.statut === 'À réviser').length > 0 ? (
              <div className="space-y-3">
                {livrables.filter(l => l.statut === 'À réviser').slice(0, 2).map((livrable) => (
                  <div key={livrable.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{livrable.titre}</h3>
                        <p className="text-xs text-gray-600 mt-1">Par: {livrable.etudiant?.prenom} {livrable.etudiant?.name}</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                        À réviser
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <BsFileEarmarkText size={14} />
                      <span>{livrable.type || 'Document'}</span>
                      <span>•</span>
                      <span>Soumis le {new Date(livrable.date_soumission || Date.now()).toLocaleDateString('fr-FR')}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLivrableAction(livrable.id, 'Révisé')}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        Réviser
                      </button>
                      <button 
                        onClick={() => handleDownload(livrable.stage_id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        onClick={() => handleLivrableAction(livrable.id, 'Approuvé')}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                      >
                        Approuver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BsFileEarmarkText size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucun livrable en attente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Évaluations Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Évaluations</h2>
          <button className="px-4 py-2 bg-dégradé text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Planifier évaluations
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Évaluations complétées</span>
            <span className="text-sm font-bold text-gray-900">{stats.evaluationsCompletees}/{stats.totalStages}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.totalStages > 0 ? (stats.evaluationsCompletees / stats.totalStages) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Note moyenne donnée</span>
            <span className="text-sm font-bold text-gray-900">⭐ {stats.moyenneNotes}/5</span>
          </div>
        </div>

        {stages.filter(s => !s.note).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3 text-sm">Stagiaires à évaluer</h3>
            <div className="space-y-2">
              {stages.filter(s => !s.note).slice(0, 3).map((stage) => (
                <div key={stage.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {stage.etudiant?.prenom?.charAt(0)}{stage.etudiant?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {stage.etudiant?.prenom} {stage.etudiant?.name}
                      </p>
                      <p className="text-xs text-gray-500">{stage.poste || 'Stagiaire'}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                    Évaluer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tâches Assignées */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Tâches Assignées</h2>
          <button className="px-4 py-2 bg-dégradé text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
            <MdAssignmentTurnedIn size={18} />
            <span>Nouvelle tâche</span>
          </button>
        </div>

        {livrables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livrables.map((livrable) => (
              <div key={livrable.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm flex-1">{livrable.titre}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    livrable.statut === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                    livrable.statut === 'Approuvé' ? 'bg-green-100 text-green-700' :
                    livrable.statut === 'Révisé' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {livrable.statut}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  Assignée à: <span className="font-semibold">{livrable.etudiant?.prenom} {livrable.etudiant?.name}</span>
                </p>
                
                {livrable.priorite && (
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    livrable.priorite === 'Haute' ? 'bg-red-100 text-red-700' :
                    livrable.priorite === 'Moyenne' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {livrable.priorite}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MdAssignmentTurnedIn size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Aucune tâche assignée</p>
            <p className="text-xs text-gray-400 mt-2">Créez des tâches pour vos stagiaires</p>
          </div>
        )}
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
    if (!name) return "";
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
          <NavLink to="." end className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-blue-700"}`}>
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

          {/* <NavLink to="evaluations" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-dégradé"}`}>
            <div className="flex items-center">
              <BsFileEarmarkText className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Évaluations</span>
            </div>
          </NavLink> */}

          <NavLink to="rapports" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <MdAssignmentTurnedIn className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Rapports</span>
            </div>
          </NavLink>

          <NavLink to="livrables" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <GiVendingMachine className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Livrables</span>
            </div>
          </NavLink>

          <NavLink to="taches_maitre" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-dégradé shadow-md" : "hover:bg-blue-200 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <IoDocumentAttachOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Taches Assignés</span>
              
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
                {getInitials(user?.prenom)}{getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.prenom}  {user?.name}</p>
                <p className="text-xs text-gray-500">Maitre de Stage</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'tuteur@entreprise.com'}</p>
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