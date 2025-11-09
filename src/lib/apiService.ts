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

export const getCourses = async (params = {}) => {
  try {
    const response = await api.get("/courses", { params });
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Unexpected response structure for courses:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    // The API returns { status: ..., message: ..., data: { "id1": {...}, "id2": {...} } }
    // We need to get the values from the inner 'data' object.
    if (response.data && typeof response.data.data === 'object' && response.data.data !== null) {
      return Object.values(response.data.data);
    }
    console.warn("Unexpected response structure for categories:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getStats = async () => {
  try {
    const response = await api.get("/counts");
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { courses: 0, categories: 0 };
  }
};

export const getPopularCourses = async () => {
  try {
    const response = await api.get("/courses/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return null;
  }
};

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const getCourseBySlug = async (slug) => {
  try {
    const response = await api.get(`/courses/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    return null;
  }
};

export const getPricingByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}/pricings`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pricing for course ${courseId}:`, error);
    return null;
  }
};

export const getCoursesByCategory = async (categorySlug) => {
  try {
    const response = await api.get(`/courses/category/${categorySlug}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Unexpected response structure for courses by category:", response.data);
    return [];
  } catch (error) {
    console.error(`Error fetching courses for category ${categorySlug}:`, error);
    return [];
  }
};

export default api;
