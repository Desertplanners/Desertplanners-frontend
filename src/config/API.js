const admin = "/api/admin";
const user = "/api/users";
const tours = "/api/tours";
const categories = "/api/categories";
const cart = "/api/cart";
const bookings = "/api/bookings";
const enquiries = "/api/enquiries";
const visas = "/api/visas";
const sections = "/api/sections"; // ✅ new added

export const API = {
  BASE_URL: "https://desetplanner-backend.onrender.com",

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

  // ---- Categories ----
  GET_CATEGORIES: `${categories}`,
  ADD_CATEGORY: `${categories}`,
  DELETE_CATEGORY: (id) => `${categories}/${id}`,
  UPDATE_CATEGORY: (id) => `${categories}/${id}`,

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

  // ---- Enquiries ----
  CREATE_ENQUIRY: `${enquiries}`,
  GET_ALL_ENQUIRIES: `${enquiries}`,
  UPDATE_ENQUIRY_STATUS: (id) => `${enquiries}/${id}/status`,
  DELETE_ENQUIRY: (id) => `${enquiries}/${id}`,

  // ---- ✅ Visa ----
  GET_VISAS: `${visas}`,
  GET_VISA_BY_SLUG: (slug) => `${visas}/${slug}`,
  ADD_VISA: `${visas}`,
  UPDATE_VISA: (id) => `${visas}/${id}`,
  DELETE_VISA: (id) => `${visas}/${id}`,

  // ---- ✅ Sections (New) ----
  GET_SECTIONS: `${sections}`,
  ADD_SECTION: `${sections}`,
  GET_SECTION_BY_ID: (id) => `${sections}/${id}`,
  UPDATE_SECTION: (id) => `${sections}/${id}`,
  DELETE_SECTION: (id) => `${sections}/${id}`,
  TOGGLE_SECTION_VISIBILITY: (id) => `${sections}/${id}/visibility`,

  // ---- ✅ Section Items ----
  ADD_SECTION_ITEM: (sectionId) => `${sections}/${sectionId}/items`,
  GET_SECTION_ITEMS: (sectionId) => `${sections}/${sectionId}/items`,
  UPDATE_SECTION_ITEM: (itemId) => `${sections}/items/${itemId}`,
  DELETE_SECTION_ITEM: (itemId) => `${sections}/items/${itemId}`,
};
