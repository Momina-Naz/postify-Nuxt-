// utils/api.js
import axios from "axios";
import { useAuthStore } from "~~/stores/Auth";

const api = axios.create({
  baseURL: "https://social-media-api-node.vercel.app",
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    // Get the auth store
    const auth = useAuthStore();
    const token = localStorage.getItem("token");

    // If token exists, attach it to Authorization header
    if (auth.token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
