import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";
import { Eye, Download } from "lucide-react";

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const res = await api.get("/stages");
        setStages(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement stages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  if (loading) return <p>Chargement des stages...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">📋 Liste des Stages</h2>

      {/* Table des stages */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Titre</th>
            <th className="p-2 border">Étudiant</th>
            <th className="p-2 border">Entreprise</th>
            <th className="p-2 border">Date début</th>
            <th className="p-2 border">Date fin</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stages.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Aucun stage trouvé
              </td>
            </tr>
          ) : (
            stages.map((stage) => (
              <tr key={stage.id} className="hover:bg-gray-50">
                <td className="p-2 border">{stage.titre}</td>
                <td className="p-2 border">
                  {stage.etudiant?.name || "Non défini"}
                </td>
                <td className="p-2 border">
                  {stage.entreprise?.nom || "Non défini"}
                </td>
                <td className="p-2 border">{stage.date_debut}</td>
                <td className="p-2 border">{stage.date_fin}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => setSelectedStage(stage)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Eye size={16} /> Voir
                  </button>
                  {stage.rapport_url && (
                    <a
                      href={stage.rapport_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Download size={16} /> Rapport
                    </a>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Modal Détail du stage */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/3 relative">
            <button
              onClick={() => setSelectedStage(null)}
              className="absolute top-2 right-3 text-red-500 text-xl"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">🧾 Détails du Stage</h3>

            <p><strong>Titre :</strong> {selectedStage.titre}</p>
            <p><strong>Description :</strong> {selectedStage.description || "—"}</p>
            <p><strong>Étudiant :</strong> {selectedStage.etudiant?.name}</p>
            <p><strong>Entreprise :</strong> {selectedStage.entreprise?.nom}</p>
            <p><strong>Campagne :</strong> {selectedStage.campagne?.titre}</p>
            <p><strong>Date début :</strong> {selectedStage.date_debut}</p>
            <p><strong>Date fin :</strong> {selectedStage.date_fin}</p>

            {selectedStage.rapport_url && (
              <div className="mt-4">
                <a
                  href={selectedStage.rapport_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center gap-2"
                >
                  <Download size={18} /> Télécharger le rapport
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageList;
