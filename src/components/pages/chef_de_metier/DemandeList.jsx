// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";
// import { FiUsers, FiBriefcase, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
// import { BsBuilding, BsSearch } from "react-icons/bs";

// const DemandeList = () => {
//   const [stats, setStats] = useState({});
//   const [demandes, setDemandes] = useState([]);
//   const [entreprises, setEntreprises] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchStats();
//     fetchDemandes();
//     fetchEntreprises();
//   }, []);

//   const fetchStats = async () => {
//     const res = await api.get("/chef-metier/statistiques");
//     setStats(res.data.data || {});
//   };

//   const fetchDemandes = async () => {
//     const res = await api.get("/chef-metier/demandes");
//     setDemandes(res.data.data || []);
//   };

//   const fetchEntreprises = async () => {
//     const res = await api.get("/chef-metier/entreprises-disponibles");
//     setEntreprises(res.data.data || []);
//   };

//   const handleAffecter = async (demandeId, entrepriseId) => {
//     if (!window.confirm("Confirmer l'affectation de cet apprenant ?")) return;

//     await api.put(`/chef-metier/demandes/${demandeId}/affecter`, {
//       entreprise_id: entrepriseId,
//     });

//     fetchDemandes();
//     alert("✅ Apprenant affecté avec succès !");
//   };

//   const filteredDemandes = demandes.filter(
//     (d) =>
//       d.etudiant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.campagne?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard Chef de Métier</h1>

//       {/* === Statistiques globales === */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white shadow p-6 rounded-xl text-center">
//           <FiUsers className="mx-auto text-blue-500 mb-2" size={28} />
//           <h3 className="text-2xl font-bold">{stats.totalApprenants || 0}</h3>
//           <p className="text-gray-500 text-sm">Apprenants</p>
//         </div>
//         <div className="bg-white shadow p-6 rounded-xl text-center">
//           <FiBriefcase className="mx-auto text-green-500 mb-2" size={28} />
//           <h3 className="text-2xl font-bold">{stats.totalDemandes || 0}</h3>
//           <p className="text-gray-500 text-sm">Demandes reçues</p>
//         </div>
//         <div className="bg-white shadow p-6 rounded-xl text-center">
//           <FiCheckCircle className="mx-auto text-purple-500 mb-2" size={28} />
//           <h3 className="text-2xl font-bold">{stats.stagesValides || 0}</h3>
//           <p className="text-gray-500 text-sm">Stages validés</p>
//         </div>
//         <div className="bg-white shadow p-6 rounded-xl text-center">
//           <FiAlertCircle className="mx-auto text-red-500 mb-2" size={28} />
//           <h3 className="text-2xl font-bold">{stats.entreprisesSaturees || 0}</h3>
//           <p className="text-gray-500 text-sm">Entreprises pleines</p>
//         </div>
//       </div>

//       {/* === Barre de recherche === */}
//       <div className="bg-white p-4 shadow rounded-xl mb-6 flex items-center gap-3">
//         <BsSearch size={20} className="text-gray-500" />
//         <input
//           type="text"
//           placeholder="Rechercher un apprenant ou une campagne..."
//           className="w-full p-2 outline-none"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* === Liste des demandes === */}
//       <div className="bg-white shadow rounded-xl p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           📋 Liste des demandes de stage
//         </h2>

//         {filteredDemandes.length === 0 ? (
//           <p className="text-gray-500 text-center py-6">
//             Aucune demande de stage disponible.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b bg-gray-100">
//                   <th className="py-3 px-4">Apprenant</th>
//                   <th className="py-3 px-4">Campagne</th>
//                   <th className="py-3 px-4">Entreprise choisie</th>
//                   <th className="py-3 px-4">Statut</th>
//                   <th className="py-3 px-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredDemandes.map((demande) => (
//                   <tr key={demande.id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       {demande.etudiant?.nom} {demande.etudiant?.prenom}
//                     </td>
//                     <td className="py-3 px-4">{demande.campagne?.titre}</td>
//                     <td className="py-3 px-4">{demande.entreprise?.nom}</td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-3 py-1 text-xs rounded-full ${
//                           demande.statut === "en_attente"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : demande.statut === "valide"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {demande.statut}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <select
//                         onChange={(e) =>
//                           handleAffecter(demande.id, e.target.value)
//                         }
//                         className="border rounded-lg px-3 py-1 text-sm"
//                       >
//                         <option>-- Affecter à --</option>
//                         {entreprises.map((ent) => (
//                           <option key={ent.id} value={ent.id}>
//                             {ent.nom} ({ent.places_restantes} places)
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DemandeList;







// import React, { useEffect, useState } from "react";
// import { FiUsers, FiBriefcase, FiCheckCircle, FiAlertCircle, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
// import { BsBuilding, BsSearch } from "react-icons/bs";

// // Simuler l'API
// const api = {
//   get: async (url) => {
//     // Simuler les données
//     if (url.includes('statistiques')) {
//       return {
//         data: {
//           data: {
//             totalApprenants: 45,
//             totalDemandes: 28,
//             stagesValides: 15,
//             entreprisesSaturees: 3
//           }
//         }
//       };
//     }
//     if (url.includes('demandes')) {
//       return {
//         data: {
//           data: [
//             {
//               id: 1,
//               etudiant: { nom: "Diallo", prenom: "Amadou", email: "amadou@esp.sn" },
//               campagne: { titre: "Stage Développement Web 2025" },
//               entreprise: { nom: "Orange" },
//               statut: "en_attente",
//               adresse_1: "Dakar, Plateau",
//               created_at: "2025-10-15T10:30:00"
//             },
//             {
//               id: 2,
//               etudiant: { nom: "Ndiaye", prenom: "Fatou", email: "fatou@esp.sn" },
//               campagne: { titre: "Stage Développement Web 2025" },
//               entreprise: { nom: "Sonatel" },
//               statut: "en_attente",
//               adresse_1: "Guédiawaye",
//               created_at: "2025-10-16T14:20:00"
//             },
//             {
//               id: 3,
//               etudiant: { nom: "Sall", prenom: "Moussa", email: "moussa@esp.sn" },
//               campagne: { titre: "Stage Réseaux 2025" },
//               entreprise: { nom: "Free" },
//               statut: "acceptee",
//               adresse_1: "Sacré Coeur",
//               created_at: "2025-10-14T09:15:00"
//             }
//           ]
//         }
//       };
//     }
//     if (url.includes('entreprises-disponibles')) {
//       return {
//         data: {
//           data: [
//             { id: 1, nom: "Orange", places_restantes: 5, capacite_max: 10, places_occupees: 5 },
//             { id: 2, nom: "Sonatel", places_restantes: 2, capacite_max: 8, places_occupees: 6 },
//             { id: 3, nom: "Free", places_restantes: 8, capacite_max: 10, places_occupees: 2 },
//             { id: 4, nom: "Expresso", places_restantes: 0, capacite_max: 5, places_occupees: 5 }
//           ]
//         }
//       };
//     }
//   },
//   post: async (url, data) => {
//     console.log('POST', url, data);
//     return { data: { success: true, message: "Opération réussie" } };
//   }
// };

// const DemandeList = () => {
//   const [stats, setStats] = useState({});
//   const [demandes, setDemandes] = useState([]);
//   const [entreprises, setEntreprises] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatut, setFilterStatut] = useState("all");
//   const [selectedDemande, setSelectedDemande] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState(null); // 'accepter', 'refuser', 'reorienter'
//   const [selectedEntreprise, setSelectedEntreprise] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [statsRes, demandesRes, entreprisesRes] = await Promise.all([
//         api.get("/chef-metier/statistiques"),
//         api.get("/chef-metier/demandes"),
//         api.get("/chef-metier/entreprises-disponibles"),
//       ]);

//       setStats(statsRes.data.data || {});
//       setDemandes(demandesRes.data.data || []);
//       setEntreprises(entreprisesRes.data.data || []);
//     } catch (error) {
//       console.error("Erreur:", error);
//       alert("❌ Erreur lors du chargement des données");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (demande, type) => {
//     setSelectedDemande(demande);
//     setActionType(type);
//     setSelectedEntreprise(type === 'accepter' ? demande.entreprise?.id || "" : "");
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedDemande(null);
//     setActionType(null);
//     setSelectedEntreprise("");
//   };

//   const handleAction = async () => {
//     if (!selectedDemande) return;

//     try {
//       if (actionType === "accepter") {
//         const entrepriseId = selectedEntreprise || selectedDemande.entreprise?.id;
//         if (!entrepriseId) {
//           alert("⚠️ Veuillez sélectionner une entreprise");
//           return;
//         }

//         await api.post(`/chef-metier/demandes/${selectedDemande.id}/accepter`, {
//           entreprise_id: parseInt(entrepriseId),
//         });
//         alert("✅ Étudiant accepté et affecté avec succès !");
//       } else if (actionType === "refuser") {
//         await api.post(`/chef-metier/demandes/${selectedDemande.id}/refuser`);
//         alert("❌ Demande refusée");
//       } else if (actionType === "reorienter") {
//         if (!selectedEntreprise) {
//           alert("⚠️ Veuillez sélectionner une entreprise");
//           return;
//         }

//         await api.post(`/chef-metier/demandes/${selectedDemande.id}/reorienter`, {
//           nouvelle_entreprise_id: parseInt(selectedEntreprise),
//         });
//         alert("🔄 Étudiant réorienté avec succès !");
//       }

//       closeModal();
//       fetchData();
//     } catch (error) {
//       console.error("Erreur:", error);
//       alert("❌ Erreur: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const filteredDemandes = demandes.filter((d) => {
//     const matchSearch =
//       d.etudiant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.etudiant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.campagne?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchStatut = filterStatut === "all" || d.statut === filterStatut;

//     return matchSearch && matchStatut;
//   });

//   const getStatutBadge = (statut) => {
//     const styles = {
//       en_attente: "bg-yellow-100 text-yellow-700",
//       acceptee: "bg-green-100 text-green-700",
//       refusee: "bg-red-100 text-red-700",
//       reorientee: "bg-blue-100 text-blue-700",
//     };
//     const labels = {
//       en_attente: "⏳ En attente",
//       acceptee: "✅ Acceptée",
//       refusee: "❌ Refusée",
//       reorientee: "🔄 Réorientée",
//     };
//     return (
//       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[statut] || ""}`}>
//         {labels[statut] || statut}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">
//           📊 Dashboard Chef de Métier
//         </h1>

//         {/* Statistiques */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
//             <FiUsers className="mx-auto text-blue-500 mb-2" size={32} />
//             <h3 className="text-3xl font-bold text-gray-800">{stats.totalApprenants || 0}</h3>
//             <p className="text-gray-500 text-sm mt-1">Apprenants</p>
//           </div>
//           <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
//             <FiBriefcase className="mx-auto text-green-500 mb-2" size={32} />
//             <h3 className="text-3xl font-bold text-gray-800">{stats.totalDemandes || 0}</h3>
//             <p className="text-gray-500 text-sm mt-1">Demandes reçues</p>
//           </div>
//           <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
//             <FiCheckCircle className="mx-auto text-purple-500 mb-2" size={32} />
//             <h3 className="text-3xl font-bold text-gray-800">{stats.stagesValides || 0}</h3>
//             <p className="text-gray-500 text-sm mt-1">Stages validés</p>
//           </div>
//           <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
//             <FiAlertCircle className="mx-auto text-red-500 mb-2" size={32} />
//             <h3 className="text-3xl font-bold text-gray-800">{stats.entreprisesSaturees || 0}</h3>
//             <p className="text-gray-500 text-sm mt-1">Entreprises pleines</p>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="bg-white p-4 shadow-md rounded-xl mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative">
//               <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Rechercher un apprenant, campagne ou entreprise..."
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <select
//               value={filterStatut}
//               onChange={(e) => setFilterStatut(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">Tous les statuts</option>
//               <option value="en_attente">En attente</option>
//               <option value="acceptee">Acceptée</option>
//               <option value="refusee">Refusée</option>
//               <option value="reorientee">Réorientée</option>
//             </select>
//           </div>
//         </div>

//         {/* Liste des demandes */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             📋 Liste des demandes de stage ({filteredDemandes.length})
//           </h2>

//           {filteredDemandes.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">📭</div>
//               <p className="text-gray-500 text-lg">Aucune demande trouvée</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredDemandes.map((demande) => (
//                 <div
//                   key={demande.id}
//                   className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     {/* Infos étudiant */}
//                     <div className="flex-1">
//                       <div className="flex items-start gap-3">
//                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-blue-600 font-bold text-lg">
//                             {demande.etudiant?.nom?.charAt(0)}{demande.etudiant?.prenom?.charAt(0)}
//                           </span>
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-800 text-lg">
//                             {demande.etudiant?.nom} {demande.etudiant?.prenom}
//                           </h3>
//                           <p className="text-sm text-gray-500">{demande.etudiant?.email}</p>
//                           <div className="mt-2 space-y-1">
//                             <p className="text-sm text-gray-600">
//                               <strong>Campagne:</strong> {demande.campagne?.titre}
//                             </p>
//                             <p className="text-sm text-gray-600 flex items-center gap-1">
//                               <BsBuilding size={14} />
//                               <strong>Entreprise souhaitée:</strong> {demande.entreprise?.nom}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               <strong>Adresse:</strong> {demande.adresse_1}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Statut et Actions */}
//                     <div className="flex flex-col items-end gap-3">
//                       {getStatutBadge(demande.statut)}

//                       {demande.statut === "en_attente" && (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => openModal(demande, "accepter")}
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//                           >
//                             <FiCheck size={16} />
//                             Accepter
//                           </button>
//                           <button
//                             onClick={() => openModal(demande, "reorienter")}
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//                           >
//                             <FiRefreshCw size={16} />
//                             Réorienter
//                           </button>
//                           <button
//                             onClick={() => openModal(demande, "refuser")}
//                             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//                           >
//                             <FiX size={16} />
//                             Refuser
//                           </button>
//                         </div>
//                       )}

//                       {demande.statut === "acceptee" && (
//                         <button
//                           onClick={() => openModal(demande, "reorienter")}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//                         >
//                           <FiRefreshCw size={16} />
//                           Réorienter
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Modal d'action */}
//         {showModal && selectedDemande && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
//               <h3 className="text-xl font-bold mb-4 text-gray-800">
//                 {actionType === "accepter" && "✅ Accepter la demande"}
//                 {actionType === "refuser" && "❌ Refuser la demande"}
//                 {actionType === "reorienter" && "🔄 Réorienter l'étudiant"}
//               </h3>

//               <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-gray-700">
//                   <strong>Étudiant:</strong> {selectedDemande.etudiant?.nom} {selectedDemande.etudiant?.prenom}
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   <strong>Entreprise actuelle:</strong> {selectedDemande.entreprise?.nom}
//                 </p>
//               </div>

//               {(actionType === "accepter" || actionType === "reorienter") && (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     {actionType === "accepter" ? "Confirmer l'entreprise" : "Nouvelle entreprise"}
//                   </label>
//                   <select
//                     value={selectedEntreprise}
//                     onChange={(e) => setSelectedEntreprise(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">-- Sélectionner --</option>
//                     {entreprises
//                       .filter(e => e.places_restantes > 0)
//                       .map((ent) => (
//                         <option key={ent.id} value={ent.id}>
//                           {ent.nom} ({ent.places_restantes} places restantes)
//                         </option>
//                       ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-2">
//                     💡 Seules les entreprises avec des places disponibles sont affichées
//                   </p>
//                 </div>
//               )}

//               {actionType === "refuser" && (
//                 <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
//                   <p className="text-sm text-red-700">
//                     ⚠️ Êtes-vous sûr de vouloir refuser cette demande ? Cette action est irréversible.
//                   </p>
//                 </div>
//               )}

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={closeModal}
//                   className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleAction}
//                   className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
//                     actionType === "accepter"
//                       ? "bg-green-600 hover:bg-green-700"
//                       : actionType === "refuser"
//                       ? "bg-red-600 hover:bg-red-700"
//                       : "bg-blue-600 hover:bg-blue-700"
//                   }`}
//                 >
//                   Confirmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DemandeList;














import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import { BsBuilding, BsSearch } from "react-icons/bs";
// import api from "@/api/axios"; // ✅ utilise ton axios configuré
import api from "../../../api/axios";

const DemandeList = () => {
  const [stats, setStats] = useState({});
  const [demandes, setDemandes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ récupération réelle des données depuis ton backend Laravel
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, demandesRes, entreprisesRes] = await Promise.all([
        api.get("/chef-metier/statistiques"),
        api.get("/chef-metier/demandes"),
        api.get("/chef-metier/entreprises-disponibles"),
      ]);

      setStats(statsRes.data.data || {});
      setDemandes(demandesRes.data.data || []);
      setEntreprises(entreprisesRes.data.data || []);
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (demande, type) => {
    setSelectedDemande(demande);
    setActionType(type);
    setSelectedEntreprise(
      type === "accepter" ? demande.entreprise?.id || "" : ""
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
    setActionType(null);
    setSelectedEntreprise("");
  };

  // ✅ actions reliées à ton backend
  const handleAction = async () => {
    if (!selectedDemande) return;

    try {
      if (actionType === "accepter") {
        const entrepriseId = selectedEntreprise || selectedDemande.entreprise?.id;
        if (!entrepriseId) {
          alert("⚠️ Veuillez sélectionner une entreprise");
          return;
        }

        await api.post(`/chef-metier/demandes/${selectedDemande.id}/accepter`, {
          entreprise_id: parseInt(entrepriseId),
        });
        alert("✅ Étudiant accepté et affecté avec succès !");
      } else if (actionType === "refuser") {
        await api.post(`/chef-metier/demandes/${selectedDemande.id}/refuser`);
        alert("❌ Demande refusée");
      } else if (actionType === "reorienter") {
        if (!selectedEntreprise) {
          alert("⚠️ Veuillez sélectionner une entreprise");
          return;
        }

        await api.post(`/chef-metier/demandes/${selectedDemande.id}/reorienter`, {
          nouvelle_entreprise_id: parseInt(selectedEntreprise),
        });
        alert("🔄 Étudiant réorienté avec succès !");
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredDemandes = demandes.filter((d) => {
    const matchSearch =
      d.etudiant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.etudiant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.campagne?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatut = filterStatut === "all" || d.statut === filterStatut;

    return matchSearch && matchStatut;
  });

  const getStatutBadge = (statut) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-700",
      acceptee: "bg-green-100 text-green-700",
      refusee: "bg-red-100 text-red-700",
      reorientee: "bg-blue-100 text-blue-700",
    };
    const labels = {
      en_attente: "⏳ En attente",
      acceptee: "✅ Acceptée",
      refusee: "❌ Refusée",
      reorientee: "🔄 Réorientée",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[statut] || ""
        }`}
      >
        {labels[statut] || statut}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📊 Dashboard Chef de Métier
        </h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiUsers className="mx-auto text-blue-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalApprenants || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Apprenants</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiBriefcase className="mx-auto text-green-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalDemandes || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Demandes reçues</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiCheckCircle className="mx-auto text-purple-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.stagesValides || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Stages validés</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiAlertCircle className="mx-auto text-red-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.entreprisesSaturees || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Entreprises pleines</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 shadow-md rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <BsSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un apprenant, campagne ou entreprise..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="acceptee">Acceptée</option>
              <option value="refusee">Refusée</option>
              <option value="reorientee">Réorientée</option>
            </select>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Liste des demandes de stage ({filteredDemandes.length})
          </h2>

          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDemandes.map((demande) => (
                <div
                  key={demande.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Infos étudiant */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-lg">
                            {demande.etudiant?.nom?.charAt(0)}
                            {demande.etudiant?.prenom?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {demande.etudiant?.nom} {demande.etudiant?.prenom}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {demande.etudiant?.email}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <strong>Campagne:</strong>{" "}
                              {demande.campagne?.titre}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <BsBuilding size={14} />
                              <strong>Entreprise souhaitée:</strong>{" "}
                              {demande.entreprise?.nom}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Adresse:</strong> {demande.adresse_1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statut et Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {getStatutBadge(demande.statut)}

                      {demande.statut === "en_attente" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(demande, "accepter")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiCheck size={16} />
                            Accepter
                          </button>
                          <button
                            onClick={() => openModal(demande, "reorienter")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiRefreshCw size={16} />
                            Réorienter
                          </button>
                          <button
                            onClick={() => openModal(demande, "refuser")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiX size={16} />
                            Refuser
                          </button>
                        </div>
                      )}

                      {demande.statut === "acceptee" && (
                        <button
                          onClick={() => openModal(demande, "reorienter")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          <FiRefreshCw size={16} />
                          Réorienter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {actionType === "accepter" && "✅ Accepter la demande"}
                {actionType === "refuser" && "❌ Refuser la demande"}
                {actionType === "reorienter" && "🔄 Réorienter l'étudiant"}
              </h3>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Étudiant:</strong>{" "}
                  {selectedDemande.etudiant?.nom}{" "}
                  {selectedDemande.etudiant?.prenom}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Entreprise actuelle:</strong>{" "}
                  {selectedDemande.entreprise?.nom}
                </p>
              </div>

              {(actionType === "accepter" || actionType === "reorienter") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {actionType === "accepter"
                      ? "Confirmer l'entreprise"
                      : "Nouvelle entreprise"}
                  </label>
                  <select
                    value={selectedEntreprise}
                    onChange={(e) => setSelectedEntreprise(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Sélectionner --</option>
                    {entreprises
                      .filter((e) => e.places_restantes > 0)
                      .map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.nom} ({ent.places_restantes} places restantes)
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Seules les entreprises avec des places disponibles sont
                    affichées
                  </p>
                </div>
              )}

              {actionType === "refuser" && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-sm text-red-700">
                    ⚠️ Êtes-vous sûr de vouloir refuser cette demande ?
                    Cette action est irréversible.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAction}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                    actionType === "accepter"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "refuser"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandeList;
