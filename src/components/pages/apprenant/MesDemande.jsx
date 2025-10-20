// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";
// import { FiAlertCircle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
// import { BsBuilding, BsCalendar3 } from "react-icons/bs";
// import { TbBrandCampaignmonitor } from "react-icons/tb";

// const MesDemandes = () => {
//   const [demandes, setDemandes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDemandes();
//   }, []);

//   const fetchDemandes = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("📋 Chargement des demandes...");
      
//       const res = await api.get("/apprenant/mes-demandes");
      
//       console.log("✅ Réponse:", res.data);
      
//       setDemandes(res.data.data || []);
      
//     } catch (err) {
//       console.error("❌ Erreur lors du chargement des demandes:", err);
//       console.error("❌ Détails:", err.response?.data);
      
//       setError(
//         err.response?.data?.message || 
//         "Erreur lors du chargement des demandes"
//       );
//       setDemandes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const getStatutBadge = (statut) => {
//     const configs = {
//       en_attente: {
//         icon: FiClock,
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         label: "En attente"
//       },
//       accepte: {
//         icon: FiCheckCircle,
//         bg: "bg-green-100",
//         text: "text-green-700",
//         label: "Accepté"
//       },
//       refuse: {
//         icon: FiXCircle,
//         bg: "bg-red-100",
//         text: "text-red-700",
//         label: "Refusé"
//       }
//     };

//     const config = configs[statut] || configs.en_attente;
//     const Icon = config.icon;

//     return (
//       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
//         <Icon size={14} />
//         {config.label}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
//           <p className="mt-6 text-xl text-gray-600 font-medium">
//             Chargement de vos demandes...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* En-tête */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//           <TbBrandCampaignmonitor className="text-blue-600" size={32} />
//           Mes Demandes de Stage
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Suivez l'état de vos candidatures aux différentes campagnes
//         </p>
//       </div>

//       {/* Message d'erreur */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
//           <div className="flex items-start gap-3">
//             <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
//             <div>
//               <h4 className="text-red-900 font-semibold mb-1">Erreur de chargement</h4>
//               <p className="text-red-700 text-sm">{error}</p>
//               <button
//                 onClick={fetchDemandes}
//                 className="mt-3 text-sm text-red-600 underline hover:text-red-800"
//               >
//                 Réessayer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Liste des demandes */}
//       {demandes.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-md p-12 text-center">
//           <div className="text-6xl mb-4">📋</div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">
//             Aucune demande enregistrée
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Vous n'avez pas encore postulé à une campagne de stage.
//           </p>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
//             <p className="text-sm text-blue-800">
//               Consultez les <strong>campagnes disponibles</strong> et postulez pour créer votre première demande !
//             </p>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Version Desktop - Tableau */}
//           <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <table className="min-w-full">
//               <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Entreprise</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Campagne</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Adresse 1</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Adresse 2</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {demandes.map((demande) => (
//                   <tr key={demande.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <BsBuilding className="text-purple-600" size={16} />
//                         <span className="font-medium text-gray-900">
//                           {demande.entreprise?.nom || "Non défini"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="text-gray-700">
//                         {demande.campagne?.titre || "Non défini"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600 text-sm">
//                       {demande.adresse_1}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600 text-sm">
//                       {demande.adresse_2 || "-"}
//                     </td>
//                     <td className="px-6 py-4">
//                       {getStatutBadge(demande.statut)}
//                     </td>
//                     <td className="px-6 py-4 text-gray-500 text-sm">
//                       {demande.created_at && (
//                         <div className="flex items-center gap-1">
//                           <BsCalendar3 size={14} />
//                           {new Date(demande.created_at).toLocaleDateString("fr-FR")}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Version Mobile - Cartes */}
//           <div className="md:hidden space-y-4">
//             {demandes.map((demande) => (
//               <div
//                 key={demande.id}
//                 className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
//               >
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <BsBuilding className="text-purple-600" size={16} />
//                       <h3 className="font-bold text-gray-900">
//                         {demande.entreprise?.nom || "Non défini"}
//                       </h3>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       {demande.campagne?.titre || "Non défini"}
//                     </p>
//                   </div>
//                   {getStatutBadge(demande.statut)}
//                 </div>

//                 <div className="space-y-2 text-sm">
//                   <div>
//                     <span className="font-medium text-gray-700">Adresse 1 :</span>
//                     <span className="text-gray-600 ml-2">{demande.adresse_1}</span>
//                   </div>
//                   {demande.adresse_2 && (
//                     <div>
//                       <span className="font-medium text-gray-700">Adresse 2 :</span>
//                       <span className="text-gray-600 ml-2">{demande.adresse_2}</span>
//                     </div>
//                   )}
//                   {demande.created_at && (
//                     <div className="flex items-center gap-1 text-gray-500 pt-2 border-t">
//                       <BsCalendar3 size={14} />
//                       <span>
//                         {new Date(demande.created_at).toLocaleDateString("fr-FR")}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Statistiques */}
//           <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {demandes.length}
//                 </div>
//                 <div className="text-sm text-gray-600">Total</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-yellow-600">
//                   {demandes.filter(d => d.statut === 'en_attente').length}
//                 </div>
//                 <div className="text-sm text-gray-600">En attente</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">
//                   {demandes.filter(d => d.statut === 'acceptee').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Acceptées</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-red-600">
//                   {demandes.filter(d => d.statut === 'refuse').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Refusées</div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MesDemandes;













import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { FiAlertCircle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { BsBuilding, BsCalendar3 } from "react-icons/bs";
import { TbBrandCampaignmonitor } from "react-icons/tb";

const MesDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📋 Chargement des demandes...");
      
      // 📋 Route: Récupérer toutes les demandes de l'étudiant connecté
      // Endpoint: GET /api/v1/apprenant/mes-demandes
      // Retourne: Array de demandes avec relations (campagne, entreprise)
      // Format: { id, etudiant_id, campagne_id, entreprise_id, adresse_1, adresse_2, statut, created_at }
      const res = await api.get("/apprenant/mes-demandes");
      
      console.log("✅ Réponse:", res.data);
      
      setDemandes(res.data.data || []);
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement des demandes:", err);
      console.error("❌ Détails:", err.response?.data);
      
      setError(
        err.response?.data?.message || 
        "Erreur lors du chargement des demandes"
      );
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION: Adaptation aux statuts exacts de la BDD
  // Statuts possibles: 'en_attente', 'acceptee', 'refusee', 'reorientee'
  const getStatutBadge = (statut) => {
    const configs = {
      en_attente: {
        icon: FiClock,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "⏳ En attente"
      },
      acceptee: { // ✅ Avec double "e"
        icon: FiCheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        label: "✅ Acceptée"
      },
      refusee: { // ✅ Avec double "e"
        icon: FiXCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        label: "❌ Refusée"
      },
      reorientee: { // ✅ Nouveau statut
        icon: FiAlertCircle,
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "🔄 Réorientée"
      }
    };

    const config = configs[statut] || configs.en_attente;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement de vos demandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TbBrandCampaignmonitor className="text-blue-600" size={32} />
          Mes Demandes de Stage
        </h1>
        <p className="text-gray-500 mt-1">
          Suivez l'état de vos candidatures aux différentes campagnes
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-red-900 font-semibold mb-1">Erreur de chargement</h4>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchDemandes}
                className="mt-3 text-sm text-red-600 underline hover:text-red-800"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des demandes */}
      {demandes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucune demande enregistrée
          </h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore postulé à une campagne de stage.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              Consultez les <strong>campagnes disponibles</strong> et postulez pour créer votre première demande !
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Version Desktop - Tableau */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Campagne</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Adresse 1</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Adresse 2</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demandes.map((demande) => (
                  <tr key={demande.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BsBuilding className="text-purple-600" size={16} />
                        <span className="font-medium text-gray-900">
                          {demande.entreprise?.nom || "Non défini"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        {demande.campagne?.titre || "Non défini"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {demande.adresse_1}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {demande.adresse_2 || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatutBadge(demande.statut)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {demande.created_at && (
                        <div className="flex items-center gap-1">
                          <BsCalendar3 size={14} />
                          {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Mobile - Cartes */}
          <div className="md:hidden space-y-4">
            {demandes.map((demande) => (
              <div
                key={demande.id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BsBuilding className="text-purple-600" size={16} />
                      <h3 className="font-bold text-gray-900">
                        {demande.entreprise?.nom || "Non défini"}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {demande.campagne?.titre || "Non défini"}
                    </p>
                  </div>
                  {getStatutBadge(demande.statut)}
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Adresse 1 :</span>
                    <span className="text-gray-600 ml-2">{demande.adresse_1}</span>
                  </div>
                  {demande.adresse_2 && (
                    <div>
                      <span className="font-medium text-gray-700">Adresse 2 :</span>
                      <span className="text-gray-600 ml-2">{demande.adresse_2}</span>
                    </div>
                  )}
                  {demande.created_at && (
                    <div className="flex items-center gap-1 text-gray-500 pt-2 border-t">
                      <BsCalendar3 size={14} />
                      <span>
                        {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Statistiques */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {demandes.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {demandes.filter(d => d.statut === 'en_attente').length}
                </div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {/* ✅ Correction: 'acceptee' au lieu de 'accepte' */}
                  {demandes.filter(d => d.statut === 'acceptee').length}
                </div>
                <div className="text-sm text-gray-600">Acceptées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {/* ✅ Correction: 'refusee' au lieu de 'refuse' */}
                  {demandes.filter(d => d.statut === 'refusee').length}
                </div>
                <div className="text-sm text-gray-600">Refusées</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MesDemandes;