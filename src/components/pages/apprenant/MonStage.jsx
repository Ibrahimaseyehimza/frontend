<<<<<<< HEAD
// import React, { useEffect, useState } from "react";
// // import api from "../../api/axios";
// import api from "../../../api/axios";

// const MonStage = () => {
//   const [stage, setStage] = useState(null);

//   useEffect(() => {
//     const fetchStage = async () => {
//       try {
//         const res = await api.get("/apprenant/mon-stage");
//         setStage(res.data.data);
//       } catch (err) {
//         console.error("Erreur lors du chargement du stage :", err);
//       }
//     };
//     fetchStage();
//   }, []);

//   if (!stage) return <p>Aucun stage validé pour le moment.</p>;

//   return (
//     <div className="bg-white p-6 shadow rounded-xl">
//       <h2 className="text-2xl font-bold mb-4 text-blue-700">Mon Stage</h2>
//       <p><strong>Entreprise :</strong> {stage.entreprise?.nom}</p>
//       <p><strong>Maître de stage :</strong> {stage.tuteur?.nom}</p>
//       <p><strong>Date début :</strong> {stage.date_debut}</p>
//       <p><strong>Date fin :</strong> {stage.date_fin}</p>
//       <p><strong>État :</strong> {stage.statut}</p>
//     </div>
//   );
// };

// export default MonStage;







import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

// const ApprenantTaches = () => {
const   MonStage = () => {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaches();
  }, []);

  const fetchTaches = async () => {
    try {
      const response = await api.get("/apprenant/taches");
      if (response.data.success) {
        setTaches(response.data.taches);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
    } finally {
      setLoading(false);
    }
  };

  const marquerTerminee = async (id) => {
    if (!window.confirm("Voulez-vous marquer cette tâche comme terminée ?")) return;

    try {
      const response = await api.patch(`/apprenant/taches/${id}/terminer`);
      if (response.data.success) {
        alert("Tâche marquée comme terminée !");
        fetchTaches();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement des tâches...</p>
=======
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
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
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
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Mes Tâches Assignées
      </h1>

      {taches.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Aucune tâche ne vous a encore été assignée.
        </p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm text-gray-600 uppercase">
                  Titre
                </th>
                <th className="p-3 text-left text-sm text-gray-600 uppercase">
                  Description
                </th>
                <th className="p-3 text-left text-sm text-gray-600 uppercase">
                  Échéance
                </th>
                <th className="p-3 text-left text-sm text-gray-600 uppercase">
                  Statut
                </th>
                <th className="p-3 text-left text-sm text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {taches.map((t) => (
                <tr
                  key={t.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-800">{t.titre}</td>
                  <td className="p-3 text-gray-600">{t.description || "—"}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(t.date_echeance).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        t.statut === "terminee"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.statut === "terminee" ? "Terminée" : "En cours"}
                    </span>
                  </td>
                  <td className="p-3">
                    {t.statut !== "terminee" && (
                      <button
                        onClick={() => marquerTerminee(t.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        ✅ Terminer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
=======
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
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
    </div>
  );
};

<<<<<<< HEAD
export default MonStage;

=======
export default MonStage;
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
