// // api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/v1",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


// api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", token); // Ajoutez cette ligne pour vérifier
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
