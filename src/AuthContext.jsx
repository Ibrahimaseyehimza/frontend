
// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configuration des redirections par rôle
  const roleRoutes = {
    'apprenant': '/dashboard/apprenant',
    'chef_departement': '/dashboard/chef-departement',
    'chef_metier': '/dashboard/chef-metier',
    'maitre_stage': '/dashboard/maitre-stage',
    'rh': '/dashboard/rh'
  };

  const login = (userData) => {
    console.log("Login avec données:", userData);
    
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    
    // Redirection basée sur le rôle
    const userRole = userData.user.role;
    const redirectPath = roleRoutes[userRole] || '/dashboard';
    
    console.log(`Redirection vers: ${redirectPath} pour le rôle: ${userRole}`);
    navigate(redirectPath);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Vérification du token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Optionnel : Vérifier la validité du token avec le backend
      // fetchUserProfile(storedToken);
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };













// // AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// // const AuthContext = createContext();

// // ✅ Créez ET exportez le contexte
// export const AuthContext = createContext(); // Ajoutez "export" ici


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Charger l'utilisateur au démarrage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");

//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/v1/login",
//         credentials
//       );

//       const { user, token, must_change_password } = response.data.data;

//       console.log("Login avec données:", response.data.data);

//       // ✅ SAUVEGARDER LE TOKEN ET L'UTILISATEUR
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       setUser(user);
//       setIsAuthenticated(true);

//       // Redirection selon le rôle
//       const roleRoutes = {
//         apprenant: "/dashboard/apprenant",
//         chef_departement: "/dashboard/chef-departement",
//         chef_metier: "/dashboard/chef-metier",
//         maitre_stage: "/dashboard/maitre-stage",
//         rh: "/dashboard/rh",
//       };

//       const redirectPath = roleRoutes[user.role] || "/dashboard/apprenant";
//       console.log("Redirection vers:", redirectPath, "pour le rôle:", user.role);
//       navigate(redirectPath);

//       return { success: true, must_change_password };
//     } catch (error) {
//       console.error("Erreur de connexion:", error);
//       return {
//         success: false,
//         message: error.response?.data?.message || "Erreur de connexion",
//       };
//     }
//   };

//   const logout = () => {
//     // ✅ SUPPRIMER LE TOKEN ET L'UTILISATEUR
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





