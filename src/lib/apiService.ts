import axios from "axios";

// Ganti baseURL sesuai environment kamu
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});



// --- Start of Refactored Logic ---

// This function will be called once from AuthContext.
export const setupInterceptors = (onAuthFailure) => {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refresh_token");
      if (!storedRefreshToken) {
        throw new Error("No refresh token available.");
      }
      const response = await api.post("/refresh", { refresh_token: storedRefreshToken });
      
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
        return response.data.access_token;
      } else {
        throw new Error("Failed to refresh token, no access token received.");
      }
    } catch (error) {
      console.error("Error inside refreshToken function. Triggering auth failure.", error);
      onAuthFailure(); // Call the explicit logout function
      throw error;
    }
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshToken();
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    if (response.data.refresh_token) {
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
  }
  return response.data;
};

// --- End of Refactored Logic ---

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

export const searchCourses = async (query: string) => {
  try {
    const response = await api.get("/courses/search", { params: { q: query } });
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.warn("Unexpected response structure for search results:", response.data);
    return [];
  } catch (error) {
    console.error("Error searching courses:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    // Check if response.data is an array (direct list of categories)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Check if response.data has a 'data' property that is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Fallback for object of objects, if that's the structure
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


export async function getPopularCourses() {
  try {
    const response = await api.get("/courses/popular");
    if (Array.isArray(response.data.data)) {
      return response.data;
    }
    console.warn("Unexpected response structure for popular courses:", response.data);
    return { data: [] };
  } catch (error) {
    console.error("Failed to fetch popular courses:", error);
    return { data: [] };
  }
}

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

export const getMateriBySlug = async (slug) => {
  try {
    const response = await api.get(`/materi/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching materi ${slug}:`, error);
    throw error;
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

export const getMyCourses = async () => {
  try {
    const response = await api.get("/my-courses");
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.warn("Unexpected response structure for my courses:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching my courses:", error);
    return [];
  }
};

export const getMyTransactions = async () => {
  try {
    const response = await api.get("/my-transactions");
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.warn("Unexpected response structure for my transactions:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching my transactions:", error);
    return [];
  }
};

export const getMyCertificates = async () => {
  try {
    const response = await api.get("/my-certificates");
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.warn("Unexpected response structure for my certificates:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching my certificates:", error);
    return [];
  }
};

export const updateMyProfile = async (userData) => {
  try {
    let payload = userData;
    let headers = {};

    if (userData.photo instanceof File) {
      const formData = new FormData();
      for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(userData, key)) {
          formData.append(key, userData[key]);
        }
      }
      payload = formData;
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post("/me", payload, { headers });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getTransactionDetail = async (id: string | number) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

export const deleteContent = (contentId: number) => api.delete(`/contents/${contentId}`);

// --- Quiz Attempts Endpoints ---
export const createQuizAttempt = async (payload: any) => {
  const response = await api.post('/quiz-attempts', payload);
  return response.data;
};
export const getQuizAttempts = () => api.get('/quiz-attempts');

export const createTransaction = async (payload: any) => {
  const response = await api.post("/transactions", payload);
  return response.data;
};

// --- Content Completion Endpoints ---
export const markContentAsComplete = (courseId: number, contentId: number, batchId: string) =>
  api.post(`/courses/${courseId}/contents/${contentId}/complete`, { batch_id: batchId });
export const markContentAsIncomplete = (courseId: number, contentId: number) =>
  api.delete(`/courses/${courseId}/contents/${contentId}/complete`);

export const createCertificate = async (payload: any) => {
  const response = await api.post("/certificates", payload);
  return response.data;
};

export const regenerateCertificate = async (certificateId: string | number) => {
  try {
    const response = await api.post(`/certificates/${certificateId}/regenerate`);
    return response.data;
  } catch (error) {
    console.error(`Error regenerating certificate ${certificateId}:`, error);
    throw error;
  }
};

export const getGoogleAuthRedirectUrl = async () => {
  const response = await api.get("/auth/google/redirect");
  return response.data;
};

export default api;