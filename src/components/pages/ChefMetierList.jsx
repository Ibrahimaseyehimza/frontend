// src/components/pages/ChefMetierList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ChefMetierList = () => {
  const [metiers, setMetiers] = useState([]);
  const [chefs, setChefs] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "chef_metier",
    metier_id: "",
  });

  // Charger les métiers depuis le backend
  useEffect(() => {
    const fetchMetiers = async () => {
      try {
        const res = await api.get("/metiers");
        setMetiers(res.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des métiers", err);
      }
    };
    fetchMetiers();
  }, []);

  // Charger les chefs depuis le backend
  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await api.get("/chefs-de-metier");
        setChefs(res.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des chefs", err);
      }
    };
    fetchChefs();
  }, []);

  // Gestion du formulaire
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/chefs-de-metier", form);
      alert("Chef de métier créé avec succès !");
      alert(res.data.message);
      console.log("Nouveau chef de métier", res.data.data);
      setChefs((prev) => [...prev, res.data.data]); // ✅ mise à jour locale
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur lors de la création du chef de métier");
    }
  };

  // Suppression d’un chef
  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(`/chefs-de-metier/${id}`);
      setChefs((prev) => prev.filter((chef) => chef.id !== id));
      alert("Chef supprimé !");
    } catch (err) {
      console.error("Erreur suppression", err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Créer un Chef de Métier</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="prenom"
          placeholder="Prenom"
          value={form.prenom}
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
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password_confirmation"
          placeholder="Confirmer le mot de passe"
          value={form.password_confirmation}
          onChange={handleChange}
        />

        <select
          className="w-full p-2 border rounded"
          name="metier_id"
          value={form.metier_id}
          onChange={handleChange}
        >
          <option value="">Choisir un métier</option>
          {metiers.map((metier) => (
            <option key={metier.id} value={metier.id}>
              {metier.nom}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Créer
        </button>
      </form>

      {/* Liste des chefs */}
      <h3 className="text-lg font-semibold mb-4">📋 Liste des Chefs de Métier</h3>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Nom</th>
            <th className="p-3">Prenom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Métier</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {chefs.length > 0 ? (
            chefs.map((chef) => (
              <tr key={chef.id} className="border-t">
                <td className="p-3">{chef.nom}</td>
                <td className="p-3">{chef.prenom}</td>
                <td className="p-3">{chef.email}</td>
                <td className="p-3">{chef.metier?.nom || "Non attribué"}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(chef.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-3">
                Aucun chef de métier trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChefMetierList;
