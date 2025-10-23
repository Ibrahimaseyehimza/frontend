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
    </div>
  );
};

export default MonStage;

