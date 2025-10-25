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
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

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
      setForm({ tache_id: "", titre: "", description: "", fichier: null });
      
      const res = await api.get("/mes_livrables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivrables(res.data.livrables);
    } catch (err) {
      console.error("Erreur de soumission :", err);
      alert("❌ Erreur lors de la soumission !");
    }
  };

  const stats = {
    total: livrables.length,
    enAttente: livrables.filter(l => l.statut === "en_attente").length,
    approuves: livrables.filter(l => l.statut === "approuve").length,
    rejetes: livrables.filter(l => l.statut === "rejete").length,
  };

  const getStatutBadge = (statut) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approuve: "bg-green-100 text-green-800 border-green-300",
      rejete: "bg-red-100 text-red-800 border-red-300",
      en_revision: "bg-blue-100 text-blue-800 border-blue-300",
    };
    const labels = {
      en_attente: "En attente",
      approuve: "Approuvé",
      rejete: "Rejeté",
      en_revision: "En révision",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[statut] || "bg-gray-100 text-gray-800"}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const livrablesFiltres = livrables.filter(l => {
    const matchStatut = filterStatut === "Tous" || l.statut === filterStatut;
    const matchSearch = l.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Livrables</h1>
              <p className="text-gray-600 mt-1">Gérez et suivez vos soumissions</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-dégradé text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau livrable
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            color="blue"
          />
          <StatCard
            title="En attente"
            value={stats.enAttente}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="yellow"
          />
          <StatCard
            title="Approuvés"
            value={stats.approuves}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="green"
          />
          <StatCard
            title="Rejetés"
            value={stats.rejetes}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="red"
          />
        </div>

        {/* Formulaire Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Soumettre un livrable</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID de la tâche
                  </label>
                  <input
                    type="number"
                    value={form.tache_id}
                    onChange={(e) => setForm({ ...form, tache_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre du livrable
                  </label>
                  <input
                    type="text"
                    value={form.titre}
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: Rapport de stage"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Décrivez votre livrable..."
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fichier joint
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setForm({ ...form, fichier: e.target.files[0] })}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        {form.fichier ? form.fichier.name : "Cliquez pour sélectionner un fichier"}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Soumettre
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un livrable..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>Tous</option>
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvé</option>
              <option value="rejete">Rejeté</option>
              <option value="en_revision">En révision</option>
            </select>
          </div>
        </div>

        {/* Liste des livrables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {livrablesFiltres.length > 0 ? (
            livrablesFiltres.map((livrable) => (
              <div
                key={livrable.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{livrable.titre}</h3>
                    {getStatutBadge(livrable.statut)}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{livrable.description}</p>
                  
                  {livrable.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="font-bold text-blue-900 text-lg">{livrable.note}/20</span>
                      </div>
                    </div>
                  )}

                  {livrable.commentaire && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">
                        <span className="font-semibold not-italic">Commentaire : </span>
                        {livrable.commentaire}
                      </p>
                    </div>
                  )}

                  {livrable.fichier_url && (
                    <a
                      href={livrable.fichier_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Télécharger le fichier
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun livrable trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par soumettre votre premier livrable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default LivrablesApprenant;