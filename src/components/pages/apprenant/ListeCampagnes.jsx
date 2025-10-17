// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";
// // import { useAuth } from "../../AuthContext";
// import { useAuth } from "../../../AuthContext";

// const ListeCampagne = () => {
//   const { token, user } = useAuth();
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCampagnes = async () => {
//       try {
//         const response = await api.get("/campagnes/apprenant", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const campagnesData = response.data.data || [];
//         setCampagnes(campagnesData);
//       } catch (error) {
//         console.error("Erreur chargement campagnes:", error);
//         setCampagnes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchCampagnes();
//   }, [token]);

//   if (loading) return <p className="text-center mt-10">Chargement des campagnes...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-3 text-blue-700">Campagnes disponibles</h2>
//       {campagnes.length === 0 ? (
//         <p>Aucune campagne disponible pour ton métier.</p>
//       ) : (
//         <ul className="space-y-4">
//           {campagnes.map((campagne) => (
//             <li key={campagne.id} className="border rounded-lg p-4 shadow-md hover:bg-gray-50">
//               <h3 className="text-lg font-semibold text-blue-600">{campagne.titre}</h3>
//               <p>{campagne.description}</p>
//               <p className="text-sm text-gray-500">
//                 📅 Du {campagne.date_debut} au {campagne.date_fin}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>  
//   );
// };

// export default ListeCampagne;
















import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../AuthContext";

const ListeCampagne = () => {
  const { token, user } = useAuth();
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [entrepriseId, setEntrepriseId] = useState("");
  const [adresse1, setAdresse1] = useState("");
  const [adresse2, setAdresse2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Charger les campagnes disponibles pour le métier de l’apprenant
  useEffect(() => {
    const fetchCampagnes = async () => {
      try {
        const response = await api.get("/campagnes/apprenant", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampagnes(response.data.data || []);
      } catch (error) {
        console.error("Erreur chargement campagnes:", error);
        setCampagnes([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCampagnes();
  }, [token]);

  // 🔹 Soumission de la candidature
  const handlePostuler = async (e) => {
    e.preventDefault();
    if (!selectedCampagne || !entrepriseId || !adresse1) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(
        "/apprenant/postuler",
        {
          campagne_id: selectedCampagne.id,
          entreprise_id: entrepriseId,
          adresse_1: adresse1,
          adresse_2: adresse2,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message || "Candidature envoyée avec succès 🎉");
      setSelectedCampagne(null);
      setAdresse1("");
      setAdresse2("");
      setEntrepriseId("");
    } catch (error) {
      console.error("Erreur postulation:", error);
      setMessage(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la soumission."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Chargement des campagnes...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Campagnes de stage disponibles
      </h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg shadow">
          {message}
        </div>
      )}

      {campagnes.length === 0 ? (
        <p className="text-gray-600">
          Aucune campagne ouverte pour ton métier actuellement.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campagnes.map((campagne) => (
            <div
              key={campagne.id}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {campagne.titre}
              </h3>
              <p className="text-gray-600 text-sm mt-1 mb-3">
                {campagne.description || "Aucune description fournie."}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                📅 Du <strong>{campagne.date_debut}</strong> au{" "}
                <strong>{campagne.date_fin}</strong>
              </p>

              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Entreprises disponibles :
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 mb-3">
                {campagne.entreprises.map((ent) => (
                  <li key={ent.id}>{ent.nom}</li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedCampagne(campagne)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Postuler
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 MODAL POSTULATION */}
      {selectedCampagne && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
              Postuler à la campagne : {selectedCampagne.titre}
            </h3>

            <form onSubmit={handlePostuler} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choisir une entreprise
                </label>
                <select
                  value={entrepriseId}
                  onChange={(e) => setEntrepriseId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {selectedCampagne.entreprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse 1 (obligatoire)
                </label>
                <input
                  type="text"
                  value={adresse1}
                  onChange={(e) => setAdresse1(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  placeholder="Ex : Quartier Médina, Dakar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse 2 (optionnelle)
                </label>
                <input
                  type="text"
                  value={adresse2}
                  onChange={(e) => setAdresse2(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  placeholder="Ex : Mermoz, Dakar"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCampagne(null)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Soumettre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeCampagne;
