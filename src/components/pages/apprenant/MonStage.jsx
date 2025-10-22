import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const MonStage = () => {
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get("/apprenant/mon-stage");
        
        console.log("✅ Stage récupéré:", res.data);
        
        if (res.data.success) {
          setStage(res.data.data);
        } else {
          setError(res.data.message || "Aucun stage trouvé");
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement du stage :", err);
        
        // Gestion détaillée des erreurs
        if (err.response) {
          // Le serveur a répondu avec un code d'erreur
          switch (err.response.status) {
            case 404:
              setError("La route API n'existe pas. Vérifiez la configuration backend.");
              break;
            case 401:
              setError("Non autorisé. Veuillez vous reconnecter.");
              break;
            case 500:
              setError("Erreur serveur. Veuillez réessayer plus tard.");
              break;
            default:
              setError(err.response.data?.message || "Erreur de chargement");
          }
        } else if (err.request) {
          // La requête a été envoyée mais pas de réponse
          setError("Aucune réponse du serveur. Vérifiez votre connexion.");
        } else {
          // Erreur lors de la configuration de la requête
          setError("Erreur lors de la requête: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStage();
  }, []);

  // État de chargement
  if (loading) {
    return (
      <div className="bg-white p-6 shadow rounded-xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="bg-white p-6 shadow rounded-xl border-l-4 border-red-500">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Aucun stage trouvé
  if (!stage) {
    return (
      <div className="bg-white p-6 shadow rounded-xl border-l-4 border-yellow-500">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">Aucun stage validé</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Vous n'avez pas encore de stage validé pour le moment.
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Veuillez soumettre une demande de stage pour commencer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du stage
  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Mon Stage</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          stage.statut === 'validé' ? 'bg-green-100 text-green-800' :
          stage.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
          stage.statut === 'terminé' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {stage.statut}
        </span>
      </div>

      <div className="space-y-4">
        {/* Entreprise */}
        <div className="flex items-start">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <p className="text-sm text-gray-500">Entreprise</p>
            <p className="text-base font-medium text-gray-900">
              {stage.entreprise?.nom || 'Non définie'}
            </p>
          </div>
        </div>

        {/* Maître de stage */}
        <div className="flex items-start">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div>
            <p className="text-sm text-gray-500">Maître de stage</p>
            <p className="text-base font-medium text-gray-900">
              {stage.tuteur?.nom || 'Non défini'}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-start">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm text-gray-500">Période</p>
            <p className="text-base font-medium text-gray-900">
              {stage.date_debut ? new Date(stage.date_debut).toLocaleDateString('fr-FR') : 'Non définie'}
              {' → '}
              {stage.date_fin ? new Date(stage.date_fin).toLocaleDateString('fr-FR') : 'Non définie'}
            </p>
          </div>
        </div>

        {/* Informations supplémentaires si disponibles */}
        {stage.description && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-base text-gray-700">{stage.description}</p>
          </div>
        )}

        {stage.mission && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Mission</p>
            <p className="text-base text-gray-700">{stage.mission}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Voir les détails
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
          Télécharger la convention
        </button>
      </div>
    </div>
  );
};

export default MonStage;