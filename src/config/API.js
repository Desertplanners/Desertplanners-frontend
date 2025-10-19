const admin = "/api/admin";
const tours = "/api/tours";
export const API = {
  ADMIN_REGISTER: `${admin}/register`,
  ADMIN_LOGIN: `${admin}/login`,
  ADMIN_PROFILE: `${admin}/me`,
  ADMIN_UPDATE_PROFILE: `${admin}/me`,

    // Tours endpoints
  GET_TOURS: `${tours}`,            // GET all tours
  GET_TOUR: (slug) => `${tours}/${slug}`, // GET single tour
  ADD_TOUR: `${tours}`,             // POST new tour
  UPDATE_TOUR: (id) => `${tours}/${id}`, // PUT update tour
  DELETE_TOUR: (id) => `${tours}/${id}`, // DELETE tour
};
