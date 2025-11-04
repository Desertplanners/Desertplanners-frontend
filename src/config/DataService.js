// config/DataService.js
import axios from "axios";

// ✅ Backend base URL from .env (VITE syntax for Vite projects)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DataService = (type = "user") => {
  const token =
    type === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
  });
};

export default DataService;
