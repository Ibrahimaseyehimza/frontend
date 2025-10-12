import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const res = await api.get("/entreprises");
      setEntreprises(res.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des entreprises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les entreprises par recherche
  const filteredEntreprises = entreprises.filter((e) =>
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.telephone?.includes(searchTerm)
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
              Entreprises du Métier
            </h1>
            <p className="text-gray-600 mt-1">
              Liste des entreprises partenaires
            </p>
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
            placeholder="Rechercher par nom, email ou téléphone..."
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
            {new Set(entreprises.map(e => e.metier_id).filter(Boolean)).size}
          </div>
          <div className="text-gray-600 mt-2">Secteurs</div>
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
              : "Aucune entreprise n'est enregistrée pour ce métier"}
          </p>
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
              </div>

              {/* Métier si disponible */}
              {entreprise.metier && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {entreprise.metier.nom}
                  </span>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => {
                    // Action voir profil
                  }}
                >
                  <FiEdit2 size={16} />
                  <span>Voir Profil</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  onClick={() => {
                    // Action modifier
                  }}
                >
                  <FiEdit2 size={16} />
                </button>
              </div>

              {/* Footer - Date d'ajout */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                Ajouté le {entreprise.created_at ? new Date(entreprise.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination ou chargement plus */}
      {filteredEntreprises.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Charger plus d'entreprises
          </button>
        </div>
      )}
    </div>
  );
};

export default EntrepriseList;