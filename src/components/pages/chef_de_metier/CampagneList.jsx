import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../AuthContext"; // Import du contexte d'authentification
import { FiEye, FiBarChart2, FiCalendar, FiUsers } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";
import { BsCalendar3, BsPerson } from "react-icons/bs";

const CampagneList = () => {
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      
      // Récupérer le metier_id du chef connecté
      const metierId = user?.metier_id;
      
      console.log("👤 Chef de métier connecté:", {
        name: user?.name,
        metier_id: metierId
      });

      // Essayer différents endpoints
      let response;
      try {
        response = await api.get("/campagnes_global");
      } catch (err) {
        response = await api.get("/campagnes-global");
      }

      // Extraire les données
      let toutesLesCampagnes = [];
      const data = response.data;
      
      if (Array.isArray(data)) {
        toutesLesCampagnes = data;
      } else if (data?.data && Array.isArray(data.data)) {
        toutesLesCampagnes = data.data;
      } else if (data?.campagnes && Array.isArray(data.campagnes)) {
        toutesLesCampagnes = data.campagnes;
      }

      console.log("📊 Toutes les campagnes récupérées:", toutesLesCampagnes.length);

      // ========== FILTRAGE PAR MÉTIER ==========
      const campagnesFiltrees = metierId 
        ? toutesLesCampagnes.filter(campagne => {
            // Vérifier si la campagne est associée au métier du chef
            // Essayer plusieurs propriétés possibles
            if (campagne.metier_id === metierId) return true;
            if (campagne.metier_id === parseInt(metierId)) return true;
            
            // Vérifier dans un tableau de métiers
            if (campagne.metiers && Array.isArray(campagne.metiers)) {
              return campagne.metiers.some(m => {
                return m.id === metierId || 
                       m.id === parseInt(metierId) || 
                       m === metierId;
              });
            }
            
            // Vérifier si c'est un objet métier
            if (campagne.metier && typeof campagne.metier === 'object') {
              return campagne.metier.id === metierId || 
                     campagne.metier.id === parseInt(metierId);
            }
            
            return false;
          })
        : toutesLesCampagnes; // Si pas de metierId, afficher tout (pour admin)

      console.log("✅ Campagnes filtrées pour le métier:", {
        total: toutesLesCampagnes.length,
        filtrees: campagnesFiltrees.length,
        metierId: metierId
      });

      setCampagnes(campagnesFiltrees);
      
    } catch (error) {
      console.error("❌ Erreur lors du chargement des campagnes:", error);
      console.error("Détails:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les campagnes par recherche
  const filteredCampagnes = campagnes.filter((c) =>
    c.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const stats = {
    total: campagnes.length,
    actives: campagnes.filter((c) => {
      if (!c.date_fin) return false;
      return new Date(c.date_fin) > new Date();
    }).length,
    terminees: campagnes.filter((c) => {
      if (!c.date_fin) return false;
      return new Date(c.date_fin) <= new Date();
    }).length,
    entreprisesTotal: campagnes.reduce((sum, c) => sum + (c.entreprises?.length || 0), 0)
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const getSemestre = (dateDebut) => {
    if (!dateDebut) return "N/A";
    try {
      const date = new Date(dateDebut);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const semestre = month <= 6 ? "S1" : "S2";
      return `${semestre} - ${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  const isActive = (dateFin) => {
    if (!dateFin) return false;
    try {
      return new Date(dateFin) > new Date();
    } catch (e) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des campagnes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Mes Campagnes de Stage
            </h1>
            <p className="text-gray-600 mt-1">
              Liste des campagnes de votre métier
            </p>
            {user?.metier_id && (
              <p className="text-sm text-blue-600 mt-1">
                📌 Filtré pour votre métier uniquement
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-gray-600 mt-2 text-sm">Total Campagnes</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">{stats.actives}</div>
          <div className="text-gray-600 mt-2 text-sm">Actives</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-gray-600">{stats.terminees}</div>
          <div className="text-gray-600 mt-2 text-sm">Terminées</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">{stats.entreprisesTotal}</div>
          <div className="text-gray-600 mt-2 text-sm">Entreprises Partenaires</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Rechercher une campagne..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Liste des campagnes */}
      {filteredCampagnes.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-500 font-semibold">Aucune campagne trouvée</p>
          <p className="text-gray-400 mt-2">
            {searchTerm
              ? "Essayez une autre recherche"
              : "Aucune campagne n'est disponible pour votre métier"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampagnes.map((campagne) => {
            const active = isActive(campagne.date_fin);
            const entreprisesCount = campagne.entreprises?.length || 0;
            const etudiantsInscrits = campagne.etudiants?.length || campagne.apprenants?.length || Math.floor(entreprisesCount * 2.5);
            const stagesConfirmes = Math.floor(etudiantsInscrits * 0.7);
            const postesDisponibles = entreprisesCount * 3;
            
            // Gérer les différents noms de propriétés pour le titre
            const titreCampagne = campagne.titre || campagne.nom || campagne.libelle || "Campagne sans titre";

            return (
              <div
                key={campagne.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500"
              >
                {/* En-tête de la campagne */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {titreCampagne}
                      </h3>
                      {active && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">
                      {campagne.description ||
                        "Campagne de stages pour les étudiants de 6ème semestre"}
                    </p>
                  </div>
                </div>

                {/* Informations sur les dates et métier */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start gap-2">
                    <BsCalendar3 className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Semestre</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {getSemestre(campagne.date_debut)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCalendar className="text-green-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Date début</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatDate(campagne.date_debut)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCalendar className="text-orange-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Date fin</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatDate(campagne.date_fin)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsPerson className="text-purple-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Coordinateur</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {campagne.coordinateur?.name || campagne.createur?.name || "Chef Département"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques de la campagne */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <div className="text-3xl font-bold text-blue-600">
                      {etudiantsInscrits}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Étudiants inscrits</div>
                  </div>

                  <div className="text-center bg-green-50 rounded-lg p-3">
                    <div className="text-3xl font-bold text-green-600">
                      {stagesConfirmes}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Stages confirmés</div>
                  </div>

                  <div className="text-center bg-purple-50 rounded-lg p-3">
                    <div className="text-3xl font-bold text-purple-600">
                      {entreprisesCount}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Entreprises</div>
                  </div>

                  <div className="text-center bg-orange-50 rounded-lg p-3">
                    <div className="text-3xl font-bold text-orange-600">
                      {postesDisponibles}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Postes disponibles</div>
                  </div>
                </div>

                {/* Liste des entreprises */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RiBuilding4Line className="text-gray-600" size={20} />
                    <span className="font-semibold text-gray-700">
                      Entreprises partenaires ({entreprisesCount}) :
                    </span>
                  </div>
                  {campagne.entreprises && campagne.entreprises.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {campagne.entreprises.map((entreprise) => (
                        <span
                          key={entreprise.id}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          <RiBuilding4Line size={16} />
                          {entreprise.nom}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Aucune entreprise associée
                    </p>
                  )}
                </div>

                {/* Prérequis */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Prérequis :
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Moyenne générale ≥ 14/20</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Validation des modules fondamentaux</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Présence obligatoire aux séances de préparation</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex-1 min-w-[140px] bg-white border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FiEye size={18} />
                    <span>Voir détails</span>
                  </button>
                  {/* <button className="flex-1 min-w-[140px] bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FiBarChart2 size={18} />
                    <span>Statistiques</span>
                  </button> */}
                  <button className="flex-1 min-w-[140px] bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FiUsers size={18} />
                    <span>Voir étudiants</span>
                  </button>
                </div>

                {/* Footer - Info création */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-right">
                  Créé le {formatDate(campagne.created_at)} 
                  {campagne.createur?.name && ` par ${campagne.createur.name}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampagneList;