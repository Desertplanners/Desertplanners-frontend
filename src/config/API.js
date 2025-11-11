// 🔥 Automatically detect local or live environment
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// 🧠 Base API groups
const admin = "/api/admin";
const user = "/api/users";
const tours = "/api/tours";
const categories = "/api/categories";
const cart = "/api/cart";
const bookings = "/api/bookings";
const enquiries = "/api/enquiries";
const visas = "/api/visas";
const sections = "/api/sections";
const visaCategories = "/api/visa-categories";
const payment = "/api/payment"; // ✅ new

export const API = {
  // ✅ BASE_URL switches automatically
  BASE_URL: isLocalhost
    ? "http://localhost:5000" // 🔹 Local (development)
    : "https://desetplanner-backend.onrender.com", // 🔹 Render (production)

  // ---- Admin ----
  ADMIN_REGISTER: `${admin}/register`,
  ADMIN_LOGIN: `${admin}/login`,
  ADMIN_PROFILE: `${admin}/me`,
  ADMIN_UPDATE_PROFILE: `${admin}/me`,
  ADMIN_OVERVIEW: `${admin}/overview`,

  // ---- Admin Users ----
  ADMIN_GET_USERS: `${admin}/users`,
  ADMIN_UPDATE_USER: (id) => `${admin}/users/${id}`,
  ADMIN_DELETE_USER: (id) => `${admin}/users/${id}`,

  // ---- User ----
  USER_REGISTER: `${user}/register`,
  USER_LOGIN: `${user}/login`,
  USER_PROFILE: `${user}/me`,
  USER_UPDATE_PROFILE: `${user}/me`,

  // ---- Tours ----
  GET_TOURS: `${tours}`,
  GET_TOUR: (slug) => `${tours}/${slug}`,
  ADD_TOUR: `${tours}`,
  UPDATE_TOUR: (id) => `${tours}/${id}`,
  DELETE_TOUR: (id) => `${tours}/${id}`,
  GET_TOURS_BY_CATEGORY: (categoryName) => `${tours}/category/${categoryName}`,
  CHECK_AVAILABILITY: `${tours}/check-availability`,

  // ---- Tour Categories ----
  GET_CATEGORIES: `${categories}`,
  ADD_CATEGORY: `${categories}`,
  DELETE_CATEGORY: (id) => `${categories}/${id}`,
  UPDATE_CATEGORY: (id) => `${categories}/${id}`,

  // ---- Visa Categories ----
  ADD_VISA_CATEGORY: `${visaCategories}`,
  GET_VISA_CATEGORIES: `${visaCategories}`,
  DELETE_VISA_CATEGORY: (id) => `${visaCategories}/${id}`,
  UPDATE_VISA_CATEGORY: (id) => `${visaCategories}/${id}`,

  // ---- Cart ----
  GET_CART: (userId) => `${cart}/${userId}`,
  ADD_TO_CART: `${cart}/add`,
  REMOVE_FROM_CART: (userId, itemId) => `${cart}/remove/${userId}/${itemId}`,
  CLEAR_CART: (userId) => `${cart}/clear/${userId}`,

  // ---- Bookings ----
  CREATE_BOOKING: `${bookings}/`,
  GET_ALL_BOOKINGS: `${bookings}`,
  GET_BOOKING_BY_ID: (id) => `${bookings}/${id}`,
  UPDATE_BOOKING_STATUS: (id) => `${bookings}/${id}/status`,
  GET_MY_BOOKINGS: `${bookings}/my`,

  // ---- Payment (💳 NEW) ----
  CREATE_PAYMENT: `${payment}/create`,       // Step 1: Create payment session (backend → Paymennt)
  CONFIRM_PAYMENT: (bookingId) => `${payment}/confirm/${bookingId}`, // Step 2: Temporary confirm (local test)
  WEBHOOK_PAYMENT: `${payment}/webhook`,     // Step 3: Paymennt webhook (server auto updates)

  // ---- Enquiries ----
  CREATE_ENQUIRY: `${enquiries}`,
  GET_ALL_ENQUIRIES: `${enquiries}`,
  UPDATE_ENQUIRY_STATUS: (id) => `${enquiries}/${id}/status`,
  DELETE_ENQUIRY: (id) => `${enquiries}/${id}`,

  // ---- ✅ Visa ----
  GET_VISAS: `${visas}`,
  GET_VISA_BY_SLUG: (slug) => `${visas}/${slug}`,
  GET_VISAS_BY_CATEGORY: (categorySlug) => `${visas}/category/${categorySlug}`,
  ADD_VISA: `${visas}`,
  UPDATE_VISA: (id) => `${visas}/${id}`,
  DELETE_VISA: (id) => `${visas}/${id}`,

  // ---- ✅ Sections ----
  GET_SECTIONS: `${sections}`,
  ADD_SECTION: `${sections}`,
  GET_SECTION_BY_ID: (id) => `${sections}/${id}`,
  UPDATE_SECTION: (id) => `${sections}/${id}`,
  DELETE_SECTION: (id) => `${sections}/${id}`,
  TOGGLE_SECTION_VISIBILITY: (id) => `${sections}/${id}/visibility`,

  // ---- ✅ Section Items ----
  ADD_SECTION_ITEM: (sectionId) => `${sections}/${sectionId}/items`,
  GET_SECTION_ITEMS: (sectionId) => `${sections}/${sectionId}/items`,
  UPDATE_SECTION_ITEM: (sectionId, itemId) => `${sections}/${sectionId}/items/${itemId}`,
  DELETE_SECTION_ITEM: (sectionId, itemId) => `${sections}/${sectionId}/items/${itemId}`,
};
