import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await login(form);
  //   window.location.href = "/dashboard";
  // };


  // Dans votre Login.jsx, ajoutez :
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Tentative de connexion...");
  
  try {
    const res = await api.post("/login", { email, password });
    console.log("Données utilisateur reçues:", res.data);
    console.log("Rôle utilisateur:", res.data.user?.role);
    login(res.data);
  } catch (err) {
    console.error("Erreur de connexion:", err);
    alert("Identifiants invalides");
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-xl w-80"
      >
        <h1 className="text-lg font-bold mb-4">Connexion</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-2 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}
