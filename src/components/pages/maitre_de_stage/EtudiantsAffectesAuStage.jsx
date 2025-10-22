// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";

// export default function EtudiantsAffectes() {
//   const [etudiants, setEtudiants] = useState([]);
//   const [entreprise, setEntreprise] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchEtudiants = async () => {
//     try {
//       const res = await api.get("/maitre-stage/etudiants-affectes");
//       console.log("📦 Étudiants récupérés :", res.data);

//       if (res.data.success) {
//         setEtudiants(res.data.etudiants || []);
//         setEntreprise(res.data.entreprise || "");
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors du chargement :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEtudiants();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Chargement des étudiants affectés...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         🎓 Étudiants affectés à l’entreprise {entreprise || ""}
//       </h1>

//       {etudiants.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
//           Aucun étudiant affecté à cette entreprise pour le moment.
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Nom complet
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Email
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Téléphone
//                 </th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
//                   Département
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {etudiants.map((etd) => (
//                 <tr key={etd.id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2 text-gray-800">
//                     {etd.name} {etd.prenom}
//                   </td>
//                   <td className="px-4 py-2 text-gray-600">{etd.email}</td>
//                   <td className="px-4 py-2 text-gray-600">{etd.telephone || "-"}</td>
//                   <td className="px-4 py-2 text-gray-600">
//                     {etd.departement?.nom || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// // export default EtudiantsAffectes;



import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";

const EtudiantsAffectesAuStage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 🔔 Route pour les nouvelles affectations uniquement
        const response = await axios.get("/maitre-stage/notifications-affectations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🔔 Notifications:", response.data);

        if (response.data.success || response.data) {
          setNotifications(response.data.notifications || response.data.data || []);
        } else {
          setError("Erreur de récupération des notifications");
        }
      } catch (err) {
        console.error("❌ Erreur:", err);
        setError(err.response?.data?.message || "Impossible de charger les notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const marquerCommeLue = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/maitre-stage/notifications/${notificationId}/lire`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettre à jour l'état local
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, lue: true } : notif
      ));
    } catch (err) {
      console.error("Erreur lors du marquage:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg font-medium">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  const notificationsNonLues = notifications.filter(n => !n.lue);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {/* 🔹 En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🔔 Notifications d'affectation
          </h2>
          {notificationsNonLues.length > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {notificationsNonLues.length} nouvelle{notificationsNonLues.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* 🔹 Liste des notifications */}
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">
              Aucune nouvelle affectation pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 transition ${
                  notification.lue
                    ? "bg-gray-50 border-gray-300"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {!notification.lue && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <h3 className="font-semibold text-gray-900">
                        {notification.titre || "Nouvelle affectation"}
                      </h3>
                    </div>
                    
                    <p className="text-gray-700 mb-2">
                      {notification.message || 
                        `Un nouvel étudiant vous a été affecté : ${notification.etudiant?.prenom} ${notification.etudiant?.nom}`
                      }
                    </p>

                    {notification.etudiant && (
                      <div className="bg-white p-3 rounded border border-gray-200 mt-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Nom:</span>
                            <span className="ml-2 font-medium">
                              {notification.etudiant.prenom} {notification.etudiant.nom}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <span className="ml-2 text-blue-600">
                              {notification.etudiant.email}
                            </span>
                          </div>
                          {notification.etudiant.campagne && (
                            <div>
                              <span className="text-gray-500">Campagne:</span>
                              <span className="ml-2">{notification.etudiant.campagne}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {!notification.lue && (
                    <button
                      onClick={() => marquerCommeLue(notification.id)}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Marquer comme lue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EtudiantsAffectesAuStage;