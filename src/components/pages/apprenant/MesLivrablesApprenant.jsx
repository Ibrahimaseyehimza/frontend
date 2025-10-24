// import React, { useState, useEffect } from "react";
// import api from "../../../api/axios";
// import NouveauLivrableModal from "./NouveauLivrableModal";
// import LivrableCard from "./LivrableCard";

// const MesLivrablesApprenant = () => {
//   const [livrables, setLivrables] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchLivrables = async () => {
//       try {
//         const res = await api.get("/v1/mes_livrables");
//         setLivrables(res.data);
//       } catch (error) {
//         console.error("Erreur:", error);
//       }
//     };
//     fetchLivrables();
//   }, []);

//   const handleSubmit = async (formData) => {
//     try {
//       await api.post("/v1/livrables_apprenant", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setShowModal(false);
//       alert("✅ Livrable soumis avec succès !");
//     } catch (error) {
//       console.error(error);
//       alert("❌ Erreur lors de la soumission.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800">Mes Livrables</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => setShowModal(true)}
//         >
//           ➕ Soumettre un livrable
//         </button>
//       </div>

//       {livrables.map((livrable) => (
//         <LivrableCard key={livrable.id} livrable={livrable} />
//       ))}

//       <NouveauLivrableModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// };

// export default MesLivrablesApprenant;







import React, { useState, useEffect, useMemo } from "react";
// import api from "../../../api/axios"; // Assure-toi que ce fichier existe
import api from "../../../api/axios";

const MesLivrablesApprenant = () => {
  const [livrables, setLivrables] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [showModal, setShowModal] = useState(false);

  // Charger les livrables de l'apprenant connecté
  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const res = await api.get("/mes_livrables");
        setLivrables(res.data);
        console.log("📦 Livrables chargés :", res.data);
      } catch (err) {
        console.error("❌ Erreur de chargement des livrables :", err);
      }
    };
    fetchLivrables();
  }, []);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = livrables.length;
    const approuves = livrables.filter(l => l.statut === "approuve").length;
    const enRevision = livrables.filter(l => l.statut === "en_revision").length;
    const rejetes = livrables.filter(l => l.statut === "rejete").length;
    const enAttente = livrables.filter(l => l.statut === "en_attente").length;
    const enRetard = livrables.filter(l => l.statut === "en_retard").length;
    return { total, approuves, enRevision, rejetes, enAttente, enRetard };
  }, [livrables]);

  // Filtrage dynamique
  const livrablesFiltres = livrables.filter((l) => {
    const matchesSearch = l.titre.toLowerCase().includes(search.toLowerCase());
    const matchesStatut = filterStatut === "Tous" || l.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  // Soumission du nouveau livrable
  const handleSubmitLivrable = async (formData) => {
    try {
      const res = await api.post("/livrables_apprenant", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLivrables([res.data, ...livrables]);
      setShowModal(false);
      alert("✅ Livrable soumis avec succès !");
    } catch (err) {
      console.error("❌ Erreur lors de la soumission :", err);
      alert("Erreur lors de la soumission du livrable.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Livrables</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          ➕ Soumettre un livrable
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} color="text-blue-600" />
        <StatCard label="Approuvés" value={stats.approuves} color="text-green-600" />
        <StatCard label="En révision" value={stats.enRevision} color="text-blue-600" />
        <StatCard label="Rejetés" value={stats.rejetes} color="text-red-600" />
        <StatCard label="En attente" value={stats.enAttente} color="text-yellow-600" />
        <StatCard label="En retard" value={stats.enRetard} color="text-orange-600" />
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un livrable..."
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option>Tous</option>
          <option>approuve</option>
          <option>en_revision</option>
          <option>rejete</option>
          <option>en_attente</option>
          <option>en_retard</option>
        </select>
      </div>

      {/* Liste des livrables */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {livrablesFiltres.length > 0 ? (
          livrablesFiltres.map((l) => (
            <div key={l.id} className="p-4 border-b">
              <h2 className="font-semibold text-lg">{l.titre}</h2>
              <p className="text-gray-600">{l.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Statut : <span className="font-medium">{l.statut}</span>
              </p>
              {l.fichier && (
                <a
                  href={`http://127.0.0.1:8000/storage/${l.fichier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  📂 Voir le fichier
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">Aucun livrable trouvé.</p>
        )}
      </div>

      {/* Modal intégré */}
      <NouveauLivrableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitLivrable}
      />
    </div>
  );
};

// ✅ Sous-composant : Carte de statistiques
const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow p-4 rounded text-center">
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-500 text-sm">{label}</div>
  </div>
);

// ✅ Sous-composant intégré : Modal de soumission
const NouveauLivrableModal = ({ show, onClose, onSubmit }) => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);
  const [tacheId, setTacheId] = useState("");

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("tache_id", tacheId);
    if (fichier) formData.append("fichier", fichier);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Soumettre un livrable</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre du livrable"
            className="w-full border p-2 mb-3 rounded"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 mb-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="ID de la tâche (tache_id)"
            className="w-full border p-2 mb-3 rounded"
            value={tacheId}
            onChange={(e) => setTacheId(e.target.value)}
            required
          />
          <input
            type="file"
            onChange={(e) => setFichier(e.target.files[0])}
            className="w-full mb-3"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MesLivrablesApprenant;
