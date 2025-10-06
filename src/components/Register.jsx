import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "chef_departement",
    departement_id: "",
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");



  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await api.post("/register", form);
  //     login(res.data.data);
  //     navigate(`/dashboard/${res.data.data.user.role}`);
  //   } catch (err) {
  //     console.error(err.response?.data || err);
  //     alert(err.response?.data?.message || "Erreur lors de l’inscription");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors({}); // reset avant nouvelle tentative

  //   try {
  //     const res = await api.post("/register", form);
  //     login(res.data.data);
  //     navigate(`/dashboard/${res.data.data.user.role}`);
  //   } catch (err) {
  //     if (err.response?.status === 422) {
  //       // Laravel FormRequest errors
  //       setErrors(err.response.data.errors);
  //     } else {
  //       alert(err.response?.data?.message || "Erreur lors de l’inscription");
  //     }
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setGlobalError("");

  try {
    const res = await api.post("/register", form);
    login(res.data.data);
    navigate(`/dashboard/${res.data.data.user.role}`);
  } catch (err) {
    if (err.response?.status === 422) {
      // Erreurs de validation champ par champ
      setErrors(err.response.data.errors);
    } else if (err.response?.status === 403) {
      // Erreurs métier (clé invalide, chef déjà existant…)
      setGlobalError(err.response.data.message || "Action non autorisée");
    } else {
      // Erreur serveur ou autre
      setGlobalError("Une erreur est survenue. Réessayez plus tard.");
    }
  }
};

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/BACK Register.jpg')" }}
      // style={{ backgroundImage: "url('/')" }}
    >
      {/* Colonne gauche */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-white m-0 p-0">

        <img src="/STAGE LINK BLANC.png" alt="Stage Link" className="w-32 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-center">BIENVENUE!</h1>
        <p className="text-lg text-center mb-6">
          Inscrivez-vous pour suivre vos stages, échanger <br />
          avec vos encadrants et déposer vos rapports en toute <br />
          simplicité. Donnez un coup d’accélérateur à votre <br />
          parcours professionnel dès aujourd’hui !
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow hover:opacity-90 transition">
          Plus d'info
        </button>
      </div>

      {/* Colonne droite */}
      <div className="md:w-1/2 flex flex-col items-center justify-center m-0 p-0">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-4">
            <FaUser className="text-blue-600 text-5xl bg-gray-200 p-3 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Inscription
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {globalError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {globalError}
              </div>
            )}

            {/* Nom */}
            <div className="flex items-center border rounded-lg p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                name="name"
                placeholder="Nom complet"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-lg p-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                name="email"
                type="email"
                placeholder="Adresse mail"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
            </div>

            {/* Mot de passe */}
            <div className="flex items-center border rounded-lg p-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
            </div>

            {/* Confirmation mot de passe */}
            <div className="flex items-center border rounded-lg p-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                name="password_confirmation"
                type="password"
                placeholder="Confirmer le mot de passe"
                value={form.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation[0]}</p>}
            </div>

            {/* ID Département */}
            <div className="flex items-center border rounded-lg p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                name="departement_id"
                placeholder="ID Département"
                value={form.departement_id}
                onChange={handleChange}
              />
              {errors.departement_id && <p className="text-red-500 text-sm">{errors.departement_id[0]}</p>}
            </div>
            <div className="flex items-center border rounded-lg p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                  className="w-full p-3 border rounded-xl"
                  name="invitation_key"
                  placeholder="Clé d’invitation"
                  value={form.invitation_key}
                  onChange={handleChange}
                />
                {errors.invitation_key && <p className="text-red-500 text-sm">{errors.invitation_key[0]}</p>}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition duration-300"
            >
              S’inscrire
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4">
            Déjà inscrit ?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
