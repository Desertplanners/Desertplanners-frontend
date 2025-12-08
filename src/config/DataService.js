import axios from "axios";

// Detect Environment
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Base API URL
export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://desertplanners-backend.onrender.com";

const DataService = (type = "guest") => {
  let token = null;

  // 👉 USER TOKEN
  if (type === "user") {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    token = userInfo?.token || null;
  }

  // 👉 ADMIN TOKEN
  if (type === "admin") {
    token = localStorage.getItem("adminToken");
  }

  // 👉 HEADERS
  const headers = {};

  // JSON type
  if (type === "json") {
    headers["Content-Type"] = "application/json";
  }

  // ADD TOKEN IF EXISTS
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // ⭐ Axios Instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers,
    withCredentials: false,
  });

  // ⭐ ADD INTERCEPTOR (IMPORTANT FOR AUTO LOGOUT)
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status;

      // If token invalid, expired, or user deleted
      if (status === 401 || status === 403) {
        // Remove admin token
        localStorage.removeItem("adminToken");

        // Redirect ONLY if request is from admin
        if (type === "admin") {
          window.location.href = "/admin/login";
        }
      }

      return Promise.reject(err);
    }
  );

  return api;
};

export default DataService;
