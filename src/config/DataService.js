import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://desetplanner-backend.onrender.com";

const DataService = (type = "guest") => {
  let token = null;

  if (type === "user") {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    token = userInfo?.token || null;
  } else if (type === "admin") {
    token = localStorage.getItem("adminToken");
  }

  const headers = {}; // IMPORTANT → DO NOT set Content-Type here

  if (type === "json") {
    headers["Content-Type"] = "application/json";
  }

  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: API_BASE_URL,
    headers,
    withCredentials: false,
  });
};

export default DataService;
