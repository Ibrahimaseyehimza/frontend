import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const RapportsList = () => {
  const [rapports, setRapports] = useState([]);

  useEffect(() => {
    api.get("/rapports")
      .then((res) => setRapports(res.data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  return (
    <div>
      <h2>Liste des rapports</h2>
      <ul>
        {rapports.map((r) => (
          <li key={r.id}>{r.titre}</li>
        ))}
      </ul>
    </div>
  );
};

export default RapportsList;  // ✅ export par défaut ici
