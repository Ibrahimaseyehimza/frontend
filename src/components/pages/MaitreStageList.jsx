import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MaitreStageList = () => {
  const [maitres, setMaitres] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
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

  // ✅ Charger maîtres de stage + entreprises
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maitresRes, entreprisesRes] = await Promise.all([
          api.get("/maitres"),
          api.get("/entreprises"),
        ]);
        setMaitres(maitresRes.data.data ?? []);
        setEntreprises(entreprisesRes.data.data ?? []);
      } catch (err) {
        console.error("Erreur chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Gestion du formulaire
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/maitres/${editingId}`, form);
        setMaitres(maitres.map((m) => (m.id === editingId ? res.data.data : m)));
        alert("Maître de stage mis à jour ✅");
      } else {
        const res = await api.post("/maitres", form);
        setMaitres([...maitres, res.data.data]);
        alert("Maître de stage créé ✅");
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
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Erreur lors de l’enregistrement");
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce maître de stage ?")) return;
    try {
      await api.delete(`/maitres/${id}`);
      setMaitres(maitres.filter((m) => m.id !== id));
      alert("Supprimé ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Gestion des Maîtres de Stage</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          className="w-full p-2 border rounded"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {!editingId && (
          <>
            <input
              className="w-full p-2 border rounded"
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="password"
              name="password_confirmation"
              placeholder="Confirmer le mot de passe"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </>
        )}
        <select
          className="w-full p-2 border rounded"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* Liste */}
      <h3 className="text-xl font-semibold mb-3">Liste des Maîtres de Stage</h3>
      {maitres.length === 0 ? (
        <p>Aucun maître trouvé.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Prénom</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Entreprise</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maitres.map((m) => (
              <tr key={m.id} className="text-center">
                <td className="p-2 border">{m.name}</td>
                <td className="p-2 border">{m.prenom}</td>
                <td className="p-2 border">{m.email}</td>
                <td className="p-2 border">{m.entreprise?.nom || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MaitreStageList;
