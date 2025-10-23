

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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid #e5e7eb", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Chargement des tâches...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
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

export default GestionTaches;
