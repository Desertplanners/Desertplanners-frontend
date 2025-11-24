import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaInfoCircle,
  FaCheckCircle,
  FaFileContract,
  FaTimesCircle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import TourGallery from "../components/TourGallery";
import toast from "react-hot-toast";
import { Suspense, lazy } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";

export default function TourServiceDetails() {
  const { categorySlug, tourSlug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  // Check Availability states
  const [startDate, setStartDate] = useState(null);
  const [guests, setGuests] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");

  const navigate = useNavigate();

  // Reset availabilityResult when date or guests change
  useEffect(() => {
    setAvailabilityResult(null);
  }, [startDate, guests]);

  // Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      const api = DataService();
      try {
        const res = await api.get(API.GET_TOUR(tourSlug));
        console.log("🎯 API GET_TOUR Response:", res.data); // <-- ADD THIS
        if (res.data) {
          setTour(res.data);
          setMainImage(`${API.BASE_URL}/${res.data.mainImage}`);
          console.log("🖼️ Related tours:", res.data.relatedTours); // <-- ADD THIS
          setRelatedTours(res.data.relatedTours || []);
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourSlug]);

  // Format date to YYYY-MM-DD for backend
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check Availability
  const checkAvailability = async () => {
    if (!startDate) {
      toast("Please select a date");
      return;
    }

    if (tour.priceChild) {
      // Child price wale tours me adult required
      if (!adults) {
        toast("Please select number of adults");
        return;
      }
    } else {
      // Normal tours me guests required
      if (!guests) {
        toast("Please select number of guests");
        return;
      }
    }

    try {
      setLoadingAvailability(true);
      const api = DataService();
      const res = await api.post(API.CHECK_AVAILABILITY, {
        date: formatDateToYYYYMMDD(startDate),
        guests: tour.priceChild
          ? parseInt(adults || 0) + parseInt(children || 0)
          : parseInt(guests),
        tourId: tour._id,
      });
      setAvailabilityResult(res.data);
      toast.success(res.data.message || "Availability checked successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error checking availability");
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Add to Cart
  const handleAddToCart = async (tour) => {
    try {
      setAddingToCart(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const formattedDate = startDate
        ? formatDateToYYYYMMDD(startDate)
        : new Date().toISOString().split("T")[0];

      // Adult = guests, Child = 0 (for now)
      // const adults = Number(guests) || 1;
      // const children = 0;

      const adultCount = tour.priceChild ? Number(adults) : Number(guests);
      const childCount = tour.priceChild ? Number(children) : 0;

      const adultPrice = Number(tour.priceAdult || tour.price || 0);
      const childPrice = Number(tour.priceChild || 0);

      // ======================================================
      // 🔐 1️⃣ LOGGED-IN USER
      // ======================================================
      if (user?._id) {
        localStorage.removeItem("guestCart");

        const api = DataService("user");

        const payload = {
          userId: user._id,
          tourId: tour._id,
          date: formattedDate,

          guestsAdult: adultCount,
          guestsChild: childCount,

          adultPrice,
          childPrice,
        };

        console.log("📤 Cart Payload:", payload);

        const res = await api.post(API.ADD_TO_CART, payload);

        if (res.data?.success) {
          toast.success("Added to cart!");
          navigate("/cart", { state: { newCart: res.data.cart } });
        } else {
          toast.error("Something went wrong!");
        }

        return;
      }

      // ======================================================
      // 🧳 2️⃣ GUEST USER FLOW
      // ======================================================
      let localCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // guestCart me item compare always id se karna
      const existing = localCart.find((item) => item.tourId === tour._id);

      if (existing) {
        existing.guestsAdult = adults;
        existing.guestsChild = children;
        existing.date = formattedDate;
        existing.adultPrice = adultPrice;
        existing.childPrice = childPrice;
        existing.guestsAdult = adultCount;
        existing.guestsChild = childCount;
      } else {
        localCart.push({
          tourId: tour._id,
          title: tour.title,
          mainImage: tour.mainImage,
          date: formattedDate,
          guestsAdult: adultCount,
          guestsChild: childCount,
          adultPrice,
          childPrice,
          quantity: 1,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(localCart));

      toast.success("Added to cart!");
      navigate("/cart", { state: { newCart: localCart } });
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );
      toast.error("Error adding to cart!");
    } finally {
      setAddingToCart(false);
    }
  };

  // Yeh function component ke bahar add karo (file ke end mein)
  // 🔄 UPDATED - Array Format Cancellation Policy Render Function
  const renderStructuredCancellationPolicy = (policy) => {
    // Agar policy array format mein hai (new dynamic format)
    if (Array.isArray(policy)) {
      if (policy.length === 0) return null;

      return (
        <div className="space-y-6">
          {policy.map((section, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                {section.title}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Agar policy string format mein hai (backward compatibility)
    if (typeof policy === "string") {
      return (
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {policy}
        </div>
      );
    }

    // Agar policy object format mein hai (old structured format - backward compatibility)
    if (typeof policy === "object") {
      return (
        <div className="space-y-6">
          {/* Refund Timeline */}
          {policy.refundTimeline && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Refund Timeline
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.refundTimeline}
              </p>
            </div>
          )}

          {/* No-Show Policy */}
          {policy.noShowPolicy && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                No-Show Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.noShowPolicy}
              </p>
            </div>
          )}

          {/* Non-Refundable Items */}
          {policy.nonRefundableItems && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Non-Refundable Items
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.nonRefundableItems}
              </p>
            </div>
          )}

          {/* Refund Method */}
          {policy.refundMethod && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Refund Method
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.refundMethod}
              </p>
            </div>
          )}

          {/* Rescheduling Policy */}
          {policy.reschedulingPolicy && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Rescheduling Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.reschedulingPolicy}
              </p>
            </div>
          )}

          {/* Child Policy */}
          {policy.childPolicy && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Child Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.childPolicy}
              </p>
            </div>
          )}

          {/* Other Terms */}
          {policy.otherTerms && (
            <div>
              <h3 className="font-bold text-[#e82429] text-lg mb-2">
                Other Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {policy.otherTerms}
              </p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };
  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-10 animate-pulse">
        <div className="h-[400px] bg-gray-200 rounded-3xl mb-8"></div>
        <div className="h-10 bg-gray-200 w-2/3 mb-4 rounded"></div>
        <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tour)
    return (
      <div className="text-center py-20 text-2xl font-semibold text-red-600">
        Tour not found
      </div>
    );

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* LEFT SECTION — IMAGES + DETAILS */}
        <div className="lg:col-span-8 order-1 lg:order-1 space-y-8">
          {/* Main Image + Thumbnails */}
          <Suspense
            fallback={
              <div className="h-[400px] bg-gray-200 animate-pulse rounded-3xl"></div>
            }
          >
            <TourGallery tour={tour} />
          </Suspense>

          {/* Title + Price */}
          <div className="bg-gradient-to-r from-[#fff4f4] to-[#ffeaea] rounded-3xl shadow-xl p-6 border border-[#e82429]/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-3xl font-extrabold text-[#721011] mb-2">
                  {tour.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-[#e82429]/20 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaClock className="text-[#e82429]" />{" "}
                    {tour.duration || "Flexible"}
                  </span>
                  <span className="bg-[#fff4f4]/80 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm">
                    {tour.category?.name || "Luxury Experience"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2 mt-3 md:mt-0">
                {/* Adult Price */}
                <p className="text-3xl md:text-4xl font-extrabold text-[#e82429] leading-tight">
                  AED {tour.priceAdult || tour.price || "—"}
                </p>

                {/* Child Price Beautiful Tag */}
                {tour.priceChild && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#ffe5e5] to-[#ffd6d6] text-[#721011] font-semibold text-sm rounded-full shadow-sm border border-[#e82429]/30">
                      Child Price: AED {tour.priceChild}
                    </span>
                  </div>
                )}

                {/* Per Person */}
                <p className="text-gray-500 text-xs md:text-sm font-medium -mt-1">
                  (Per Person)
                </p>

                {/* Rating Section */}
                <div className="flex items-center gap-2 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-500 drop-shadow-sm"
                    />
                  ))}
                  <span className="text-gray-600 text-sm font-medium">
                    4.9 / 5 (134 reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
              {tour.description ||
                "Experience the best of Dubai with our luxury travel packages and unforgettable adventures."}
            </p>
          </div>

          {/* Mobile / Tablet Check Availability */}
          <div className="block lg:hidden">
            <div className="bg-white rounded-3xl shadow-xl p-6 mt-4 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#404041]">
                  Check Availability
                </h2>
                <span className="bg-[#e82429] text-white px-3 py-1 rounded-full text-sm">
                  Popular
                </span>
              </div>

              {/* Date Picker */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 font-medium">Select Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  placeholderText="Select a date"
                  className="w-full border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none shadow-sm"
                />
              </div>

              {/* Guests Section */}
              <div className="flex flex-col gap-4">
                {tour.priceChild ? (
                  <>
                    {/* Adults */}
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-700 font-semibold flex items-center gap-2">
                        <span className="text-[#e82429] text-lg">👤</span>{" "}
                        Adults
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-300 shadow-sm text-gray-700 focus:ring-2 focus:ring-[#e82429] focus:border-[#e82429] transition-all"
                      >
                        <option value="">Select Adults</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Children */}
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-700 font-semibold flex items-center gap-2">
                        <span className="text-[#e82429] text-lg">🧒</span>{" "}
                        Children
                      </label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-300 shadow-sm text-gray-700 focus:ring-2 focus:ring-[#e82429] focus:border-[#e82429] transition-all"
                      >
                        <option value="0">0</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guests (no child price) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-700 font-semibold flex items-center gap-2">
                        <span className="text-[#e82429] text-lg">👥</span>{" "}
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-[#e82429] focus:border-[#e82429]"
                      >
                        <option value="">Select Guests</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Button */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (!availabilityResult?.available) {
                      checkAvailability();
                    } else {
                      handleAddToCart(tour);
                    }
                  }}
                  className={`w-full font-bold py-3 rounded-2xl shadow-xl transition-transform duration-300 ${
                    availabilityResult?.available
                      ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105"
                      : "bg-gradient-to-r from-[#e82429] to-[#721011] text-white hover:scale-105"
                  }`}
                >
                  {availabilityResult?.available
                    ? addingToCart
                      ? "Adding..."
                      : "Add to Cart"
                    : loadingAvailability
                    ? "Checking..."
                    : "Check Availability"}
                </button>

                {availabilityResult && !availabilityResult.available && (
                  <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-center">
                    Not available on selected date or for selected guests
                  </div>
                )}
                {availabilityResult?.available && (
                  <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-xl border border-green-200 text-center">
                    Available on {startDate.toDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <section className="bg-gradient-to-br from-[#fff4f4] to-[#ffeaea] rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-[#721011] mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-[#e82429]" /> Highlights
            </h2>

            <ul className="space-y-3 text-gray-700">
              {(tour.highlights || []).map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#e82429]" /> {point}
                </li>
              ))}
            </ul>
          </section>

          {/* NEED TO KNOW */}
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-[#404041] mb-3 border-b border-[#e82429]/30 pb-2">
              Need to Know
            </h2>

            <ul className="space-y-3">
              {[
                { icon: "⏰", text: `Timings: ${tour.timings || "Flexible"}` },
                // {
                //   icon: "📌",
                //   text: "Pick-up & drop-off included in most tours",
                // },
                // { icon: "🧳", text: "Comfortable clothing recommended" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-[#fff4f4] rounded-xl border border-[#e82429]/20 hover:bg-[#ffeaea] transition-all duration-300"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* ✅ Inclusions Section */}
            {tour.inclusions?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#e82429] mb-2">
                  Inclusions
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {tour.inclusions.map((inc, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 p-2 bg-[#fff4f4] rounded-lg border border-[#e82429]/20 hover:bg-[#ffeaea] transition-all duration-300"
                    >
                      <span className="text-[#e82429] text-lg">✅</span> {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ Exclusions Section */}
            {tour.exclusions?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#e82429] mb-2">
                  Exclusions
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {tour.exclusions.map((exc, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 p-2 bg-[#fff4f4] rounded-lg border border-[#e82429]/20 hover:bg-[#ffeaea] transition-all duration-300"
                    >
                      <span className="text-[#e82429] text-lg">❌</span> {exc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ✅ NAYA SECTION - Terms and Conditions */}
          {tour.termsAndConditions && (
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-[#404041] mb-3 border-b border-[#e82429]/30 pb-2 flex items-center gap-2">
                <FaFileContract className="text-[#e82429]" /> Special Terms &
                Conditions
              </h2>

              <div className="bg-[#fff4f4] rounded-2xl p-6 border border-[#e82429]/20">
                <div
                  className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: tour.termsAndConditions.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          )}

          {/* ✅ UPDATED SECTION - Structured Cancellation Policy */}
          {tour.cancellationPolicy && (
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-[#404041] mb-3 border-b border-[#e82429]/30 pb-2 flex items-center gap-2">
                <FaTimesCircle className="text-[#e82429]" /> Cancellation &
                Refund Policy
              </h2>

              <div className="bg-[#fff4f4] rounded-2xl p-6 border border-[#e82429]/20">
                {renderStructuredCancellationPolicy(tour.cancellationPolicy)}
              </div>
            </div>
          )}
          {/* STATIC REVIEWS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
            <h2 className="text-2xl font-bold text-[#404041] mb-6 border-b pb-2">
              Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Alice Smith",
                  rating: 5,
                  text: "Amazing experience! Highly recommend for family trips.",
                },
                {
                  name: "John Doe",
                  rating: 4,
                  text: "Very well organized tour. Worth the price!",
                },
                {
                  name: "Maria Johnson",
                  rating: 5,
                  text: "The guides were friendly and knowledgeable. Loved it!",
                },
                {
                  name: "David Lee",
                  rating: 4,
                  text: "Beautiful places and great itinerary. Will come again.",
                },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-5 bg-gradient-to-r from-[#fff4f4] to-[#ffeaea] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#e82429]/20 flex items-center justify-center text-[#e82429] font-bold text-lg">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#404041]">
                        {rev.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < rev.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* COMMON INFO SECTION */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
            <h2 className="text-2xl font-bold text-[#404041] mb-4 border-b pb-2">
              Know Before You Go
            </h2>

            <ul className="space-y-3">
              {[
                {
                  text: "Pick-up and drop-off included in most tours",
                  icon: "🚐",
                },
                { text: "Comfortable clothing recommended", icon: "👕" },
                { text: "Duration may vary depending on traffic", icon: "⏱️" },
                {
                  text: "Free cancellation up to 24 hours in advance",
                  icon: "❌",
                },
                { text: "Guided tours with professional staff", icon: "🧑‍💼" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#e82429]/20 bg-[#fff4f4] hover:bg-[#ffeaea] transition-all duration-300"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RELATED TOURS SECTION - SLIDER VERSION */}
          {relatedTours && relatedTours.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-[#721011] mb-8 text-center">
                Related Tours
              </h2>

              <Swiper
                modules={[Autoplay]}
                navigation={false}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-10"
              >
                {relatedTours.map((t) => {
                  const imageUrl = t.mainImage?.startsWith("http")
                    ? t.mainImage
                    : `${API.BASE_URL}/${t.mainImage}`;

                  return (
                    <SwiperSlide key={t._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link
                          to={`/tours/${t.category?.slug}/${t.slug}`}
                          className="
                  block bg-white rounded-3xl shadow-lg hover:shadow-xl 
                  transition-all overflow-hidden border border-gray-200 
                  h-[380px] flex flex-col     /* ⭐ FIXED CARD HEIGHT */
                "
                        >
                          {/* IMAGE */}
                          <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                            <img
                              src={imageUrl || "/no-image.jpg"}
                              alt={t.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                            {/* Duration Tag */}
                            {t.duration && (
                              <span className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                ⏳ {t.duration}
                              </span>
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="p-5 flex flex-col justify-between flex-1">
                            {/* Title — fixed height */}
                            <h4 className="text-lg font-semibold text-[#404041] line-clamp-2 min-h-[48px]">
                              {t.title}
                            </h4>

                            {/* BOTTOM SECTION */}
                            <div className="flex items-center justify-between mt-auto pt-3">
                              <div>
                                <div className="text-[#e82429] font-bold text-lg">
                                  AED {t.priceAdult || t.price}
                                </div>
                                <p className="text-gray-500 text-xs">
                                  per person
                                </p>
                              </div>

                              <span className="text-[#721011] font-bold text-sm flex items-center gap-1">
                                View Details →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </section>
          )}

          {/* LOCATION MAP */}
          {tour.location && (
            <div className="bg-white rounded-3xl shadow-lg p-8 mt-6">
              <h2 className="text-2xl font-semibold text-[#404041] flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="text-[#e82429]" /> Location on Map
              </h2>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-[#e82429]/20 shadow-md">
                <iframe
                  src={tour.location}
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="lg:col-span-4 order-2 lg:order-2 hidden lg:block">
          <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-800">
                Check Availability
              </h2>
              <span className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                Popular
              </span>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-gray-700 font-medium">Select Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                placeholderText="Select a date"
                className="w-full border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none shadow-sm"
              />
            </div>

            {/* Guests */}
            <div className="flex flex-col gap-4 mt-2">
              {tour.priceChild ? (
                <>
                  {/* Adults */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-semibold flex items-center gap-2">
                      <span className="text-[#e82429] text-lg">👤</span> Adults
                    </label>

                    <div className="relative">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="
              w-full px-4 py-3 rounded-2xl bg-white border 
              border-gray-300 shadow-sm text-gray-700
              focus:ring-2 focus:ring-[#e82429]/50 focus:border-[#e82429]
              transition-all duration-300 cursor-pointer
            "
                      >
                        <option value="">Select Adults</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-semibold flex items-center gap-2">
                      <span className="text-[#e82429] text-lg">🧒</span>{" "}
                      Children
                    </label>

                    <div className="relative">
                      <select
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        className="
              w-full px-4 py-3 rounded-2xl bg-white border 
              border-gray-300 shadow-sm text-gray-700
              focus:ring-2 focus:ring-[#e82429]/50 focus:border-[#e82429]
              transition-all duration-300 cursor-pointer
            "
                      >
                        <option value="0">0</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Guests (No child price tours) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-semibold flex items-center gap-2">
                      <span className="text-[#e82429] text-lg">👥</span> Guests
                    </label>

                    <div className="relative">
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="
              w-full px-4 py-3 rounded-2xl bg-white border 
              border-gray-300 shadow-sm text-gray-700
              focus:ring-2 focus:ring-[#e82429]/50 focus:border-[#e82429]
              transition-all duration-300 cursor-pointer
            "
                      >
                        <option value="">Select Guests</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Button */}
            <div className="mt-2">
              <button
                onClick={() => {
                  if (!availabilityResult?.available) {
                    checkAvailability();
                  } else {
                    handleAddToCart(tour);
                  }
                }}
                className={`w-full font-bold py-3 rounded-2xl shadow-xl transition-transform duration-300 ${
                  availabilityResult?.available
                    ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105"
                    : "bg-gradient-to-r from-[#e82429] to-[#721011] text-white hover:scale-105"
                }`}
              >
                {availabilityResult?.available
                  ? addingToCart
                    ? "Adding..."
                    : "Add to Cart"
                  : loadingAvailability
                  ? "Checking..."
                  : "Check Availability"}
              </button>

              {availabilityResult && !availabilityResult.available && (
                <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-center">
                  Not available on selected date or for selected guests
                </div>
              )}
              {availabilityResult?.available && (
                <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-xl border border-green-200 text-center">
                  Available for {guests} guest(s) on {startDate.toDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
