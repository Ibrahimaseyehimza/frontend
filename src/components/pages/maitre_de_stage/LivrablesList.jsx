// src/components/pages/LivrablesList.jsx
import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";

const LivrablesList = () => {
  const [livrables, setLivrables] = useState([]);

  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const res = await api.get("/livrables"); // backend route à prévoir
        setLivrables(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement livrables:", err);
      }
    };
    fetchLivrables();
  }, []);

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Livrables des Stagiaires</h2>

      {livrables.length === 0 ? (
        <p>Aucun livrable disponible.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Stagiaire</th>
              <th className="border p-2">Fichier</th>
              <th className="border p-2">Date d’envoi</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {livrables.map((liv) => (
              <tr key={liv.id} className="text-center">
                <td className="border p-2">{liv.etudiant?.name}</td>
                <td className="border p-2">{liv.nom_fichier}</td>
                <td className="border p-2">{liv.created_at}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDownload(liv.url)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Télécharger
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LivrablesList;
