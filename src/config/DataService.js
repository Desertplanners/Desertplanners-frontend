import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://desetplanner-backend.onrender.com";

const DataService = (type = "guest") => {
  let token = null;

  // 🧠 Token load only if user or admin login hai
  if (type === "user") {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    token = userInfo?.token || null;
  } else if (type === "admin") {
    token = localStorage.getItem("adminToken");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  // 🛡️ Add Authorization header only if token valid hai
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: API_BASE_URL,
    headers,
    withCredentials: false, // ❌ Render CORS issue fix
  });
};

export default DataService;
