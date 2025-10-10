import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const CampagneList = () => {
  const [campagnes, setCampagnes] = useState([]);

  useEffect(() => {
    const fetchCampagnes = async () => {
      const res = await api.get("/campagnes");
      setCampagnes(res.data.data || []);
    };
    fetchCampagnes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Campagnes de Stage</h2>
      {campagnes.length === 0 ? (
        <p>Aucune campagne trouvée.</p>
      ) : (
        <ul className="space-y-2">
          {campagnes.map((c) => (
            <li key={c.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">{c.titre}</h3>
              <p>{c.description}</p>
              <p>
                <strong>Entreprises :</strong>{" "}
                {c.entreprises.map((e) => e.nom).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampagneList;
