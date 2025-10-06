import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const CampagneList = () => {
  const [metiers, setMetiers] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [selectedEntreprises, setSelectedEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    metier_id: "",
    entreprise_ids: [],
  });

  // ✅ Charger les métiers et campagnes existantes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metierRes, campagneRes] = await Promise.all([
          api.get("/metiers"),
          api.get("/campagnes"),
        ]);
        setMetiers(metierRes.data.data ?? []);
        setCampagnes(campagneRes.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Quand le métier change → charger les entreprises liées
  const handleMetierChange = async (e) => {
    const metierId = e.target.value;
    setForm({ ...form, metier_id: metierId, entreprise_ids: [] });
    setSelectedEntreprises([]);

    if (!metierId) return;

    try {
      const res = await api.get(`/metiers/${metierId}/entreprises`);
      setEntreprises(res.data.data ?? []);
    } catch (err) {
      console.error("Erreur chargement entreprises:", err);
    }
  };

  // ✅ Ajouter / retirer entreprise
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

  // ✅ Création / mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/campagnes/${editingId}`, form);
        setCampagnes(
          campagnes.map((c) => (c.id === editingId ? res.data.data : c))
        );
        alert("Campagne mise à jour ✅");
      } else {
        const res = await api.post("/campagnes", form);
        setCampagnes([...campagnes, res.data.data]);
        alert("Campagne créée ✅");
      }

      // Reset
      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        metier_id: "",
        entreprise_ids: [],
      });
      setSelectedEntreprises([]);
      setEditingId(null);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Erreur création / mise à jour");
    }
  };

  // ✅ Préparer édition
  const handleEdit = (campagne) => {
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
  };

  // ✅ Supprimer une campagne
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette campagne ?")) return;
    try {
      await api.delete(`/campagnes/${id}`);
      setCampagnes(campagnes.filter((c) => c.id !== id));
      alert("Campagne supprimée ✅");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 bg-white rounded shadow space-y-8">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? "Modifier une Campagne" : "Créer une Campagne de Stage"}
      </h2>

      {/* === FORMULAIRE === */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Titre"
          name="titre"
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-4">
          <input
            type="date"
            className="w-1/2 p-2 border rounded"
            name="date_debut"
            value={form.date_debut}
            onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
            required
          />
          <input
            type="date"
            className="w-1/2 p-2 border rounded"
            name="date_fin"
            value={form.date_fin}
            onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
            required
          />
        </div>

        <select
          className="w-full p-2 border rounded"
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

        {entreprises.length > 0 && (
          <div>
            <label className="block mb-2 font-semibold">
              Entreprises disponibles :
            </label>
            <ul className="space-y-2">
              {entreprises.map((ent) => (
                <li
                  key={ent.id}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    selectedEntreprises.includes(ent.id)
                      ? "bg-blue-100"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleAddEntreprise(ent.id)}
                >
                  <span>{ent.nom}</span>
                  {selectedEntreprises.includes(ent.id) && (
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveEntreprise(ent.id);
                      }}
                      className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                    >
                      ❌
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedEntreprises.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Entreprises sélectionnées :</h4>
            <div className="flex flex-wrap gap-2">
              {entreprises
                .filter((e) => selectedEntreprises.includes(e.id))
                .map((ent) => (
                  <span
                    key={ent.id}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {ent.nom}
                    <button
                      type="button"
                      onClick={() => handleRemoveEntreprise(ent.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✖
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Mettre à jour" : "Créer Campagne"}
        </button>
      </form>

      {/* === LISTE DES CAMPAGNES === */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Liste des Campagnes</h3>
        {campagnes.length === 0 ? (
          <p>Aucune campagne trouvée.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Titre</th>
                <th className="p-2 border">Métier</th>
                <th className="p-2 border">Entreprises</th>
                <th className="p-2 border">Dates</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campagnes.map((c) => (
                <tr key={c.id} className="text-center">
                  <td className="p-2 border">{c.titre}</td>
                  <td className="p-2 border">{c.metier?.nom || "-"}</td>
                  <td className="p-2 border">
                    {c.entreprises?.map((e) => e.nom).join(", ") || "-"}
                  </td>
                  <td className="p-2 border">
                    {c.date_debut} → {c.date_fin}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CampagneList;
