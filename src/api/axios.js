// api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    'Accept': 'application/json',
    // 'Content-Type': 'application/json',
  },
  withCredentials: false, // Important pour Sanctum avec tokens
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", token);
  
  if (token) {
    // Pour Laravel Sanctum avec tokens API
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Erreur 403:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;










// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   // Récupérez le token (depuis localStorage, context, etc.)
//   const token = localStorage.getItem('token'); // ou votre méthode de stockage
  
//   try {
//     const response = await fetch('http://127.0.0.1:8000/api/v1/metiers', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify(yourData)
//     });
    
//     if (!response.ok) {
//       throw new Error(`Erreur: ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log('Succès:', data);
//   } catch (error) {
//     console.error('Erreur création métier:', error);
//   }
// };
