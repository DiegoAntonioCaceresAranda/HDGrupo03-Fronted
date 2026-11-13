import axios from "axios";

// URL de Render como respaldo seguro
const rawApiUrl = import.meta.env.VITE_API_URL || "https://collinscafegrupo03.onrender.com";

const apiBaseUrl = String(rawApiUrl)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("collins_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;