import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TachesMaitre() {
  const [taches, setTaches] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [form, setForm] = useState({
    etudiant_id: "",
    titre: "",
    description: "",
    date_echeance: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Charger les étudiants affectés à ce maître
  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/maitre/etudiants-affectes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEtudiants(res.data.etudiants || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTaches = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/maitre/taches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaches(res.data.taches || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEtudiants();
    fetchTaches();
  }, [token]);

  // 🟢 Créer une tâche
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/maitre/taches", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTaches([res.data.tache, ...taches]);
        setMessage("✅ Tâche créée avec succès !");
        setForm({ etudiant_id: "", titre: "", description: "", date_echeance: "" });
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la création de la tâche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">📝 Créer une nouvelle tâche</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Étudiant :</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.etudiant_id}
              onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}
              required
            >
              <option value="">-- Sélectionnez un étudiant --</option>
              {etudiants.map((etu) => (
                <option key={etu.id} value={etu.id}>
                  {etu.prenom} {etu.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Titre :</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description :</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Date d’échéance :</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={form.date_echeance}
              onChange={(e) => setForm({ ...form, date_echeance: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            {loading ? "Création..." : "Créer la tâche"}
          </button>

          {message && <p className="text-center mt-3 text-green-600">{message}</p>}
        </form>
      </div>

      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">📋 Liste des tâches</h3>

        {taches.length === 0 ? (
          <p className="text-gray-500">Aucune tâche pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {taches.map((tache) => (
              <li
                key={tache.id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{tache.titre}</h4>
                    <p className="text-gray-600 text-sm mt-1">{tache.description}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Étudiant :{" "}
                      <span className="font-medium">
                        {tache.etudiant?.prenom} {tache.etudiant?.nom}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    ⏰ Échéance : {tache.date_echeance}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
