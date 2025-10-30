// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { FiBriefcase, FiEye, FiDownload } from "react-icons/fi";

// const StageListChefDepartement = () => {
//   const [stages, setStages] = useState([]);
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [campagneFilter, setCampagneFilter] = useState("all");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const [stagesRes, campagnesRes] = await Promise.all([
//         api.get("/suivi-stage"),
//         api.get("/campagnes_global")
//       ]);

//       const realStages = stagesRes.data.data.map(stage => ({
//         ...stage,
//         etudiant: stage, // user lui-même
//         entreprise: stage.entreprise || { nom: "Non défini" },
//         livrables: stage.livrables || [],
//         campagne_id: stage.campagne_id || null
//       }));

//       setStages(realStages);
//       setCampagnes(campagnesRes.data.data ?? []);
//     } catch (err) {
//       console.error("Erreur chargement données:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredStages = stages.filter(stage => {
//     const matchSearch =
//       stage.etudiant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       stage.etudiant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchCampagne =
//       campagneFilter === "all" || stage.campagne_id === parseInt(campagneFilter);

//     return matchSearch && matchCampagne;
//   });

//   const getStageStatus = (livrable) => {
//     const today = new Date();
//     const fin = livrable?.tache?.date_fin ? new Date(livrable.tache.date_fin) : null;

//     if (!fin) return { label: "Non défini", color: "bg-gray-100 text-gray-800" };
//     if (today > fin) return { label: "Terminé", color: "bg-gray-100 text-gray-800" };
//     return { label: "En cours", color: "bg-green-100 text-green-800" };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
//           <p className="mt-6 text-xl text-gray-600 font-medium">Chargement des stages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
//         <FiBriefcase className="text-blue-600" size={32} /> Gestion des Stages
//       </h1>

//       {/* Filtres */}
//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="Rechercher par étudiant..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/2 pl-3 py-2 border rounded-lg"
//         />
//         <select
//           value={campagneFilter}
//           onChange={e => setCampagneFilter(e.target.value)}
//           className="w-full md:w-1/4 pl-3 py-2 border rounded-lg"
//         >
//           <option value="all">Toutes les campagnes</option>
//           {campagnes.map(c => (
//             <option key={c.id} value={c.id}>{c.titre}</option>
//           ))}
//         </select>
//       </div>

//       {filteredStages.length === 0 ? (
//         <p className="text-gray-600">Aucun stage trouvé.</p>
//       ) : (
//         <div className="space-y-4">
//           {filteredStages.map(stage => (
//             <div key={stage.id} className="bg-white rounded-lg shadow p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="font-bold text-lg">{stage.etudiant?.name} {stage.etudiant?.prenom}</h2>
//                 <span className="text-sm text-gray-500">{stage.entreprise?.nom}</span>
//               </div>

//               <p className="text-sm text-gray-600 mb-2">
//                 Campagne: {campagnes.find(c => c.id === stage.campagne_id)?.titre || "—"}
//               </p>

//               {/* Livrables */}
//               {stage.livrables.length === 0 ? (
//                 <p className="text-gray-500">Pas de livrables.</p>
//               ) : (
//                 <table className="w-full text-left border-t border-gray-200">
//                   <thead>
//                     <tr className="text-gray-600 text-sm border-b">
//                       <th className="px-2 py-1">Titre</th>
//                       <th className="px-2 py-1">Tâche</th>
//                       <th className="px-2 py-1">Statut</th>
//                       <th className="px-2 py-1">Note</th>
//                       <th className="px-2 py-1">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stage.livrables.map(liv => {
//                       const status = getStageStatus(liv);
//                       return (
//                         <tr key={liv.id} className="border-b">
//                           <td className="px-2 py-1">{liv.titre}</td>
//                           <td className="px-2 py-1">{liv.tache?.titre || "—"}</td>
//                           <td className={`px-2 py-1 ${status.color} rounded-full text-xs`}>{status.label}</td>
//                           <td className="px-2 py-1">{liv.note ?? "—"}</td>
//                           <td className="px-2 py-1 flex gap-2">
//                             {liv.fichier_url && (
//                               <a href={liv.fichier_url} target="_blank" rel="noopener noreferrer">
//                                 <FiDownload className="text-blue-600" />
//                               </a>
//                             )}
//                             <FiEye className="text-green-600" />
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StageListChefDepartement;












// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { FiBriefcase } from "react-icons/fi";

// const StageListChefDepartement = () => {
//   const [apprenants, setApprenants] = useState([]);
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [campagneFilter, setCampagneFilter] = useState("all");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [apprenantsRes, campagnesRes] = await Promise.all([
//         api.get("/suivi-stage"),
//         api.get("/campagnes_global") // endpoint de tes campagnes
//       ]);

//       setApprenants(apprenantsRes.data.data ?? []);
//       setCampagnes(campagnesRes.data.data ?? []);
//     } catch (err) {
//       console.error("Erreur chargement données:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtrer les apprenants
//   const filteredApprenants = apprenants.filter(apprenant => {
//     // Recherche par nom/prénom/email
//     const searchMatch =
//       apprenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       apprenant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       apprenant.email.toLowerCase().includes(searchTerm.toLowerCase());

//     // Filtrage par campagne
//     const campagneMatch =
//       campagneFilter === "all" ||
//       apprenant.livrables.some(l => l.tache?.stage?.campagne_id === parseInt(campagneFilter));

//     return searchMatch && campagneMatch;
//   });

//   // Calcul du statut d'un livrable selon la tâche
//   const getLivrableStatus = (livrable) => {
//     if (!livrable.tache) return "Non assignée";
//     return livrable.tache.statut === "en_cours" ? "En cours" :
//            livrable.tache.statut === "terminee" ? "Terminée" : livrable.tache.statut;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
//           <p className="mt-6 text-xl text-gray-600 font-medium">Chargement des données...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
//         <FiBriefcase className="text-blue-600" size={32} /> Suivi des Apprenants
//       </h1>

//       {/* Filtres */}
//       <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input
//           type="text"
//           placeholder="Rechercher par nom, prénom ou email..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="w-full pl-3 py-2 border rounded-lg"
//         />
//         <select
//           value={campagneFilter}
//           onChange={e => setCampagneFilter(e.target.value)}
//           className="w-full pl-3 py-2 border rounded-lg"
//         >
//           <option value="all">Toutes les campagnes</option>
//           {campagnes.map(c => (
//             <option key={c.id} value={c.id}>{c.titre}</option>
//           ))}
//         </select>
//       </div>

//       {/* Liste des apprenants */}
//       {filteredApprenants.length === 0 ? (
//         <p>Aucun apprenant trouvé.</p>
//       ) : (
//         filteredApprenants.map(apprenant => (
//           <div key={apprenant.id} className="mb-6 p-4 bg-white rounded-lg shadow">
//             <h2 className="text-xl font-semibold">{apprenant.name} {apprenant.prenom}</h2>
//             <p className="text-gray-600">{apprenant.email}</p>
//             <p className="text-gray-600">Entreprise: {apprenant.entreprise?.nom || "—"}</p>

//             {/* Livrables */}
//             <div className="mt-4">
//               {apprenant.livrables.length === 0 ? (
//                 <p className="text-gray-500">Aucun livrable.</p>
//               ) : (
//                 <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
//                   <thead className="bg-gray-200">
//                     <tr>
//                       <th className="px-3 py-2 text-left">Titre</th>
//                       <th className="px-3 py-2 text-left">Description</th>
//                       <th className="px-3 py-2 text-left">Statut</th>
//                       <th className="px-3 py-2 text-left">Note</th>
//                       <th className="px-3 py-2 text-left">Commentaire</th>
//                     </tr>
//                   </thead>
//                   {/* <tbody>
//                     {apprenant.livrables.map(l => (
//                       <tr key={l.id} className="border-b">
//                         <td className="px-3 py-2">{l.titre}</td>
//                         <td className="px-3 py-2">{l.description}</td>
//                         <td className="px-3 py-2">{getLivrableStatus(l)}</td>
//                         <td className="px-3 py-2">{l.note ?? "—"}</td>
//                         <td className="px-3 py-2">{l.commentaire ?? "—"}</td>
//                       </tr>
//                     ))}
//                   </tbody> */}
// <tbody>
//   {apprenant.livrables.map(livrable => {
//     const tacheStatut = livrable.tache ? livrable.tache.statut : "Non assignée";
//     const livrableStatut = livrable.statut ?? "Non défini";

//     return (
//       <tr key={livrable.id} className="border-b">
//         <td className="px-4 py-2">{livrable.titre}</td>
//         <td className="px-4 py-2">{livrable.tache?.titre || "—"}</td>
//         <td className="px-4 py-2">{livrable.statut || "—"}</td>
//         <td className="px-4 py-2">{livrable.note ?? "—"}</td>
//         <td className="px-4 py-2">{livrable.commentaire ?? "—"}</td>
//         <td className="px-4 py-2">
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             Tâche: {tacheStatut} / Livrable: {livrableStatut}
//           </span>
//         </td>
//       </tr>
//     );
//   })}
// </tbody>


//                 </table>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default StageListChefDepartement;










import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiBriefcase, FiDownload, FiEye } from "react-icons/fi";

const statusColors = {
  "approuve": "bg-green-100 text-green-800",
  "en_attente": "bg-yellow-100 text-yellow-800",
  "rejete": "bg-red-100 text-red-800",
  "en_cours": "bg-blue-100 text-blue-800",
  "terminee": "bg-gray-200 text-gray-800",
  "Non assignée": "bg-gray-100 text-gray-800",
  "Non défini": "bg-gray-100 text-gray-800"
};

const StageListChefDepartement = () => {
  const [apprenants, setApprenants] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [campagneFilter, setCampagneFilter] = useState("all");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apprenantsRes, campagnesRes] = await Promise.all([
        api.get("/suivi-stage"),
        api.get("/campagnes_global")
      ]);
      setApprenants(apprenantsRes.data.data ?? []);
      setCampagnes(campagnesRes.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally { setLoading(false); }
  };

  const filteredApprenants = apprenants.filter(apprenant => {
    const searchMatch =
      apprenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const campagneMatch =
      campagneFilter === "all" ||
      apprenant.livrables.some(l => l.tache?.stage?.campagne_id === parseInt(campagneFilter));
    return searchMatch && campagneMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        <FiBriefcase className="text-blue-600" size={32} /> Suivi des Apprenants
      </h1>

      {/* Filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 pl-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={campagneFilter}
          onChange={e => setCampagneFilter(e.target.value)}
          className="w-full md:w-1/4 pl-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Toutes les campagnes</option>
          {campagnes.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
        </select>
      </div>

      {/* Liste des apprenants */}
      {filteredApprenants.length === 0 ? (
        <p className="text-gray-600">Aucun apprenant trouvé.</p>
      ) : (
        <div className="grid gap-6">
          {filteredApprenants.map(apprenant => (
            <div key={apprenant.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{apprenant.name} {apprenant.prenom}</h2>
                  <p className="text-gray-500 text-sm">{apprenant.email}</p>
                  <p className="text-gray-500 text-sm">Entreprise: {apprenant.entreprise?.nom || "—"}</p>
                </div>
              </div>

              {/* Livrables */}
              {apprenant.livrables.length === 0 ? (
                <p className="text-gray-400">Pas de livrables pour cet apprenant.</p>
              ) : (
                <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Titre</th>
                      <th className="px-4 py-2 text-left">Tâche</th>
                      <th className="px-4 py-2 text-left">Statut Tâche</th>
                      <th className="px-4 py-2 text-left">Statut Livrable</th>
                      <th className="px-4 py-2 text-left">Note</th>
                      <th className="px-4 py-2 text-left">Commentaire</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apprenant.livrables.map(l => {
                      const tacheStatut = l.tache?.statut ?? "Non assignée";
                      const livrableStatut = l.statut ?? "Non défini";
                      return (
                        <tr key={l.id} className="border-b hover:bg-gray-100 transition-colors">
                          <td className="px-4 py-2">{l.titre}</td>
                          <td className="px-4 py-2">{l.tache?.titre || "—"}</td>
                          <td className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[tacheStatut]}`}>{tacheStatut}</td>
                          <td className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[livrableStatut]}`}>{livrableStatut}</td>
                          <td className="px-4 py-2">{l.note ?? "—"}</td>
                          <td className="px-4 py-2">{l.commentaire ?? "—"}</td>
                          <td className="px-4 py-2 flex gap-2">
                            {l.fichier_url && (
                              <a href={l.fichier_url} target="_blank" rel="noopener noreferrer">
                                <FiDownload className="text-blue-600 hover:text-blue-800"/>
                              </a>
                            )}
                            <FiEye className="text-green-600 hover:text-green-800"/>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageListChefDepartement;
