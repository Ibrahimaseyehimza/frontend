// // src/components/pages/RhList.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";

// const RhList = () => {
//   const [rhs, setRhs] = useState([]);
//   const [entreprises, setEntreprises] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     prenom: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     entreprise_id: "",
//   });

//   // Charger RH + entreprises
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [rhRes, entRes] = await Promise.all([
//           api.get("/rhs"),
//           api.get("/entreprises_global"),
//         ]);

//         console.log("👉 Données RH:", rhRes.data);
//         console.log("👉 Données Entreprises:", entRes.data);

//         setRhs(rhRes.data.data ?? []);
//         setEntreprises(entRes.data.data ?? []); 
//       } catch (err) {
//         console.error("Erreur lors du chargement:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Gérer les champs
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // Créer ou mettre à jour
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         const res = await api.put(`/rhs/${editingId}`, form);
//         setRhs(rhs.map((r) => (r.id === editingId ? res.data.data : r)));
//         alert("RH mis à jour");
//       } else {
//         const res = await api.post("/rhs", form);
//         setRhs([...rhs, res.data.data]);
//         alert("RH créé");
//       }

//       // Reset form
//       setForm({
//         name: "",
//         prenom: "",
//         email: "",
//         password: "",
//         password_confirmation: "",
//         entreprise_id: "",
//       });
//       setEditingId(null);
//     } catch (err) {
//       console.error(err.response?.data || err);
//       alert(err.response?.data?.message || "Erreur lors de l’enregistrement");
//     }
//   };

//   // Préparer édition
//   const handleEdit = (rh) => {
//     setForm({
//       name: rh.name,
//       prenom: rh.prenom,
//       email: rh.email,
//       password: "",
//       password_confirmation: "",
//       entreprise_id: rh.entreprise_id,
//     });
//     setEditingId(rh.id);
//   };

//   // Supprimer
//   const handleDelete = async (id) => {
//     if (!window.confirm("Supprimer ce RH ?")) return;
//     try {
//       await api.delete(`/rhs/${id}`);
//       setRhs(rhs.filter((r) => r.id !== id));
//       alert("RH supprimé");
//     } catch (err) {
//       console.error(err.response?.data || err);
//       alert("Erreur lors de la suppression");
//     }
//   };

//   if (loading) return <p>Chargement...</p>;

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-6">Gestion des RH</h2>

//       {/* Formulaire */}
//       <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//         <input
//           className="w-full p-2 border rounded"
//           name="name"
//           placeholder="Nom"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="w-full p-2 border rounded"
//           name="prenom"
//           placeholder="Prénom"
//           value={form.prenom}
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="w-full p-2 border rounded"
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         {!editingId && (
//           <>
//             <input
//               className="w-full p-2 border rounded"
//               type="password"
//               name="password"
//               placeholder="Mot de passe"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full p-2 border rounded"
//               type="password"
//               name="password_confirmation"
//               placeholder="Confirmer le mot de passe"
//               value={form.password_confirmation}
//               onChange={handleChange}
//               required
//             />
//           </>
//         )}
//         <select
//           className="w-full p-2 border rounded"
//           name="entreprise_id"
//           value={form.entreprise_id}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Choisir une entreprise --</option>
//           {entreprises.map((ent) => (
//             <option key={ent.id} value={ent.id}>
//               {ent.nom}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           {editingId ? "Mettre à jour" : "Ajouter"}
//         </button>
//       </form>

//       {/*Liste */}
//       <h3 className="text-xl font-semibold mb-3">Liste des RH</h3>
//       {rhs.length === 0 ? (
//         <p>Aucun RH trouvé.</p>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">Nom</th>
//               <th className="p-2 border">Prénom</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Entreprise</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rhs.map((rh) => (
//               <tr key={rh.id} className="text-center">
//                 <td className="p-2 border">{rh.name}</td>
//                 <td className="p-2 border">{rh.prenom}</td>
//                 <td className="p-2 border">{rh.email}</td>
//                 <td className="p-2 border">
//                   {rh.entreprise?.nom || "-"}
//                 </td>
//                 <td className="p-2 border space-x-2">
//                   <button
//                     onClick={() => handleEdit(rh)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                   >
//                     Modifier
//                   </button>
//                   <button
//                     onClick={() => handleDelete(rh.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Supprimer
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default RhList;
  












import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";
import api from "../../api/axios";
import { FiCalendar, FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";

const CampagneRH = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/campagnes_rh");
      setCampagnes(res.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const endpoint = `/v1/rh/campagnes/${id}/${action}`;
      const res = await api.post(endpoint);
      alert(res.data.message);
      fetchCampagnes();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const filtered = campagnes.filter((c) =>
    c.titre?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Chargement des campagnes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Campagnes de Stage Reçues
      </h1>
      <p className="text-gray-600 mb-6">
        Voici les campagnes envoyées par les chefs de département.
      </p>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une campagne..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <p className="text-gray-500 text-lg">Aucune campagne disponible</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((campagne) => (
            <div
              key={campagne.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {campagne.titre}
                  </h2>
                  <p className="text-gray-600 mt-1">{campagne.description}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campagne.pivot?.statut === "acceptée"
                      ? "bg-green-100 text-green-700"
                      : campagne.pivot?.statut === "refusée"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {campagne.pivot?.statut || "en attente"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiCalendar className="text-blue-500" /> 
                  <span>
                    Début : {formatDate(campagne.date_debut)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiCalendar className="text-orange-500" /> 
                  <span>
                    Fin : {formatDate(campagne.date_fin)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BsBuilding className="text-purple-500" /> 
                  <span>
                    Métier : {campagne.metier?.nom || "N/A"}
                  </span>
                </div>
              </div>

              {/* Boutons d’action */}
              {campagne.pivot?.statut === "en attente" && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleAction(campagne.id, "accepter")}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle /> Accepter
                  </button>
                  <button
                    onClick={() => handleAction(campagne.id, "refuser")}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <FiXCircle /> Refuser
                  </button>
                </div>
              )}

              <div className="mt-4 text-right text-xs text-gray-400">
                Créée le {formatDate(campagne.created_at)} par{" "}
                <span className="font-medium text-gray-600">
                  {campagne.chef_departement?.nom || "Chef Département"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampagneRH;
