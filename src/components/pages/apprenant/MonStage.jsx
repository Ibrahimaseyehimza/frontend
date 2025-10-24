import React, { useState, useEffect } from "react";
// import api from "../../../api/axios";

// Mock API pour la démonstration
const api = {
  get: async (url) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler des données de tâches
    return {
      data: {
        success: true,
        taches: [
          {
            id: 1,
            titre: "Rapport mensuel",
            description: "Rédiger le rapport d'activité du mois",
            date_echeance: "2025-11-15",
            statut: "en_cours"
          },
          {
            id: 2,
            titre: "Présentation projet",
            description: "Préparer la présentation pour le client",
            date_echeance: "2025-11-20",
            statut: "en_cours"
          },
          {
            id: 3,
            titre: "Formation sécurité",
            description: "Compléter le module de formation en ligne",
            date_echeance: "2025-10-28",
            statut: "terminee"
          }
        ]
      }
    };
  },
  patch: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  }
};

const MonStage = () => {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaches();
  }, []);

  const fetchTaches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/apprenant/taches");
      if (response.data.success) {
        setTaches(response.data.taches);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
      setError("Impossible de charger les tâches. Veuillez réessayer.");
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

  // État de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 shadow rounded-xl border-l-4 border-red-500 max-w-md">
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
                onClick={fetchTaches}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage des tâches
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mes Tâches Assignées
        </h1>

        {taches.length === 0 ? (
          <div className="bg-white p-8 shadow rounded-xl text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mt-4 text-lg">
              Aucune tâche ne vous a encore été assignée.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                      Titre
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                      Description
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                      Échéance
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                      Statut
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
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
                      <td className="p-4 font-medium text-gray-800">{t.titre}</td>
                      <td className="p-4 text-gray-600">{t.description || "—"}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(t.date_echeance).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            t.statut === "terminee"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {t.statut === "terminee" ? "Terminée" : "En cours"}
                        </span>
                      </td>
                      <td className="p-4">
                        {t.statut !== "terminee" && (
                          <button
                            onClick={() => marquerTerminee(t.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MonStage;