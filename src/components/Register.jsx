// import React, { useState, useContext } from "react";
// import api from "../api/axios";
// import { AuthContext } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

// const Register = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     role: "chef_departement",
//     departement_id: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [globalError, setGlobalError] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setGlobalError("");

//     try {
//       const res = await api.post("/register", form);
//       login(res.data.data);
//       navigate(`/dashboard/${res.data.data.user.role}`);
//     } catch (err) {
//       if (err.response?.status === 422) {
//         // Erreurs de validation champ par champ
//         setErrors(err.response.data.errors);
//       } else if (err.response?.status === 403) {
//         // Erreurs métier (clé invalide, chef déjà existant…)
//         setGlobalError(err.response.data.message || "Action non autorisée");
//       } else {
//         // Erreur serveur ou autre
//         setGlobalError("Une erreur est survenue. Réessayez plus tard.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dégradé to-white px-4 sm:px-6 lg:px-8">
//       <div className="min-h-[92vh] w-full max-w-7xl shadow-lg flex flex-col md:flex-row mx-auto my-4 bg-center bg-no-repeat bg-bgcouleur  overflow-hidden">
        
//         {/* Colonne gauche */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white px-6 sm:px-8 lg:px-10 py-8 sm:py-10 text-center md:text-left">
//           <img
//             src="/STAGE LINK BLANC.png"
//             alt="Stage Link"
//             className="w-32 sm:w-40 md:w-48 lg:w-52 mb-4 md:mr-28"
//           />
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mr-28">
//             BIENVENUE!
//           </h1>
//           <hr className="w-full md:w-3/4 border-white mb-4" />
//           <p className="text-sm sm:text-base lg:text-lg mb-4 text-justify md:ml-10 leading-relaxed max-w-md px-2 sm:px-0">
//             Inscrivez-vous pour suivre vos stages, échanger avec vos encadrants
//             et déposer vos rapports en toute simplicité. Donnez un coup
//             d'accélérateur à votre parcours professionnel dès aujourd'hui !
//           </p>

//           <button className="px-4 sm:px-6 py-2 sm:py-2.5 mt-4 sm:mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow hover:opacity-90 transition text-sm sm:text-base">
//             Plus d'info
//           </button>
//         </div>

//         {/* Colonne droite */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
//           <div className="bg-white/10 backdrop-invert backdrop-opacity-10 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg w-full max-w-md">
//             <div className="flex justify-center mb-4">
//               <FaUser className="text-blue-600 text-4xl sm:text-5xl bg-gray-200 p-2 sm:p-3 rounded-full" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-white">
//               Inscription
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

//               {globalError && (
//                 <div className="bg-red-100 text-red-700 p-2 sm:p-3 rounded-lg mb-4 text-sm">
//                   {globalError}
//                 </div>
//               )}

//               {/* Nom */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaUser className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="name"
//                     placeholder="Nom complet"
//                     value={form.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name[0]}</p>}
//               </div>

//               {/* Email */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaEnvelope className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="email"
//                     type="email"
//                     placeholder="Adresse mail"
//                     value={form.email}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email[0]}</p>}
//               </div>

//               {/* Mot de passe */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaLock className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="password"
//                     type="password"
//                     placeholder="Mot de passe"
//                     value={form.password}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password[0]}</p>}
//               </div>

//               {/* Confirmation mot de passe */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaLock className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="password_confirmation"
//                     type="password"
//                     placeholder="Confirmer le mot de passe"
//                     value={form.password_confirmation}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.password_confirmation && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password_confirmation[0]}</p>}
//               </div>

//               {/* ID Département */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaUser className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="departement_id"
//                     placeholder="ID Département"
//                     value={form.departement_id}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.departement_id && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.departement_id[0]}</p>}
//               </div>

//               {/* Clé d'invitation */}
//               <div>
//                 <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
//                   <FaUser className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
//                   <input
//                     className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
//                     name="invitation_key"
//                     placeholder="Clé d'invitation"
//                     value={form.invitation_key}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {errors.invitation_key && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.invitation_key[0]}</p>}
//               </div>

//               {/* Bouton */}
//               <button
//                 type="submit"
//                 className="w-full bg-white text-inscrire p-2.5 sm:p-3 rounded-xl font-Be Vietnam font-bold hover:bg-gray-400 transition duration-300 text-sm sm:text-base mt-2"
//               >
//                 S'inscrire
//               </button>
//             </form>
//             <p className="text-center text-white mt-3 sm:mt-4 text-sm sm:text-base">
//               Déjà inscrit ?{" "}
//               <a href="/login" className="text-blue-500 hover:underline">
//                 Se connecter
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;












import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaKey } from "react-icons/fa";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Initialisation correcte avec des chaînes vides
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "chef_departement",
    departement_id: "",
    invitation_key: "", // ✅ Ajouté dans l'état initial
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ État de chargement

  // ✅ Gestion correcte du changement avec nettoyage des erreurs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Nettoyer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Nettoyer l'erreur globale
    if (globalError) {
      setGlobalError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setLoading(true); // ✅ Activer le chargement

    try {
      const res = await api.post("/register", form);
      
      // ✅ Vérifier la structure de la réponse
      if (res.data && res.data.data) {
        login(res.data.data);
        navigate(`/dashboard/${res.data.data.user.role}`);
      } else {
        setGlobalError("Réponse invalide du serveur");
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      
      if (err.response?.status === 422) {
        // Erreurs de validation champ par champ
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 403) {
        // Erreurs métier (clé invalide, chef déjà existant…)
        setGlobalError(err.response.data.message || "Action non autorisée");
      } else if (err.response?.status === 500) {
        // Erreur serveur
        setGlobalError("Erreur serveur. Veuillez réessayer plus tard.");
      } else if (err.message === "Network Error") {
        // Erreur réseau
        setGlobalError("Problème de connexion. Vérifiez votre connexion internet.");
      } else {
        // Erreur générique
        setGlobalError(err.response?.data?.message || "Une erreur est survenue. Réessayez plus tard.");
      }
    } finally {
      setLoading(false); // ✅ Désactiver le chargement
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dégradé to-white px-4 sm:px-6 lg:px-8">
      <div className="min-h-[92vh] w-full max-w-7xl shadow-lg flex flex-col md:flex-row mx-auto my-4 bg-center bg-no-repeat bg-bgcouleur overflow-hidden">
        
        {/* Colonne gauche */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white px-6 sm:px-8 lg:px-10 py-8 sm:py-10 text-center md:text-left">
          <img
            src="/STAGE LINK BLANC.png"
            alt="Stage Link"
            className="w-32 sm:w-40 md:w-48 lg:w-52 mb-4 md:mr-28"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mr-28">
            BIENVENUE!
          </h1>
          <hr className="w-full md:w-3/4 border-white mb-4" />
          <p className="text-sm sm:text-base lg:text-lg mb-4 text-justify md:ml-10 leading-relaxed max-w-md px-2 sm:px-0">
            Inscrivez-vous pour suivre vos stages, échanger avec vos encadrants
            et déposer vos rapports en toute simplicité. Donnez un coup
            d'accélérateur à votre parcours professionnel dès aujourd'hui !
          </p>

          <button 
            type="button"
            className="px-4 sm:px-6 py-2 sm:py-2.5 mt-4 sm:mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow hover:opacity-90 transition text-sm sm:text-base"
          >
            Plus d'info
          </button>
        </div>

        {/* Colonne droite */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white/10 backdrop-invert backdrop-opacity-10 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-center mb-4">
              <FaUser className="text-blue-600 text-4xl sm:text-5xl bg-gray-200 p-2 sm:p-3 rounded-full" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-white">
              Inscription
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

              {/* Message d'erreur global */}
              {globalError && (
                <div className="bg-red-100 text-red-700 p-2 sm:p-3 rounded-lg mb-4 text-sm">
                  {globalError}
                </div>
              )}

              {/* Nom */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaUser className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="name"
                    type="text"
                    placeholder="Nom complet"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaEnvelope className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="email"
                    type="email"
                    placeholder="Adresse mail"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email[0]}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaLock className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password[0]}</p>}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaLock className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="password_confirmation"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password_confirmation[0]}</p>}
              </div>

              {/* ID Département */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaBuilding className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="departement_id"
                    type="number"
                    // placeholder="ID Département"
                    placeholder="Role Chef De Département"
                    value={form.departement_id}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.departement_id && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.departement_id[0]}</p>}
              </div>

              {/* Clé d'invitation */}
              <div>
                <div className="flex items-center border rounded-lg p-2 sm:p-2.5">
                  <FaKey className="text-gray-400 mr-2 text-sm sm:text-base flex-shrink-0" />
                  <input
                    className="flex-1 outline-none bg-gray-400 bg-opacity-50 text-white placeholder-gray-300 text-sm sm:text-base"
                    name="invitation_key"
                    type="text"
                    placeholder="Clé d'invitation"
                    value={form.invitation_key}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.invitation_key && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.invitation_key[0]}</p>}
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-inscrire p-2.5 sm:p-3 rounded-xl font-Be Vietnam font-bold hover:bg-gray-400 transition duration-300 text-sm sm:text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>
            <p className="text-center text-white mt-3 sm:mt-4 text-sm sm:text-base">
              Déjà inscrit ?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;