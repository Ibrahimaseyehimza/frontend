import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiEye, FiEdit2, FiMail, FiPhone, FiMapPin, FiMoreVertical } from "react-icons/fi";
import { BsBuilding, BsPerson } from "react-icons/bs";

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [metiers, setMetiers] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    email: "",
    telephone: "",
    latitude: "",
    longitude: "",
    metier_id: "",
    contact_name: "",
  });

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = async (showLoader = false) => {
    if (showLoader) setPageLoading(true);
    try {
      const [entrepriseRes, metierRes] = await Promise.all([
        api.get("/entreprises"),
        api.get("/metiers"),
      ]);
      setEntreprises(entrepriseRes.data.data ?? []);
      setMetiers(metierRes.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setEntreprises([]);
      setMetiers([]);
    } finally {
      if (showLoader) setPageLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/entreprises/${editingId}`, form);
        setEntreprises(
          entreprises.map((ent) =>
            ent.id === editingId ? res.data.data : ent
          )
        );
        alert("✅ Entreprise mise à jour");
      } else {
        const res = await api.post("/entreprises", form);
        setEntreprises([...entreprises, res.data.data]);
        alert("✅ Entreprise créée");
      }

      setForm({
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        latitude: "",
        longitude: "",
        metier_id: "",
        contact_name: "",
      });
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        "❌ " +
          (err.response?.data?.message ||
            err.response?.data?.error ||
            "Erreur lors de l'enregistrement")
      );
    }
  };

  const handleEdit = (entreprise) => {
    setForm({
      nom: entreprise.nom,
      adresse: entreprise.adresse,
      email: entreprise.email,
      telephone: entreprise.telephone,
      latitude: entreprise.latitude || "",
      longitude: entreprise.longitude || "",
      metier_id: entreprise.metier_id || "",
      contact_name: entreprise.contact_name || "",
    });
    setEditingId(entreprise.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette entreprise ?")) return;
    try {
      await api.delete(`/entreprises/${id}`);
      setEntreprises(entreprises.filter((ent) => ent.id !== id));
      alert("✅ Entreprise supprimée");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredEntreprises = entreprises.filter((ent) => {
    const matchSearch =
      ent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && ent.email && ent.telephone);

    return matchSearch && matchStatus;
  });

  const stats = {
    total: entreprises.length,
    actives: entreprises.filter((e) => e.email && e.telephone).length,
    secteurs: [...new Set(entreprises.map((e) => e.metier_id).filter(Boolean))]
      .length,
  };

  const getMetierName = (metierId) => {
    const metier = metiers.find((m) => m.id === metierId);
    return metier ? metier.nom : "Non spécifié";
  };

  // Générer des couleurs aléatoires pour les logos
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
              Entreprises Partenaires
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos entreprises et leurs informations de contact
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({
                nom: "",
                adresse: "",
                email: "",
                telephone: "",
                latitude: "",
                longitude: "",
                metier_id: "",
                contact_name: "",
              });
            }}
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors"
          >
            <span className="text-xl">+</span>
            <span>Ajouter une entreprise</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 mt-2">Total entreprises</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-green-600">
            {stats.actives}
          </div>
          <div className="text-gray-600 mt-2">Actives</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-5xl font-bold text-orange-600">
            {stats.secteurs}
          </div>
          <div className="text-gray-600 mt-2">Secteurs</div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Entreprises actives</option>
          </select>
        </div>
      </div>

      {/* Grille d'entreprises */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEntreprises.length > 0 ? (
          filteredEntreprises.map((ent) => (
            <div
              key={ent.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
            >
              {/* En-tête avec logo et menu */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Logo entreprise */}
                  <div
                    className={`w-12 h-12 ${getRandomColor(
                      ent.id
                    )} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <BsBuilding className="text-white text-xl" />
                  </div>

                  {/* Nom et secteur */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {ent.nom}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {getMetierName(ent.metier_id)}
                    </p>
                  </div>
                </div>

                {/* Menu trois points */}
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <FiMoreVertical size={20} />
                </button>
              </div>

              {/* Badge Active */}
              {ent.email && ent.telephone && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </div>
              )}

              {/* Informations de contact */}
              <div className="space-y-3 mb-4">
                {/* Localisation */}
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                  <span className="break-words">
                    {ent.adresse || "Adresse non renseignée"}
                  </span>
                </div>

                {/* Contact */}
                {ent.contact_name && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BsPerson className="text-gray-400 flex-shrink-0" size={16} />
                    <span className="truncate">{ent.contact_name}</span>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiMail className="text-gray-400 flex-shrink-0" size={16} />
                  <span className="truncate">
                    {ent.email || "Non renseigné"}
                  </span>
                </div>

                {/* Téléphone */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiPhone className="text-gray-400 flex-shrink-0" size={16} />
                  <span>{ent.telephone || "Non renseigné"}</span>
                </div>
              </div>

              {/* Adresse complète */}
              <div className="text-xs text-gray-500 mb-4 pb-4 border-t border-gray-100 pt-4">
                {ent.adresse || "Adresse non disponible"}
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(ent)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiEye size={16} />
                  <span>Voir profil</span>
                </button>
                <button
                  onClick={() => handleEdit(ent)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiEdit2 size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => window.open(`mailto:${ent.email}`)}
                  disabled={!ent.email}
                  className={`bg-dégradé text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors ${
                    !ent.email ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiMail size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-lg shadow text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-500">Aucune entreprise trouvée</p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Essayez une autre recherche"
                : "Cliquez sur 'Ajouter une entreprise' pour commencer"}
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
                {editingId ? "Modifier l'entreprise" : "Nouvelle entreprise"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setForm({
                    nom: "",
                    adresse: "",
                    email: "",
                    telephone: "",
                    latitude: "",
                    longitude: "",
                    metier_id: "",
                    contact_name: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="nom"
                  placeholder="Ex: Orange Sénégal"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="metier_id"
                  value={form.metier_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner un secteur --</option>
                  {metiers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du contact
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="contact_name"
                  placeholder="Ex: Marie Faye"
                  value={form.contact_name}
                  onChange={handleChange}
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète *
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="adresse"
                  placeholder="Ex: Immeuble Orange, Avenue Léopold Sédar Senghor, Dakar"
                  value={form.adresse}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    name="email"
                    placeholder="contact@entreprise.sn"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="telephone"
                    placeholder="+221 33 869 50 00"
                    value={form.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (optionnel)
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="14.6928"
                    value={form.latitude}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (optionnel)
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="-17.4467"
                    value={form.longitude}
                    onChange={handleChange}
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
                  className="flex-1 bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? "Mettre à jour" : "Créer l'entreprise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepriseList;