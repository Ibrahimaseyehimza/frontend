import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function EtudiantsAffectes() {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maitres, setMaitres] = useState([]);
  const [selectedEtudiants, setSelectedEtudiants] = useState([]);
  const [selectedMaitre, setSelectedMaitre] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Charger les étudiants affectés
  const fetchEtudiantsAffectes = async () => {
    try {
      const res = await api.get("/rh/etudiants-affectes");
      setCampagnes(res.data.data || []);
    } catch (error) {
      console.error("Erreur récupération étudiants :", error);
      setErrorMsg("Impossible de charger les étudiants affectés.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les maîtres de stage disponibles
  const fetchMaitresStage = async () => {
    try {
      const res = await api.get("/rh/maitres-stage");
      setMaitres(res.data.data || []);
    } catch (error) {
      console.error("Erreur récupération maîtres :", error);
    }
  };

  useEffect(() => {
    fetchEtudiantsAffectes();
    fetchMaitresStage();
  }, []);

  // Gestion de la sélection d'étudiants
  const toggleEtudiant = (id) => {
    setSelectedEtudiants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 📨 Soumission au maître de stage
  const handleSoumettre = async (campagneId) => {
    if (!selectedMaitre) {
      setErrorMsg("Veuillez sélectionner un maître de stage.");
      return;
    }
    if (selectedEtudiants.length === 0) {
      setErrorMsg("Veuillez sélectionner au moins un étudiant.");
      return;
    }

    try {
      const res = await api.post("/rh/soumettre-maitre-stage", {
        maitre_stage_id: selectedMaitre,
        campagne_id: campagneId,
        etudiants_ids: selectedEtudiants,
        message,
      });

      if (res.data.success) {
        setSuccessMsg("✅ Liste envoyée avec succès au maître de stage !");
        setSelectedEtudiants([]);
        setMessage("");
        setSelectedMaitre("");
      } else {
        setErrorMsg("Erreur lors de la soumission.");
      }
    } catch (error) {
      console.error("Soumission erreur :", error);
      setErrorMsg("✅ Liste envoyée avec succès au maître de stage !");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des entreprises...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        👥 Étudiants affectés
      </h1>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-300">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 border border-green-300">
          {successMsg}
        </div>
      )}

      {campagnes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Aucun étudiant affecté trouvé.
        </div>
      ) : (
        campagnes.map((campagne, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              📅 {campagne.campagne?.titre || "Campagne inconnue"}
            </h2>

            {/* Liste d'étudiants */}
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-blue-50 text-left text-sm text-gray-700">
                  <th className="p-2">Sélection</th>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Prénom</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Téléphone</th>
                  <th className="p-2">Niveau</th>
                </tr>
              </thead>
              <tbody>
                {campagne.etudiants.map((etudiant) => (
                  <tr
                    key={etudiant.etudiant_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEtudiants.includes(
                          etudiant.etudiant_id
                        )}
                        onChange={() => toggleEtudiant(etudiant.etudiant_id)}
                      />
                    </td>
                    <td className="p-2">{etudiant.nom}</td>
                    <td className="p-2">{etudiant.prenom}</td>
                    <td className="p-2">{etudiant.email}</td>
                    <td className="p-2">{etudiant.telephone}</td>
                    <td className="p-2">{etudiant.niveau_etude}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sélection maître + message */}
            <div className="border-t pt-4 mt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={selectedMaitre}
                  onChange={(e) => setSelectedMaitre(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-gray-700 w-full md:w-1/3"
                >
                  <option value="">-- Sélectionner un maître de stage --</option>
                  {maitres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.prenom} ({m.email})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Message (optionnel)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-gray-700 flex-1"
                />

                <button
                  onClick={() => handleSoumettre(campagne.campagne.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  📤 Envoyer au maître de stage
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
