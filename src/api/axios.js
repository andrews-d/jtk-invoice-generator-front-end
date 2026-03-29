import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Correct format
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized - redirect to login");
        localStorage.removeItem("token");
        // window.location.href = "/login"; // optional
      }
    }
    return Promise.reject(error);
  },
);

export default api;
