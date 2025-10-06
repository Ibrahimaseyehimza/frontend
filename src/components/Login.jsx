import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    try {
      const res = await api.post("/login", form);
      login(res.data.data); // stocke user + token dans AuthContext
      navigate(`/dashboard/${res.data.data.user.role}`);
    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 401) {
        // Mauvais identifiants
        setGlobalError("Email ou mot de passe incorrect.");
      } else if (err.response?.status === 403) {
        // Accès refusé (ex: must_change_password bloqué)
        setGlobalError(err.response.data.message || "Accès refusé.");
      } else {
        // Erreur serveur
        setGlobalError("Une erreur est survenue. Réessayez plus tard.");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Colonne gauche */}
      <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center items-center p-10">
        <img src="/logo.png" alt="Stage Link" className="w-32 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Bienvenue !</h1>
        <p className="text-lg text-center mb-6">
          Connectez-vous pour accéder à vos stages, gérer vos missions et
          collaborer avec vos encadrants. 🚀
        </p>
      </div>

      {/* Colonne droite */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-4">
            <FaLock className="text-blue-600 text-5xl bg-gray-200 p-3 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Connexion
          </h2>

          {/* Message global */}
          {globalError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <div
                className={`flex items-center border rounded-lg p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              >
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  className="flex-1 outline-none"
                  name="email"
                  type="email"
                  placeholder="Adresse mail"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div
                className={`flex items-center border rounded-lg p-2 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              >
                <FaLock className="text-gray-400 mr-2" />
                <input
                  className="flex-1 outline-none"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password[0]}</p>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition duration-300"
            >
              Se connecter
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
