
// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
// import { BsBuilding } from "react-icons/bs";

// const CampagneRH = () => {
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCampagnes();
//   }, []);

//   const fetchCampagnes = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/campagnes_rh");
//       setCampagnes(res.data.data || []);
//     } catch (error) {
//       console.error("Erreur lors du chargement des campagnes:", error);
//       alert("Erreur lors du chargement des campagnes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (campagneId) => {
//     const nb_places = prompt("Combien d'étudiants pouvez-vous accueillir ?");
    
//     // Vérifier si l'utilisateur a annulé ou laissé vide
//     if (!nb_places || nb_places.trim() === "") {
//       return;
//     }

//     // Vérifier si c'est un nombre valide
//     const nbPlacesInt = parseInt(nb_places);
//     if (isNaN(nbPlacesInt) || nbPlacesInt <= 0) {
//       alert("Veuillez entrer un nombre valide supérieur à 0");
//       return;
//     }

//     try {
//       const res = await api.post(`/campagnes/${campagneId}/accepter`, { 
//         nb_places: nbPlacesInt 
//       });
//       alert(res.data.message || "Campagne acceptée ✅");
      
//       // Recharger les campagnes pour obtenir les données à jour
//       fetchCampagnes();
//     } catch (err) {
//       console.error("Erreur lors de l'acceptation:", err);
//       alert("Erreur: " + (err.response?.data?.message || "Erreur lors de l'acceptation"));
//     }
//   };

//   const handleReject = async (campagneId) => {
//     const message_refus = prompt("Raison du refus ? (facultatif)");
    
//     // Permettre de refuser même sans message
//     if (message_refus === null) {
//       return; // L'utilisateur a cliqué sur Annuler
//     }

//     try {
//       const res = await api.post(`/campagnes/${campagneId}/refuser`, { 
//         message_refus: message_refus || "Aucune raison fournie" 
//       });
//       alert(res.data.message || "Campagne refusée ❌");
      
//       // Recharger les campagnes pour obtenir les données à jour
//       fetchCampagnes();
//     } catch (err) {
//       console.error("Erreur lors du refus:", err);
//       alert("Erreur: " + (err.response?.data?.message || "Erreur lors du refus"));
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("fr-FR");
//   };

//   // Fonction pour obtenir le statut depuis pivot ou entreprises
//   const getStatut = (campagne) => {
//     // Vérifier d'abord dans pivot
//     if (campagne.pivot?.statut) {
//       return campagne.pivot.statut;
//     }
//     // Vérifier dans entreprises[0].pivot
//     if (campagne.entreprises && campagne.entreprises[0]?.pivot?.statut) {
//       return campagne.entreprises[0].pivot.statut;
//     }
//     return "en_attente";
//   };

//   const getNbPlaces = (campagne) => {
//     if (campagne.pivot?.nb_places) {
//       return campagne.pivot.nb_places;
//     }
//     if (campagne.entreprises && campagne.entreprises[0]?.pivot?.nb_places) {
//       return campagne.entreprises[0].pivot.nb_places;
//     }
//     return null;
//   };

//   const getMessageRefus = (campagne) => {
//     if (campagne.pivot?.message_refus) {
//       return campagne.pivot.message_refus;
//     }
//     if (campagne.entreprises && campagne.entreprises[0]?.pivot?.message_refus) {
//       return campagne.entreprises[0].pivot.message_refus;
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Chargement des campagnes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">📋 Campagnes de stage reçues</h1>

//         {campagnes.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <p className="text-gray-600 text-lg">
//               Aucune campagne n'a encore été envoyée à votre entreprise.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {campagnes.map((c) => {
//               const statut = getStatut(c);
//               const nbPlaces = getNbPlaces(c);
//               const messageRefus = getMessageRefus(c);

//               return (
//                 <div
//                   key={c.id}
//                   className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500"
//                 >
//                   {/* En-tête avec titre et statut */}
//                   <div className="flex justify-between items-start mb-3">
//                     <h2 className="text-lg font-bold text-gray-800 flex-1">
//                       {c.titre || "Campagne sans titre"}
//                     </h2>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 whitespace-nowrap ${
//                         statut === "acceptée"
//                           ? "bg-green-100 text-green-700"
//                           : statut === "refusée"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {statut === "acceptée" ? "✅ Acceptée" : 
//                        statut === "refusée" ? "❌ Refusée" : 
//                        "⏳ En attente"}
//                     </span>
//                   </div>

//                   {/* Description */}
//                   <p className="text-sm text-gray-600 mb-4">
//                     {c.description || "Aucune description disponible"}
//                   </p>

//                   {/* Informations de la campagne */}
//                   <div className="space-y-2 text-sm text-gray-700 mb-4">
//                     <div className="flex items-center">
//                       <FiCalendar className="text-blue-500 mr-2" />
//                       <span>Début : {formatDate(c.date_debut)}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <FiCalendar className="text-orange-500 mr-2" />
//                       <span>Fin : {formatDate(c.date_fin)}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <BsBuilding className="text-purple-500 mr-2" />
//                       <span>Métier : {c.metier?.nom || "Non spécifié"}</span>
//                     </div>
//                   </div>

//                   {/* Actions selon le statut */}
//                   {statut === "en_attente" && (
//                     <div className="flex gap-3 mt-4">
//                       <button
//                         onClick={() => handleAccept(c.id)}
//                         className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
//                       >
//                         <FiCheckCircle />
//                         Accepter
//                       </button>
//                       <button
//                         onClick={() => handleReject(c.id)}
//                         className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
//                       >
//                         <FiXCircle />
//                         Refuser
//                       </button>
//                     </div>
//                   )}

//                   {/* Affichage si acceptée */}
//                   {statut === "acceptée" && nbPlaces && (
//                     <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                       <p className="text-green-700 text-sm font-medium">
//                         ✅ Vous pouvez accueillir <span className="font-bold">{nbPlaces}</span> étudiant{nbPlaces > 1 ? 's' : ''}
//                       </p>
//                     </div>
//                   )}

//                   {/* Affichage si refusée */}
//                   {statut === "refusée" && (
//                     <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <p className="text-red-700 text-sm font-medium">
//                         ❌ Campagne refusée
//                       </p>
//                       {messageRefus && (
//                         <p className="text-red-600 text-xs mt-1 italic">
//                           Raison : {messageRefus}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CampagneRH;










// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { FiCalendar, FiUsers, FiCheck, FiXCircle } from "react-icons/fi";
// import { RiBuilding4Line } from "react-icons/ri";
// import { motion, AnimatePresence } from "framer-motion";

// const CampagnesRH = () => {
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCampagne, setSelectedCampagne] = useState(null);
//   const [actionType, setActionType] = useState(null); // 'accepter' ou 'refuser'
//   const [nbPlaces, setNbPlaces] = useState("");
//   const [messageRefus, setMessageRefus] = useState("");

//   useEffect(() => {
//     fetchCampagnes();
//   }, []);

//   const fetchCampagnes = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/campagnes_rh");
//       setCampagnes(res.data.data || []);
//     } catch (error) {
//       console.error("Erreur lors du chargement des campagnes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async () => {
//     if (!selectedCampagne) return;

//     try {
//       if (actionType === "acceptée") {
//         await api.post(`/campagnes/${selectedCampagne.id}/accepter`, {
//           nb_places: nbPlaces,
//         });
//       } else if (actionType === "refuser") {
//         await api.post(`/campagnes/${selectedCampagne.id}/refuser`, {
//           message_refus: messageRefus,
//         });
//       }

//       setSelectedCampagne(null);
//       setActionType(null);
//       setNbPlaces("");
//       setMessageRefus("");
//       fetchCampagnes();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Erreur lors de la mise à jour de la campagne");
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("fr-FR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-4 text-gray-800">
//         Campagnes disponibles
//       </h1>

//       {campagnes.length === 0 ? (
//         <div className="text-center text-gray-500 mt-20">
//           📭 Aucune campagne disponible pour votre entreprise
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {campagnes.map((campagne) => {
//             const statut = campagne.entreprises[0]?.pivot?.statut || "en_attente";

//             return (
//               <motion.div
//                 key={campagne.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white shadow-md p-6 rounded-xl border-l-4 border-blue-500"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-2xl font-semibold text-gray-800">
//                       {campagne.titre}
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       {campagne.description || "Aucune description fournie."}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       statut === "en_attente"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : statut === "acceptee"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {statut === "en_attente"
//                       ? "En attente"
//                       : statut === "acceptee"
//                       ? "Acceptée"
//                       : "Refusée"}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                   <div className="flex items-center gap-2">
//                     <FiCalendar className="text-blue-500" />
//                     <span>
//                       <strong>Début :</strong> {formatDate(campagne.date_debut)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FiCalendar className="text-orange-500" />
//                     <span>
//                       <strong>Fin :</strong> {formatDate(campagne.date_fin)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <RiBuilding4Line className="text-purple-500" />
//                     <span>
//                       <strong>Métier :</strong> {campagne.metier?.nom || "N/A"}
//                     </span>
//                   </div>
//                 </div>

//                 {statut === "en_attente" && (
//                   <div className="flex gap-3 mt-4">
//                     <button
//                       onClick={() => {
//                         setSelectedCampagne(campagne);
//                         setActionType("accepter");
//                       }}
//                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
//                     >
//                       <FiCheck />
//                       Accepter
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedCampagne(campagne);
//                         setActionType("refuser");
//                       }}
//                       className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
//                     >
//                       <FiXCircle />
//                       Refuser
//                     </button>
//                   </div>
//                 )}

//                 {statut === "acceptee" && (
//                   <p className="text-green-700 mt-3 text-sm">
//                     ✅ Vous avez accepté cette campagne ({campagne.entreprises[0]?.pivot?.nb_places || "?"} étudiants max)
//                   </p>
//                 )}
//                 {statut === "refusee" && (
//                   <p className="text-red-700 mt-3 text-sm italic">
//                     ❌ Refusée : {campagne.entreprises[0]?.pivot?.message_refus}
//                   </p>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* 🔹 MODALE */}
//       <AnimatePresence>
//         {selectedCampagne && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
//             >
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">
//                 {actionType === "accepter"
//                   ? "Accepter la campagne"
//                   : "Refuser la campagne"}
//               </h3>

//               {actionType === "accepter" ? (
//                 <div>
//                   <label className="text-sm text-gray-600 font-medium">
//                     Nombre d’étudiants que vous pouvez accueillir :
//                   </label>
//                   <input
//                     type="number"
//                     className="w-full border rounded-lg p-2 mt-2"
//                     value={nbPlaces}
//                     onChange={(e) => setNbPlaces(e.target.value)}
//                     placeholder="Ex : 5"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   <label className="text-sm text-gray-600 font-medium">
//                     Raison du refus :
//                   </label>
//                   <textarea
//                     className="w-full border rounded-lg p-2 mt-2"
//                     rows="3"
//                     value={messageRefus}
//                     onChange={(e) => setMessageRefus(e.target.value)}
//                     placeholder="Ex : Pas de capacité d’accueil cette année"
//                   ></textarea>
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => {
//                     setSelectedCampagne(null);
//                     setActionType(null);
//                   }}
//                   className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleAction}
//                   className={`px-4 py-2 rounded text-white ${
//                     actionType === "accepter"
//                       ? "bg-green-600 hover:bg-green-700"
//                       : "bg-red-600 hover:bg-red-700"
//                   }`}
//                 >
//                   Confirmer
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CampagnesRH;


import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiCalendar, FiUsers, FiCheck, FiXCircle } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const CampagnesRH = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accepter' ou 'refuser'
  const [nbPlaces, setNbPlaces] = useState("");
  const [messageRefus, setMessageRefus] = useState("");

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/campagnes_rh");
      setCampagnes(res.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des campagnes:", error);
      alert("Erreur lors du chargement des campagnes");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedCampagne) return;

    try {
      if (actionType === "accepter") {
        // Validation du nombre de places
        const nbPlacesInt = parseInt(nbPlaces);
        if (!nbPlaces || isNaN(nbPlacesInt) || nbPlacesInt <= 0) {
          alert("⚠️ Veuillez entrer un nombre valide d'étudiants (supérieur à 0)");
          return;
        }

        const res = await api.post(`/campagnes/${selectedCampagne.id}/accepter`, {
          nb_places: nbPlacesInt,
        });
        alert(res.data.message || "✅ Campagne acceptée avec succès");
      } else if (actionType === "refuser") {
        // Message de refus facultatif
        const res = await api.post(`/campagnes/${selectedCampagne.id}/refuser`, {
          message_refus: messageRefus || "Aucune raison fournie",
        });
        alert(res.data.message || "❌ Campagne refusée");
      }

      // Réinitialisation et rechargement
      setSelectedCampagne(null);
      setActionType(null);
      setNbPlaces("");
      setMessageRefus("");
      fetchCampagnes();
    } catch (err) {
      console.error("Erreur lors de l'action:", err);
      alert("❌ Erreur: " + (err.response?.data?.message || err.message || "Erreur inconnue"));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Fonction pour obtenir le statut de manière flexible
  const getStatut = (campagne) => {
    // Vérifier dans pivot (structure 1)
    if (campagne.pivot?.statut) {
      return campagne.pivot.statut;
    }
    // Vérifier dans entreprises[0].pivot (structure 2)
    if (campagne.entreprises && campagne.entreprises[0]?.pivot?.statut) {
      return campagne.entreprises[0].pivot.statut;
    }
    return "en_attente";
  };

  const getNbPlaces = (campagne) => {
    if (campagne.pivot?.nb_places) {
      return campagne.pivot.nb_places;
    }
    if (campagne.entreprises && campagne.entreprises[0]?.pivot?.nb_places) {
      return campagne.entreprises[0].pivot.nb_places;
    }
    return null;
  };

  const getMessageRefus = (campagne) => {
    if (campagne.pivot?.message_refus) {
      return campagne.pivot.message_refus;
    }
    if (campagne.entreprises && campagne.entreprises[0]?.pivot?.message_refus) {
      return campagne.entreprises[0].pivot.message_refus;
    }
    return "Aucune raison fournie";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📋 Campagnes de stage disponibles
        </h1>

        {campagnes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">
              Aucune campagne disponible pour votre entreprise
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {campagnes.map((campagne) => {
              const statut = getStatut(campagne);
              const nbPlacesAcceptees = getNbPlaces(campagne);
              const raisonRefus = getMessageRefus(campagne);

              return (
                <motion.div
                  key={campagne.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-xl border-l-4 border-blue-500"
                >
                  {/* En-tête */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {campagne.titre || "Campagne sans titre"}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {campagne.description || "Aucune description fournie."}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap self-start ${
                        statut === "en_attente"
                          ? "bg-yellow-100 text-yellow-700"
                          : statut === "acceptée" || statut === "acceptee"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {statut === "en_attente"
                        ? "⏳ En attente"
                        : statut === "acceptée" || statut === "acceptee"
                        ? "✅ Acceptée"
                        : "❌ Refusée"}
                    </span>
                  </div>

                  {/* Informations de la campagne */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-blue-500 text-lg" />
                      <span className="text-sm">
                        <strong className="text-gray-700">Début :</strong>{" "}
                        <span className="text-gray-600">{formatDate(campagne.date_debut)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-orange-500 text-lg" />
                      <span className="text-sm">
                        <strong className="text-gray-700">Fin :</strong>{" "}
                        <span className="text-gray-600">{formatDate(campagne.date_fin)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiBuilding4Line className="text-purple-500 text-lg" />
                      <span className="text-sm">
                        <strong className="text-gray-700">Métier :</strong>{" "}
                        <span className="text-gray-600">{campagne.metier?.nom || "Non spécifié"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions selon le statut */}
                  {statut === "en_attente" && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setSelectedCampagne(campagne);
                          setActionType("accepter");
                          setNbPlaces(""); // Réinitialiser
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <FiCheck className="text-lg" />
                        Accepter
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCampagne(campagne);
                          setActionType("refuser");
                          setMessageRefus(""); // Réinitialiser
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <FiXCircle className="text-lg" />
                        Refuser
                      </button>
                    </div>
                  )}

                  {/* Message si acceptée */}
                  {(statut === "acceptée" || statut === "acceptee") && (
                    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                        <FiUsers className="text-lg" />
                        Vous avez accepté cette campagne
                        {nbPlacesAcceptees && (
                          <span className="font-bold">
                            ({nbPlacesAcceptees} étudiant{nbPlacesAcceptees > 1 ? "s" : ""} max)
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Message si refusée */}
                  {(statut === "refusée" || statut === "refusee") && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-red-700 text-sm font-medium mb-1">
                        ❌ Campagne refusée
                      </p>
                      <p className="text-red-600 text-xs italic">
                        Raison : {raisonRefus}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔹 MODALE D'ACTION */}
      <AnimatePresence>
        {selectedCampagne && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedCampagne(null);
              setActionType(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Empêcher la fermeture au clic intérieur
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {actionType === "accepter"
                  ? "✅ Accepter la campagne"
                  : "❌ Refuser la campagne"}
              </h3>

              <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Campagne :</strong> {selectedCampagne.titre}
                </p>
              </div>

              {actionType === "accepter" ? (
                <div className="mt-4">
                  <label className="block text-sm text-gray-700 font-medium mb-2">
                    Nombre d'étudiants que vous pouvez accueillir :
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={nbPlaces}
                    onChange={(e) => setNbPlaces(e.target.value)}
                    placeholder="Ex : 5"
                    min="1"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Indiquez le nombre maximum d'étudiants que votre entreprise peut accueillir pour cette campagne.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm text-gray-700 font-medium mb-2">
                    Raison du refus (facultatif) :
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    value={messageRefus}
                    onChange={(e) => setMessageRefus(e.target.value)}
                    placeholder="Ex : Pas de capacité d'accueil cette année"
                    autoFocus
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedCampagne(null);
                    setActionType(null);
                    setNbPlaces("");
                    setMessageRefus("");
                  }}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAction}
                  className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${
                    actionType === "accepter"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampagnesRH;