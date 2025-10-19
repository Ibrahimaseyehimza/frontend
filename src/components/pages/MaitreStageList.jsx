import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiUser, FiMail, FiBriefcase, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";

const MaitreStageList = () => {
  const [maitres, setMaitres] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    entreprise_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maitresRes, entreprisesRes] = await Promise.all([
        api.get("/maitres"),
        api.get("/entreprises_global"),
      ]);
      setMaitres(maitresRes.data.data ?? []);
      setEntreprises(entreprisesRes.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement:", err);
      alert("❌ Erreur lors du chargement des données");
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
        const res = await api.put(`/maitres/${editingId}`, form);
        setMaitres(maitres.map((m) => (m.id === editingId ? res.data.data : m)));
        alert("✅ Maître de stage mis à jour");
      } else {
        const res = await api.post("/maitres", form);
        setMaitres([...maitres, res.data.data]);
        alert("✅ Maître de stage créé");
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

  const handleEdit = (m) => {
    setForm({
      name: m.name,
      prenom: m.prenom,
      email: m.email,
      password: "",
      password_confirmation: "",
      entreprise_id: m.entreprise_id,
    });
    setEditingId(m.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce maître de stage ?")) return;
    try {
      await api.delete(`/maitres/${id}`);
      setMaitres(maitres.filter((m) => m.id !== id));
      alert("✅ Supprimé avec succès");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredMaitres = maitres.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Maîtres de Stage
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les maîtres de stage et leurs entreprises
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
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors"
          >
            <FiPlus size={20} />
            <span>Ajouter un Maître de Stage</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">{maitres.length}</div>
          <div className="text-gray-600 mt-2">Total Maîtres de Stage</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">
            {new Set(maitres.map((m) => m.entreprise_id).filter(Boolean)).size}
          </div>
          <div className="text-gray-600 mt-2">Entreprises Représentées</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-purple-600">
            {maitres.filter((m) => m.email).length}
          </div>
          <div className="text-gray-600 mt-2">Contacts Complets</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, email ou entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Liste des maîtres */}
      {filteredMaitres.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">👨‍💼</div>
          <p className="text-xl text-gray-500 font-semibold">
            {searchTerm ? "Aucun maître de stage trouvé" : "Aucun maître de stage"}
          </p>
          <p className="text-gray-400 mt-2">
            {!searchTerm && "Cliquez sur 'Ajouter' pour créer le premier"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaitres.map((maitre) => (
            <div
              key={maitre.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
            >
              {/* Avatar et nom */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {maitre.name} {maitre.prenom}
                  </h3>
                  <p className="text-sm text-gray-500">Maître de stage</p>
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-blue-500 flex-shrink-0" size={16} />
                  <span className="truncate">{maitre.email}</span>
                </div>
                
                {maitre.entreprise && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiBuilding4Line className="text-green-500 flex-shrink-0" size={16} />
                    <span className="truncate">{maitre.entreprise.nom}</span>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(maitre)}
                  className="flex-1 bg-dégradé text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiEdit2 size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(maitre.id)}
                  className="bg-white border-2 border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Modifier le Maître de Stage" : "Nouveau Maître de Stage"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
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
                    placeholder="Prénom"
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
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!editingId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <input
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      name="password_confirmation"
                      placeholder="••••••••"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="entreprise_id"
                  value={form.entreprise_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choisir une entreprise --</option>
                  {entreprises.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom}
                    </option>
                  ))}
                </select>
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
                  {editingId ? "✅ Mettre à jour" : "✅ Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaitreStageList;