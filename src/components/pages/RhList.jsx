// src/components/pages/RhList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const RhList = () => {
  const [rhs, setRhs] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    entreprise_id: "",
  });

  // Charger RH + entreprises
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rhRes, entRes] = await Promise.all([
          api.get("/rhs"),
          api.get("/entreprises"),
        ]);

        console.log("👉 Données RH:", rhRes.data);
        console.log("👉 Données Entreprises:", entRes.data);

        setRhs(rhRes.data.data ?? []);
        setEntreprises(entRes.data.data ?? []); 
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gérer les champs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Créer ou mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/rhs/${editingId}`, form);
        setRhs(rhs.map((r) => (r.id === editingId ? res.data.data : r)));
        alert("RH mis à jour");
      } else {
        const res = await api.post("/rhs", form);
        setRhs([...rhs, res.data.data]);
        alert("RH créé");
      }

      // Reset form
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

  // Préparer édition
  const handleEdit = (rh) => {
    setForm({
      name: rh.name,
      prenom: rh.prenom,
      email: rh.email,
      password: "",
      password_confirmation: "",
      entreprise_id: rh.entreprise_id,
    });
    setEditingId(rh.id);
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce RH ?")) return;
    try {
      await api.delete(`/rhs/${id}`);
      setRhs(rhs.filter((r) => r.id !== id));
      alert("RH supprimé");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Gestion des RH</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          className="w-full p-2 border rounded"
          name="nom"
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
          {entreprises.map((ent) => (
            <option key={ent.id} value={ent.id}>
              {ent.nom}
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

      {/*Liste */}
      <h3 className="text-xl font-semibold mb-3">Liste des RH</h3>
      {rhs.length === 0 ? (
        <p>Aucun RH trouvé.</p>
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
            {rhs.map((rh) => (
              <tr key={rh.id} className="text-center">
                <td className="p-2 border">{rh.name}</td>
                <td className="p-2 border">{rh.prenom}</td>
                <td className="p-2 border">{rh.email}</td>
                <td className="p-2 border">
                  {rh.entreprise?.nom || "-"}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(rh)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(rh.id)}
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

export default RhList;
  