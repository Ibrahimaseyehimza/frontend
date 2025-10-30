import React, { useEffect, useState } from "react";
// import api from "../api/axios"; // ton instance axios configurée
import api from "../../../api/axios";
// import LivrableCard from "../components/LivrableCard";
import LivrableCard from "./LivrableCard";  

const LivrablesMaitre = () => {
  const [livrables, setLivrables] = useState([]);

  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/maitre-stage/livrables", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLivrables(res.data.livrables);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    fetchLivrables();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📦 Liste des livrables</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {livrables.map((livrable) => (
          <LivrableCard key={livrable.id} livrable={livrable} />
        ))}
      </div>
    </div>
  );
};

export default LivrablesMaitre;
