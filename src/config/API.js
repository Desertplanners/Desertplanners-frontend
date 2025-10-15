const admin = "/admin";

const BASE = "http://localhost:5000"; 
// agar aap network pe test kar rahe ho to:
// const BASE = "http://192.168.1.105:5000";

export const API = {
  BASE_URL: BASE,

  // Admin APIs
  ADMIN_REGISTER: `${admin}/register`,
  ADMIN_LOGIN: `${admin}/login`,
};

export default API;
