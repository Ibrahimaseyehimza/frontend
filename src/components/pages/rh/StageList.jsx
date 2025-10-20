import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { FiSearch, FiDownload, FiEye, FiCalendar, FiUser, FiBuilding, FiFileText, FiFilter, FiRefreshCw } from "react-icons/fi";
import { BsBuilding, BsCalendar3, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { MdOutlineWorkOutline } from "react-icons/md";
import { RiFileListLine } from "react-icons/ri";

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entrepriseFilter, setEntrepriseFilter] = useState("all");

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stages");
      console.log("📊 Stages récupérés:", res.data);
      
      // Gérer différentes structures de réponse
      let stagesData = res.data.data || res.data.stages || res.data || [];
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(stagesData)) {
        stagesData = [];
      }
      
      console.log("✅ Nombre de stages:", stagesData.length);
      setStages(stagesData);
    } catch (err) {
      console.error("❌ Erreur chargement stages:", err);
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStage = (stage) => {
    setSelectedStage(stage);
  };

  const handleCloseDetails = () => {
    setSelectedStage(null);
  };

  const handleDownload = (rapportUrl) => {
    if (!rapportUrl) {
      alert("⚠️ Aucun rapport disponible pour ce stage.");
      return;
    }
    window.open(rapportUrl, "_blank");
  };

  // Filtrage des stages
  const filteredStages = stages.filter((stage) => {
    const matchSearch =
      stage.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.etudiant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.apprenant?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || 
      (statusFilter === "actif" && isStageActif(stage)) ||
      (statusFilter === "termine" && !isStageActif(stage));

    const matchEntreprise =
      entrepriseFilter === "all" || 
      stage.entreprise?.nom === entrepriseFilter;

    return matchSearch && matchStatus && matchEntreprise;
  });

  // Fonction pour vérifier si un stage est actif
  const isStageActif = (stage) => {
    if (!stage.date_fin) return false;
    return new Date(stage.date_fin) > new Date();
  };

  // Obtenir la liste unique des entreprises
  const entreprises = [...new Set(stages.map((s) => s.entreprise?.nom).filter(Boolean))];

  // Statistiques
  const stats = {
    total: stages.length,
    actifs: stages.filter(isStageActif).length,
    termines: stages.filter(s => !isStageActif(s)).length,
    avecRapport: stages.filter(s => s.rapport_url).length,
  };

  // Obtenir les initiales
  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Couleur aléatoire pour les avatars
  const getRandomColor = (id) => {
    const colors = [
      "bg-blue-600",
      "bg-indigo-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-red-600",
      "bg-orange-600",
      "bg-green-600",
      "bg-teal-600",
      "bg-cyan-600",
    ];
    return colors[id % colors.length];
  };

  // Badge de statut
  const getStatusBadge = (stage) => {
    if (isStageActif(stage)) {
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
          <BsCheckCircle size={12} />
          En cours
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
        <BsXCircle size={12} />
        Terminé
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des stages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Stages
            </h1>
            <p className="text-gray-600 mt-1">
              Consultez et gérez tous les stages en cours et terminés
            </p>
          </div>
          <button
            onClick={fetchStages}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Stages</p>
              <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <RiFileListLine className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Stages Actifs</p>
              <div className="text-4xl font-bold text-green-600">{stats.actifs}</div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <BsCheckCircle className="text-green-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Stages Terminés</p>
              <div className="text-4xl font-bold text-gray-600">{stats.termines}</div>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              <BsXCircle className="text-gray-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Avec Rapport</p>
              <div className="text-4xl font-bold text-purple-600">{stats.avecRapport}</div>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiFileText className="text-purple-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un stage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">En cours</option>
              <option value="termine">Terminés</option>
            </select>
          </div>
          
          <div className="relative">
            <BsBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={entrepriseFilter}
              onChange={(e) => setEntrepriseFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Toutes les entreprises</option>
              {entreprises.map((entreprise) => (
                <option key={entreprise} value={entreprise}>
                  {entreprise}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des stages */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>Liste des stages</span>
            <span className="text-lg font-normal text-gray-500">
              ({filteredStages.length})
            </span>
          </h2>
        </div>

        {filteredStages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiFileListLine className="text-gray-400" size={48} />
            </div>
            <p className="text-xl text-gray-600 font-semibold mb-2">
              {searchTerm || statusFilter !== "all" || entrepriseFilter !== "all"
                ? "Aucun stage trouvé"
                : "Aucun stage disponible"}
            </p>
            <p className="text-gray-400">
              {!searchTerm && statusFilter === "all" && entrepriseFilter === "all"
                ? "Les stages apparaîtront ici une fois créés"
                : "Essayez de modifier vos critères de recherche"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStages.map((stage) => (
              <div
                key={stage.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:border-blue-200 cursor-pointer"
                onClick={() => handleSelectStage(stage)}
              >
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-12 h-12 ${getRandomColor(
                        stage.id
                      )} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <span className="text-white text-lg font-bold">
                        {getInitials(stage.titre)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {stage.titre || "Stage sans titre"}
                      </h3>
                      {getStatusBadge(stage)}
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                  {stage.entreprise?.nom && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiBuilding className="text-gray-400 flex-shrink-0" size={16} />
                      <span className="truncate">{stage.entreprise.nom}</span>
                    </div>
                  )}

                  {(stage.etudiant?.name || stage.apprenant?.name) && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiUser className="text-gray-400 flex-shrink-0" size={16} />
                      <span className="truncate">
                        {stage.etudiant?.name || stage.apprenant?.name}
                      </span>
                    </div>
                  )}

                  {stage.date_debut && stage.date_fin && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiCalendar className="text-gray-400 flex-shrink-0" size={16} />
                      <span>
                        {new Date(stage.date_debut).toLocaleDateString("fr-FR")} → {new Date(stage.date_fin).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStage(stage);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FiEye size={16} />
                    <span>Détails</span>
                  </button>
                  
                  {stage.rapport_url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(stage.rapport_url);
                      }}
                      className="bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FiDownload size={16} />
                      <span>Rapport</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information de filtrage */}
        {filteredStages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Affichage de <span className="font-semibold text-gray-800">{filteredStages.length}</span> stage(s)
              {filteredStages.length !== stages.length && (
                <span> sur <span className="font-semibold text-gray-800">{stages.length}</span> au total</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* En-tête du modal */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${getRandomColor(
                    selectedStage.id
                  )} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white text-2xl font-bold">
                    {getInitials(selectedStage.titre)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedStage.titre || "Stage sans titre"}
                  </h3>
                  {getStatusBadge(selectedStage)}
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FiBuilding className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-700">Entreprise</span>
                </div>
                <p className="text-gray-800 ml-8">
                  {selectedStage.entreprise?.nom || "Non définie"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FiUser className="text-green-600" size={20} />
                  <span className="font-semibold text-gray-700">Apprenant</span>
                </div>
                <p className="text-gray-800 ml-8">
                  {selectedStage.etudiant?.name || selectedStage.apprenant?.name || "Non assigné"}
                </p>
              </div>

              {selectedStage.campagne && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MdOutlineWorkOutline className="text-purple-600" size={20} />
                    <span className="font-semibold text-gray-700">Campagne</span>
                  </div>
                  <p className="text-gray-800 ml-8">
                    {selectedStage.campagne?.titre || selectedStage.campagne?.nom || "—"}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FiCalendar className="text-orange-600" size={20} />
                  <span className="font-semibold text-gray-700">Période</span>
                </div>
                <p className="text-gray-800 ml-8">
                  {selectedStage.date_debut && selectedStage.date_fin ? (
                    <>
                      Du {new Date(selectedStage.date_debut).toLocaleDateString("fr-FR")} 
                      {" au "}
                      {new Date(selectedStage.date_fin).toLocaleDateString("fr-FR")}
                    </>
                  ) : (
                    "Dates non définies"
                  )}
                </p>
              </div>

              {selectedStage.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFileText className="text-indigo-600" size={20} />
                    <span className="font-semibold text-gray-700">Description</span>
                  </div>
                  <p className="text-gray-800 ml-8 whitespace-pre-line">
                    {selectedStage.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bouton de téléchargement */}
            {selectedStage.rapport_url && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleDownload(selectedStage.rapport_url)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg"
                >
                  <FiDownload size={20} />
                  Télécharger le rapport de stage
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageList;