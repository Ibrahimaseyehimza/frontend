// // components/dashboards/ApprenantDashboard.jsx
// import React from 'react';
// import { useAuth } from '../../AuthContext';

// const ApprenantDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard Apprenant</h1>
//       <p>Bienvenue, {user?.name}</p>
//       <div>
//         <h2>Vos fonctionnalités :</h2>
//         <ul>
//           <li>Consulter les offres de stage</li>
//           <li>Postuler à un stage</li>
//           <li>Suivre vos candidatures</li>
//           <li>Télécharger vos documents</li>
//         </ul>
//       </div>
//       <button onClick={logout}>Déconnexion</button>
//     </div>
//   );
// };

// export default ApprenantDashboard;















import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const DashboardApprenant = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ adresse_1: "", adresse_2: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCampagnes = async () => {
      try {
        const res = await api.get("/apprenant/campagnes_apprenant");
        setCampagnes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampagnes();
  }, []);

  const handlePostuler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/apprenant/postuler", {
        campagne_id: selected.id,
        entreprise_id: selected.entreprise_id,
        adresse_1: form.adresse_1,
        adresse_2: form.adresse_2,
      });
      setSuccess("Candidature envoyée avec succès ✅");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campagnes disponibles 🎯</h1>

      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campagnes.map((campagne) => (
          <div key={campagne.id} className="bg-white shadow-lg rounded-xl p-4">
            <h2 className="font-semibold text-lg">{campagne.titre}</h2>
            <p className="text-gray-500">{campagne.metier?.nom}</p>
            <button
              onClick={() => setSelected(campagne)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Postuler
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-3">Postuler à {selected.titre}</h3>
          <form onSubmit={handlePostuler}>
            <input
              type="text"
              placeholder="Adresse 1"
              className="border p-2 w-full mb-2 rounded"
              value={form.adresse_1}
              onChange={(e) => setForm({ ...form, adresse_1: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Adresse 2 (facultatif)"
              className="border p-2 w-full mb-2 rounded"
              value={form.adresse_2}
              onChange={(e) => setForm({ ...form, adresse_2: e.target.value })}
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Soumettre la demande
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardApprenant;
