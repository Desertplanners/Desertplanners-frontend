import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import {
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import PhoneInput from "./PhoneInput";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // CART
  const [cart, setCart] = useState(location.state?.cart || []);

  useEffect(() => {
    if (!location.state?.cart) {
      const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart(localCart);
    }
  }, [location.state?.cart]);

  // USER
  const [user, setUser] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("userInfo")) ||
      {}
    );
  });

  const token =
    user?.token || localStorage.getItem("token") || user?.accessToken || "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const api = DataService("user");
          const res = await api.get(API.USER_PROFILE);
          if (res.data) setUser(res.data);
        } catch (err) {
          console.warn("⚠️ Failed to fetch user profile:", err.message);
        }
      }
    };
    fetchUserProfile();
  }, [token]);

  // FORM
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestContact: "",
    pickupPoint: "",
    dropPoint: "",
    specialRequest: "",
  });

  useEffect(() => {
    if (user?.name || user?.email || user?.phone) {
      setForm((prev) => ({
        ...prev,
        guestName: user?.name || prev.guestName,
        guestEmail: user?.email || prev.guestEmail,
        guestContact: user?.phone || prev.guestContact,
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  // 🔥 TOTAL PRICE FIXED
  const totalPrice = cart.reduce((sum, item) => {
    const t = item.tourId || item;

    const adultPrice = Number(item.adultPrice || t.priceAdult || t.price || 0);
    const childPrice = Number(item.childPrice || t.priceChild || 0);

    const adultCount = Number(item.guestsAdult || item.guests || 0);
    const childCount = Number(item.guestsChild || 0);

    return sum + adultPrice * adultCount + childPrice * childCount;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 FINAL — BOOKING SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.guestName ||
      !form.guestEmail ||
      !form.pickupPoint ||
      !form.dropPoint
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const api = DataService();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // FINAL MAPPING
      const items = cart.map((item) => {
        const tourId =
          typeof item.tourId === "object" ? item.tourId._id : item.tourId;

        const adultPrice = Number(
          item.adultPrice ||
            (typeof item.tourId === "object"
              ? item.tourId.priceAdult
              : item.priceAdult) ||
            0
        );

        const childPrice = Number(
          item.childPrice ||
            (typeof item.tourId === "object"
              ? item.tourId.priceChild
              : item.priceChild) ||
            0
        );

        return {
          tourId,
          date: item.date,
          adultCount: Number(item.guestsAdult || item.guests || 0),
          childCount: Number(item.guestsChild || 0),
          adultPrice,
          childPrice,
          pickupPoint: form.pickupPoint,
          dropPoint: form.dropPoint,
        };
      });

      const bookingData = {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestContact: form.guestContact,
        pickupPoint: form.pickupPoint,
        dropPoint: form.dropPoint,
        specialRequest: form.specialRequest,
        totalPrice,
        items,
      };

      const bookingRes = await api.post(API.CREATE_BOOKING, bookingData, {
        headers,
      });

      if (!bookingRes.data?.success) {
        toast.error("Booking failed!");
        setLoading(false);
        return;
      }

      const bookingId =
        bookingRes.data.booking?._id || bookingRes.data.bookingId;

      // PAYMENT
      const paymentRes = await api.post(
        API.CREATE_PAYMENT,
        { bookingId },
        { headers }
      );

      if (paymentRes.data?.success && paymentRes.data?.paymentLink) {
        toast.success("Redirecting to secure payment...");
        localStorage.removeItem("guestCart");
        window.location.href = paymentRes.data.paymentLink;
      } else {
        await api.put(API.CONFIRM_PAYMENT(bookingId));
        localStorage.removeItem("guestCart");
        toast.success("Booking confirmed (local)");
        navigate("/booking-success", { state: { bookingId } });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing booking.");
    } finally {
      setLoading(false);
    }
  };

  // UI BELOW
  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-gradient-to-br from-[#ffffff] via-[#f9f7ff] to-[#fff1f3] rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#8000ff] to-[#e5006e] text-transparent bg-clip-text drop-shadow-lg">
        Checkout & Confirm Your Booking
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaCalendarAlt className="text-[#e82429]" /> Booking Summary
          </h3>

          {cart.length > 0 ? (
            <div className="space-y-5">
              {cart.map((item, i) => {
                const t = item.tourId || item;

                const title =
                  item.tourId?.title || item.title || "Tour Experience";

                const adultCount = Number(item.guestsAdult || item.guests || 0);
                const childCount = Number(item.guestsChild || 0);

                const adultUnitPrice = Number(
                  item.adultPrice || t.priceAdult || t.price || 0
                );
                const childUnitPrice = Number(
                  item.childPrice || t.priceChild || 0
                );

                const adultTotal = adultUnitPrice * adultCount;
                const childTotal = childUnitPrice * childCount;
                const total = adultTotal + childTotal;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-5 border-b pb-4 border-gray-200 hover:bg-gray-50 rounded-xl transition-all p-2"
                  >
                    <img
                      src={
                        item.tourId?.mainImage?.startsWith("http")
                          ? item.tourId.mainImage
                          : item.mainImage || "/no-img.png"
                      }
                      alt={title}
                      className="w-28 h-20 object-cover rounded-xl"
                    />

                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {title}
                      </h4>

                      <p className="text-gray-600 text-sm">
                        <FaCalendarAlt className="inline text-[#e82429] mr-1" />
                        {item.date
                          ? new Date(item.date).toDateString()
                          : "Not selected"}
                      </p>

                      {/* Adult Breakdown */}
                      {adultCount > 0 && (
                        <p className="text-gray-700 text-sm">
                          Adults: {adultCount} × AED {adultUnitPrice} ={" "}
                          <span className="font-semibold text-[#e82429]">
                            AED {adultTotal}
                          </span>
                        </p>
                      )}

                      {/* Child Breakdown */}
                      {childCount > 0 && (
                        <p className="text-gray-700 text-sm">
                          Children: {childCount} × AED {childUnitPrice} ={" "}
                          <span className="font-semibold text-[#e82429]">
                            AED {childTotal}
                          </span>
                        </p>
                      )}

                      {/* Total */}
                      <p className="text-[#e82429] font-bold mt-1">
                        Total: AED {total}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between pt-4 border-t border-gray-200 text-lg">
                <span className="font-bold text-gray-800">Total Price:</span>
                <span className="font-bold text-[#e82429]">AED {totalPrice}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No items in cart 🛒</p>
          )}
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaUser className="text-[#e82429]" /> Traveler Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="guestEmail"
                value={form.guestEmail}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <PhoneInput
                value={form.guestContact}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, guestContact: val }))
                }
              />
            </div>

            {/* Pickup */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="pickupPoint"
                value={form.pickupPoint}
                onChange={handleChange}
                placeholder="Pickup Point"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            {/* Drop */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="dropPoint"
                value={form.dropPoint}
                onChange={handleChange}
                placeholder="Drop Point"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            {/* Special Request */}
            <textarea
              name="specialRequest"
              value={form.specialRequest}
              onChange={handleChange}
              placeholder="Special Request (Optional)"
              className="w-full border p-3 rounded-xl h-24 focus:ring-2 focus:ring-[#e82429] outline-none"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl font-semibold text-lg hover:scale-[1.03] transition-transform"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
