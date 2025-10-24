// import React, { useState, useMemo } from "react";

// // Données simulées
// const mockLivrables = [
//   {
//     id: 1,
//     titre: "Rapport de Stage - Développement Web",
//     description: "Rapport détaillé sur l'expérience de stage en développement web chez Orange Sénégal",
//     etudiant: "Fatou Ndiaye",
//     entreprise: "Orange Sénégal",
//     dateSoumission: "2024-05-25",
//     dateRevision: "2024-05-28",
//     reviseur: "Prof. Amadou Diallo",
//     statut: "Approuvé",
//     note: 17.5,
//     commentaire: "Excellent rapport avec une analyse technique approfondie et une réflexion personnelle de qualité.",
//     tags: ["#rapport", "#stage", "#développement web", "#orange"],
//     telechargements: 12,
//     version: 2,
//     format: "PDF",
//     taille: "2.5 MB"
//   },
//   {
//     id: 2,
//     titre: "Présentation Frontend",
//     description: "Diaporama sur les bonnes pratiques en React",
//     etudiant: "Mamadou Fall",
//     entreprise: "ISEP",
//     dateSoumission: "2024-06-01",
//     dateRevision: null,
//     reviseur: null,
//     statut: "En révision",
//     note: null,
//     commentaire: null,
//     tags: ["#présentation", "#react"],
//     telechargements: 3,
//     version: 1,
//     format: "PPTX",
//     taille: "5 MB"
//   },
//   {
//     id: 3,
//     titre: "Rapport Backend",
//     description: "API RESTful pour la gestion des stages",
//     etudiant: "Aïssatou Diop",
//     entreprise: "ISEP",
//     dateSoumission: "2024-05-20",
//     dateRevision: "2024-05-22",
//     reviseur: "Prof. Amadou Diallo",
//     statut: "Rejeté",
//     note: 8,
//     commentaire: "Manque de tests unitaires et documentation insuffisante.",
//     tags: ["#api", "#backend"],
//     telechargements: 5,
//     version: 1,
//     format: "PDF",
//     taille: "1.2 MB"
//   }
// ];

// const MesLivrables = () => {
//   const [livrables, setLivrables] = useState(mockLivrables);
//   const [search, setSearch] = useState("");
//   const [filterStatut, setFilterStatut] = useState("Tous");
//   const [filterEtudiant, setFilterEtudiant] = useState("Tous");
//   const [showModal, setShowModal] = useState(false);

//   // Formulaire pour nouveau livrable
//   const [newLivrable, setNewLivrable] = useState({
//     titre: "",
//     description: "",
//     etudiant: "",
//     entreprise: "",
//     dateSoumission: "",
//     statut: "En attente",
//     note: null,
//     commentaire: "",
//     tags: [],
//     telechargements: 0,
//     version: 1,
//     format: "",
//     taille: ""
//   });

//   // Calcul des statistiques
//   const stats = useMemo(() => {
//     const total = livrables.length;
//     const approuves = livrables.filter(l => l.statut === "Approuvé").length;
//     const enRevision = livrables.filter(l => l.statut === "En révision").length;
//     const rejetes = livrables.filter(l => l.statut === "Rejeté").length;
//     const enAttente = livrables.filter(l => l.statut === "En attente").length;
//     const enRetard = livrables.filter(l => l.statut === "En retard").length;
//     return { total, approuves, enRevision, rejetes, enAttente, enRetard };
//   }, [livrables]);

//   // Filtrage des livrables
//   const livrablesFiltres = livrables.filter(l => {
//     const matchesSearch = l.titre.toLowerCase().includes(search.toLowerCase()) || l.etudiant.toLowerCase().includes(search.toLowerCase());
//     const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
//     const matchesEtudiant = filterEtudiant === "Tous" || l.etudiant === filterEtudiant;
//     return matchesSearch && matchesStatut && matchesEtudiant;
//   });

//   const handleAddLivrable = () => {
//     const id = livrables.length ? Math.max(...livrables.map(l => l.id)) + 1 : 1;
//     setLivrables([...livrables, { ...newLivrable, id }]);
//     setNewLivrable({
//       titre: "",
//       description: "",
//       etudiant: "",
//       entreprise: "",
//       dateSoumission: "",
//       statut: "En attente",
//       note: null,
//       commentaire: "",
//       tags: [],
//       telechargements: 0,
//       version: 1,
//       format: "",
//       taille: ""
//     });
//     setShowModal(false);
//   };

//   // Liste des étudiants uniques pour filtre
//   const etudiants = Array.from(new Set(livrables.map(l => l.etudiant)));

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Gestion des Livrables</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => setShowModal(true)}
//         >
//           ➕ Nouveau livrable
//         </button>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-6 gap-4 mb-6">
//         <StatCard label="Total" value={stats.total} color="text-blue-600" />
//         <StatCard label="Approuvés" value={stats.approuves} color="text-green-600" />
//         <StatCard label="En révision" value={stats.enRevision} color="text-blue-600" />
//         <StatCard label="Rejetés" value={stats.rejetes} color="text-red-600" />
//         <StatCard label="En attente" value={stats.enAttente} color="text-yellow-600" />
//         <StatCard label="En retard" value={stats.enRetard} color="text-orange-600" />
//       </div>

//       {/* Filtres */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Rechercher par titre ou étudiant..."
//           className="flex-1 p-2 border rounded"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />
//         <select className="p-2 border rounded" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
//           <option>Tous</option>
//           <option>Approuvé</option>
//           <option>En révision</option>
//           <option>Rejeté</option>
//           <option>En attente</option>
//           <option>En retard</option>
//         </select>
//         <select className="p-2 border rounded" value={filterEtudiant} onChange={e => setFilterEtudiant(e.target.value)}>
//           <option value="Tous">Tous les étudiants</option>
//           {etudiants.map((e, i) => (
//             <option key={i} value={e}>{e}</option>
//           ))}
//         </select>
//       </div>

//       {/* Liste des livrables */}
//       <div className="bg-white shadow rounded-xl overflow-hidden">
//         {livrablesFiltres.map(l => (
//           <LivrableCard key={l.id} livrable={l} />
//         ))}
//       </div>

//       {/* Modal pour nouveau livrable */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">Ajouter un nouveau livrable</h2>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="text"
//                 placeholder="Titre"
//                 className="p-2 border rounded"
//                 value={newLivrable.titre}
//                 onChange={e => setNewLivrable({ ...newLivrable, titre: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Description"
//                 className="p-2 border rounded"
//                 value={newLivrable.description}
//                 onChange={e => setNewLivrable({ ...newLivrable, description: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Étudiant"
//                 className="p-2 border rounded"
//                 value={newLivrable.etudiant}
//                 onChange={e => setNewLivrable({ ...newLivrable, etudiant: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Entreprise"
//                 className="p-2 border rounded"
//                 value={newLivrable.entreprise}
//                 onChange={e => setNewLivrable({ ...newLivrable, entreprise: e.target.value })}
//               />
//               <input
//                 type="date"
//                 className="p-2 border rounded"
//                 value={newLivrable.dateSoumission}
//                 onChange={e => setNewLivrable({ ...newLivrable, dateSoumission: e.target.value })}
//               />
//               <select
//                 className="p-2 border rounded"
//                 value={newLivrable.statut}
//                 onChange={e => setNewLivrable({ ...newLivrable, statut: e.target.value })}
//               >
//                 <option>En attente</option>
//                 <option>En révision</option>
//                 <option>Approuvé</option>
//                 <option>Rejeté</option>
//                 <option>En retard</option>
//               </select>
//               <input
//                 type="text"
//                 placeholder="Format (ex: PDF)"
//                 className="p-2 border rounded"
//                 value={newLivrable.format}
//                 onChange={e => setNewLivrable({ ...newLivrable, format: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Taille (ex: 2.5 MB)"
//                 className="p-2 border rounded"
//                 value={newLivrable.taille}
//                 onChange={e => setNewLivrable({ ...newLivrable, taille: e.target.value })}
//               />
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>Annuler</button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAddLivrable}>Ajouter</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ label, value, color }) => (
//   <div className="bg-white shadow p-4 rounded text-center">
//     <div className={`text-xl font-bold ${color}`}>{value}</div>
//     <div className="text-gray-500 text-sm">{label}</div>
//   </div>
// );

// const LivrableCard = ({ livrable }) => (
//   <div className="border-b p-4">
//     <div className="flex justify-between items-center">
//       <h2 className="font-bold text-gray-800">{livrable.titre}</h2>
//       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${livrable.statut === 'Approuvé' ? 'bg-green-100 text-green-700' : livrable.statut === 'Rejeté' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{livrable.statut}</span>
//     </div>
//     <p className="text-gray-600">{livrable.description}</p>
//     <div className="flex gap-4 text-gray-500 text-sm mt-2">
//       <span>👤 {livrable.etudiant}</span>
//       <span>🏢 {livrable.entreprise}</span>
//       <span>📅 {new Date(livrable.dateSoumission).toLocaleDateString()}</span>
//       {livrable.note && <span>⭐ {livrable.note}/20</span>}
//     </div>
//     {livrable.commentaire && <div className="mt-2 p-2 bg-green-50 text-green-700 rounded">💬 {livrable.commentaire}</div>}
//     <div className="flex gap-2 mt-2">
//       <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Télécharger</button>
//       <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Prévisualiser</button>
//       <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Partager</button>
//     </div>
//   </div>
// );

// export default MesLivrables;










// import React, { useState, useMemo } from "react";
// import NouveauLivrableModal from "./NouveauLivrableModal";

// // Données simulées
// const mockLivrables = [
//   {
//     id: 1,
//     titre: "Rapport de Stage - Développement Web",
//     description: "Rapport détaillé sur l'expérience de stage en développement web chez Orange Sénégal",
//     etudiant: "Fatou Ndiaye",
//     entreprise: "Orange Sénégal",
//     dateSoumission: "2024-05-25",
//     statut: "Approuvé",
//     note: 17.5,
//     commentaire: "Excellent rapport avec une analyse technique approfondie et une réflexion personnelle de qualité.",
//     fichier: null
//   },
//   {
//     id: 2,
//     titre: "Présentation Frontend",
//     description: "Diaporama sur les bonnes pratiques en React",
//     etudiant: "Mamadou Fall",
//     entreprise: "ISEP",
//     dateSoumission: "2024-06-01",
//     statut: "En révision",
//     note: null,
//     commentaire: null,
//     fichier: null
//   }
// ];

// const MesLivrables = () => {
//   const [livrables, setLivrables] = useState(mockLivrables);
//   const [search, setSearch] = useState("");
//   const [filterStatut, setFilterStatut] = useState("Tous");
//   const [filterEtudiant, setFilterEtudiant] = useState("Tous");
//   const [showModal, setShowModal] = useState(false);

//   // Statistiques
//   const stats = useMemo(() => {
//     const total = livrables.length;
//     const approuves = livrables.filter(l => l.statut === "Approuvé").length;
//     const enRevision = livrables.filter(l => l.statut === "En révision").length;
//     const rejetes = livrables.filter(l => l.statut === "Rejeté").length;
//     const enAttente = livrables.filter(l => l.statut === "En attente").length;
//     const enRetard = livrables.filter(l => l.statut === "En retard").length;
//     return { total, approuves, enRevision, rejetes, enAttente, enRetard };
//   }, [livrables]);

//   // Liste des étudiants uniques pour filtre
//   const etudiants = Array.from(new Set(livrables.map(l => l.etudiant)));

//   // Filtrage des livrables
//   const livrablesFiltres = livrables.filter(l => {
//     const matchesSearch = l.titre.toLowerCase().includes(search.toLowerCase()) || l.etudiant.toLowerCase().includes(search.toLowerCase());
//     const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
//     const matchesEtudiant = filterEtudiant === "Tous" || l.etudiant === filterEtudiant;
//     return matchesSearch && matchesStatut && matchesEtudiant;
//   });

//   // Soumission d'un nouveau livrable par l'apprenant
//   const handleSubmitLivrable = ({ titre, description, fichier }) => {
//     const id = livrables.length ? Math.max(...livrables.map(l => l.id)) + 1 : 1;
//     const newLivrable = {
//       id,
//       titre,
//       description,
//       etudiant: "Nom de l'apprenant", // à remplacer dynamiquement si authentifié
//       entreprise: "",
//       dateSoumission: new Date().toISOString().split("T")[0],
//       statut: "En attente",
//       note: null,
//       commentaire: null,
//       fichier
//     };
//     setLivrables([newLivrable, ...livrables]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Gestion des Livrables</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => setShowModal(true)}
//         >
//           ➕ Soumettre un livrable
//         </button>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-6 gap-4 mb-6">
//         <StatCard label="Total" value={stats.total} color="text-blue-600" />
//         <StatCard label="Approuvés" value={stats.approuves} color="text-green-600" />
//         <StatCard label="En révision" value={stats.enRevision} color="text-blue-600" />
//         <StatCard label="Rejetés" value={stats.rejetes} color="text-red-600" />
//         <StatCard label="En attente" value={stats.enAttente} color="text-yellow-600" />
//         <StatCard label="En retard" value={stats.enRetard} color="text-orange-600" />
//       </div>

//       {/* Filtres */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Rechercher par titre ou étudiant..."
//           className="flex-1 p-2 border rounded"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select className="p-2 border rounded" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
//           <option>Tous</option>
//           <option>Approuvé</option>
//           <option>En révision</option>
//           <option>Rejeté</option>
//           <option>En attente</option>
//           <option>En retard</option>
//         </select>
//         <select className="p-2 border rounded" value={filterEtudiant} onChange={(e) => setFilterEtudiant(e.target.value)}>
//           <option value="Tous">Tous les étudiants</option>
//           {etudiants.map((e, i) => (
//             <option key={i} value={e}>{e}</option>
//           ))}
//         </select>
//       </div>

//       {/* Liste des livrables */}
//       <div className="bg-white shadow rounded-xl overflow-hidden">
//         {livrablesFiltres.map((l) => (
//           <LivrableCard key={l.id} livrable={l} />
//         ))}
//       </div>

//       {/* Modal soumission livrable */}
//       <NouveauLivrableModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleSubmitLivrable}
//       />
//     </div>
//   );
// };

// const StatCard = ({ label, value, color }) => (
//   <div className="bg-white shadow p-4 rounded text-center">
//     <div className={`text-xl font-bold ${color}`}>{value}</div>
//     <div className="text-gray-500 text-sm">{label}</div>
//   </div>
// );

// const LivrableCard = ({ livrable }) => (
//   <div className="border-b p-4">
//     <div className="flex justify-between items-center">
//       <h2 className="font-bold text-gray-800">{livrable.titre}</h2>
//       <span
//         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//           livrable.statut === "Approuvé"
//             ? "bg-green-100 text-green-700"
//             : livrable.statut === "Rejeté"
//             ? "bg-red-100 text-red-700"
//             : "bg-yellow-100 text-yellow-700"
//         }`}
//       >
//         {livrable.statut}
//       </span>
//     </div>
//     <p className="text-gray-600">{livrable.description}</p>
//     <div className="flex gap-4 text-gray-500 text-sm mt-2">
//       <span>👤 {livrable.etudiant}</span>
//       <span>🏢 {livrable.entreprise}</span>
//       <span>📅 {new Date(livrable.dateSoumission).toLocaleDateString()}</span>
//       {livrable.note !== null && <span>⭐ {livrable.note}/20</span>}
//     </div>
//     {livrable.commentaire && (
//       <div className="mt-2 p-2 bg-green-50 text-green-700 rounded">💬 {livrable.commentaire}</div>
//     )}
//     {livrable.fichier && (
//       <div className="mt-2">
//         <a
//           href={URL.createObjectURL(livrable.fichier)}
//           download={livrable.fichier.name}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//         >
//           Télécharger le fichier
//         </a>
//       </div>
//     )}
//   </div>
// );

// export default MesLivrables;







// import React, { useState, useEffect, useMemo } from "react";
// // import API, { setAuthToken } from "../api";
// import api from "../../../api/axios";
// import NouveauLivrableModal from "./NouveauLivrableModal";
// import LivrableCard from "./LivrableCard";

// const MesLivrables = ({ currentUser, userToken }) => {
//   const [livrables, setLivrables] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterStatut, setFilterStatut] = useState("Tous");
//   const [filterEtudiant, setFilterEtudiant] = useState("Tous");
//   const [showModal, setShowModal] = useState(false);

//    useEffect(() => {
//     // 🔹 Charger l'utilisateur connecté
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/user"); // Laravel renvoie l'utilisateur connecté
//         console.log("👤 Utilisateur connecté :", res.data);
//         setCurrentUser(res.data.data);
//       } catch (error) {
//         console.error("❌ Erreur de récupération de l'utilisateur :", error);
//       }
//     };

//     fetchUser();
//   }, []);


//   useEffect(() => {
//     const fetchLivrables = async () => {
//       try {
//         const res = await API.get("/livrables");
//         setLivrables(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchLivrables();
//   }, []);

//   const stats = useMemo(() => {
//     const total = livrables.length;
//     const approuves = livrables.filter(l => l.statut === "approuve").length;
//     const enRevision = livrables.filter(l => l.statut === "en_revision").length;
//     const rejetes = livrables.filter(l => l.statut === "rejete").length;
//     const enAttente = livrables.filter(l => l.statut === "en_attente").length;
//     const enRetard = livrables.filter(l => l.statut === "en_retard").length;
//     return { total, approuves, enRevision, rejetes, enAttente, enRetard };
//   }, [livrables]);

//   const etudiants = Array.from(new Set(livrables.map(l => l.apprenant?.name)));

//   const livrablesFiltres = livrables.filter(l => {
//     const matchesSearch =
//       l.titre.toLowerCase().includes(search.toLowerCase()) ||
//       l.apprenant?.name.toLowerCase().includes(search.toLowerCase());
//     const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
//     const matchesEtudiant = filterEtudiant === "Tous" || l.apprenant?.name === filterEtudiant;
//     return matchesSearch && matchesStatut && matchesEtudiant;
//   });

//   const handleSubmitLivrable = async ({ titre, description, fichier, tache_id }) => {
//     try {
//       const formData = new FormData();
//       formData.append("titre", titre);
//       formData.append("description", description);
//       formData.append("tache_id", tache_id);
//       if (fichier) formData.append("fichier", fichier);

//       const res = await API.post("/livrables_apprenant", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setLivrables([res.data, ...livrables]);
//       setShowModal(false);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de la soumission du livrable.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Gestion des Livrables</h1>
//         {/* {currentUser.role === "apprenant" && (
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={() => setShowModal(true)}
//           >
//             ➕ Soumettre un livrable
//           </button>
//         )} */}

//         {currentUser?.role === "apprenant" && (
//         <button
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={() => setShowModal(true)}
//         >
//             ➕ Soumettre un livrable
//         </button>
//         )}

//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-6 gap-4 mb-6">
//         <StatCard label="Total" value={stats.total} color="text-blue-600" />
//         <StatCard label="Approuvés" value={stats.approuves} color="text-green-600" />
//         <StatCard label="En révision" value={stats.enRevision} color="text-blue-600" />
//         <StatCard label="Rejetés" value={stats.rejetes} color="text-red-600" />
//         <StatCard label="En attente" value={stats.enAttente} color="text-yellow-600" />
//         <StatCard label="En retard" value={stats.enRetard} color="text-orange-600" />
//       </div>

//       {/* Filtres */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Rechercher par titre ou étudiant..."
//           className="flex-1 p-2 border rounded"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select className="p-2 border rounded" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
//           <option>Tous</option>
//           <option>approuve</option>
//           <option>en_revision</option>
//           <option>rejete</option>
//           <option>en_attente</option>
//           <option>en_retard</option>
//         </select>
//         <select className="p-2 border rounded" value={filterEtudiant} onChange={(e) => setFilterEtudiant(e.target.value)}>
//           <option value="Tous">Tous les étudiants</option>
//           {etudiants.map((e, i) => (
//             <option key={i} value={e}>{e}</option>
//           ))}
//         </select>
//       </div>

//       {/* Liste des livrables */}
//       <div className="bg-white shadow rounded-xl overflow-hidden">
//         {livrablesFiltres.map((l) => (
//           <LivrableCard
//             key={l.id}
//             livrable={l}
//             userRole={currentUser.role}
//             onUpdate={(updated) => setLivrables((prev) => prev.map((lv) => lv.id === updated.id ? updated : lv))}
//           />
//         ))}
//       </div>

//       <NouveauLivrableModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleSubmitLivrable}
//         livrables={livrables}
//       />
//     </div>
//   );
// };

// const StatCard = ({ label, value, color }) => (
//   <div className="bg-white shadow p-4 rounded text-center">
//     <div className={`text-xl font-bold ${color}`}>{value}</div>
//     <div className="text-gray-500 text-sm">{label}</div>
//   </div>
// );

// export default MesLivrables;
// //   );             


















import React, { useState, useEffect, useMemo } from "react";
import api from "../../../api/axios";
import NouveauLivrableModal from "./NouveauLivrableModal";
import LivrableCard from "./LivrableCard";

const MesLivrables = ({ currentUser, userToken }) => {
  const [livrables, setLivrables] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterEtudiant, setFilterEtudiant] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(currentUser || null);

  // ✅ Charger l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/v1/apprenant/me", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log("👤 Utilisateur connecté :", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    if (!currentUser) {
      fetchUser();
    }
  }, [userToken, currentUser]);

  // ✅ Récupération des livrables
  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const res = await api.get("/v1/livrables_apprenant", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setLivrables(res.data);
      } catch (err) {
        console.error("❌ Erreur de récupération des livrables :", err);
      }
    };

    fetchLivrables();
  }, [userToken]);

  // ✅ Statistiques
  const stats = useMemo(() => {
    const total = livrables.length;
    const approuves = livrables.filter((l) => l.statut === "approuve").length;
    const enRevision = livrables.filter((l) => l.statut === "en_revision").length;
    const rejetes = livrables.filter((l) => l.statut === "rejete").length;
    const enAttente = livrables.filter((l) => l.statut === "en_attente").length;
    const enRetard = livrables.filter((l) => l.statut === "en_retard").length;
    return { total, approuves, enRevision, rejetes, enAttente, enRetard };
  }, [livrables]);

  // ✅ Filtres
  const etudiants = Array.from(new Set(livrables.map((l) => l.apprenant?.name)));

  const livrablesFiltres = livrables.filter((l) => {
    const matchesSearch =
      l.titre?.toLowerCase().includes(search.toLowerCase()) ||
      l.apprenant?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
    const matchesEtudiant = filterEtudiant === "Tous" || l.apprenant?.name === filterEtudiant;
    return matchesSearch && matchesStatut && matchesEtudiant;
  });

  // ✅ Soumission d’un nouveau livrable
  const handleSubmitLivrable = async ({ titre, description, fichier, tache_id }) => {
    try {
      const formData = new FormData();
      formData.append("titre", titre);
      formData.append("description", description);
      formData.append("tache_id", tache_id);
      if (fichier) formData.append("fichier", fichier);

      const res = await api.post("/v1/livrables_apprenant", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLivrables([res.data, ...livrables]);
      setShowModal(false);
    } catch (err) {
      console.error("❌ Erreur lors de la soumission du livrable :", err);
      alert("Erreur lors de la soumission du livrable.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Livrables</h1>

        {user?.role === "apprenant" && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            ➕ Soumettre un livrable
          </button>
        )}
      </div>

      {/* ✅ Statistiques */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} color="text-blue-600" />
        <StatCard label="Approuvés" value={stats.approuves} color="text-green-600" />
        <StatCard label="En révision" value={stats.enRevision} color="text-blue-600" />
        <StatCard label="Rejetés" value={stats.rejetes} color="text-red-600" />
        <StatCard label="En attente" value={stats.enAttente} color="text-yellow-600" />
        <StatCard label="En retard" value={stats.enRetard} color="text-orange-600" />
      </div>

      {/* ✅ Filtres */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre ou étudiant..."
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option>Tous</option>
          <option>approuve</option>
          <option>en_revision</option>
          <option>rejete</option>
          <option>en_attente</option>
          <option>en_retard</option>
        </select>
        <select
          className="p-2 border rounded"
          value={filterEtudiant}
          onChange={(e) => setFilterEtudiant(e.target.value)}
        >
          <option value="Tous">Tous les étudiants</option>
          {etudiants.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Liste des livrables */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {livrablesFiltres.map((l) => (
          <LivrableCard
            key={l.id}
            livrable={l}
            userRole={user?.role}
            onUpdate={(updated) =>
              setLivrables((prev) =>
                prev.map((lv) => (lv.id === updated.id ? updated : lv))
              )
            }
          />
        ))}
      </div>

      {/* ✅ Modal d'ajout */}
      <NouveauLivrableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitLivrable}
        livrables={livrables}
      />
    </div>
  );
};

// ✅ Carte de statistique
const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow p-4 rounded text-center">
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-500 text-sm">{label}</div>
  </div>
);

export default MesLivrables;
