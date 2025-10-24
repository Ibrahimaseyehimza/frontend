// import React, { useState } from "react";

// const NouveauLivrableModal = ({ show, onClose, onSubmit }) => {
//   const [titre, setTitre] = useState("");
//   const [description, setDescription] = useState("");
//   const [fichier, setFichier] = useState(null);
//   const [preview, setPreview] = useState(null);

//   if (!show) return null;

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFichier(file);
//       if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = () => setPreview(reader.result);
//         reader.readAsDataURL(file);
//       } else {
//         setPreview(null);
//       }
//     }
//   };

//   const handleSubmit = () => {
//     if (!titre || !description || !fichier) {
//       alert("Veuillez remplir tous les champs et ajouter un fichier.");
//       return;
//     }
//     onSubmit({ titre, description, fichier });
//     // Reset form
//     setTitre("");
//     setDescription("");
//     setFichier(null);
//     setPreview(null);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Soumettre un nouveau livrable</h2>
//         <div className="flex flex-col gap-3">
//           <input
//             type="text"
//             placeholder="Titre de la tâche"
//             className="p-2 border rounded"
//             value={titre}
//             onChange={(e) => setTitre(e.target.value)}
//           />
//           <textarea
//             placeholder="Description de votre tâche"
//             className="p-2 border rounded"
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <input
//             type="file"
//             accept=".pdf,.docx,.pptx,image/*"
//             onChange={handleFileChange}
//             className="p-2 border rounded"
//           />
//           {preview && (
//             <img src={preview} alt="Preview" className="mt-2 max-h-48 border rounded" />
//           )}
//         </div>
//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             onClick={onClose}
//           >
//             Annuler
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={handleSubmit}
//           >
//             Soumettre
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NouveauLivrableModal;










import React, { useState } from "react";

const NouveauLivrableModal = ({ show, onClose, onSubmit, livrables }) => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);
  const [tacheId, setTacheId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ titre, description, fichier, tache_id: tacheId });
  };

  if (!show) return null;

  // Liste des tâches uniques depuis les livrables pour que l'apprenant choisisse
  const taches = Array.from(new Set(livrables.map(l => l.tache))).filter(Boolean);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">Soumettre un livrable</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Titre du livrable"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />
          <input type="file" onChange={(e) => setFichier(e.target.files[0])} />
          <select
            value={tacheId}
            onChange={(e) => setTacheId(e.target.value)}
            required
            className="p-2 border rounded"
          >
            <option value="">Sélectionner la tâche</option>
            {taches.map((t) => (
              <option key={t.id} value={t.id}>{t.titre}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Soumettre</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouveauLivrableModal;




