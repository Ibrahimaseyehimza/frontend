import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { FiEye, FiBarChart2 } from "react-icons/fi";
import { BsCalendar3, BsPerson } from "react-icons/bs";

const CampagneList = () => {
  const [metiers, setMetiers] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [selectedEntreprises, setSelectedEntreprises] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [semestreFilter, setSemestreFilter] = useState("all");

  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    metier_id: "",
    entreprise_ids: [],
  });

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = async (showLoader = false) => {
    if (showLoader) setPageLoading(true);
    try {
      const [metierRes, campagneRes] = await Promise.all([
        api.get("/metiers"),
        api.get("/campagnes"),
      ]);
      setMetiers(metierRes.data.data ?? []);
      setCampagnes(campagneRes.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setMetiers([]);
      setCampagnes([]);
    } finally {
      if (showLoader) setPageLoading(false);
    }
  };

  const handleMetierChange = async (e) => {
    const metierId = e.target.value;
    setForm({ ...form, metier_id: metierId, entreprise_ids: [] });
    setSelectedEntreprises([]);

    if (!metierId) {
      setEntreprises([]);
      return;
    }

    try {
      const res = await api.get(`/metiers/${metierId}/entreprises`);
      setEntreprises(res.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement entreprises:", err);
      setEntreprises([]);
    }
  };

  const handleAddEntreprise = (id) => {
    if (!selectedEntreprises.includes(id)) {
      setSelectedEntreprises((prev) => [...prev, id]);
      setForm((prev) => ({
        ...prev,
        entreprise_ids: [...prev.entreprise_ids, id],
      }));
    }
  };

  const handleRemoveEntreprise = (id) => {
    setSelectedEntreprises((prev) => {
      const updated = prev.filter((eid) => eid !== id);
      setForm((f) => ({
        ...f,
        entreprise_ids: f.entreprise_ids.filter((eid) => eid !== id),
      }));
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.metier_id) {
      alert("❌ Veuillez sélectionner un métier");
      return;
    }

    if (form.entreprise_ids.length === 0) {
      alert("❌ Veuillez sélectionner au moins une entreprise");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        metier_id: parseInt(form.metier_id),
      };

      if (editingId) {
        const res = await api.put(`/campagnes/${editingId}`, dataToSend);
        setCampagnes(
          campagnes.map((c) => (c.id === editingId ? res.data.data : c))
        );
        alert("✅ Campagne mise à jour");
      } else {
        const res = await api.post("/campagnes", dataToSend);
        setCampagnes([...campagnes, res.data.data]);
        alert("✅ Campagne créée");
      }

      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        metier_id: "",
        entreprise_ids: [],
      });
      setSelectedEntreprises([]);
      setEntreprises([]);
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ " + (err.response?.data?.message || "Erreur création/mise à jour"));
    }
  };

  const handleEdit = async (campagne) => {
    setForm({
      titre: campagne.titre,
      description: campagne.description,
      date_debut: campagne.date_debut,
      date_fin: campagne.date_fin,
      metier_id: campagne.metier_id,
      entreprise_ids: campagne.entreprises?.map((e) => e.id) || [],
    });
    setSelectedEntreprises(campagne.entreprises?.map((e) => e.id) || []);
    setEditingId(campagne.id);

    if (campagne.metier_id) {
      try {
        const res = await api.get(`/metiers/${campagne.metier_id}/entreprises`);
        setEntreprises(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement entreprises:", err);
      }
    }

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette campagne ?")) return;
    try {
      await api.delete(`/campagnes/${id}`);
      setCampagnes(campagnes.filter((c) => c.id !== id));
      alert("✅ Campagne supprimée");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredCampagnes = campagnes.filter((c) => {
    const matchSearch =
      c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && new Date(c.date_fin) > new Date()) ||
      (statusFilter === "inactive" && new Date(c.date_fin) <= new Date());

    return matchSearch && matchStatus;
  });

  const stats = {
    total: campagnes.length,
    actives: campagnes.filter((c) => new Date(c.date_fin) > new Date()).length,
    enPlanification: campagnes.filter((c) => new Date(c.date_debut) > new Date()).length,
    terminees: campagnes.filter((c) => new Date(c.date_fin) <= new Date()).length,
  };

  const getMetierName = (metierId) => {
    const metier = metiers.find((m) => m.id === metierId);
    return metier ? metier.nom : "Non spécifié";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getSemestre = (dateDebut) => {
    const date = new Date(dateDebut);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const semestre = month <= 6 ? "S1" : "S2";
    return `${semestre} - ${year}`;
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
              Gestion des Campagnes de Stage
            </h1>
            <p className="text-gray-600 mt-1">
              Créez et gérez les campagnes de recrutement de stages par semestre
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({
                titre: "",
                description: "",
                date_debut: "",
                date_fin: "",
                metier_id: "",
                entreprise_ids: [],
              });
              setSelectedEntreprises([]);
              setEntreprises([]);
            }}
            className="bg-dégradé text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors"
          >
            <span className="text-xl">+</span>
            <span>Nouvelle Campagne</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-gray-600 mt-2 text-sm">Total</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">{stats.actives}</div>
          <div className="text-gray-600 mt-2 text-sm">Actives</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">
            {stats.enPlanification}
          </div>
          <div className="text-gray-600 mt-2 text-sm">En planification</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-gray-600">{stats.terminees}</div>
          <div className="text-gray-600 mt-2 text-sm">Terminées</div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rechercher une campagne..."
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
            <option value="active">Campagnes actives</option>
            <option value="inactive">Campagnes terminées</option>
          </select>
        </div>
      </div>

      {/* Liste des campagnes */}
      <div className="space-y-4">
        {filteredCampagnes.length > 0 ? (
          filteredCampagnes.map((campagne) => {
            const isActive = new Date(campagne.date_fin) > new Date();
            const entreprisesCount = campagne.entreprises?.length || 0;
            const etudiantsInscrits = Math.floor(entreprisesCount * 2.5);
            const stagesConfirmes = Math.floor(etudiantsInscrits * 0.7);
            const postesDisponibles = entreprisesCount * 3;

            return (
              <div
                key={campagne.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
              >
                {/* En-tête */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {campagne.titre}
                      </h3>
                      {isActive && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {campagne.description || "Campagne de stages pour les étudiants de 6ème semestre"}
                    </p>
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-2">
                    <BsCalendar3 className="text-blue-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Semestre</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {getSemestre(campagne.date_debut)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsCalendar3 className="text-green-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Période</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatDate(campagne.date_debut)} → {formatDate(campagne.date_fin)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsPerson className="text-purple-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Coordinateur</div>
                      <div className="text-sm font-semibold text-gray-800">
                        Pr. Chef Département
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BsCalendar3 className="text-orange-600 mt-1" size={18} />
                    <div>
                      <div className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium inline-block mb-1">
                        Date limite
                      </div>
                      <div className="text-sm font-bold text-orange-600">
                        {formatDate(campagne.date_fin)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {etudiantsInscrits}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Étudiants inscrits</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {stagesConfirmes}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Stages confirmés</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {entreprisesCount}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Entreprises</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {postesDisponibles}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Postes disponibles</div>
                  </div>
                </div>

                {/* Prérequis */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Prérequis :
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Moyenne générale ≥ 12/20</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Validation des modules fondamentaux</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Présence obligatoire aux séances de préparation</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex-1 min-w-[120px] bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FiEye size={18} />
                    <span>Voir détails</span>
                  </button>
                  <button className="flex-1 min-w-[120px] bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FiBarChart2 size={18} />
                    <span>Statistiques</span>
                  </button>
                  <button
                    onClick={() => handleEdit(campagne)}
                    className="flex-1 min-w-[120px] bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaPen size={16} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDelete(campagne.id)}
                    className="flex-1 min-w-[120px] bg-orange-600 text-white py-2.5 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <RiDeleteBin6Line size={18} />
                    <span>Suspendre</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-right">
                  Créé le {formatDate(campagne.created_at)} par Chef Département
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-500">Aucune campagne trouvée</p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Essayez une autre recherche"
                : "Cliquez sur 'Nouvelle Campagne' pour commencer"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Modifier la campagne" : "Nouvelle campagne"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setForm({
                    titre: "",
                    description: "",
                    date_debut: "",
                    date_fin: "",
                    metier_id: "",
                    entreprise_ids: [],
                  });
                  setSelectedEntreprises([]);
                  setEntreprises([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la campagne *
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Campagne Stage S6 - 2024"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Campagne de stages pour les étudiants de 6ème semestre"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.date_debut}
                    onChange={(e) =>
                      setForm({ ...form, date_debut: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.date_fin}
                    onChange={(e) =>
                      setForm({ ...form, date_fin: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Métier *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.metier_id}
                  onChange={handleMetierChange}
                  required
                >
                  <option value="">-- Choisir un métier --</option>
                  {metiers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              {entreprises.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprises disponibles * (cliquez pour sélectionner)
                  </label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {entreprises.map((ent) => (
                        <div
                          key={ent.id}
                          className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors ${
                            selectedEntreprises.includes(ent.id)
                              ? "bg-blue-100 border-2 border-blue-500"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => handleAddEntreprise(ent.id)}
                        >
                          <span className="font-medium">{ent.nom}</span>
                          {selectedEntreprises.includes(ent.id) && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveEntreprise(ent.id);
                              }}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedEntreprises.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprises sélectionnées ({selectedEntreprises.length})
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                    {entreprises
                      .filter((e) => selectedEntreprises.includes(e.id))
                      .map((ent) => (
                        <span
                          key={ent.id}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {ent.nom}
                          <button
                            type="button"
                            onClick={() => handleRemoveEntreprise(ent.id)}
                            className="hover:bg-blue-700 rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
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
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? "✅ Mettre à jour" : "✅ Créer la campagne"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampagneList;