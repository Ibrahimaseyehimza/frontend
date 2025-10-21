import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const MesStagiaire = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entreprise, setEntreprise] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔐 récupère le token du maître
        const response = await axios.get("maitre-stage/taches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEtudiants(response.data.etudiants);
          setEntreprise(response.data.entreprise);
        } else {
          setError("Erreur de récupération des données");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">Chargement des notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔔 Notifications – Étudiants affectés ({entreprise})
        </h2>

        {etudiants.length === 0 ? (
          <p className="text-gray-600">Aucun étudiant ne vous a encore été affecté.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Nom complet</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Adresse</th>
                  <th className="text-left py-3 px-4">Campagne</th>
                  <th className="text-left py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etudiant, index) => (
                  <tr
                    key={etudiant.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {etudiant.prenom} {etudiant.nom}
                    </td>
                    <td className="py-3 px-4">{etudiant.email}</td>
                    <td className="py-3 px-4">
                      {etudiant.adresse_1}
                      {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                    </td>
                    <td className="py-3 px-4">{etudiant.campagne}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          etudiant.statut === "acceptee"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {etudiant.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesStagiaire;
