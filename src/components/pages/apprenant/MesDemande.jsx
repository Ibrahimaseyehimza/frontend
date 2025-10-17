import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const MesDemandes = () => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await api.get("/apprenant/mes-demandes");
        setDemandes(res.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes :", err);
      }
    };
    fetchDemandes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mes Demandes de Stage</h2>
      {demandes.length === 0 ? (
        <p>Aucune demande enregistrée.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-3">Entreprise</th>
              <th className="p-3">Campagne</th>
              <th className="p-3">Adresse 1</th>
              <th className="p-3">Adresse 2</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.entreprise?.nom}</td>
                <td className="p-3">{d.campagne?.titre}</td>
                <td className="p-3">{d.adresse_1}</td>
                <td className="p-3">{d.adresse_2 || "-"}</td>
                <td className="p-3 font-semibold text-blue-600">{d.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MesDemandes;
