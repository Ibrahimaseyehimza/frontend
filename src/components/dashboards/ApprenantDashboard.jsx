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















// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";

// const DashboardApprenant = () => {
//   const [campagnes, setCampagnes] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [form, setForm] = useState({ adresse_1: "", adresse_2: "" });
//   const [success, setSuccess] = useState("");

//   useEffect(() => {

//       if (!token) return; // ⛔ n’appelle pas l’API sans token

//     const fetchCampagnes = async () => {
//       try {
//         const res = await api.get("/apprenant/campagnes");
//         setCampagnes(res.data.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCampagnes();
//   }, []);

//   const handlePostuler = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/apprenant/postuler", {
//         campagne_id: selected.id,
//         entreprise_id: selected.entreprise_id,
//         adresse_1: form.adresse_1,
//         adresse_2: form.adresse_2,
//       });
//       setSuccess("Candidature envoyée avec succès ✅");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Campagnes disponibles 🎯</h1>

//       {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {campagnes.map((campagne) => (
//           <div key={campagne.id} className="bg-white shadow-lg rounded-xl p-4">
//             <h2 className="font-semibold text-lg">{campagne.titre}</h2>
//             <p className="text-gray-500">{campagne.metier?.nom}</p>
//             <button
//               onClick={() => setSelected(campagne)}
//               className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Postuler
//             </button>
//           </div>
//         ))}
//       </div>

//       {selected && (
//         <div className="mt-6 bg-gray-100 p-4 rounded-xl">
//           <h3 className="text-lg font-bold mb-3">Postuler à {selected.titre}</h3>
//           <form onSubmit={handlePostuler}>
//             <input
//               type="text"
//               placeholder="Adresse 1"
//               className="border p-2 w-full mb-2 rounded"
//               value={form.adresse_1}
//               onChange={(e) => setForm({ ...form, adresse_1: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Adresse 2 (facultatif)"
//               className="border p-2 w-full mb-2 rounded"
//               value={form.adresse_2}
//               onChange={(e) => setForm({ ...form, adresse_2: e.target.value })}
//             />
//             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
//               Soumettre la demande
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardApprenant;








import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../AuthContext";

const ApprenantDashboard = () => {
  const { token, user } = useAuth(); // ✅ Récupère le token et le user depuis le contexte
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Appel API pour charger les campagnes
  useEffect(() => {
    if (!token) {
      console.warn("⏳ En attente du token...");
      return; // Ne rien faire tant qu’on n’a pas le token
    }

    const fetchCampagnes = async () => {
      try {
        console.log("📡 Chargement des campagnes pour :", user?.email);

        const response = await api.get("/apprenant/campagnes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCampagnes(response.data.data);
      } catch (error) {
        console.error("❌ Erreur chargement campagnes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampagnes();
  }, [token, user]);

  if (loading) {
    return <p className="text-center mt-10">Chargement des campagnes...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue, {user?.prenom || user?.nom}
      </h1>

      <h2 className="text-xl font-semibold mb-3 text-blue-700">
        Campagnes disponibles
      </h2>

      {campagnes.length === 0 ? (
        <p>Aucune campagne disponible pour ton métier.</p>
      ) : (
        <ul className="space-y-4">
          {campagnes.map((campagne) => (
            <li
              key={campagne.id}
              className="border rounded-lg p-4 shadow-md hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {campagne.titre}
              </h3>
              <p>{campagne.description}</p>
              <p className="text-sm text-gray-500">
                📅 Du {campagne.date_debut} au {campagne.date_fin}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprenantDashboard;
