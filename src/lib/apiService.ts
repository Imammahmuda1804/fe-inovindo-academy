import axios from "axios";

// Ganti baseURL sesuai environment kamu
// Saat di lokal, biasanya Laravel jalan di http://127.0.0.1:8000/api
// Kalau nanti di hosting, ubah ke URL server kamu
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// 🧩 Interceptor: Tambahkan token Sanctum otomatis jika tersedia
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧱 (Opsional) Interceptor respons: logout otomatis jika token invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect ke login jika unauthorized
      }
    }
    return Promise.reject(error);
  }
);

export const getStats = async () => {
  try {
    const response = await api.get("/counts");
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { courses: 0, categories: 0 };
  }
};

export default api;
