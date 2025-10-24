// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import api from "../../../api/axios";
// import { CloudUpload, FileText, X } from "lucide-react";

// const MesLivrablesApprenant = () => {
//   const [livrables, setLivrables] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterStatut, setFilterStatut] = useState("Tous");
//   const [showModal, setShowModal] = useState(false);

//   // Charger les livrables
//   useEffect(() => {
//     const fetchLivrables = async () => {
//       try {
//         const res = await api.get("/mes_livrables");
//         setLivrables(res.data.livrables || []);
//       } catch (err) {
//         console.error("❌ Erreur de chargement :", err);
//       }
//     };
//     fetchLivrables();
//   }, []);

//   // Statistiques
//   const stats = useMemo(() => {
//     const total = livrables.length;
//     const approuves = livrables.filter(l => l.statut === "approuve").length;
//     const enRevision = livrables.filter(l => l.statut === "en_revision").length;
//     const rejetes = livrables.filter(l => l.statut === "rejete").length;
//     const enAttente = livrables.filter(l => l.statut === "en_attente").length;
//     const enRetard = livrables.filter(l => l.statut === "en_retard").length;
//     return { total, approuves, enRevision, rejetes, enAttente, enRetard };
//   }, [livrables]);

//   // Filtrage dynamique
//   const livrablesFiltres = livrables.filter((l) => {
//     const matchesSearch = l.titre.toLowerCase().includes(search.toLowerCase());
//     const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
//     return matchesSearch && matchesStatut;
//   });

//   // Soumission du livrable
//   const handleSubmitLivrable = async (formData) => {
//     try {
//       const res = await api.post("/livrables_apprenant", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setLivrables([res.data.livrable || res.data, ...livrables]);
//       setShowModal(false);
//       alert("✅ Livrable soumis avec succès !");
//     } catch (err) {
//       console.error("❌ Erreur lors de la soumission :", err);
//       alert("Erreur lors de la soumission du livrable.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">📘 Mes Livrables</h1>
//         <button
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
//           onClick={() => setShowModal(true)}
//         >
//           <CloudUpload size={20} /> Soumettre un livrable
//         </button>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
//         {Object.entries(stats).map(([key, value]) => (
//           <StatCard key={key} label={key} value={value} />
//         ))}
//       </div>

//       {/* Filtres */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Rechercher un livrable..."
//           className="flex-1 p-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select
//           className="p-2 border rounded-lg"
//           value={filterStatut}
//           onChange={(e) => setFilterStatut(e.target.value)}
//         >
//           <option>Tous</option>
//           <option>approuve</option>
//           <option>en_revision</option>
//           <option>rejete</option>
//           <option>en_attente</option>
//           <option>en_retard</option>
//         </select>
//       </div>

//       {/* Liste des livrables */}
//       <div className="space-y-4">
//         {livrablesFiltres.length > 0 ? (
//           livrablesFiltres.map((l) => (
//             <motion.div
//               key={l.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
//             >
//               <h2 className="font-semibold text-lg text-gray-800">{l.titre}</h2>
//               <p className="text-gray-600">{l.description}</p>

//               <div className="mt-3 flex flex-wrap items-center justify-between text-sm">
//                 <span className={`font-medium ${getStatutColor(l.statut)}`}>
//                   Statut : {l.statut}
//                 </span>
//                 {l.fichier && (
//                   <a
//                     href={`http://127.0.0.1:8000/storage/${l.fichier}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline flex items-center gap-1"
//                   >
//                     <FileText size={16} /> Télécharger
//                   </a>
//                 )}
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 py-6">
//             Aucun livrable trouvé 😕
//           </p>
//         )}
//       </div>

//       {/* Modal de soumission */}
//       <NouveauLivrableModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleSubmitLivrable}
//       />
//     </div>
//   );
// };

// // Carte statistique
// const StatCard = ({ label, value }) => {
//   const colors = {
//     total: "text-blue-600",
//     approuves: "text-green-600",
//     enRevision: "text-yellow-600",
//     rejetes: "text-red-600",
//     enAttente: "text-orange-500",
//     enRetard: "text-purple-600",
//   };
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="bg-white rounded-lg p-4 text-center shadow"
//     >
//       <div className={`text-2xl font-bold ${colors[label] || "text-gray-800"}`}>
//         {value}
//       </div>
//       <div className="capitalize text-gray-500 text-sm">{label}</div>
//     </motion.div>
//   );
// };

// // Fonction couleur de statut
// const getStatutColor = (statut) => {
//   switch (statut) {
//     case "approuve":
//       return "text-green-600";
//     case "rejete":
//       return "text-red-600";
//     case "en_attente":
//       return "text-yellow-600";
//     case "en_revision":
//       return "text-blue-600";
//     case "en_retard":
//       return "text-orange-600";
//     default:
//       return "text-gray-600";
//   }
// };

// // Modal de soumission
// const NouveauLivrableModal = ({ show, onClose, onSubmit }) => {
//   const [titre, setTitre] = useState("");
//   const [description, setDescription] = useState("");
//   const [tacheId, setTacheId] = useState("");
//   const [fichiers, setFichiers] = useState([]);

//   if (!show) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("titre", titre);
//     formData.append("description", description);
//     formData.append("tache_id", tacheId);
//     fichiers.forEach((file) => formData.append("fichiers[]", file));
//     onSubmit(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-white rounded-xl shadow-lg w-96 p-6"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Soumettre un livrable</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-red-500">
//             <X size={20} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Titre"
//             className="w-full border p-2 mb-3 rounded"
//             value={titre}
//             onChange={(e) => setTitre(e.target.value)}
//             required
//           />
//           <textarea
//             placeholder="Description"
//             className="w-full border p-2 mb-3 rounded"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//           <input
//             type="number"
//             placeholder="ID de la tâche"
//             className="w-full border p-2 mb-3 rounded"
//             value={tacheId}
//             onChange={(e) => setTacheId(e.target.value)}
//             required
//           />
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setFichiers(Array.from(e.target.files))}
//             className="w-full mb-3"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Envoyer le livrable
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default MesLivrablesApprenant;












import React, { useEffect, useState } from "react";
// import api from "../api/axios";
import api from "../../../api/axios";

const LivrablesApprenant = () => {
  const [livrables, setLivrables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tache_id: "",
    titre: "",
    description: "",
    fichier: null,
  });

  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/mes_livrables", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLivrables(res.data.livrables);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchLivrables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("tache_id", form.tache_id);
      formData.append("titre", form.titre);
      formData.append("description", form.description);
      if (form.fichier) formData.append("fichier", form.fichier);

      await api.post("/apprenant/livrables", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Livrable soumis avec succès !");
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      console.error("Erreur de soumission :", err);
      alert("❌ Erreur lors de la soumission !");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🧑‍💻 Mes Livrables</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
      >
        {showForm ? "Fermer le formulaire" : "Soumettre un livrable"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow-md mb-6"
        >
          <div className="mb-2">
            <label className="block text-sm font-semibold">Tâche ID :</label>
            <input
              type="number"
              value={form.tache_id}
              onChange={(e) =>
                setForm({ ...form, tache_id: e.target.value })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Titre :</label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Description :</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Fichier :</label>
            <input
              type="file"
              onChange={(e) =>
                setForm({ ...form, fichier: e.target.files[0] })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-700"
          >
            Envoyer
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {livrables.map((livrable) => (
          <div
            key={livrable.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
          >
            <h2 className="font-bold text-lg">{livrable.titre}</h2>
            <p className="text-gray-600">{livrable.description}</p>
            {livrable.fichier_url && (
              <a
                href={livrable.fichier_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Télécharger / Voir fichier
              </a>
            )}
            <p>
              <strong>Statut :</strong> {livrable.statut}
            </p>
            {livrable.note && (
              <p>
                <strong>Note :</strong> {livrable.note}/20
              </p>
            )}
            {livrable.commentaire && (
              <p className="italic text-gray-700">
                💬 Commentaire : {livrable.commentaire}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivrablesApprenant;
