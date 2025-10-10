import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState(null);

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

  const handleSelectStage = (stage) => {
    setSelectedStage(stage);
  };

  const handleCloseDetails = () => {
    setSelectedStage(null);
  };

  const handleDownload = (rapportUrl) => {
    if (!rapportUrl) {
      alert("Aucun rapport disponible pour ce stage.");
      return;
    }
    window.open(rapportUrl, "_blank");
  };

  if (loading) return <p>Chargement des stages...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">📚 Gestion des Stages</h2>

      {/* 🧾 Tableau des stages */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Titre</th>
              <th className="p-3 text-left">Entreprise</th>
              <th className="p-3 text-left">Apprenant</th>
              <th className="p-3 text-left">Dates</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Aucun stage trouvé.
                </td>
              </tr>
            ) : (
              stages.map((stage) => (
                <tr
                  key={stage.id}
                  className="hover:bg-blue-50 cursor-pointer border-b"
                  onClick={() => handleSelectStage(stage)}
                >
                  <td className="p-3">{stage.titre}</td>
                  <td className="p-3">{stage.entreprise?.nom || "—"}</td>
                  <td className="p-3">{stage.etudiant?.name || "—"}</td>
                  <td className="p-3">
                    {stage.date_debut} → {stage.date_fin}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(stage.rapport_url);
                      }}
                    >
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📋 Panneau de détails */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={handleCloseDetails}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4">
              Détails du stage — {selectedStage.titre}
            </h3>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Entreprise :</span>{" "}
                {selectedStage.entreprise?.nom || "Non définie"}
              </p>
              <p>
                <span className="font-semibold">Apprenant :</span>{" "}
                {selectedStage.etudiant?.name || "—"}
              </p>
              <p>
                <span className="font-semibold">Campagne :</span>{" "}
                {selectedStage.campagne?.titre || "—"}
              </p>
              <p>
                <span className="font-semibold">Durée :</span>{" "}
                {selectedStage.date_debut} → {selectedStage.date_fin}
              </p>
              <p>
                <span className="font-semibold">Description :</span>{" "}
                {selectedStage.description || "Aucune description"}
              </p>

              {selectedStage.rapport_url && (
                <button
                  onClick={() => handleDownload(selectedStage.rapport_url)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  📥 Télécharger le rapport
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageList;
