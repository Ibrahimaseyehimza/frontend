

// import React, { useState, useEffect } from "react";
// import api from "../../../api/axios";

// const LivrablesMaitre = () => {
//   const [livrables, setLivrables] = useState([]);
//   const [selected, setSelected] = useState(null); // livrable sélectionné pour notation
//   const [note, setNote] = useState("");
//   const [commentaire, setCommentaire] = useState("");
//   const [statut, setStatut] = useState("en_attente");

//   useEffect(() => {
//     fetchLivrables();
//   }, []);

//   // 🔹 Récupérer uniquement les livrables des apprenants du maître connecté
//   const fetchLivrables = async () => {
//     try {
//       const res = await api.get("/maitre-stage/livrables"); // route qui renvoie les livrables filtrés côté backend
//       setLivrables(res.data.livrables);
//     } catch (error) {
//       console.error("Erreur de récupération des livrables:", error);
//     }
//   };

//   // 🔹 Noter / commenter / changer le statut d’un livrable
//   const handleSubmit = async (id) => {
//     try {
//       await api.put(`/maitre-stage/livrables/${id}`, {
//         note,
//         commentaire,
//         statut,
//       });
//       alert("✅ Livrable mis à jour !");
//       fetchLivrables(); // recharger la liste
//       setSelected(null); // fermer le formulaire
//       setNote("");
//       setCommentaire("");
//       setStatut("en_attente");
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour :", error);
//       alert("❌ Erreur lors de la mise à jour.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         Livrables des Apprenants
//       </h1>

//       {livrables.map((livrable) => (
//         <div key={livrable.id} className="border rounded-lg p-4 mb-4 bg-white shadow">
//           <h2 className="font-semibold text-lg">{livrable.titre}</h2>
//           <p className="text-sm text-gray-600">Apprenant : {livrable.apprenant?.name}</p>
//           <p className="mt-2">{livrable.description}</p>
//           {livrable.fichier && (
//             <a
//               href={`http://localhost:8000/storage/${livrable.fichier}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 underline mt-2 block"
//             >
//               📎 Voir le fichier
//             </a>
//           )}
//           <p className="mt-2">
//             Statut :{" "}
//             <span
//               className={`font-semibold ${
//                 livrable.statut === "approuve"
//                   ? "text-green-600"
//                   : livrable.statut === "rejete"
//                   ? "text-red-600"
//                   : "text-yellow-600"
//               }`}
//             >
//               {livrable.statut}
//             </span>
//           </p>

//           <button
//             onClick={() => {
//               setSelected(livrable);
//               setNote(livrable.note || "");
//               setCommentaire(livrable.commentaire || "");
//               setStatut(livrable.statut);
//             }}
//             className="mt-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Noter / Commenter
//           </button>

//           {selected?.id === livrable.id && (
//             <div className="mt-3 border-t pt-3">
//               <input
//                 type="number"
//                 placeholder="Note sur 20"
//                 className="border p-2 w-full mb-2 rounded"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//               <textarea
//                 placeholder="Commentaire"
//                 className="border p-2 w-full mb-2 rounded"
//                 value={commentaire}
//                 onChange={(e) => setCommentaire(e.target.value)}
//               />
//               <select
//                 className="border p-2 w-full mb-2 rounded"
//                 value={statut}
//                 onChange={(e) => setStatut(e.target.value)}
//               >
//                 <option value="en_attente">En attente</option>
//                 <option value="approuve">Approuvé</option>
//                 <option value="rejete">Rejeté</option>
//               </select>

//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => handleSubmit(livrable.id)}
//                   className="px-4 py-2 bg-green-600 text-white rounded"
//                 >
//                   Enregistrer
//                 </button>
//                 <button
//                   onClick={() => setSelected(null)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded"
//                 >
//                   Fermer
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LivrablesMaitre;











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
