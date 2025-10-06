// src/components/pages/EntrepriseList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    email: "",
    telephone: "",
  });

  //  Charger la liste des entreprises
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const res = await api.get("/entreprises");
        // setEntreprises(res.data.data || res.data);
        setEntreprises(res.data.data ?? []);
      } catch (err) {
        console.error("Erreur lors du chargement des entreprises:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntreprises();
  }, []);

  //  Gérer les champs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Créer ou mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Mise à jour
        const res = await api.put(`/entreprises/${editingId}`, form);
        setEntreprises(
          entreprises.map((ent) =>
            ent.id === editingId ? res.data.data || res.data : ent
          )
        );
        alert("Entreprise mise à jour ");
      } else {
        // Création
        const res = await api.post("/entreprises", form);
        setEntreprises([...entreprises, res.data.data || res.data]);
        alert("Entreprise créée ");
      }

      // Reset form
      setForm({ nom: "", adresse: "", email: "", telephone: "" });
      setEditingId(null);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Erreur lors de l’enregistrement");
    }
  };

  // Préparer édition
  const handleEdit = (entreprise) => {
    setForm({
      nom: entreprise.nom,
      adresse: entreprise.adresse,
      email: entreprise.email,
      telephone: entreprise.telephone,
    });
    setEditingId(entreprise.id);
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette entreprise ?")) return;
    try {
      await api.delete(`/entreprises/${id}`);
      setEntreprises(entreprises.filter((ent) => ent.id !== id));
      alert("Entreprise supprimée");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Gestion des Entreprises</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          className="w-full p-2 border rounded"
          name="nom"
          placeholder="Nom de l’entreprise"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          name="adresse"
          placeholder="Adresse"
          value={form.adresse}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* Liste */}
      <h3 className="text-xl font-semibold mb-3">Liste des Entreprises</h3>
      {entreprises.length === 0 ? (
        <p>Aucune entreprise trouvée.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Adresse</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((ent) => (
              <tr key={ent.id} className="text-center">
                <td className="p-2 border">{ent.nom}</td>
                <td className="p-2 border">{ent.adresse || "-"}</td>
                <td className="p-2 border">{ent.email || "-"}</td>
                <td className="p-2 border">{ent.telephone || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(ent)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(ent.id)}
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

export default EntrepriseList;
