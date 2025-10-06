
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










// // src/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   const isAuthenticated = !!token;

//   useEffect(() => {
//     if (token && !user) {
//       // ✅ récupérer l’utilisateur depuis le backend si nécessaire
//       fetchUser();
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/user", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUser(data);
//       } else {
//         logout();
//       }
//     } catch (err) {
//       console.error("Erreur fetch user:", err);
//       logout();
//     }
//   };

//   const login = (data) => {
//     setToken(data.token);
//     setUser(data.user);
//     localStorage.setItem("token", data.token);
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

