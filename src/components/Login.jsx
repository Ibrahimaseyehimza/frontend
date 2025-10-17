import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner, FaCheckCircle } from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setLoading(true);
    setSuccess(false);

    try {
      const res = await api.post("/login", form);
      
      // Afficher le message de succès
      setSuccess(true);
      
      // Attendre 1 seconde pour montrer le message
      setTimeout(() => {
        login(res.data.data); // stocke user + token dans AuthContext
        navigate(`/dashboard/${res.data.data.user.role}`);
      }, 1000);
      
    } catch (err) {
      setLoading(false);
      setSuccess(false);
      
      if (err.response?.status === 422) {
        // Validation errors
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 401) {
        // Mauvais identifiants
        setGlobalError("Email ou mot de passe incorrect.");
      } else if (err.response?.status === 403) {
        // Accès refusé
        setGlobalError(err.response.data.message || "Accès refusé.");
      } else {
        // Erreur serveur
        setGlobalError("Une erreur est survenue. Réessayez plus tard.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dégradé to-white">
      <div className="min-h-[92vh] w-full sm:w-[100%] max-w-7xl bg-white rounded-2xl shadow-lg flex mx-auto my-4">
        {/* Colonne  */}
        <div className="w-full flex items-center justify-center bg-gradient-to-br from-dégradé to-dégradé p-4 sm:p-6 lg:p-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                <img src="/STAGE LINK ICON.png" alt="Stage Link" className="w-33 h-20" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-6 text-white">
              Plateforme de Gestion des Stages
            </h2>

            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Connexion
            </h2>

            {/* Message global d'erreur */}
            {globalError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 animate-pulse">
                {globalError}
              </div>
            )}

            {/* Message de succès */}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2 animate-pulse">
                <FaCheckCircle className="text-green-600" />
                <span className="font-semibold">Connexion réussie ! Redirection...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <div
                  className={`flex items-center border rounded-lg p-2 bg-white/20 ${
                    errors.email ? "border-red-500" : "border-white/30"
                  }`}
                >
                  <FaEnvelope className="text-white/70 mr-2" />
                  <input
                    className="flex-1 outline-none bg-transparent text-white placeholder-white/60"
                    name="email"
                    type="email"
                    placeholder="Adresse mail"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div
                  className={`flex items-center border rounded-lg p-2 bg-white/20 ${
                    errors.password ? "border-red-500" : "border-white/30"
                  }`}
                >
                  <FaLock className="text-white/70 mr-2" />
                  <input
                    className="flex-1 outline-none bg-transparent text-white placeholder-white/60"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password[0]}</p>
                )}
              </div>

              {/* Bouton avec loading et animation */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : success
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-white text-blue-700 hover:bg-gray-100"
                } ${loading || success ? "text-white" : ""} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {loading && !success && (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    <span>Connexion en cours...</span>
                  </>
                )}
                
                {success && (
                  <>
                    <FaCheckCircle size={18} />
                    <span>Connexion réussie !</span>
                  </>
                )}
                
                {!loading && !success && (
                  <span>Se connecter</span>
                )}
              </button>
            </form>

            <p className="text-center text-white mt-4">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-blue-200 hover:text-white hover:underline font-semibold transition-colors">
                Inscrivez-vous
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;