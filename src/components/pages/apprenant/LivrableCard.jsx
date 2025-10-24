import React, { useState } from "react";
import api from "../../../api/axios";

const LivrableCard = ({ livrable, userRole, onUpdate }) => {
  const [note, setNote] = useState(livrable.note || "");
  const [commentaire, setCommentaire] = useState(livrable.commentaire || "");
  const [statut, setStatut] = useState(livrable.statut);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/livrables/${livrable.id}`, {
        note,
        commentaire,
        statut,
      });
      // Mettre à jour le livrable parent
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du livrable.");
    }
  };

  return (
    <div className="border-b p-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-800">{livrable.titre}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statut === "approuve"
              ? "bg-green-100 text-green-700"
              : statut === "rejete"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {statut}
        </span>
      </div>

      <p className="text-gray-600">{livrable.description}</p>

      <div className="flex gap-4 text-gray-500 text-sm mt-2">
        <span>👤 {livrable.apprenant?.name}</span>
        <span>🏢 {livrable.tache?.entreprise?.name || "N/A"}</span>
        <span>📅 {new Date(livrable.created_at).toLocaleDateString()}</span>
        {note !== null && <span>⭐ {note}/20</span>}
      </div>

      {commentaire && (
        <div className="mt-2 p-2 bg-green-50 text-green-700 rounded">💬 {commentaire}</div>
      )}

      {livrable.fichier && (
        <div className="mt-2">
          <a
            href={`http://localhost:8000/storage/${livrable.fichier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Télécharger le fichier
          </a>
        </div>
      )}

      {/* Formulaire de notation uniquement pour le maître de stage */}
      {userRole === "maitre_stage" && (
        <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-2 border-t pt-2">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="20"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note /20"
              className="p-2 border rounded flex-1"
            />
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Commentaire"
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enregistrer
          </button>
        </form>
      )}
    </div>
  );
};

export default LivrableCard;
