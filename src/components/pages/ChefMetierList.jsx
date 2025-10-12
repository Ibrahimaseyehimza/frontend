// src/components/pages/ChefMetierList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiEdit2, FiTrash2, FiUserPlus, FiMail, FiBriefcase, FiUser } from "react-icons/fi";
import { BsPersonBadge } from "react-icons/bs";

const ChefMetierList = () => {
  const [metiers, setMetiers] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "chef_metier",
    metier_id: "",
  });

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = async (showLoader = false) => {
    if (showLoader) setPageLoading(true);
    try {
      const [metiersRes, chefsRes] = await Promise.all([
        api.get("/metiers"),
        api.get("/chefs-de-metier"),
      ]);
      setMetiers(metiersRes.data.data || []);
      setChefs(chefsRes.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
      setMetiers([]);
      setChefs([]);
    } finally {
      if (showLoader) setPageLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      alert("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/chefs-de-metier/${editingId}`, form);
        setChefs(chefs.map((chef) => (chef.id === editingId ? res.data.data : chef)));
        alert("✅ Chef de métier mis à jour");
      } else {
        const res = await api.post("/chefs-de-metier", form);
        setChefs([...chefs, res.data.data]);
        alert("✅ Chef de métier créé avec succès");
      }

      setForm({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "chef_metier",
        metier_id: "",
      });
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ " + (err.response?.data?.message || "Erreur lors de l'enregistrement"));
    }
  };

  const handleEdit = (chef) => {
    setForm({
      nom: chef.nom,
      prenom: chef.prenom,
      email: chef.email,
      password: "",
      password_confirmation: "",
      role: "chef_metier",
      metier_id: chef.metier_id || "",
    });
    setEditingId(chef.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce chef de métier ?")) return;
    try {
      await api.delete(`/chefs-de-metier/${id}`);
      setChefs(chefs.filter((chef) => chef.id !== id));
      alert("✅ Chef de métier supprimé");
    } catch (err) {
      console.error("Erreur suppression", err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredChefs = chefs.filter(
    (chef) =>
      chef.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.metier?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: chefs.length,
    metiersCouvert: [...new Set(chefs.map((c) => c.metier_id).filter(Boolean))].length,
    actifs: chefs.filter((c) => c.email).length,
  };

  const getMetierName = (metierId) => {
    const metier = metiers.find((m) => m.id === metierId);
    return metier ? metier.nom : "Non attribué";
  };

  const getRandomColor = (id) => {
    const colors = [
      "bg-blue-600",
      "bg-indigo-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-red-600",
      "bg-orange-600",
      "bg-yellow-600",
      "bg-green-600",
      "bg-teal-600",
      "bg-cyan-600",
    ];
    return colors[id % colors.length];
  };

  const getInitials = (nom, prenom) => {
    const n = nom?.charAt(0) || "";
    const p = prenom?.charAt(0) || "";
    return (n + p).toUpperCase() || "CM";
  };

  if (pageLoading) {
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
              Gestion des Chefs de Métier
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les responsables de chaque filière
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({
                nom: "",
                prenom: "",
                email: "",
                password: "",
                password_confirmation: "",
                role: "chef_metier",
                metier_id: "",
              });
            }}
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors"
          >
            <FiUserPlus size={20} />
            <span>Nouveau Chef de Métier</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 mt-2">Total Chefs de Métier</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-green-600">{stats.actifs}</div>
          <div className="text-gray-600 mt-2">Actifs</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-purple-600">
            {stats.metiersCouvert}
          </div>
          <div className="text-gray-600 mt-2">Métiers Couverts</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Rechercher un chef de métier (nom, prénom, email, métier)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grille des chefs de métier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChefs.length > 0 ? (
          filteredChefs.map((chef) => (
            <div
              key={chef.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
            >
              {/* En-tête avec avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar avec initiales */}
                  <div
                    className={`w-14 h-14 ${getRandomColor(
                      chef.id
                    )} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-lg font-bold">
                      {getInitials(chef.nom, chef.prenom)}
                    </span>
                  </div>

                  {/* Nom et prénom */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {chef.prenom} {chef.nom}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <BsPersonBadge size={14} />
                      <span className="truncate">Chef de Métier</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge Métier */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <FiBriefcase size={14} />
                  {getMetierName(chef.metier_id)}
                </span>
              </div>

              {/* Informations de contact */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiUser className="text-gray-400 flex-shrink-0" size={16} />
                  <span className="truncate">
                    {chef.nom} {chef.prenom}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiMail className="text-gray-400 flex-shrink-0" size={16} />
                  <span className="truncate">{chef.email}</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(chef)}
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiEdit2 size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(chef.id)}
                  className="bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* Footer - Date de création */}
              {chef.created_at && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
                  Créé le{" "}
                  {new Date(chef.created_at).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-lg shadow text-center">
            <div className="text-6xl mb-4">👨‍💼</div>
            <p className="text-xl text-gray-500">Aucun chef de métier trouvé</p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Essayez une autre recherche"
                : "Cliquez sur 'Nouveau Chef de Métier' pour commencer"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId
                  ? "Modifier le Chef de Métier"
                  : "Nouveau Chef de Métier"}
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
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="nom"
                    placeholder="Ex: Diallo"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="prenom"
                    placeholder="Ex: Amadou"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  placeholder="amadou.diallo@isep-thies.edu.sn"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Métier *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="metier_id"
                  value={form.metier_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner un métier --</option>
                  {metiers.map((metier) => (
                    <option key={metier.id} value={metier.id}>
                      {metier.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe {editingId ? "" : "*"}
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required={!editingId}
                  />
                  {editingId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Laissez vide pour ne pas modifier
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe {editingId ? "" : "*"}
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    name="password_confirmation"
                    placeholder="••••••••"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required={!editingId}
                  />
                </div>
              </div>

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
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? "✅ Mettre à jour" : "✅ Créer le Chef de Métier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefMetierList;