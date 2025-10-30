import React, { useState } from "react";
// import api from "../api/axios";
import api from "../../../api/axios";   

const LivrableCard = ({ livrable }) => {
  const [note, setNote] = useState(livrable.note || "");
  const [commentaire, setCommentaire] = useState(livrable.commentaire || "");
  const [statut, setStatut] = useState(livrable.statut);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/maitre-stage/livrables/${livrable.id}`,
        { note, commentaire, statut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Livrable mis à jour !");
      console.log(res.data);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("❌ Erreur lors de la mise à jour !");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImage = livrable.fichier_url?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-lg">{livrable.titre}</h2>
      <p className="text-sm text-gray-600">{livrable.description}</p>
      <p className="text-sm">
        <strong>Apprenant :</strong> {livrable.apprenant?.name}
      </p>

      {livrable.fichier_url && (
        <div className="mt-2">
          {isImage ? (
            <>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-blue-500 underline"
              >
                {showPreview ? "Masquer la capture" : "Voir la capture"}
              </button>
              {showPreview && (
                <img
                  src={livrable.fichier_url}
                  alt="Capture du livrable"
                  className="mt-2 rounded-lg border w-full"
                />
              )}
            </>
          ) : (
            <a
              href={livrable.fichier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Télécharger le document
            </a>
          )}
        </div>
      )}

      <div className="mt-3">
        <label className="block text-sm font-semibold">Note :</label>
        <input
          type="number"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1 rounded w-full"
          min="0"
          max="20"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-semibold">Commentaire :</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-semibold">Statut :</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="en_attente">En attente</option>
          <option value="approuve">Approuvé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded-xl py-2 mt-3 hover:bg-blue-700"
      >
        {isSubmitting ? "Enregistrement..." : "💾 Enregistrer"}
      </button>
    </div>
  );
};

export default LivrableCard;
