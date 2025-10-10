import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ChefMetierCampagnes = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Charger les campagnes du métier connecté
  useEffect(() => {
    const fetchCampagnes = async () => {
      try {
        const res = await api.get("/campagnes");
        setCampagnes(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur lors du chargement des campagnes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampagnes();
  }, []);

  // ✅ Afficher les entreprises d’une campagne
  const handleViewCampagne = async (campagne) => {
    setSelectedCampagne(campagne);
    try {
      const res = await api.get(`/campagnes/${campagne.id}/entreprises`);
      setEntreprises(res.data.data ?? []);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises:", err);
    }
  };

  // ✅ Retirer une entreprise d’une campagne
  const handleRemoveEntreprise = async (entrepriseId) => {
    if (!selectedCampagne) return;
    if (!window.confirm("Retirer cette entreprise de la campagne ?")) return;

    try {
      await api.delete(
        `/campagnes/${selectedCampagne.id}/entreprises/${entrepriseId}`
      );

      setEntreprises((prev) =>
        prev.filter((ent) => ent.id !== entrepriseId)
      );

      alert("Entreprise retirée ✅");
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Impossible de retirer l’entreprise");
    }
  };

  // ✅ Archiver une campagne
  const handleArchive = async (id) => {
    if (!window.confirm("Archiver cette campagne ?")) return;

    try {
      await api.put(`/campagnes/${id}`, { statut: "archivee" });
      setCampagnes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, statut: "archivee" } : c))
      );
      alert("Campagne archivée ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’archivage");
    }
  };

  if (loading) return <p>Chargement des campagnes...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700">
        📋 Campagnes du métier
      </h2>

      {campagnes.length === 0 ? (
        <p>Aucune campagne disponible.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {campagnes.map((campagne) => (
            <div
              key={campagne.id}
              className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{campagne.titre}</h3>
              <p className="text-sm text-gray-600">{campagne.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                📅 {campagne.date_debut} → {campagne.date_fin}
              </p>
              <p
                className={`mt-2 inline-block px-3 py-1 rounded text-xs ${
                  campagne.statut === "active"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {campagne.statut?.toUpperCase()}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleViewCampagne(campagne)}
                  className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                >
                  Voir entreprises
                </button>
                {campagne.statut !== "archivee" && (
                  <button
                    onClick={() => handleArchive(campagne.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Archiver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Entreprises associées */}
      {selectedCampagne && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-3">
            🏢 Entreprises liées à : {selectedCampagne.titre}
          </h3>
          {entreprises.length === 0 ? (
            <p>Aucune entreprise associée.</p>
          ) : (
            <ul className="space-y-2">
              {entreprises.map((ent) => (
                <li
                  key={ent.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded"
                >
                  <span>{ent.nom}</span>
                  <button
                    onClick={() => handleRemoveEntreprise(ent.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefMetierCampagnes;
