import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../AuthContext";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { BsBuilding, BsCalendar3 } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";

const ListeCampagne = () => {
  const { token, user } = useAuth();
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [entrepriseId, setEntrepriseId] = useState("");
  const [adresse1, setAdresse1] = useState("");
  const [adresse2, setAdresse2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Charger les campagnes disponibles
  useEffect(() => {
    const fetchCampagnes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔍 User info:", user);
        console.log("🔍 Token:", token ? "Présent" : "Absent");
        
        // ✅ CORRECTION : Pas de /v1 car déjà dans baseURL
        const response = await api.get("/campagnes/apprenant", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log("✅ Réponse API complète:", response.data);
        
        // ✅ CORRECTION : Gestion flexible de la structure de réponse
        let campagnesData = [];
        
        if (response.data.data) {
          campagnesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          campagnesData = response.data;
        } else if (response.data.campagnes) {
          campagnesData = response.data.campagnes;
        }
        
        if (Array.isArray(campagnesData)) {
          setCampagnes(campagnesData);
          console.log(`✅ ${campagnesData.length} campagne(s) chargée(s)`);
        } else {
          console.error("❌ Format de données invalide:", campagnesData);
          setCampagnes([]);
          setError("Format de données invalide reçu du serveur");
        }
        
      } catch (error) {
        console.error("❌ Erreur chargement campagnes:", error);
        console.error("❌ Status:", error.response?.status);
        console.error("❌ Détails:", error.response?.data);
        
        let errorMessage = "Erreur de chargement des campagnes";
        
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Session expirée. Veuillez vous reconnecter.";
          } else if (error.response.status === 403) {
            errorMessage = "Accès non autorisé. Vérifiez vos permissions.";
          } else if (error.response.status === 404) {
            errorMessage = "Route API introuvable. Vérifiez la configuration.";
          } else {
            errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
          }
        } else if (error.request) {
          errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion.";
        }
        
        setError(errorMessage);
        setCampagnes([]);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchCampagnes();
    } else {
      console.error("❌ Token ou user manquant");
      setError("Authentification requise");
      setLoading(false);
    }
  }, [token, user]);

  // 🔹 Soumission de la candidature
  const handlePostuler = async (e) => {
    e.preventDefault();
    
    if (!selectedCampagne || !entrepriseId || !adresse1) {
      setMessage("⚠️ Veuillez remplir tous les champs requis.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    
    try {
      console.log("📤 Envoi candidature:", {
        campagne_id: selectedCampagne.id,
        entreprise_id: entrepriseId,
        adresse_1: adresse1,
        adresse_2: adresse2,
      });
      
      // ✅ CORRECTION : Ajout du préfixe /v1
      const response = await api.post("/v1/apprenant/postuler", {
        campagne_id: selectedCampagne.id,
        entreprise_id: entrepriseId,
        adresse_1: adresse1,
        adresse_2: adresse2,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("✅ Candidature envoyée:", response.data);
      setMessage(response.data.message || "✅ Candidature envoyée avec succès !");
      
      // Réinitialiser le formulaire
      setSelectedCampagne(null);
      setAdresse1("");
      setAdresse2("");
      setEntrepriseId("");
      
      // Masquer le message après 5 secondes
      setTimeout(() => setMessage(""), 5000);
      
    } catch (error) {
      console.error("❌ Erreur postulation:", error);
      console.error("❌ Détails:", error.response?.data);
      
      let errorMsg = "Une erreur est survenue lors de la soumission.";
      
      if (error.response?.data) {
        errorMsg = error.response.data.message || 
                   error.response.data.error ||
                   errorMsg;
      }
      
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSubmitting(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TbBrandCampaignmonitor className="text-blue-600" size={32} />
          Campagnes de Stage Disponibles
        </h1>
        <p className="text-gray-500 mt-1">
          Postulez aux campagnes qui correspondent à votre métier
        </p>
      </div>

      {/* Message de succès/erreur */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg shadow-md ${
          message.includes('❌') || message.includes('⚠️')
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center gap-3">
            <FiAlertCircle className={
              message.includes('❌') || message.includes('⚠️') 
                ? 'text-red-600' 
                : 'text-green-600'
            } size={20} />
            <p className={
              message.includes('❌') || message.includes('⚠️')
                ? 'text-red-700' 
                : 'text-green-700'
            }>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Informations de debug */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">🔍 Informations de l'etudiant</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• User ID: {user?.id || 'Non défini'}</p>
          <p>• Métier ID: {user?.metier_id || 'Non défini'}</p>
          <p>• Nom: {user?.name || 'Non défini'}</p>
          <p>• Email: {user?.email || 'Non défini'}</p>
          <p>• Role: {user?.role || 'Non défini'}</p>
          <p>• Nombre de campagnes: {campagnes.length}</p>
          <p>• Token: {token ? '✅ Présent' : '❌ Absent'}</p>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-red-900 font-semibold mb-1">Erreur de chargement</h4>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-red-600 underline hover:text-red-800"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des campagnes */}
      {campagnes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucune campagne disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Aucune campagne ouverte pour votre métier actuellement.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Vérifications à faire :</strong>
            </p>
            <ul className="text-left text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Votre métier est-il bien défini dans votre profil ?</li>
              <li>• Des campagnes sont-elles créées pour votre métier ?</li>
              <li>• Les campagnes sont-elles encore actives (dates) ?</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campagnes.map((campagne) => (
            <div
              key={campagne.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {campagne.titre}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {campagne.metier?.nom || "Métier non défini"}
                    </span>
                    {campagne.date_fin && new Date(campagne.date_fin) > new Date() && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {campagne.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {campagne.description}
                </p>
              )}

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                {campagne.date_debut && campagne.date_fin && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BsCalendar3 className="text-gray-400" size={14} />
                    <span>
                      {new Date(campagne.date_debut).toLocaleDateString("fr-FR")} 
                      {" → "}
                      {new Date(campagne.date_fin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}

                {campagne.entreprises && campagne.entreprises.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <BsBuilding className="text-gray-400" size={14} />
                      <span>Entreprises disponibles :</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campagne.entreprises.map((ent) => (
                        <span 
                          key={ent.id}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {ent.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCampagne(campagne)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
              >
                Postuler à cette campagne
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 MODAL POSTULATION */}
      {selectedCampagne && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Postuler à : {selectedCampagne.titre}
            </h3>

            <form onSubmit={handlePostuler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisir une entreprise *
                </label>
                <select
                  value={entrepriseId}
                  onChange={(e) => setEntrepriseId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Sélectionner une entreprise --</option>
                  {selectedCampagne.entreprises?.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse principale *
                </label>
                <input
                  type="text"
                  value={adresse1}
                  onChange={(e) => setAdresse1(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex : Quartier Médina, Dakar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse secondaire (optionnelle)
                </label>
                <input
                  type="text"
                  value={adresse2}
                  onChange={(e) => setAdresse2(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex : Mermoz, Dakar"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampagne(null);
                    setEntrepriseId("");
                    setAdresse1("");
                    setAdresse2("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Envoi en cours..." : "✅ Soumettre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeCampagne;