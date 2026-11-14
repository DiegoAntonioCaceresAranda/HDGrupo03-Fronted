import axios from "axios";

// URL de Render como respaldo seguro
const rawApiUrl = import.meta.env.VITE_API_URL || "https://collinscafegrupo03.onrender.com";

// Aseguramos que la URL base termine limpio (sin barras al final, pero CONSERVANDO el /api si lo trae)
const apiBaseUrl = String(rawApiUrl)
  .trim()
  .replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar el token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("collins_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Usar la llave correcta con la que guardas el token
      localStorage.removeItem("collins_token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;