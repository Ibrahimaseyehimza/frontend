import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const LoginApprenant = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    matricule: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/apprenant/login", credentials);

      if (response.data.success) {
        // Sauvegarder le token et les infos de l'apprenant
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.apprenant));
        localStorage.setItem("userRole", "apprenant");

        alert("Connexion réussie ✅");
        navigate("/apprenant/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Erreur de connexion. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Connexion Apprenant
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="exemple@isep.sn"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matricule
            </label>
            <input
              type="text"
              name="matricule"
              value={credentials.matricule}
              onChange={handleChange}
              placeholder="Votre matricule"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Utilisez votre matricule comme mot de passe
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Vous avez oublié votre matricule ?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contactez l'administration
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginApprenant;