// // components/dashboards/MaitreStagesDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const MaitreStageDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Maître de Stage</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Encadrer les stagiaires</li>
//           <li>Évaluer les performances</li>
//           <li>Rédiger les rapports d'évaluation</li>
//           <li>Communiquer avec l'établissement</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default MaitreStageDashboard;














import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MaitreStagesDashboard = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les stages
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const res = await api.get("/maitre-stage/stages");
        setStages(res.data.data || []);
      } catch (err) {
        console.error("Erreur chargement stages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const handleDownload = async (stageId) => {
    try {
      const res = await api.get(`/maitre-stage/stages/${stageId}/rapport`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rapport_stage_${stageId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Aucun rapport trouvé pour ce stage.");
    }
  };

  const handleNoteChange = async (stageId, note) => {
    try {
      await api.put(`/maitre-stage/stages/${stageId}/note`, { note });
      alert("✅ Note enregistrée !");
      setStages((prev) =>
        prev.map((s) => (s.id === stageId ? { ...s, note } : s))
      );
    } catch (err) {
      alert("Erreur lors de l’enregistrement de la note.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🎓 Stages à superviser</h1>

      {stages.length === 0 ? (
        <p>Aucun stagiaire affecté pour le moment.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Étudiant</th>
              <th className="p-2">Entreprise</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Rapport</th>
              <th className="p-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {stage.etudiant?.prenom} {stage.etudiant?.name}
                </td>
                <td className="p-2">{stage.entreprise?.nom}</td>
                <td className="p-2">
                  {stage.date_debut} → {stage.date_fin}
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleDownload(stage.id)}
                  >
                    Télécharger
                  </button>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    className="border p-1 w-16 text-center rounded"
                    defaultValue={stage.note || ""}
                    onBlur={(e) => handleNoteChange(stage.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MaitreStagesDashboard;
