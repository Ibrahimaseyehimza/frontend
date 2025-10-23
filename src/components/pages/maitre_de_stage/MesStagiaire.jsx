import React, { useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiUser, FiCalendar, FiEye } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";

const MesStagiaires = () => {
  const { user } = useAuth();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entreprise, setEntreprise] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement des stagiaires...");
      
      const response = await api.get("/maitre-stage/etudiants-affectes");

      console.log("📊 Réponse API:", response.data);

      if (response.data.success || response.data) {
        const etudiantsData = response.data.etudiants || response.data.data || [];
        setEtudiants(etudiantsData);
        setEntreprise(response.data.entreprise || "");
        
        console.log(`✅ ${etudiantsData.length} stagiaire(s) chargé(s)`);
      } else {
        setError("Erreur de récupération des données");
      }
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err.response?.data?.message || "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des stagiaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
            <button
              onClick={fetchEtudiants}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              🔄 Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-dégradé rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 Mes Stagiaires</h1>
              <p className="text-blue-100 text-lg">
                Maître de stage: <span className="font-semibold">{user?.name}</span>
              </p>
              {entreprise && (
                <p className="text-blue-200 text-sm mt-1">
                  <FiMapPin className="inline mr-1" />
                  {entreprise}
                </p>
              )}
            </div>
            <div className="text-center bg-white bg-opacity-20 px-8 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold">{etudiants?.length || 0}</div>
              <p className="text-blue-100 text-sm mt-1">Stagiaire{etudiants?.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {!etudiants || etudiants.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Aucun stagiaire affecté
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Les stagiaires qui vous seront affectés apparaîtront ici.
              </p>
            </div>
          ) : (
            <>
              {/* Vue en cartes pour mobile/tablet */}
              <div className="block lg:hidden space-y-4">
                {etudiants.map((etudiant, index) => (
                  <div
                    key={etudiant.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                        {etudiant.prenom?.charAt(0)}
                        {etudiant.nom?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {etudiant.prenom} {etudiant.nom}
                        </h3>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          etudiant.statut === "acceptee"
                            ? "bg-green-100 text-green-700"
                            : etudiant.statut === "en_cours"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {etudiant.statut || "En attente"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiMail className="text-blue-500" />
                        <a href={`mailto:${etudiant.email}`} className="text-blue-600 hover:underline">
                          {etudiant.email}
                        </a>
                      </div>
                      {etudiant.telephone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiPhone className="text-green-500" />
                          <span>{etudiant.telephone}</span>
                        </div>
                      )}
                      {etudiant.adresse_1 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiMapPin className="text-orange-500" />
                          <span>
                            {etudiant.adresse_1}
                            {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                          </span>
                        </div>
                      )}
                      {etudiant.campagne && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiCalendar className="text-purple-500" />
                          <span>{etudiant.campagne}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                      onClick={() => {/* TODO: Voir détails */}}
                    >
                      <FiEye />
                      Voir détails
                    </button>
                  </div>
                ))}
              </div>

              {/* Vue en tableau pour desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-dégradé">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-white">#</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Stagiaire</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Adresse</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Campagne</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Statut</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {etudiants.map((etudiant, index) => (
                      <tr
                        key={etudiant.id}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-10 bg-dégradé rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {etudiant.prenom?.charAt(0)}
                              {etudiant.nom?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {etudiant.prenom} {etudiant.nom}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FiMail className="text-blue-500" size={14} />
                              <a href={`mailto:${etudiant.email}`} className="text-blue-600 hover:underline text-sm">
                                {etudiant.email}
                              </a>
                            </div>
                            {etudiant.telephone && (
                              <div className="flex items-center gap-2">
                                <FiPhone className="text-green-500" size={14} />
                                <span className="text-gray-700 text-sm">{etudiant.telephone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 text-gray-700 text-sm max-w-xs">
                          {etudiant.adresse_1 ? (
                            <div className="flex items-start gap-2">
                              <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" size={14} />
                              <span>
                                {etudiant.adresse_1}
                                {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6 text-gray-700">
                          {etudiant.campagne ? (
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-purple-500" size={14} />
                              <span className="text-sm">{etudiant.campagne}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                            etudiant.statut === "acceptee"
                              ? "bg-green-100 text-green-700"
                              : etudiant.statut === "en_cours"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {etudiant.statut === "acceptee" && "✓ Accepté"}
                            {etudiant.statut === "en_cours" && "⏳ En cours"}
                            {!etudiant.statut && "⏳ En attente"}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <button 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                            onClick={() => {/* TODO: Voir détails */}}
                          >
                            <FiEye size={16} />
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Statistiques en bas */}
        {etudiants.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Total stagiaires</p>
                <p className="text-3xl font-bold text-blue-600">{etudiants.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Stagiaires actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {etudiants.filter(e => e.statut === "acceptee" || e.statut === "en_cours").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {etudiants.filter(e => !e.statut || e.statut === "en_attente").length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesStagiaires;