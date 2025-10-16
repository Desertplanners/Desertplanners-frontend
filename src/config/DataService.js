import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const DataService = (token = '') => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true, // ✅ ye must for cookies/CORS
  });
};

export default DataService;
