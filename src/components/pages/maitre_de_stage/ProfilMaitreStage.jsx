// src/components/pages/ProfilMaitreStage.jsx
import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import api from "../../api/axios";

const ProfilMaitreStage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, form);
      alert("Profil mis à jour ✅");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erreur mise à jour");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="Nouveau mot de passe (optionnel)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ProfilMaitreStage;
