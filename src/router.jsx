import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tour from "./pages/Tour";
import ScrollToTop from "./components/ScrollToTop";
import TourDetails from "./pages/TourDetails";
import TourServiceDetails from "./pages/TourServiceDetails";
// import HolidayPackages from "./pages/HolidayPackages";
// import HolidayDetails from "./pages/HolidayDetails";
import VisaList from "./pages/VisaList";
import VisaDetails from "./pages/VisaDetails";
import ContactUs from "./pages/Contact";
import AdminRegister from "./pages/Admin/AdminRegister";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import UserLogin from "./pages/User/UserLogin";
import UserRegister from "./pages/User/UserRegister";
import MyProfile from "./components/Profile/MyProfile";
import MyOrders from "./components/Profile/MyOrder";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CancellationPolicy from "./components/CancellationPolicy";
import BookingSuccess from "./components/BookingSuccess";
const AppRouter = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tour />} />
      <Route path="/tours/:slug" element={<TourDetails />} />{" "}
      <Route
        path="/tours/:categorySlug/:tourSlug"
        element={<TourServiceDetails />}
      />
      {/* <Route path="/holidays" element={<HolidayPackages />} />
      <Route path="/holidays/:slug" element={<HolidayDetails />} /> */}
      <Route path="/visa" element={<VisaList />} />
      <Route path="/visa/:categorySlug" element={<VisaList />} /> {/* 👈 new */}
      <Route path="/visa/:categorySlug/:visaSlug" element={<VisaDetails />} />
      <Route path="/contact-us" element={<ContactUs />} />
      {/* Admin Auth */}
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/cancellation-policy" element={<CancellationPolicy />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
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
