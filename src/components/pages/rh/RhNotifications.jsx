import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function RhNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      // 🟢 Utilisation de "api" au lieu de "axios"
      const res = await api.get("/rh/notifications");

      console.log("🔔 Données reçues du backend :", res.data);

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("❌ Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // 🟢 Utilisation de "api" au lieu de "axios"
      await api.post(`/rh/notifications/${id}/marquer-lue`);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Chargement des notifications...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🔔 Notifications RH
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Aucune notification reçue pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-lg p-4 shadow-sm border transition ${
                notif.read_at ? "bg-gray-100" : "bg-white border-blue-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {notif.data?.titre || "Notification"}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line mt-2">
                    {notif.data?.message || "Aucun contenu."}
                  </p>
                </div>

                {!notif.read_at && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    Marquer comme lue
                  </button>
                )}
              </div>

              {notif.read_at && (
                <p className="text-xs text-gray-500 mt-2">
                  ✅ Lue le {new Date(notif.read_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}