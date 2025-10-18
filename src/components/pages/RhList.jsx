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
import { FiEdit2, FiTrash2, FiUserPlus, FiMail, FiUser, FiSearch, FiRefreshCw } from "react-icons/fi";
import { BsPersonBadge, BsBuilding } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";

const RhList = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entrepriseFilter, setEntrepriseFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    entreprise_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rhRes, entRes] = await Promise.all([
        api.get("/rhs"),
        api.get("/entreprises"),
      ]);

      console.log("👉 Données RH:", rhRes.data);
      console.log("👉 Données Entreprises:", entRes.data);

      setRhs(rhRes.data.data ?? []);
      setEntreprises(entRes.data.data ?? []);
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
      setRhs([]);
      setEntreprises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && form.password !== form.password_confirmation) {
      alert("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/rhs/${editingId}`, form);
        setRhs(rhs.map((r) => (r.id === editingId ? res.data.data : r)));
        alert("✅ RH mis à jour avec succès");
      } else {
        const res = await api.post("/rhs", form);
        setRhs([...rhs, res.data.data]);
        alert("✅ RH créé avec succès");
      }

      setForm({
        name: "",
        prenom: "",
        email: "",
        password: "",
        password_confirmation: "",
        entreprise_id: "",
      });
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ " + (err.response?.data?.message || "Erreur lors de l'enregistrement"));
    }
  };

  const handleEdit = (rh) => {
    setForm({
      name: rh.name,
      prenom: rh.prenom,
      email: rh.email,
      password: "",
      password_confirmation: "",
      entreprise_id: rh.entreprise_id || "",
    });
    setEditingId(rh.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce RH ?")) return;
    try {
      await api.delete(`/rhs/${id}`);
      setRhs(rhs.filter((r) => r.id !== id));
      alert("✅ RH supprimé avec succès");
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredRhs = rhs.filter((rh) => {
    const matchSearch =
      rh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rh.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rh.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rh.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEntreprise =
      entrepriseFilter === "all" || rh.entreprise_id === parseInt(entrepriseFilter);

    return matchSearch && matchEntreprise;
  });

  const stats = {
    total: rhs.length,
    parEntreprise: [...new Set(rhs.map((r) => r.entreprise_id).filter(Boolean))].length,
    actifs: rhs.filter((r) => r.email).length,
  };

  const getInitials = (name, prenom) => {
    const n = name?.charAt(0) || "";
    const p = prenom?.charAt(0) || "";
    return (n + p).toUpperCase() || "RH";
  };

  const getRandomColor = (id) => {
    const colors = [
      "bg-blue-600",
      "bg-indigo-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-red-600",
      "bg-orange-600",
      "bg-green-600",
      "bg-teal-600",
      "bg-cyan-600",
    ];
    return colors[id % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Ressources Humaines
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les responsables RH de chaque entreprise partenaire
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({
                name: "",
                prenom: "",
                email: "",
                password: "",
                password_confirmation: "",
                entreprise_id: "",
              });
            }}
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all"
          >
            <FiUserPlus size={20} />
            <span>Nouveau RH</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total RH</p>
              <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <BsPersonBadge className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">RH Actifs</p>
              <div className="text-4xl font-bold text-green-600">{stats.actifs}</div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <FiUser className="text-green-600" size={28} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Entreprises</p>
              <div className="text-4xl font-bold text-purple-600">{stats.parEntreprise}</div>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <BsBuilding className="text-purple-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <BsBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={entrepriseFilter}
              onChange={(e) => setEntrepriseFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Toutes les entreprises</option>
              {entreprises.map((entreprise) => (
                <option key={entreprise.id} value={entreprise.id}>
                  {entreprise.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grille des RH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRhs.length > 0 ? (
          filteredRhs.map((rh) => (
            <div
              key={rh.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
            >
              {/* En-tête avec avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-14 h-14 ${getRandomColor(
                      rh.id
                    )} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    <span className="text-white text-lg font-bold">
                      {getInitials(rh.name, rh.prenom)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {rh.name} {rh.prenom}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <BsPersonBadge size={14} />
                      <span className="truncate">Responsable RH</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge Entreprise */}
              {rh.entreprise?.nom && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <BsBuilding size={12} />
                    {rh.entreprise.nom}
                  </span>
                </div>
              )}

              {/* Informations de contact */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiUser className="text-gray-400 flex-shrink-0" size={16} />
                  <span className="truncate">
                    {rh.name} {rh.prenom}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiMail className="text-gray-400 flex-shrink-0" size={16} />
                  <span className="truncate">{rh.email}</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(rh)}
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiEdit2 size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(rh.id)}
                  className="bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* Footer - Date de création */}
              {rh.created_at && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
                  Créé le{" "}
                  {new Date(rh.created_at).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-xl text-gray-500">Aucun RH trouvé</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || entrepriseFilter !== "all"
                ? "Essayez une autre recherche"
                : "Cliquez sur 'Nouveau RH' pour commencer"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Modifier le RH" : "Nouveau RH"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="name"
                      placeholder="Ex: Diallo"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="prenom"
                      placeholder="Ex: Amadou"
                      value={form.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    name="email"
                    placeholder="amadou.diallo@entreprise.sn"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise *
                </label>
                <div className="relative">
                  <BsBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    name="entreprise_id"
                    value={form.entreprise_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner une entreprise --</option>
                    {entreprises.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required={!editingId}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        name="password_confirmation"
                        placeholder="••••••••"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required={!editingId}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium shadow-md"
                >
                  {editingId ? "✅ Mettre à jour" : "✅ Créer le RH"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RhList;