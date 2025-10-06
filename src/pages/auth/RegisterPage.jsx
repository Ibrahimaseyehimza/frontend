import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "etudiant", // rôle par défaut
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-xl w-96"
      >
        <h1 className="text-lg font-bold mb-4">Inscription</h1>

        <input
          type="text"
          placeholder="Nom complet"
          className="w-full mb-2 p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-2 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full mb-2 p-2 border rounded"
          value={form.password_confirmation}
          onChange={(e) =>
            setForm({ ...form, password_confirmation: e.target.value })
          }
          required
        />

        <select
          className="w-full mb-2 p-2 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="etudiant">🎓 Étudiant</option>
          <option value="tuteur">🧑‍🏫 Tuteur</option>
          <option value="admin">👑 Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
}
