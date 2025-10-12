import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MetierList = () => {
  const [metiers, setMetiers] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "", logo: "" });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  // Charger les métiers au montage du composant
  useEffect(() => {
    fetchMetiers(true); //  Active le loader au chargement initial
  }, []);

  const fetchMetiers = async (showLoader = false) => {
    if (showLoader) setPageLoading(true);
    try {
      const res = await api.get("/metiers");
      console.log("Données reçues:", res.data); // Debug
      setMetiers(res.data.data || []); //  Assure que c'est un tableau
    } catch (err) {
      console.error("Erreur lors du chargement des métiers:", err.response?.data || err);
      setMetiers([]); //  En cas d'erreur, définit un tableau vide
    } finally {
      if (showLoader) setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/metiers", form);
      setForm({ nom: "", description: "", logo: "" });
      fetchMetiers();
      setShowModal(false);
      alert(" Métier ajouté avec succès !");
    } catch (err) {
      console.error("Erreur création métier:", err.response?.data || err);
      alert(err.response?.data?.message || "Erreur lors de la création du métier");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce métier ?")) return;
    
    setDeleteLoading(id);
    try {
      await api.delete(`/metiers/${id}`);
      await fetchMetiers(false); // Pas de loader lors de la suppression
      alert(" Métier supprimé avec succès !");
    } catch (err) {
      console.error("Erreur suppression métier:", err.response?.data || err);
      alert(err.response?.data?.message || " Erreur lors de la suppression du métier");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filtrer les métiers selon la recherche
  const filteredMetiers = metiers.filter((metier) =>
    metier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (metier.description && metier.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Afficher le loader pendant le chargement initial
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Métiers</h1>
            <p className="text-gray-600 mt-1">Créez et gérez les métiers disponibles</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg"
          >
            <span className="text-xl">+</span>
            <span>Nouveau Métier</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-gray-800">{metiers.length}</div>
          <div className="text-gray-600 mt-2">Total</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">
            {metiers.filter(m => m.logo).length}
          </div>
          <div className="text-gray-600 mt-2">Avec Logo</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">
            {metiers.filter(m => m.description).length}
          </div>
          <div className="text-gray-600 mt-2">Avec Description</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-orange-600">
            {filteredMetiers.length}
          </div>
          <div className="text-gray-600 mt-2">Affichés</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Rechercher un métier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Liste des métiers en cartes */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMetiers.length > 0 ? (
          filteredMetiers.map((metier) => (
            <div
              key={metier.id}
              className="bg-white border-2 border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                {/* Logo et info */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {metier.logo ? (
                      <img
                        src={metier.logo}
                        alt={metier.nom}
                        className="h-24 w-24 object-contain"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-dégradé rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {metier.nom.substring(0, 4)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informations */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {metier.nom}
                    </h3>
                    <p className="text-gray-600">
                      {metier.description || "Aucune description disponible"}
                    </p>
                    <div className="mt-3 flex gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        Créé le {new Date(metier.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDelete(metier.id)}
                    disabled={deleteLoading === metier.id}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {deleteLoading === metier.id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-6xl mb-4"></div>
            <p className="text-xl text-gray-500">Aucun métier trouvé</p>
            <p className="text-gray-400 mt-2">
              {searchTerm ? "Essayez une autre recherche" : "Cliquez sur 'Nouveau Métier' pour commencer"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nouveau Métier</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm({ nom: "", description: "", logo: "" });
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du métier *
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="nom"
                  placeholder="Ex: Développement Web"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="description"
                  placeholder="Décrivez ce métier..."
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo du métier
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                >
                  <option value="">-- Sélectionner un logo --</option>
                  <option value="/ASRI BLEU.png">ASRI (Systèmes & Réseaux)</option>
                  <option value="/DWM BLEU.png">DWM (Développement Web Mobile)</option>
                  <option value="/RT BLEU.png">RT (Réseau & Télécom)</option>
                </select>

                {form.logo && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                    <img
                      src={form.logo}
                      alt="Aperçu"
                      className="h-24 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm({ nom: "", description: "", logo: "" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Création..." : " Créer le métier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetierList;