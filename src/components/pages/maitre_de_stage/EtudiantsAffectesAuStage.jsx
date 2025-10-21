// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";

// export default function EtudiantsAffectes() {
//   const [etudiants, setEtudiants] = useState([]);
//   const [entreprise, setEntreprise] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchEtudiants = async () => {
//     try {
//       const res = await api.get("/maitre-stage/etudiants-affectes");
//       console.log("📦 Étudiants récupérés :", res.data);

//       if (res.data.success) {
//         setEtudiants(res.data.etudiants || []);
//         setEntreprise(res.data.entreprise || "");
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors du chargement :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEtudiants();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Chargement des étudiants affectés...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         🎓 Étudiants affectés à l’entreprise {entreprise || ""}
//       </h1>

//       {etudiants.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
//           Aucun étudiant affecté à cette entreprise pour le moment.
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Nom complet
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Email
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Téléphone
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Département
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {etudiants.map((etd) => (
//                 <tr key={etd.id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2 text-gray-800">
//                     {etd.name} {etd.prenom}
//                   </td>
//                   <td className="px-4 py-2 text-gray-600">{etd.email}</td>
//                   <td className="px-4 py-2 text-gray-600">{etd.telephone || "-"}</td>
//                   <td className="px-4 py-2 text-gray-600">
//                     {etd.departement?.nom || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// // export default EtudiantsAffectes;



import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../../../api/axios";

const EtudiantsAfectesAuStage = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entreprise, setEntreprise] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔐 récupère le token du maître
        const response = await axios.get("/maitre-stage/etudiants-affectes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEtudiants(response.data.etudiants);
          setEntreprise(response.data.entreprise);
        } else {
          setError("Erreur de récupération des données");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">Chargement des notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔔 Notifications – Étudiants affectés ({entreprise})
        </h2>

        {etudiants.length === 0 ? (
          <p className="text-gray-600">Aucun étudiant ne vous a encore été affecté.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Nom complet</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Adresse</th>
                  <th className="text-left py-3 px-4">Campagne</th>
                  <th className="text-left py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etudiant, index) => (
                  <tr
                    key={etudiant.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {etudiant.prenom} {etudiant.nom}
                    </td>
                    <td className="py-3 px-4">{etudiant.email}</td>
                    <td className="py-3 px-4">
                      {etudiant.adresse_1}
                      {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                    </td>
                    <td className="py-3 px-4">{etudiant.campagne}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          etudiant.statut === "acceptee"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {etudiant.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtudiantsAfectesAuStage;
