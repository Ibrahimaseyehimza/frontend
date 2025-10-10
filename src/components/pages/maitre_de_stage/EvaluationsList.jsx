// src/components/pages/EvaluationsList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const EvaluationsList = () => {
  const [stages, setStages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchStages = async () => {
      const res = await api.get("/stages");
      setStages(res.data.data ?? []);
    };
    fetchStages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/stages/${selectedId}/evaluer`, { note });
      alert("Évaluation enregistrée ✅");
      setSelectedId(null);
      setNote("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur d’évaluation");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Évaluer un stagiaire</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedId || ""}
          onChange={(e) => setSelectedId(e.target.value)}
          required
        >
          <option value="">-- Choisir un stagiaire --</option>
          {stages.map((st) => (
            <option key={st.id} value={st.id}>
              {st.etudiant?.name} — {st.entreprise?.nom}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          max="20"
          step="0.5"
          placeholder="Note sur 20"
          className="w-full p-2 border rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EvaluationsList;
