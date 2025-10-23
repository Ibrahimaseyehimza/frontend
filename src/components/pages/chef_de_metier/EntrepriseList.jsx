import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext"; // Import du contexte d'authentification
import { FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";

const EntrepriseList = () => {
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
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
        response = await api.get("/entreprises_global");
      } catch (err) {
        try {
          response = await api.get("/entreprises");
        } catch (err2) {
          response = await api.get("/entreprise");
        }
      }

      // Extraire les données
      let toutesLesEntreprises = [];
      const data = response.data;
      
      if (Array.isArray(data)) {
        toutesLesEntreprises = data;
      } else if (data?.data && Array.isArray(data.data)) {
        toutesLesEntreprises = data.data;
      } else if (data?.entreprises && Array.isArray(data.entreprises)) {
        toutesLesEntreprises = data.entreprises;
      }

      console.log("📊 Toutes les entreprises récupérées:", toutesLesEntreprises.length);

      // ========== MÉTHODE 1: Filtrage direct par metier_id ==========
      let entreprisesFiltrees = [];
      
      if (metierId) {
        entreprisesFiltrees = toutesLesEntreprises.filter(entreprise => {
          // Vérifier si l'entreprise est associée au métier du chef
          
          // Cas 1: metier_id direct
          if (entreprise.metier_id === metierId || entreprise.metier_id === parseInt(metierId)) {
            return true;
          }
          
          // Cas 2: Tableau de métiers
          if (entreprise.metiers && Array.isArray(entreprise.metiers)) {
            const hasMetier = entreprise.metiers.some(m => {
              return m.id === metierId || 
                     m.id === parseInt(metierId) || 
                     m === metierId;
            });
            if (hasMetier) return true;
          }
          
          // Cas 3: Objet métier
          if (entreprise.metier && typeof entreprise.metier === 'object') {
            if (entreprise.metier.id === metierId || entreprise.metier.id === parseInt(metierId)) {
              return true;
            }
          }
          
          return false;
        });
        
        console.log("✅ Méthode 1 - Entreprises filtrées par metier_id:", entreprisesFiltrees.length);
      }

      // ========== MÉTHODE 2: Si peu de résultats, récupérer via les campagnes ==========
      if (entreprisesFiltrees.length === 0 && metierId) {
        console.log("🔄 Tentative de récupération via les campagnes...");
        
        try {
          // Récupérer les campagnes du métier
          const campagnesResponse = await api.get("/campagnes_global").catch(() => 
            api.get("/campagnes-global")
          );
          
          let campagnes = [];
          const campagnesData = campagnesResponse.data;
          
          if (Array.isArray(campagnesData)) {
            campagnes = campagnesData;
          } else if (campagnesData?.data && Array.isArray(campagnesData.data)) {
            campagnes = campagnesData.data;
          }
          
          // Filtrer les campagnes du métier
          const campagnesDuMetier = campagnes.filter(c => {
            if (c.metier_id === metierId || c.metier_id === parseInt(metierId)) return true;
            if (c.metiers && Array.isArray(c.metiers)) {
              return c.metiers.some(m => m.id === metierId || m.id === parseInt(metierId));
            }
            if (c.metier && c.metier.id === metierId) return true;
            return false;
          });
          
          console.log("📊 Campagnes du métier trouvées:", campagnesDuMetier.length);
          
          // Extraire les IDs d'entreprises uniques
          const entreprisesIds = new Set();
          campagnesDuMetier.forEach(campagne => {
            if (campagne.entreprises && Array.isArray(campagne.entreprises)) {
              campagne.entreprises.forEach(ent => {
                if (ent.id) entreprisesIds.add(ent.id);
              });
            }
            if (campagne.entreprise_id) {
              entreprisesIds.add(campagne.entreprise_id);
            }
          });
          
          // Filtrer les entreprises par IDs
          if (entreprisesIds.size > 0) {
            entreprisesFiltrees = toutesLesEntreprises.filter(e => 
              entreprisesIds.has(e.id)
            );
            console.log("✅ Méthode 2 - Entreprises filtrées via campagnes:", entreprisesFiltrees.length);
          }
          
        } catch (err) {
          console.warn("⚠️ Impossible de récupérer les campagnes:", err);
        }
      }

      // Si toujours aucun résultat et que c'est un chef de métier, afficher un message
      if (entreprisesFiltrees.length === 0 && metierId) {
        console.warn("⚠️ Aucune entreprise trouvée pour ce métier");
      }

      // Si pas de metierId (admin), afficher toutes les entreprises
      const entreprisesFinales = metierId ? entreprisesFiltrees : toutesLesEntreprises;

      console.log("📊 Résultat final:", {
        total: toutesLesEntreprises.length,
        filtrees: entreprisesFinales.length,
        metierId: metierId
      });

      setEntreprises(entreprisesFinales);
      
    } catch (error) {
      console.error("❌ Erreur lors du chargement des entreprises:", error);
      console.error("Détails:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les entreprises par recherche
  const filteredEntreprises = entreprises.filter((e) =>
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.telephone?.includes(searchTerm) ||
    e.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des entreprises...
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
              Mes Entreprises Partenaires
            </h1>
            <p className="text-gray-600 mt-1">
              Liste des entreprises liées à votre métier
            </p>
            {user?.metier_id && (
              <p className="text-sm text-blue-600 mt-1">
                📌 Filtré pour votre métier uniquement
              </p>
            )}
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">{entreprises.length}</p>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">{entreprises.length}</div>
          <div className="text-gray-600 mt-2">Total Entreprises</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">
            {entreprises.filter(e => e.email && e.telephone).length}
          </div>
          <div className="text-gray-600 mt-2">Avec Contact Complet</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-purple-600">
            {entreprises.filter(e => e.adresse).length}
          </div>
          <div className="text-gray-600 mt-2">Avec Adresse</div>
        </div>
      </div>

      {/* Liste des entreprises */}
      {filteredEntreprises.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-xl text-gray-500 font-semibold">Aucune entreprise trouvée</p>
          <p className="text-gray-400 mt-2">
            {searchTerm
              ? "Essayez une autre recherche"
              : "Aucune entreprise n'est enregistrée pour votre métier"}
          </p>
          {!searchTerm && user?.metier_id && (
            <p className="text-sm text-blue-600 mt-4">
              💡 Les entreprises apparaîtront lorsqu'elles seront associées à des campagnes de votre métier
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntreprises.map((entreprise) => (
            <div
              key={entreprise.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-6"
            >
              {/* Logo/Icône entreprise */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RiBuilding4Line className="text-white" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {entreprise.nom}
                  </h3>
                  <p className="text-sm text-gray-500">Entreprise partenaire</p>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-3 mb-4">
                {entreprise.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="text-blue-500 flex-shrink-0" size={18} />
                    <span className="truncate">{entreprise.email}</span>
                  </div>
                )}
                
                {entreprise.telephone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPhone className="text-green-500 flex-shrink-0" size={18} />
                    <span>{entreprise.telephone}</span>
                  </div>
                )}
                
                {entreprise.adresse && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="line-clamp-2">{entreprise.adresse}</span>
                  </div>
                )}

                {/* Si pas d'informations de contact */}
                {!entreprise.email && !entreprise.telephone && !entreprise.adresse && (
                  <div className="text-sm text-gray-400 italic text-center py-2">
                    Informations de contact non disponibles
                  </div>
                )}
              </div>

              {/* Métier si disponible */}
              {entreprise.metier && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {entreprise.metier.nom || entreprise.metier}
                  </span>
                </div>
              )}

              {/* Secteur d'activité si disponible */}
              {entreprise.secteur && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {entreprise.secteur}
                  </span>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => {
                    // Action voir profil
                    console.log("Voir profil entreprise:", entreprise.id);
                  }}
                >
                  <FiEdit2 size={16} />
                  <span>Voir Profil</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  onClick={() => {
                    // Action modifier
                    console.log("Modifier entreprise:", entreprise.id);
                  }}
                >
                  <FiEdit2 size={16} />
                </button>
              </div>

              {/* Footer - Date d'ajout */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                {entreprise.created_at ? (
                  <>Ajouté le {new Date(entreprise.created_at).toLocaleDateString('fr-FR')}</>
                ) : (
                  <>Entreprise partenaire</>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message informatif */}
      {filteredEntreprises.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            💼 Affichage de {filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''} 
            {searchTerm && ` correspondant à "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default EntrepriseList;