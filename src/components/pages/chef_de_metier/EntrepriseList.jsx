import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
import api from "../../../api/axios";

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const res = await api.get("/entreprises");
      setEntreprises(res.data.data || []);
    };
    fetchEntreprises();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Entreprises du Métier</h2>
      {entreprises.length === 0 ? (
        <p>Aucune entreprise trouvée.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((e) => (
              <tr key={e.id}>
                <td className="p-2 border">{e.nom}</td>
                <td className="p-2 border">{e.email}</td>
                <td className="p-2 border">{e.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EntrepriseList;
