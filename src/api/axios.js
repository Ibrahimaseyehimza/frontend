// // api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/v1",
//   headers: {
//     'Accept': 'application/json',
//     // 'Content-Type': 'application/json',
//   },
//   withCredentials: false, // Important pour Sanctum avec tokens
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log("Token récupéré:", token);
  
//   if (token) {
//     // Pour Laravel Sanctum avec tokens API
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 403) {
//       console.error('Erreur 403:', error.response.data);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;





import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("Erreur 403:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;



