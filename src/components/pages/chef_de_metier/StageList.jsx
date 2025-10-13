import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";
import { 
  FiEye, 
  FiDownload, 
  FiX, 
  FiCalendar, 
  FiUser, 
  FiBriefcase, 
  FiFileText,
  FiClock,
  FiMapPin,
  FiTarget
} from "react-icons/fi";
import { BsBuilding, BsCalendar3 } from "react-icons/bs";

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [campagneFilter, setCampagneFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stagesRes, campagnesRes] = await Promise.all([
        api.get("/stages"),
        api.get("/campagnes")
      ]);
      setStages(stagesRes.data.data ?? []);
      setCampagnes(campagnesRes.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les informations de la campagne
  const getCampagneInfo = (campagneId) => {
    return campagnes.find(c => c.id === campagneId);
  };

  // Filtrer les stages
  const filteredStages = stages.filter((stage) => {
    const matchSearch =
      stage.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.etudiant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.campagne?.titre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCampagne = 
      campagneFilter === "all" || 
      stage.campagne_id === parseInt(campagneFilter);

    return matchSearch && matchCampagne;
  });

  // Calculer le statut du stage
  const getStageStatus = (dateDebut, dateFin) => {
    const today = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (today < debut) return { label: "À venir", color: "bg-yellow-100 text-yellow-800" };
    if (today > fin) return { label: "Terminé", color: "bg-gray-100 text-gray-800" };
    return { label: "En cours", color: "bg-green-100 text-green-800" };
  };

  // Statistiques par campagne
  const getStatsParCampagne = () => {
    return campagnes.map(campagne => {
      const stagesCampagne = stages.filter(s => s.campagne_id === campagne.id);
      return {
        campagne: campagne.titre,
        total: stagesCampagne.length,
        enCours: stagesCampagne.filter(s => {
          const today = new Date();
          return new Date(s.date_debut) <= today && new Date(s.date_fin) >= today;
        }).length
      };
    }).filter(stat => stat.total > 0);
  };

  // Statistiques globales
  const stats = {
    total: stages.length,
    enCours: stages.filter(s => {
      const today = new Date();
      return new Date(s.date_debut) <= today && new Date(s.date_fin) >= today;
    }).length,
    termines: stages.filter(s => new Date(s.date_fin) < new Date()).length,
    aVenir: stages.filter(s => new Date(s.date_debut) > new Date()).length,
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
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiBriefcase className="text-blue-600" size={32} />
          Gestion des Stages
        </h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez tous les stages de vos étudiants par campagne
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Stages</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">En Cours</p>
              <p className="text-3xl font-bold text-green-600">{stats.enCours}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiClock className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Terminés</p>
              <p className="text-3xl font-bold text-gray-600">{stats.termines}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiTarget className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">À Venir</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.aVenir}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par campagne */}
      {getStatsParCampagne().length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTarget className="text-blue-600" />
            Répartition par campagne
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getStatsParCampagne().map((stat, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="font-semibold text-gray-800 mb-2">{stat.campagne}</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total: {stat.total}</span>
                  <span className="text-sm text-green-600 font-medium">En cours: {stat.enCours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par titre, étudiant, entreprise ou campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FiTarget className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={campagneFilter}
              onChange={(e) => setCampagneFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">Toutes les campagnes</option>
              {campagnes.map(campagne => (
                <option key={campagne.id} value={campagne.id}>
                  {campagne.titre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des stages */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Liste des stages ({filteredStages.length})
          </h2>
        </div>

        {filteredStages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-500 font-semibold">
              {searchTerm || campagneFilter !== "all" 
                ? "Aucun stage ne correspond à vos critères de recherche" 
                : "Aucun stage trouvé"}
            </p>
            <p className="text-gray-400 mt-2">
              {!searchTerm && campagneFilter === "all" && "Les stages apparaîtront ici une fois créés"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre du Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campagne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStages.map((stage) => {
                  const status = getStageStatus(stage.date_debut, stage.date_fin);
                  const campagneInfo = getCampagneInfo(stage.campagne_id);
                  
                  return (
                    <tr key={stage.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FiBriefcase className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {stage.titre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiTarget className="mr-2 text-purple-500" size={16} />
                          <span className="text-sm text-gray-900 font-medium">
                            {campagneInfo?.titre || stage.campagne?.titre || "Non spécifiée"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiUser className="mr-2 text-gray-400" size={16} />
                          {stage.etudiant?.name || "Non défini"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <BsBuilding className="mr-2 text-gray-400" size={16} />
                          {stage.entreprise?.nom || "Non défini"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <BsCalendar3 className="mr-2 text-gray-400" size={14} />
                            {new Date(stage.date_debut).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="flex items-center">
                            <BsCalendar3 className="mr-2 text-gray-400" size={14} />
                            {new Date(stage.date_fin).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedStage(stage)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Voir les détails"
                          >
                            <FiEye size={18} />
                          </button>
                          {stage.rapport_url && (
                            <a
                              href={stage.rapport_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition-colors"
                              title="Télécharger le rapport"
                            >
                              <FiDownload size={18} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détails du Stage */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header du Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Détails du Stage</h3>
                  <p className="text-blue-100 text-sm">{selectedStage.titre}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Contenu du Modal */}
            <div className="p-6 space-y-6">
              {/* Statut */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Statut</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStageStatus(selectedStage.date_debut, selectedStage.date_fin).color}`}>
                  {getStageStatus(selectedStage.date_debut, selectedStage.date_fin).label}
                </span>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <FiUser size={20} />
                    <span className="font-semibold">Étudiant</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedStage.etudiant?.name || "Non défini"}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <BsBuilding size={20} />
                    <span className="font-semibold">Entreprise</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedStage.entreprise?.nom || "Non défini"}
                  </p>
                </div>
              </div>

              {/* Période */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700 mb-3">
                  <FiCalendar size={20} />
                  <span className="font-semibold">Période du stage</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date de début</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedStage.date_debut).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date de fin</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedStage.date_fin).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campagne avec plus d'infos */}
              {(getCampagneInfo(selectedStage.campagne_id) || selectedStage.campagne) && (
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-700 mb-3">
                    <FiTarget size={20} />
                    <span className="font-semibold">Campagne de stage</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-medium text-lg">
                      {getCampagneInfo(selectedStage.campagne_id)?.titre || selectedStage.campagne?.titre}
                    </p>
                    {getCampagneInfo(selectedStage.campagne_id)?.description && (
                      <p className="text-gray-600 text-sm">
                        {getCampagneInfo(selectedStage.campagne_id).description}
                      </p>
                    )}
                    {getCampagneInfo(selectedStage.campagne_id) && (
                      <div className="flex gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Début campagne: </span>
                          <span className="font-medium">
                            {new Date(getCampagneInfo(selectedStage.campagne_id).date_debut).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fin campagne: </span>
                          <span className="font-medium">
                            {new Date(getCampagneInfo(selectedStage.campagne_id).date_fin).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedStage.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiFileText size={20} />
                    <span className="font-semibold">Description</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedStage.description}
                  </p>
                </div>
              )}

              {/* Bouton de téléchargement du rapport */}
              {selectedStage.rapport_url && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={selectedStage.rapport_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiDownload size={20} />
                    Télécharger le rapport de stage
                  </a>
                </div>
              )}
            </div>

            {/* Footer du Modal */}
            <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={() => setSelectedStage(null)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageList;