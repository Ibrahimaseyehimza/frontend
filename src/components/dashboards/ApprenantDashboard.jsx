// components/dashboards/ApprenantDashboard.jsx - VERSION CORRIGÉE
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { IoHomeOutline, IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { MdAssignmentTurnedIn, MdNoteAlt } from "react-icons/md";
import { BsFileEarmarkText, BsCheckCircle, BsBuilding } from "react-icons/bs";
import { FiLogOut, FiSearch, FiSettings, FiUser, FiMail } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import NotificationBell from '../pages/NotificationBell';

// Composant tableau de bord principal
const TableauDeBordHome = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    campagnesDisponibles: 0,
    candidaturesEnvoyees: 0,
    stageEnCours: null,
    documentsDeposes: 0,
    tachesTotales: 0,
    tachesTerminees: 0,
    tachesEnCours: 0,
    performance: 0,
    progressionStage: 0,
  });
  
  const [taches, setTaches] = useState([]);
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
      
      const responses = await Promise.allSettled([
        api.get("/apprenant/mon-stage"),
        api.get("/apprenant/taches"),
        api.get("/apprenant/livrables"),
        api.get("/apprenant/candidatures"),
        api.get("/campagnes/apprenant"),
      ]);
      
      // ✅ CORRECTION : Extraction sécurisée du stage
      const stageResponse = responses[0];
      const stageData = stageResponse.status === 'fulfilled' 
        ? (stageResponse.value?.data?.data || stageResponse.value?.data || null)
        : null;
      
      // ✅ CORRECTION : Extraction sécurisée des tâches avec vérification de type
      const tachesResponse = responses[1];
      let tachesData = [];
      if (tachesResponse.status === 'fulfilled') {
        const rawData = tachesResponse.value?.data;
        console.log('🔍 Type de rawData:', typeof rawData, 'Est array?', Array.isArray(rawData));
        console.log('📦 Contenu rawData:', rawData);
        
        if (Array.isArray(rawData)) {
          tachesData = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          tachesData = rawData.data;
        } else if (rawData && typeof rawData === 'object') {
          console.warn('⚠️ Format inattendu pour les tâches:', rawData);
          tachesData = [];
        }
      }
      
      // ✅ CORRECTION : Extraction sécurisée des livrables
      const livrablesResponse = responses[2];
      let livrablesData = [];
      if (livrablesResponse.status === 'fulfilled') {
        const rawData = livrablesResponse.value?.data;
        if (Array.isArray(rawData)) {
          livrablesData = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          livrablesData = rawData.data;
        }
      }
      
      // ✅ CORRECTION : Extraction sécurisée des candidatures
      const candidaturesResponse = responses[3];
      let candidaturesData = [];
      if (candidaturesResponse.status === 'fulfilled') {
        const rawData = candidaturesResponse.value?.data;
        if (Array.isArray(rawData)) {
          candidaturesData = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          candidaturesData = rawData.data;
        }
      }
      
      console.log('✅ Données extraites:', {
        stage: stageData,
        taches: tachesData.length,
        livrables: livrablesData.length,
        candidatures: candidaturesData.length
      });
      
      // ✅ S'assurer que ce sont des tableaux
      setTaches(Array.isArray(tachesData) ? tachesData : []);
      setLivrables(Array.isArray(livrablesData) ? livrablesData : []);
      
      // Calculer les statistiques
      const tachesTerminees = tachesData.filter(t => 
        t.statut === 'termine' || t.statut === 'terminee' || t.status === 'completed'
      ).length;
      
      const tachesEnCours = tachesData.filter(t => 
        t.statut === 'en_cours' || t.status === 'in_progress'
      ).length;
      
      const performance = tachesData.length > 0 
        ? ((tachesTerminees / tachesData.length) * 5).toFixed(1) 
        : 0;
      
      // Calculer la progression du stage
      let progressionStage = 0;
      if (stageData && stageData.date_debut && stageData.date_fin) {
        const debut = new Date(stageData.date_debut);
        const fin = new Date(stageData.date_fin);
        const maintenant = new Date();
        const totalDuree = fin - debut;
        const dureeEcoulee = maintenant - debut;
        progressionStage = Math.min(Math.max((dureeEcoulee / totalDuree) * 100, 0), 100);
      }
      
      setStats({
        campagnesDisponibles: 0,
        candidaturesEnvoyees: candidaturesData.length,
        stageEnCours: stageData,
        documentsDeposes: livrablesData.length,
        tachesTotales: tachesData.length,
        tachesTerminees: tachesTerminees,
        tachesEnCours: tachesEnCours,
        performance: performance,
        progressionStage: progressionStage.toFixed(0),
      });
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
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
      {/* Carte principale avec informations du stage */}
      {stats.stageEnCours ? (
        <div className="bg-dégradé rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  Bonjour, {user?.name || user?.prenom}
                </h1>
                <p className="text-blue-100 text-lg mb-1">
                  Stage en cours - {stats.stageEnCours.poste || stats.stageEnCours.titre || 'Développeur Full Stack'}
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <BsBuilding className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Entreprise</p>
                      <p className="font-semibold">{stats.stageEnCours.entreprise?.nom || 'Orange Sénégal'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <FaRegUser className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Superviseur</p>
                      <p className="font-semibold">{stats.stageEnCours.maitre_stage?.nom || stats.stageEnCours.superviseur || 'Marie Faye'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <IoHomeOutline className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Localisation</p>
                      <p className="font-semibold">{stats.stageEnCours.ville || 'Dakar, Sénégal'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex w-20 h-20 bg-white bg-opacity-20 rounded-2xl items-center justify-center">
                <BsFileEarmarkText className="text-white" size={40} />
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-100">Progression du stage</span>
                <span className="text-lg font-bold">{stats.progressionStage}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${stats.progressionStage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dégradé rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user?.prenom || user?.name}
            </h1>
            <p className="text-gray-300 mb-4">Aucun stage en cours actuellement</p>
            <NavLink 
              to="campagnes"
              className="inline-block bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Voir les campagnes disponibles →
            </NavLink>
          </div>

          <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
            <img src="/LOGO EIT.png" alt="Logo ISEP" className="h-24 w-auto object-contain" />
          </div>
        </div>
      )}

      {/* Statistiques en cartes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Tâches Totales</p>
            <p className="text-4xl font-bold text-gray-900">{stats.tachesTotales}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <BsCheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Terminées</p>
            <p className="text-4xl font-bold text-gray-900">{stats.tachesTerminees}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">En Cours</p>
            <p className="text-4xl font-bold text-gray-900">{stats.tachesEnCours}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Performance</p>
            <p className="text-4xl font-bold text-gray-900">{stats.performance} ★</p>
          </div>
        </div>
      </div>

      {/* Mes Tâches et Mes Livrables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes Tâches */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mes Tâches</h3>
            <NavLink 
              to="taches"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir toutes
            </NavLink>
          </div>

          {taches.length > 0 ? (
            <div className="space-y-3">
              {taches.slice(0, 3).map((tache) => (
                <div key={tache.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {tache.titre || tache.nom || 'Tâche sans titre'}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {tache.description || 'Aucune description disponible'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 whitespace-nowrap ${
                      tache.statut === 'termine' || tache.statut === 'terminee' || tache.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : tache.statut === 'en_cours' || tache.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tache.statut === 'termine' || tache.statut === 'terminee' || tache.status === 'completed' ? 'Terminée' : 
                       tache.statut === 'en_cours' || tache.status === 'in_progress' ? 'En cours' : 'À faire'}
                    </span>
                  </div>
                  {tache.date_limite && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {new Date(tache.date_limite).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-2">📋</div>
              <p className="text-gray-500 font-medium">Aucune tâche assignée</p>
              <p className="text-sm text-gray-400 mt-1">Les tâches apparaîtront ici</p>
            </div>
          )}
        </div>

        {/* Mes Livrables */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mes Livrables</h3>
            <NavLink
              to="rapport"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-colors text-sm font-medium"
            >
              <span className="text-lg leading-none">↑</span>
              Nouveau
            </NavLink>
          </div>

          {livrables.length > 0 ? (
            <div className="space-y-3">
              {livrables.slice(0, 3).map((livrable) => (
                <div key={livrable.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BsFileEarmarkText className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {livrable.titre || livrable.nom || 'Document sans titre'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {livrable.created_at 
                            ? `Déposé le ${new Date(livrable.created_at).toLocaleDateString('fr-FR')}`
                            : 'Date inconnue'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ml-2 ${
                      livrable.statut === 'valide' || livrable.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : livrable.statut === 'en_attente' || livrable.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {livrable.statut === 'valide' || livrable.status === 'approved' ? '✓' : 
                       livrable.statut === 'en_attente' || livrable.status === 'pending' ? '⏳' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-2">📄</div>
              <p className="text-gray-500 font-medium">Aucun livrable déposé</p>
              <p className="text-sm text-gray-400 mt-1">Déposez vos documents ici</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span>Actions Rapides</span>
          <span className="ml-2 text-yellow-500">⚡</span>
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NavLink 
            to="campagnes"
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl text-center transition-all hover:shadow-md"
          >
            <TbBrandCampaignmonitor className="text-blue-600 mx-auto mb-3" size={32} />
            <p className="font-semibold text-gray-900 text-sm">Campagnes</p>
            <p className="text-xs text-gray-600 mt-1">Voir les offres</p>
          </NavLink>
          
          <NavLink 
            to="mes-demandes"
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl text-center transition-all hover:shadow-md"
          >
            <MdAssignmentTurnedIn className="text-green-600 mx-auto mb-3" size={32} />
            <p className="font-semibold text-gray-900 text-sm">Mes Demandes</p>
            <p className="text-xs text-gray-600 mt-1">Suivi candidatures</p>
          </NavLink>
          
          <NavLink 
            to="mon-stage"
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl text-center transition-all hover:shadow-md"
          >
            <FaRegUser className="text-purple-600 mx-auto mb-3" size={32} />
            <p className="font-semibold text-gray-900 text-sm">Mon Stage</p>
            <p className="text-xs text-gray-600 mt-1">Détails du stage</p>
          </NavLink>
          
          <NavLink 
            to="rapport"
            className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl text-center transition-all hover:shadow-md"
          >
            <BsFileEarmarkText className="text-orange-600 mx-auto mb-3" size={32} />
            <p className="font-semibold text-gray-900 text-sm">Rapport</p>
            <p className="text-xs text-gray-600 mt-1">Déposer rapport</p>
          </NavLink>
        </div>
      </div>

      {/* Section contact superviseur (si stage en cours) */}
      {stats.stageEnCours && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Superviseur</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {stats.stageEnCours.maitre_stage?.nom || stats.stageEnCours.superviseur || 'Marie Faye'}
                  </p>
                  <p className="text-xs text-gray-500">Superviseur de stage</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-gray-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {stats.stageEnCours.maitre_stage?.email || 'marie.faye@orange.sn'}
                  </p>
                  <p className="text-xs text-gray-500">Email professionnel</p>
                </div>
              </div>

              <button
                onClick={() => window.location.href = `mailto:${stats.stageEnCours.maitre_stage?.email || 'marie.faye@orange.sn'}`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mt-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Envoyer un message
              </button>
            </div>
          </div>

          {/* Informations du Stage */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Informations du Stage</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Date de début</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.stageEnCours.date_debut 
                    ? new Date(stats.stageEnCours.date_debut).toLocaleDateString('fr-FR')
                    : '2024-02-15'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Date de fin</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.stageEnCours.date_fin 
                    ? new Date(stats.stageEnCours.date_fin).toLocaleDateString('fr-FR')
                    : '2024-05-15'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Durée</span>
                <span className="text-sm font-semibold text-gray-900">
                  {(() => {
                    if (stats.stageEnCours.date_debut && stats.stageEnCours.date_fin) {
                      const debut = new Date(stats.stageEnCours.date_debut);
                      const fin = new Date(stats.stageEnCours.date_fin);
                      const diffMonths = Math.round((fin - debut) / (1000 * 60 * 60 * 24 * 30));
                      return `${diffMonths} mois`;
                    }
                    return '3 mois';
                  })()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Statut</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  En cours
                </span>
              </div>
            </div>
          </div>

          {/* Actions Rapides (colonne) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Actions Rapides</h3>
            
            <div className="space-y-3">
              <NavLink
                to="rapport"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Soumettre un livrable</p>
                </div>
              </NavLink>

              <NavLink
                to="rapport"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <BsFileEarmarkText className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Rapport hebdomadaire</p>
                </div>
              </NavLink>

              <NavLink
                to="planning"
                className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Voir le planning</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal du dashboard
const ApprenantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name) => {
    if (!name) return "AP";
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

  const isHomePage = location.pathname === "/dashboard/apprenant" || location.pathname === "/dashboard/apprenant/";

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
          <NavLink to="." end className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <IoHomeOutline className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Tableau de bord</span>
            </div>
          </NavLink>

          <NavLink to="campagnes" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <TbBrandCampaignmonitor className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Campagnes</span>
            </div>
          </NavLink>

          <NavLink to="mes-demandes" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <MdAssignmentTurnedIn className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Mes demandes</span>
            </div>
          </NavLink>

          <NavLink to="mon-stage" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Mon stage</span>
            </div>
          </NavLink>
          <NavLink to="mes-livrables" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <FaRegUser className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Mes Livrables</span>
            </div>
          </NavLink>

          <NavLink to="rapport" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <BsFileEarmarkText className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Rapport</span>
            </div>
          </NavLink>

          {/* <NavLink to="notes" className={({ isActive }) => `block py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-all ${isActive ? "bg-blue-100 text-blue-700 shadow-md" : "hover:bg-blue-50 hover:text-blue-700"}`}>
            <div className="flex items-center">
              <MdNoteAlt className="text-lg sm:text-xl flex-shrink-0" />
              <span className="ml-2">Notes</span>
            </div>
          </NavLink> */}
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

          {/* Barre de recherche */}
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

            {/* Menu déroulant */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'apprenant@isep-thies.edu.sn'}</p>
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

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {isHomePage ? <TableauDeBordHome /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default ApprenantDashboard;