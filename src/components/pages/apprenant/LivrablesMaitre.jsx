import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import LivrableCard from "./LivrableCard";

const LivrablesMaitre = () => {
  const [livrables, setLivrables] = useState([]);

  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const res = await api.get("/livrables");
        setLivrables(res.data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchLivrables();
  }, []);

  const handleNotation = async (id, note) => {
    try {
      await api.put(`/livrables/${id}/noter`, { note });
      alert("✅ Note enregistrée !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la notation.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Livrables des Apprenants
      </h1>

      {livrables.map((livrable) => (
        <LivrableCard
          key={livrable.id}
          livrable={livrable}
          onNoter={handleNotation}
          mode="maitre"
        />
      ))}
    </div>
  );
};

export default LivrablesMaitre;
