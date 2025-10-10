// src/components/pages/StagiairesList.jsx
import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";

const StagiairesList = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const res = await api.get("/stages"); // endpoint backend
        setStagiaires(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement stagiaires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStagiaires();
  }, []);

  if (loading) return <p>Chargement des stagiaires...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mes Stagiaires</h2>

      {stagiaires.length === 0 ? (
        <p>Aucun stagiaire trouvé.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Entreprise</th>
              <th className="border p-2">Campagne</th>
              <th className="border p-2">Date Début</th>
              <th className="border p-2">Date Fin</th>
            </tr>
          </thead>
          <tbody>
            {stagiaires.map((stage) => (
              <tr key={stage.id} className="text-center">
                <td className="border p-2">
                  {stage.etudiant?.name || "Non assigné"}
                </td>
                <td className="border p-2">
                  {stage.entreprise?.nom || "Non définie"}
                </td>
                <td className="border p-2">
                  {stage.campagne?.titre || "—"}
                </td>
                <td className="border p-2">{stage.date_debut}</td>
                <td className="border p-2">{stage.date_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StagiairesList;
