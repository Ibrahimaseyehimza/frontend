<<<<<<< HEAD


// import React, { useState } from "react";

// const GestionTaches = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [formData, setFormData] = useState({
//     titre: "",
//     description: "",
//     apprenant_id: "",
//     priorite: "moyenne",
//     date_echeance: "",
//   });

//   const apprenants = [
//     { id: 1, nom: "Ndaw", prenom: "Rama" },
//     { id: 2, nom: "Diop", prenom: "Moussa" },
//     { id: 3, nom: "Fall", prenom: "Aminata" },
//     { id: 4, nom: "Sow", prenom: "Ibrahima" },
//   ];

//   const [taches, setTaches] = useState([
//     {
//       id: 1,
//       titre: "Développer interface utilisateur",
//       description: "Créer une interface responsive pour le module de gestion des utilisateurs",
//       apprenant: { nom: "Ndaw", prenom: "Rama" },
//       statut: "en_cours",
//       priorite: "terminee",
//       date_echeance: "25/03/2024",
//       date_creation: "15/03/2024",
//     },
//     {
//       id: 2,
//       titre: "Rapport hebdomadaire",
//       description: "Rédiger le rapport d'activités de la semaine",
//       apprenant: { nom: "Fall", prenom: "Aminata" },
//       statut: "en_attente",
//       priorite: "moyenne",
//       date_echeance: "22/03/2024",
//       date_creation: "18/03/2024",
//     },
//   ]);

//   const handleSubmit = () => {
//     if (!formData.titre || !formData.apprenant_id || !formData.date_echeance) {
//       alert("Veuillez remplir tous les champs obligatoires");
//       return;
//     }
    
//     const apprenant = apprenants.find(a => a.id === parseInt(formData.apprenant_id));
//     const nouvelleTache = {
//       id: taches.length + 1,
//       titre: formData.titre,
//       description: formData.description,
//       apprenant: apprenant,
//       statut: "en_attente",
//       priorite: formData.priorite,
//       date_echeance: new Date(formData.date_echeance).toLocaleDateString('fr-FR'),
//       date_creation: new Date().toLocaleDateString('fr-FR'),
//     };

//     setTaches([...taches, nouvelleTache]);
//     setShowModal(false);
//     setFormData({
//       titre: "",
//       description: "",
//       apprenant_id: "",
//       priorite: "moyenne",
//       date_echeance: "",
//     });
//   };

//   const getStatutStyle = (statut) => {
//     switch (statut) {
//       case "en_cours":
//         return { bg: "#fef3c7", color: "#92400e", label: "En attente" };
//       case "terminee":
//         return { bg: "#d1fae5", color: "#065f46", label: "Terminée" };
//       case "en_attente":
//         return { bg: "#dbeafe", color: "#1e40af", label: "En retard" };
//       default:
//         return { bg: "#f3f4f6", color: "#374151", label: statut };
//     }
//   };

//   const getPrioriteStyle = (priorite) => {
//     switch (priorite) {
//       case "terminee":
//         return { bg: "#fee2e2", color: "#991b1b", label: "En retard" };
//       case "moyenne":
//         return { bg: "#fef3c7", color: "#92400e", label: "Moyenne" };
//       case "basse":
//         return { bg: "#dbeafe", color: "#1e40af", label: "Basse" };
//       default:
//         return { bg: "#f3f4f6", color: "#374151", label: priorite };
//     }
//   };

//   const filteredTaches = taches.filter((tache) => {
//     const matchSearch =
//       tache.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tache.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       `${tache.apprenant?.prenom} ${tache.apprenant?.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchStatus = statusFilter === "all" || tache.statut === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   const stats = {
//     total: taches.length,
//     en_attente: taches.filter(t => t.statut === "en_attente").length,
//     en_cours: taches.filter(t => t.statut === "en_cours").length,
//     terminees: taches.filter(t => t.statut === "terminee").length,
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem" }}>
//       <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
//         <div>
//           <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>Gestion des Tâches</h1>
//           <p style={{ color: "#6b7280" }}>Suivez et gérez les tâches assignées aux apprenants</p>
//         </div>
//         <button onClick={() => setShowModal(true)} style={{ background: "#2563eb", color: "white", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", border: "none", fontSize: "1rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)" }}>
//           <span style={{ fontSize: "1.2rem" }}>+</span>
//           Nouvelle tâche
//         </button>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
//         <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//           <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>Total</p>
//           <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginTop: "0.5rem" }}>{stats.total}</p>
//         </div>
//         <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//           <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>En attente</p>
//           <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", marginTop: "0.5rem" }}>{stats.en_attente}</p>
//         </div>
//         <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//           <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>En cours</p>
//           <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", marginTop: "0.5rem" }}>{stats.en_cours}</p>
//         </div>
//         <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//           <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>Terminées</p>
//           <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", marginTop: "0.5rem" }}>{stats.terminees}</p>
//         </div>
//       </div>

//       <div style={{ background: "white", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem" }}>
//           <input type="text" placeholder="🔍 Titre ou description de tâche..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
//             <option value="all">Tous les statuts</option>
//             <option value="en_attente">En attente</option>
//             <option value="en_cours">En cours</option>
//             <option value="terminee">Terminée</option>
//           </select>
//         </div>
//       </div>

//       <div style={{ background: "white", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
//         <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
//           <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937" }}>Liste des tâches ({filteredTaches.length})</h2>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead style={{ background: "#f9fafb" }}>
//               <tr>
//                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Assigné à</th>
//                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>📅 Échéance</th>
//                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>📅 Créée le</th>
//                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Statut</th>
//                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTaches.map((tache) => {
//                 const statutStyle = getStatutStyle(tache.statut);
//                 const prioriteStyle = getPrioriteStyle(tache.priorite);
//                 return (
//                   <tr key={tache.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
//                     <td style={{ padding: "1rem" }}>
//                       <div>
//                         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
//                           <span style={{ fontSize: "1.25rem" }}>🎯</span>
//                           <strong style={{ color: "#1f2937" }}>{tache.titre}</strong>
//                         </div>
//                         <p style={{ fontSize: "0.875rem", color: "#6b7280", marginLeft: "1.75rem" }}>{tache.description}</p>
//                       </div>
//                     </td>
//                     <td style={{ padding: "1rem" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                         <span>👤</span>
//                         <span style={{ fontWeight: "500", color: "#1f2937" }}>{tache.apprenant?.prenom} {tache.apprenant?.nom}</span>
//                       </div>
//                     </td>
//                     <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>{tache.date_echeance}</td>
//                     <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>{tache.date_creation}</td>
//                     <td style={{ padding: "1rem" }}>
//                       <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                         <span style={{ background: statutStyle.bg, color: statutStyle.color, padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600" }}>{statutStyle.label}</span>
//                         <span style={{ background: prioriteStyle.bg, color: prioriteStyle.color, padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600" }}>{prioriteStyle.label}</span>
//                       </div>
//                     </td>
//                     <td style={{ padding: "1rem" }}>
//                       <div style={{ display: "flex", gap: "0.5rem" }}>
//                         <button style={{ padding: "0.5rem 0.75rem", background: "#f3f4f6", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }} title="Voir détails">👁️</button>
//                         <button style={{ padding: "0.5rem 0.75rem", background: "#f3f4f6", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }} title="Modifier">✏️</button>
//                         <button style={{ padding: "0.5rem 0.75rem", background: "#f3f4f6", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }} title="Terminer">✓</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowModal(false)}>
//           <div style={{ background: "white", borderRadius: "1rem", padding: "2rem", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
//               <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>Créer une Nouvelle Tâche</h2>
//               <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
//             </div>

//             <div>
//               <div style={{ marginBottom: "1.5rem" }}>
//                 <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>Détails de la tâche</h3>

//                 <label style={{ display: "block", marginBottom: "1rem" }}>
//                   <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Titre de la tâche *</span>
//                   <div style={{ position: "relative" }}>
//                     <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🎯</span>
//                     <input type="text" placeholder="Ex: Développer l'interface utilisateur" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
//                   </div>
//                 </label>

//                 <label style={{ display: "block", marginBottom: "1rem" }}>
//                   <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Description</span>
//                   <div style={{ position: "relative" }}>
//                     <span style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: "#9ca3af" }}>📄</span>
//                     <textarea placeholder="Description détaillée de la tâche à accomplir..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", resize: "vertical" }} />
//                   </div>
//                 </label>
//               </div>

//               <div style={{ marginBottom: "1.5rem" }}>
//                 <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>Assignation</h3>

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
//                   <label>
//                     <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Assigner à *</span>
//                     <select value={formData.apprenant_id} onChange={(e) => setFormData({ ...formData, apprenant_id: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
//                       <option value="">Sélectionner un apprenant</option>
//                       {apprenants.map((app) => (
//                         <option key={app.id} value={app.id}>{app.prenom} {app.nom}</option>
//                       ))}
//                     </select>
//                   </label>

//                   <label>
//                     <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Priorité</span>
//                     <div style={{ position: "relative" }}>
//                       <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>⚠️</span>
//                       <select value={formData.priorite} onChange={(e) => setFormData({ ...formData, priorite: e.target.value })} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
//                         <option value="basse">Basse</option>
//                         <option value="moyenne">Moyenne</option>
//                         <option value="haute">Haute</option>
//                       </select>
//                     </div>
//                   </label>
//                 </div>

//                 <label>
//                   <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Date d'échéance *</span>
//                   <div style={{ position: "relative" }}>
//                     <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>📅</span>
//                     <input type="date" value={formData.date_echeance} onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
//                   </div>
//                 </label>
//               </div>

//               <div style={{ background: "#fef3c7", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
//                 <span>⚠️</span>
//                 <span style={{ fontSize: "0.875rem", color: "#92400e" }}>Priorité sélectionnée: <strong>{formData.priorite.charAt(0).toUpperCase() + formData.priorite.slice(1)}</strong></span>
//               </div>

//               <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
//                 <button onClick={() => setShowModal(false)} style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "500", cursor: "pointer", color: "#374151" }}>Annuler</button>
//                 <button onClick={handleSubmit} style={{ padding: "0.75rem 1.5rem", background: "#2563eb", border: "none", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "600", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                   <span>💾</span>
//                   Créer la tâche
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionTaches;



















import React, { useState, useEffect } from "react";
import api from "../../../api/axios"; // ⚠️ Assurez-vous que ce chemin est correct

const GestionTaches = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
=======
import React, { useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiUser, FiCalendar, FiEye } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";

const MesStagiaires = () => {
  const { user } = useAuth();
  const [etudiants, setEtudiants] = useState([]);
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
  const [loading, setLoading] = useState(true);
  const [apprenants, setApprenants] = useState([]);
  const [taches, setTaches] = useState([]);
  const [stats, setStats] = useState({ total: 0, en_attente: 0, en_cours: 0, terminees: 0 });
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    apprenant_id: "",
    priorite: "moyenne",
    date_echeance: "",
  });

  useEffect(() => {
<<<<<<< HEAD
    fetchTaches();
    fetchApprenants();
  }, [searchTerm, statusFilter]);

  const fetchTaches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/maitre-stage/taches', {
        params: { search: searchTerm, statut: statusFilter }
      });
      
      if (response.data.success) {
        setTaches(response.data.taches);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement tâches:", error);
      const message = error.response?.data?.message || "Erreur lors du chargement des tâches";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprenants = async () => {
    try {
      const response = await api.get('/maitre-stage/etudiants-affectes');
      
      if (response.data.success) {
        setApprenants(response.data.etudiants);
      }
    } catch (error) {
      console.error("Erreur chargement apprenants:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titre || !formData.apprenant_id || !formData.date_echeance) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const response = await api.post('/maitre-stage/taches', formData);
      
      if (response.data.success) {
        alert("Tâche créée avec succès !");
        setShowModal(false);
        setFormData({
          titre: "",
          description: "",
          apprenant_id: "",
          priorite: "moyenne",
          date_echeance: "",
        });
        fetchTaches();
      }
    } catch (error) {
      console.error("Erreur création tâche:", error);
      const message = error.response?.data?.message || "Erreur lors de la création de la tâche";
      alert(message);
    }
  };

  const marquerTerminee = async (id) => {
    if (!window.confirm("Voulez-vous vraiment marquer cette tâche comme terminée ?")) {
      return;
    }

    try {
      const response = await api.patch(`/maitre-stage/taches/${id}/terminer`);
      
      if (response.data.success) {
        alert("Tâche marquée comme terminée");
        fetchTaches();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const supprimerTache = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      return;
    }

    try {
      const response = await api.delete(`/maitre-stage/taches/${id}`);
      
      if (response.data.success) {
        alert("Tâche supprimée avec succès");
        fetchTaches();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "en_attente":
        return { bg: "#fef3c7", color: "#92400e", label: "En attente" };
      case "en_cours":
        return { bg: "#dbeafe", color: "#1e40af", label: "En cours" };
      case "terminee":
        return { bg: "#d1fae5", color: "#065f46", label: "Terminée" };
      default:
        return { bg: "#f3f4f6", color: "#374151", label: statut };
    }
  };

  const getPrioriteStyle = (priorite) => {
    switch (priorite) {
      case "haute":
        return { bg: "#fee2e2", color: "#991b1b", label: "Haute" };
      case "moyenne":
        return { bg: "#fef3c7", color: "#92400e", label: "Moyenne" };
      case "basse":
        return { bg: "#dbeafe", color: "#1e40af", label: "Basse" };
      default:
        return { bg: "#f3f4f6", color: "#374151", label: priorite };
    }
  };
=======
    fetchEtudiants();
  }, []);
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement des stagiaires...");
      
      const response = await api.get("/maitre-stage/etudiants-affectes");

      console.log("📊 Réponse API:", response.data);

      if (response.data.success || response.data) {
        const etudiantsData = response.data.etudiants || response.data.data || [];
        setEtudiants(etudiantsData);
        setEntreprise(response.data.entreprise || "");
        
        console.log(`✅ ${etudiantsData.length} stagiaire(s) chargé(s)`);
      } else {
        setError("Erreur de récupération des données");
      }
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err.response?.data?.message || "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid #e5e7eb", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Chargement des tâches...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
=======
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des stagiaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
            <button
              onClick={fetchEtudiants}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              🔄 Réessayer
            </button>
          </div>
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>Gestion des Tâches</h1>
          <p style={{ color: "#6b7280" }}>Suivez et gérez les tâches assignées aux apprenants</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "#2563eb", color: "white", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", border: "none", fontSize: "1rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)" }}>
          <span style={{ fontSize: "1.2rem" }}>+</span>
          Nouvelle tâche
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>Total</p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginTop: "0.5rem" }}>{stats.total}</p>
        </div>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>En attente</p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", marginTop: "0.5rem" }}>{stats.en_attente}</p>
        </div>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>En cours</p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", marginTop: "0.5rem" }}>{stats.en_cours}</p>
        </div>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500" }}>Terminées</p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", marginTop: "0.5rem" }}>{stats.terminees}</p>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem" }}>
          <input type="text" placeholder="🔍 Rechercher par titre, description ou apprenant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
          </select>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937" }}>Liste des tâches ({taches.length})</h2>
        </div>

        {taches.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
            <p style={{ fontSize: "1.125rem" }}>Aucune tâche trouvée</p>
            <p style={{ marginTop: "0.5rem" }}>Créez votre première tâche en cliquant sur "Nouvelle tâche"</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Tâche</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Assigné à</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>📅 Échéance</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>📅 Créée le</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Statut</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {taches.map((tache) => {
                  const statutStyle = getStatutStyle(tache.statut);
                  const prioriteStyle = getPrioriteStyle(tache.priorite);
                  return (
                    <tr key={tache.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <span style={{ fontSize: "1.25rem" }}>🎯</span>
                            <strong style={{ color: "#1f2937" }}>{tache.titre}</strong>
                          </div>
                          {tache.description && (
                            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginLeft: "1.75rem" }}>{tache.description}</p>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>👤</span>
                          <span style={{ fontWeight: "500", color: "#1f2937" }}>
                            {tache.apprenant?.prenom} {tache.apprenant?.name}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginLeft: "1.5rem" }}>{tache.apprenant?.email}</p>
                      </td>
                      <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
                        {new Date(tache.date_echeance).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
                        {new Date(tache.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ background: statutStyle.bg, color: statutStyle.color, padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600" }}>
                            {statutStyle.label}
                          </span>
                          <span style={{ background: prioriteStyle.bg, color: prioriteStyle.color, padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600" }}>
                            {prioriteStyle.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {tache.statut !== "terminee" && (
                            <button
                              onClick={() => marquerTerminee(tache.id)}
                              style={{ padding: "0.5rem 0.75rem", background: "#dcfce7", color: "#166534", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: "500" }}
                              title="Marquer comme terminée"
                            >
                              ✓ Terminer
                            </button>
                          )}
                          <button
                            onClick={() => supprimerTache(tache.id)}
                            style={{ padding: "0.5rem 0.75rem", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: "500" }}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
=======
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 Mes Stagiaires</h1>
              <p className="text-blue-100 text-lg">
                Maître de stage: <span className="font-semibold">{user?.name}</span>
              </p>
              {entreprise && (
                <p className="text-blue-200 text-sm mt-1">
                  <FiMapPin className="inline mr-1" />
                  {entreprise}
                </p>
              )}
            </div>
            <div className="text-center bg-white bg-opacity-20 px-8 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold">{etudiants?.length || 0}</div>
              <p className="text-blue-100 text-sm mt-1">Stagiaire{etudiants?.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {!etudiants || etudiants.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Aucun stagiaire affecté
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Les stagiaires qui vous seront affectés apparaîtront ici.
              </p>
            </div>
          ) : (
            <>
              {/* Vue en cartes pour mobile/tablet */}
              <div className="block lg:hidden space-y-4">
                {etudiants.map((etudiant, index) => (
                  <div
                    key={etudiant.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                        {etudiant.prenom?.charAt(0)}
                        {etudiant.nom?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {etudiant.prenom} {etudiant.nom}
                        </h3>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          etudiant.statut === "acceptee"
                            ? "bg-green-100 text-green-700"
                            : etudiant.statut === "en_cours"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {etudiant.statut || "En attente"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiMail className="text-blue-500" />
                        <a href={`mailto:${etudiant.email}`} className="text-blue-600 hover:underline">
                          {etudiant.email}
                        </a>
                      </div>
                      {etudiant.telephone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiPhone className="text-green-500" />
                          <span>{etudiant.telephone}</span>
                        </div>
                      )}
                      {etudiant.adresse_1 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiMapPin className="text-orange-500" />
                          <span>
                            {etudiant.adresse_1}
                            {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                          </span>
                        </div>
                      )}
                      {etudiant.campagne && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiCalendar className="text-purple-500" />
                          <span>{etudiant.campagne}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                      onClick={() => {/* TODO: Voir détails */}}
                    >
                      <FiEye />
                      Voir détails
                    </button>
                  </div>
                ))}
              </div>

              {/* Vue en tableau pour desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-white">#</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Stagiaire</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Adresse</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Campagne</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Statut</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {etudiants.map((etudiant, index) => (
                      <tr
                        key={etudiant.id}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {etudiant.prenom?.charAt(0)}
                              {etudiant.nom?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {etudiant.prenom} {etudiant.nom}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FiMail className="text-blue-500" size={14} />
                              <a href={`mailto:${etudiant.email}`} className="text-blue-600 hover:underline text-sm">
                                {etudiant.email}
                              </a>
                            </div>
                            {etudiant.telephone && (
                              <div className="flex items-center gap-2">
                                <FiPhone className="text-green-500" size={14} />
                                <span className="text-gray-700 text-sm">{etudiant.telephone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 text-gray-700 text-sm max-w-xs">
                          {etudiant.adresse_1 ? (
                            <div className="flex items-start gap-2">
                              <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" size={14} />
                              <span>
                                {etudiant.adresse_1}
                                {etudiant.adresse_2 ? `, ${etudiant.adresse_2}` : ""}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6 text-gray-700">
                          {etudiant.campagne ? (
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-purple-500" size={14} />
                              <span className="text-sm">{etudiant.campagne}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                            etudiant.statut === "acceptee"
                              ? "bg-green-100 text-green-700"
                              : etudiant.statut === "en_cours"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {etudiant.statut === "acceptee" && "✓ Accepté"}
                            {etudiant.statut === "en_cours" && "⏳ En cours"}
                            {!etudiant.statut && "⏳ En attente"}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <button 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                            onClick={() => {/* TODO: Voir détails */}}
                          >
                            <FiEye size={16} />
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Statistiques en bas */}
        {etudiants.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Total stagiaires</p>
                <p className="text-3xl font-bold text-blue-600">{etudiants.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Stagiaires actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {etudiants.filter(e => e.statut === "acceptee" || e.statut === "en_cours").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {etudiants.filter(e => !e.statut || e.statut === "en_attente").length}
                </p>
              </div>
            </div>
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div style={{ background: "white", borderRadius: "1rem", padding: "2rem", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>Créer une Nouvelle Tâche</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>Détails de la tâche</h3>

                <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                    Titre de la tâche <span style={{ color: "#dc2626" }}>*</span>
                  </span>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🎯</span>
                    <input type="text" required placeholder="Ex: Développer l'interface utilisateur" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
                  </div>
                </label>

                <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Description</span>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: "#9ca3af" }}>📄</span>
                    <textarea placeholder="Description détaillée de la tâche à accomplir..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", resize: "vertical" }} />
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>Assignation</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <label>
                    <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                      Assigner à <span style={{ color: "#dc2626" }}>*</span>
                    </span>
                    <select required value={formData.apprenant_id} onChange={(e) => setFormData({ ...formData, apprenant_id: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                      <option value="">Sélectionner un apprenant</option>
                      {apprenants.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.prenom} {app.nom}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Priorité</span>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>⚠️</span>
                      <select value={formData.priorite} onChange={(e) => setFormData({ ...formData, priorite: e.target.value })} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                        <option value="basse">Basse</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="haute">Haute</option>
                      </select>
                    </div>
                  </label>
                </div>

                <label>
                  <span style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                    Date d'échéance <span style={{ color: "#dc2626" }}>*</span>
                  </span>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>📅</span>
                    <input type="date" required value={formData.date_echeance} onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })} min={new Date().toISOString().split('T')[0]} style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", outline: "none" }} />
                  </div>
                </label>
              </div>

              <div style={{ background: "#fef3c7", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
                <span>⚠️</span>
                <span style={{ fontSize: "0.875rem", color: "#92400e" }}>
                  Priorité sélectionnée: <strong>{formData.priorite.charAt(0).toUpperCase() + formData.priorite.slice(1)}</strong>
                </span>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "500", cursor: "pointer", color: "#374151" }}>
                  Annuler
                </button>
                <button onClick={handleSubmit} style={{ padding: "0.75rem 1.5rem", background: "#2563eb", border: "none", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "600", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>💾</span>
                  Créer la tâche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default GestionTaches;
=======
export default MesStagiaires;
>>>>>>> fc66ec1f0660aab9f3b95d72e88a3ac02408d6a0
