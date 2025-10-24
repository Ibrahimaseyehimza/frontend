import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

const MonStage = () => {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ État pour gérer les erreurs

  useEffect(() => {
    fetchTaches();
  }, []);

  const fetchTaches = async () => {
    try {
      const response = await api.get("/apprenant/taches");
      if (response.data.success) {
        setTaches(response.data.taches);
      } else {
        setError("Impossible de charger les tâches depuis le serveur.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tâches :", err);
      setError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const marquerTerminee = async (id) => {
    if (!window.confirm("Voulez-vous marquer cette tâche comme terminée ?")) return;

    try {
      const response = await api.patch(`/apprenant/taches/${id}/terminer`);
      if (response.data.success) {
        alert("✅ Tâche marquée comme terminée !");
        fetchTaches();
      } else {
        alert("Impossible de mettre à jour la tâche.");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  // 🌀 État de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement des tâches...</p>
      </div>
    );
  }

  // ❌ État d’erreur
  if (error) {
    return (
      <div className="bg-white p-6 shadow rounded-xl border-l-4 border-red-500">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              🔄 Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Aucun stage / aucune tâche
  if (!taches || taches.length === 0) {
    return (
      <div className="bg-white p-6 shadow rounded-xl border-l-4 border-yellow-500">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">Aucune tâche assignée</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Vous n'avez pas encore de tâches à effectuer pour le moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Affichage des tâches
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes Tâches Assignées</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm text-gray-600 uppercase">Titre</th>
              <th className="p-3 text-left text-sm text-gray-600 uppercase">Description</th>
              <th className="p-3 text-left text-sm text-gray-600 uppercase">Échéance</th>
              <th className="p-3 text-left text-sm text-gray-600 uppercase">Statut</th>
              <th className="p-3 text-left text-sm text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
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
    </div>
  );
};

export default MonStage;

