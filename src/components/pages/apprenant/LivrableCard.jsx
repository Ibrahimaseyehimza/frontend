// import React, { useState } from "react";
// import api from "../../../api/axios";

// const LivrableCard = ({ livrable, userRole, onUpdate }) => {
//   const [note, setNote] = useState(livrable.note || "");
//   const [commentaire, setCommentaire] = useState(livrable.commentaire || "");
//   const [statut, setStatut] = useState(livrable.statut);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.put(`/livrables/${livrable.id}`, {
//         note,
//         commentaire,
//         statut,
//       });
//       // Mettre à jour le livrable parent
//       onUpdate(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de la mise à jour du livrable.");
//     }
//   };

//   return (
//     <div className="border-b p-4">
//       <div className="flex justify-between items-center">
//         <h2 className="font-bold text-gray-800">{livrable.titre}</h2>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-semibold ${
//             statut === "approuve"
//               ? "bg-green-100 text-green-700"
//               : statut === "rejete"
//               ? "bg-red-100 text-red-700"
//               : "bg-yellow-100 text-yellow-700"
//           }`}
//         >
//           {statut}
//         </span>
//       </div>

//       <p className="text-gray-600">{livrable.description}</p>

//       <div className="flex gap-4 text-gray-500 text-sm mt-2">
//         <span>👤 {livrable.apprenant?.name}</span>
//         <span>🏢 {livrable.tache?.entreprise?.name || "N/A"}</span>
//         <span>📅 {new Date(livrable.created_at).toLocaleDateString()}</span>
//         {note !== null && <span>⭐ {note}/20</span>}
//       </div>

//       {commentaire && (
//         <div className="mt-2 p-2 bg-green-50 text-green-700 rounded">💬 {commentaire}</div>
//       )}

//       {/* {livrable.fichier && (
//         <div className="mt-2">
//           <a
//             href={`http://localhost:8000/storage/${livrable.fichier}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             Télécharger le fichier
//           </a>
//         </div>
//       )} */}

//       {livrable.fichier_url ? (
//         <div className="mt-4">
//             {livrable.fichier_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
//             <>
//                 <button
//                 onClick={() => setShowPreview(!showPreview)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                 {showPreview ? "Fermer la prévisualisation" : "Voir le détail"}
//                 </button>

//                 {showPreview && (
//                 <div className="mt-3">
//                     <img
//                     src={livrable.fichier_url}
//                     alt="Aperçu du livrable"
//                     className="max-w-full rounded-lg border"
//                     />
//                 </div>
//                 )}
//             </>
//             ) : (
//             <a
//                 href={livrable.fichier_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//                 Télécharger le document
//             </a>
//             )}
//         </div>
//         ) : (
//         <p className="text-gray-500 italic mt-2">Aucun fichier fourni</p>
//         )}


//       {/* Formulaire de notation uniquement pour le maître de stage */}
//       {userRole === "maitre_stage" && (
//         <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-2 border-t pt-2">
//           <div className="flex gap-2">
//             <input
//               type="number"
//               min="0"
//               max="20"
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Note /20"
//               className="p-2 border rounded flex-1"
//             />
//             <select
//               value={statut}
//               onChange={(e) => setStatut(e.target.value)}
//               className="p-2 border rounded"
//             >
//               <option value="en_attente">En attente</option>
//               <option value="approuve">Approuvé</option>
//               <option value="rejete">Rejeté</option>
//             </select>
//           </div>
//           <textarea
//             value={commentaire}
//             onChange={(e) => setCommentaire(e.target.value)}
//             placeholder="Commentaire"
//             className="p-2 border rounded"
//           />
//           <button
//             type="submit"
//             className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Enregistrer
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default LivrableCard;












import React, { useState } from "react";
// import api from "../api/axios";
import api from "../../../api/axios";   

const LivrableCard = ({ livrable }) => {
  const [note, setNote] = useState(livrable.note || "");
  const [commentaire, setCommentaire] = useState(livrable.commentaire || "");
  const [statut, setStatut] = useState(livrable.statut);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/maitre-stage/livrables/${livrable.id}`,
        { note, commentaire, statut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Livrable mis à jour !");
      console.log(res.data);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("❌ Erreur lors de la mise à jour !");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImage = livrable.fichier_url?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-lg">{livrable.titre}</h2>
      <p className="text-sm text-gray-600">{livrable.description}</p>
      <p className="text-sm">
        <strong>Apprenant :</strong> {livrable.apprenant?.name}
      </p>

      {livrable.fichier_url && (
        <div className="mt-2">
          {isImage ? (
            <>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-blue-500 underline"
              >
                {showPreview ? "Masquer la capture" : "Voir la capture"}
              </button>
              {showPreview && (
                <img
                  src={livrable.fichier_url}
                  alt="Capture du livrable"
                  className="mt-2 rounded-lg border w-full"
                />
              )}
            </>
          ) : (
            <a
              href={livrable.fichier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Télécharger le document
            </a>
          )}
        </div>
      )}

      <div className="mt-3">
        <label className="block text-sm font-semibold">Note :</label>
        <input
          type="number"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1 rounded w-full"
          min="0"
          max="20"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-semibold">Commentaire :</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-semibold">Statut :</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="en_attente">En attente</option>
          <option value="approuve">Approuvé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded-xl py-2 mt-3 hover:bg-blue-700"
      >
        {isSubmitting ? "Enregistrement..." : "💾 Enregistrer"}
      </button>
    </div>
  );
};

export default LivrableCard;
