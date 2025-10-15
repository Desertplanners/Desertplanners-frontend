import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tour from "./pages/Tour";
import ScrollToTop from "./components/ScrollToTop";
import TourDetails from "./pages/TourDetails";
import TourServiceDetails from "./pages/TourServiceDetails";
import HolidayPackages from "./pages/HolidayPackages";
import HolidayDetails from "./pages/HolidayDetails";
import VisaList from "./pages/VisaList";
import VisaDetails from "./pages/VisaDetails";
import ContactUs from "./pages/Contact";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";


const AppRouter = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tour />} />
      <Route path="/tours/:slug" element={<TourDetails />} />{" "}
      <Route
        path="/tours/:slug/:serviceSlug"
        element={<TourServiceDetails />}
      />
      <Route path="/holidays" element={<HolidayPackages />} />
      <Route path="/holidays/:slug" element={<HolidayDetails />} />
      <Route path="/visa" element={<VisaList />} />
      <Route path="/visa/:slug" element={<VisaDetails />} />
      <Route path="/contact" element={<ContactUs />} />
      {/* Admin Auth */}
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="*"
        element={
          <div className="text-center py-10 text-xl text-red-600">
            Page Not Found
          </div>
        }
      />
    </Routes>
  </>
);
export default AppRouter;
