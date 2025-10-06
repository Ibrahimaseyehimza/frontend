// src/components/pages/EntrepriseForm.jsx
import React, { useState } from "react";
import api from "../../api/axios";

    const EntrepriseForm = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [form, setForm] = useState({
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        latitude: "",
        longitude: "",
    });


   // 🔄 Charger les entreprises depuis le backend
    useEffect(() => {
        const fetchEntreprises = async () => {
        try {
            const res = await api.get("/entreprises");
            setEntreprises(res.data.data); // adapte selon ta structure
        } catch (err) {
            console.error("Erreur chargement entreprises", err);
        }
        };
        fetchEntreprises();
    }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/entreprises", form);
      alert("✅ Entreprise créée avec succès !");
      console.log("Nouvelle entreprise :", res.data.data);
      // Optionnel : reset du formulaire
      setForm({
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Erreur lors de la création de l'entreprise");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Créer une Entreprise 🏢</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          name="nom"
          placeholder="Nom de l'entreprise"
          value={form.nom}
          onChange={handleChange}
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
        <input
          className="w-full p-2 border rounded"
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Créer l'entreprise
        </button>
      </form>

      



    </div>
  );
};

export default EntrepriseForm;
