import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";

const MonStage = () => {
  const [stage, setStage] = useState(null);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        const res = await api.get("/apprenant/mon-stage");
        setStage(res.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement du stage :", err);
      }
    };
    fetchStage();
  }, []);

  if (!stage) return <p>Aucun stage validé pour le moment.</p>;

  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Mon Stage</h2>
      <p><strong>Entreprise :</strong> {stage.entreprise?.nom}</p>
      <p><strong>Maître de stage :</strong> {stage.tuteur?.nom}</p>
      <p><strong>Date début :</strong> {stage.date_debut}</p>
      <p><strong>Date fin :</strong> {stage.date_fin}</p>
      <p><strong>État :</strong> {stage.statut}</p>
    </div>
  );
};

export default MonStage;
