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
const payment = "/api/payment";
const banners = "/api/banner";
const visaBookings = "/api/visa-bookings";
const visaPayment = "/api/visa-payment";
const holidayCategories = "/api/holiday-categories";
const holidayTours = "/api/holiday-tour";

// ⭐ NEW SEO BASE ROUTE
const seo = "/api/seo";

export const API = {
  BASE_URL: isLocalhost
    ? "http://localhost:5000"
    : "https://desertplanners-backend.onrender.com",

  // ---- SEO ----

  SAVE_SEO: `${seo}/save`, // Create + Update both
  GET_SEO: (type, id) => `${seo}/get?parentType=${type}&parentId=${id}`,
  DELETE_SEO: `${seo}/delete`,

  // ---- Admin ----
  ADMIN_LOGIN: `${admin}/login`,
  ADMIN_OVERVIEW: `${admin}/overview`,
  REMOVE_ADMIN: `${admin}/remove-admin`,
  // ---- Admin Forgot / Reset Password ----
  ADMIN_FORGOT_PASSWORD: `${admin}/forgot-password`,
  ADMIN_RESET_PASSWORD: (token) => `${admin}/reset-password/${token}`,

  // ---- Admin Users ----
  ADMIN_GET_USERS: `${user}/users`,
  ADMIN_UPDATE_USER: (id) => `${user}/users/${id}`,
  ADMIN_DELETE_USER: (id) => `${user}/users/${id}`,
  ADMIN_PROMOTE_USER: `${user}/promote`, // ⭐ NEW — PROMOTE USER TO ADMIN

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
  GET_TOUR_BY_ID: (id) => `${tours}/id/${id}`,

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
  LOOKUP_BOOKING: (bookingId, email) =>
    `${bookings}/lookup?bookingId=${bookingId}&email=${email}`,
  INVOICE_DOWNLOAD: (id) => `${bookings}/invoice/${id}`,

  // ---- Payment (Tour Payment) ----
  CREATE_PAYMENT: `${payment}/create`,
  CONFIRM_PAYMENT: (bookingId) => `${payment}/confirm/${bookingId}`,
  WEBHOOK_PAYMENT: `${payment}/webhook`,
  GET_ALL_PAYMENTS: `${payment}/all`,

  // ---- Enquiries ----
  CREATE_ENQUIRY: `${enquiries}`,
  GET_ALL_ENQUIRIES: `${enquiries}`,
  UPDATE_ENQUIRY_STATUS: (id) => `${enquiries}/${id}/status`,
  DELETE_ENQUIRY: (id) => `${enquiries}/${id}`,

  // ---- Visa ----
  GET_VISAS: `${visas}`,
  GET_VISA_BY_SLUG: (slug) => `${visas}/${slug}`,
  GET_VISAS_BY_CATEGORY: (categorySlug) => `${visas}/category/${categorySlug}`,
  ADD_VISA: `${visas}`,
  UPDATE_VISA: (id) => `${visas}/${id}`,
  DELETE_VISA: (id) => `${visas}/${id}`,
  GET_VISA_BY_ID: (id) => `${visas}/id/${id}`,

  // ---- Sections ----
  GET_SECTIONS: `${sections}`,
  ADD_SECTION: `${sections}`,
  GET_SECTION_BY_ID: (id) => `${sections}/${id}`,
  UPDATE_SECTION: (id) => `${sections}/${id}`,
  DELETE_SECTION: (id) => `${sections}/${id}`,
  TOGGLE_SECTION_VISIBILITY: (id) => `${sections}/${id}/visibility`,

  // ---- Section Items ----
  ADD_SECTION_ITEM: (sectionId) => `${sections}/${sectionId}/items`,
  GET_SECTION_ITEMS: (sectionId) => `${sections}/${sectionId}/items`,
  UPDATE_SECTION_ITEM: (sectionId, itemId) =>
    `${sections}/${sectionId}/items/${itemId}`,
  DELETE_SECTION_ITEM: (sectionId, itemId) =>
    `${sections}/${sectionId}/items/${itemId}`,

  // ---- Banners ----
  ADD_BANNER: `${banners}`,
  GET_BANNERS: `${banners}`,
  UPDATE_BANNER: (id) => `${banners}/${id}`,
  DELETE_BANNER: (id) => `${banners}/${id}`,

  // ---- Visa Bookings ----
  CREATE_VISA_BOOKING: `${visaBookings}/`,
  GET_ALL_VISA_BOOKINGS: `${visaBookings}`,
  GET_VISA_BOOKING_BY_ID: (id) => `${visaBookings}/${id}`,
  UPDATE_VISA_BOOKING_STATUS: (id) => `${visaBookings}/${id}/status`,
  DELETE_VISA_BOOKING: (id) => `${visaBookings}/${id}`,
  LOOKUP_VISA_BOOKING: (bookingId, email) =>
    `${visaBookings}/lookup?bookingId=${bookingId}&email=${email}`,
  VISA_INVOICE_DOWNLOAD: (id) => `${visaBookings}/invoice/${id}`,

  // ---- Visa Payment ----
  CREATE_VISA_PAYMENT: `${visaPayment}/create`,
  CONFIRM_VISA_PAYMENT: (id) => `${visaPayment}/confirm/${id}`,
  WEBHOOK_VISA_PAYMENT: `${visaPayment}/webhook`,

  // ---- Holiday Categories ----
  ADD_HOLIDAY_CATEGORY: `${holidayCategories}`,
  GET_HOLIDAY_CATEGORIES: `${holidayCategories}`,
  DELETE_HOLIDAY_CATEGORY: (id) => `${holidayCategories}/${id}`,
  UPDATE_HOLIDAY_CATEGORY: (id) => `${holidayCategories}/${id}`,
  GET_PACKAGES_BY_CATEGORY: (slug) => `${holidayCategories}/category/${slug}`,

  // ---- Holiday Tours ----
  ADD_HOLIDAY_TOUR: `${holidayTours}/create`,
  GET_ALL_HOLIDAY_TOURS: `${holidayTours}/all`,
  GET_HOLIDAY_TOUR_BY_ID: (id) => `${holidayTours}/${id}`,
  UPDATE_HOLIDAY_TOUR: (id) => `${holidayTours}/update/${id}`,
  DELETE_HOLIDAY_TOUR: (id) => `${holidayTours}/delete/${id}`,
  GET_PACKAGES_BY_CATEGORY2: (slug) => `${holidayTours}/category/${slug}`,
  GET_HOLIDAY_PACKAGE_BY_SLUG: (category, slug) =>
    `${holidayTours}/category/${category}/${slug}`,
};
