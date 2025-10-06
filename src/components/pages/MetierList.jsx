import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MetierList = () => {
  const [metiers, setMetiers] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Charger les métiers au montage du composant
  useEffect(() => {
    fetchMetiers();
  }, []);

  const fetchMetiers = async () => {
    try {
      const res = await api.get("/metiers");
      setMetiers(res.data.data);
    } catch (err) {
      console.error("Erreur lors du chargement des métiers:", err.response?.data || err);
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
      setForm({ nom: "", description: "" }); // reset form
      fetchMetiers(); // recharger liste
    } catch (err) {
      console.error("Erreur création métier:", err.response?.data || err);
      alert(err.response?.data?.message || "Erreur lors de la création du métier");
    } finally {
      setLoading(false);
    }
  };        

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce métier ?")) return;
    try {
      await api.delete(`/metiers/${id}`);
      setMetiers(metiers.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Erreur suppression métier:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Métiers</h2>

      {/* Formulaire création métier */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg">
        <input
          className="border p-2 rounded mr-2"
          name="nom"
          placeholder="Nom du métier"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded mr-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {/* Liste des métiers */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metiers.length > 0 ? (
            metiers.map((metier) => (
              <tr key={metier.id}>
                <td className="p-2 border">{metier.nom}</td>
                <td className="p-2 border">{metier.description}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(metier.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
                Aucun métier trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MetierList;
