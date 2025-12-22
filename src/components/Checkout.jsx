import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import {
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";
import PhoneInput from "./PhoneInput";
import Confetti from "react-confetti";

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
        } catch (err) {}
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

  // 🎟️ COUPON STATES
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalPayable, setFinalPayable] = useState(0);
  const [animatePrice, setAnimatePrice] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 🎟️ AVAILABLE COUPONS (Dropdown)
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const [couponListLoading, setCouponListLoading] = useState(false);

  // ⭐ CHECK — Pickup / Drop required or not
  const isPickupRequired = cart.some(
    (item) =>
      item.pickupDropRequired === true ||
      item.tourId?.pickupDropRequired === true
  );

  // TOTAL PRICE FIXED
  const totalPrice = cart.reduce((sum, item) => {
    const t = item.tourId || item;

    const adultPrice = Number(item.adultPrice || t.priceAdult || t.price || 0);
    const childPrice = Number(item.childPrice || t.priceChild || 0);

    const adultCount = Number(
      item.guestsAdult ?? item.adultCount ?? item.adults ?? item.guests ?? 0
    );
    const childCount = Number(
      item.guestsChild ?? item.childCount ?? item.children ?? 0
    );

    return sum + adultPrice * adultCount + childPrice * childCount;
  }, 0);

  // TRANSACTION FEE 3.75%
  const fee = Number((totalPrice * 0.0375).toFixed(2));

  // FINAL AMOUNT
  const finalAmount = Number((totalPrice + fee).toFixed(2));

  useEffect(() => {
    setFinalPayable(Math.max(finalAmount - couponDiscount, 0).toFixed(2));
  }, [finalAmount, couponDiscount]);

  // 🟢 TOTAL DISCOUNT CALCULATION
  const totalDiscount = cart.reduce((sum, item) => {
    const t = item.tourId || item;

    // ACTUAL PRICES (without discount)
    const actualAdultPrice = Number(t.priceAdult || t.price || 0);
    const actualChildPrice = Number(t.priceChild || 0);

    // APPLIED PRICES (discounted or normal)
    const appliedAdultPrice = Number(item.adultPrice || actualAdultPrice);
    const appliedChildPrice = Number(item.childPrice || actualChildPrice);

    const adultCount = Number(
      item.guestsAdult ?? item.adultCount ?? item.adults ?? item.guests ?? 0
    );
    const childCount = Number(
      item.guestsChild ?? item.childCount ?? item.children ?? 0
    );

    const adultDiscount = (actualAdultPrice - appliedAdultPrice) * adultCount;

    const childDiscount = (actualChildPrice - appliedChildPrice) * childCount;

    return sum + Math.max(adultDiscount, 0) + Math.max(childDiscount, 0);
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = async (codeFromUI) => {
    const finalCode = codeFromUI || couponCode;

    if (!finalCode) {
      toast.error("Please enter coupon code");
      return;
    }

    try {
      setCouponLoading(true);
      const api = DataService();

      const firstItem = cart[0];
      const tourId =
        typeof firstItem?.tourId === "object"
          ? firstItem.tourId._id
          : firstItem?.tourId;

      const res = await api.post(API.APPLY_COUPON, {
        code: finalCode,
        orderAmount: finalAmount,
        tourId,
      });

      if (res.data?.success) {
        setCouponCode(finalCode);
        setAppliedCoupon(res.data);
        setCouponDiscount(res.data.discount);

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        toast.success("Coupon applied successfully 🎉");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      setCouponListLoading(true);
      const api = DataService();

      const firstItem = cart[0];
      const tourId =
        typeof firstItem?.tourId === "object"
          ? firstItem.tourId._id
          : firstItem?.tourId;

      const res = await api.get(
        `${API.GET_AVAILABLE_COUPONS}?tourId=${tourId}`
      );

      setAvailableCoupons(res.data?.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setCouponListLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscount(0);

    setAnimatePrice(true);
    setTimeout(() => setAnimatePrice(false), 600);

    toast("Coupon removed", { icon: "❌" });
  };

  // FINAL — BOOKING SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.guestName ||
      !form.guestEmail ||
      (isPickupRequired && (!form.pickupPoint || !form.dropPoint))
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // ⭐ DATA LAYER — ADD_PAYMENT_INFO
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "add_payment_info",
      payment_type: "online",
      value: finalAmount,
      currency: "AED",
      items: cart.map((item) => ({
        tour_id: item.tourId?._id || item.tourId || item._id,
        tour_name: item.tourId?.title || item.title,
        date: item.date,

        guests_adult: Number(
          item.guestsAdult ?? item.adultCount ?? item.adults ?? item.guests ?? 0
        ),

        guests_child: Number(
          item.guestsChild ?? item.childCount ?? item.children ?? 0
        ),

        price_adult: Number(
          item.adultPrice || item.tourId?.priceAdult || item.price || 0
        ),

        price_child: Number(item.childPrice || item.tourId?.priceChild || 0),

        quantity:
          Number(
            item.guestsAdult ??
              item.adultCount ??
              item.adults ??
              item.guests ??
              0
          ) + Number(item.guestsChild ?? item.childCount ?? item.children ?? 0),
      })),
    });

    console.log("📡 DATA LAYER — add_payment_info fired");

    setLoading(true);

    try {
      const api = DataService();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // ⭐ FIXED ITEMS MAPPING
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

          adultCount: Number(
            item.guestsAdult ??
              item.adultCount ??
              item.adults ??
              item.guests ??
              0
          ),

          childCount: Number(
            item.guestsChild ?? item.childCount ?? item.children ?? 0
          ),

          adultPrice,
          childPrice,
        };
      });

      // ⭐ FINAL BOOKING PAYLOAD
      const bookingData = {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestContact: form.guestContact,
        pickupPoint: isPickupRequired ? form.pickupPoint : null,
        dropPoint: isPickupRequired ? form.dropPoint : null,
        specialRequest: form.specialRequest,
        items,
        // ⭐ ADD THESE 2 LINES
        couponCode: appliedCoupon?.code || null,
        couponDiscount: couponDiscount || 0,
      };

      // ⭐ CREATE BOOKING API
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

      // ⭐ PAYMENT API
      const paymentRes = await api.post(
        API.CREATE_PAYMENT,
        { bookingId },
        { headers }
      );

      // ⭐ IF PAYMENT LINK RECEIVED → REDIRECT
      if (paymentRes.data?.success && paymentRes.data?.paymentLink) {
        toast.success("Redirecting to secure payment...");
        localStorage.removeItem("guestCart");
        window.location.href = paymentRes.data.paymentLink;
      } else {
        // ⭐ DIRECT PAYMENT CONFIRMATION
        await api.put(API.CONFIRM_PAYMENT(bookingId));
        localStorage.removeItem("guestCart");
        toast.success("Booking confirmed!");
        navigate("/booking-success", { state: { bookingId } });
      }
    } catch (err) {
      toast.error("Error processing booking.");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-gradient-to-br from-[#ffffff] via-[#f9f7ff] to-[#fff1f3] rounded-3xl shadow-2xl">
      {showConfetti && (
        <Confetti
          numberOfPieces={1500}
          gravity={0.15}
          initialVelocityY={40}
          wind={0.04}
          recycle={false}
        />
      )}

      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#8000ff] to-[#e5006e] text-transparent bg-clip-text drop-shadow-lg">
        Checkout & Confirm Your Booking
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaCalendarAlt className="text-[#e82429]" /> Booking Summary
          </h3>

          {cart.length > 0 ? (
            <div className="space-y-5">
              {cart.map((item, i) => {
                const t = item.tourId || item;

                const title =
                  item.tourId?.title || item.title || "Tour Experience";

                const adultCount = Number(
                  item.guestsAdult ??
                    item.adultCount ??
                    item.adults ??
                    item.guests ??
                    0
                );
                const childCount = Number(
                  item.guestsChild ?? item.childCount ?? item.children ?? 0
                );

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
                    className="flex items-center gap-5 border-b pb-4 border-gray-200"
                  >
                    <img
                      src={
                        item.tourId?.mainImage?.startsWith("http")
                          ? item.tourId.mainImage
                          : item.mainImage || "/no-img.png"
                      }
                      className="w-28 h-20 object-cover rounded-xl"
                      alt={title}
                    />

                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {title}
                      </h4>

                      <p className="text-gray-600 text-sm">
                        <FaCalendarAlt className="inline text-[#e82429]" />{" "}
                        {item.date
                          ? new Date(item.date).toDateString()
                          : "Not selected"}
                      </p>

                      {adultCount > 0 && (
                        <p className="text-gray-700 text-sm">
                          Adults: {adultCount} × AED {adultUnitPrice} ={" "}
                          <b>AED {adultTotal}</b>
                        </p>
                      )}

                      {childCount > 0 && (
                        <p className="text-gray-700 text-sm">
                          Children: {childCount} × AED {childUnitPrice} ={" "}
                          <b>AED {childTotal}</b>
                        </p>
                      )}

                      <p className="text-[#e82429] font-bold mt-1">
                        Total: AED {total}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* TOTALS */}
              <div className="flex justify-between pt-4 border-t border-gray-200 text-lg">
                <span className="font-bold text-gray-800">Subtotal:</span>
                <span className="font-bold text-[#e82429]">
                  AED {totalPrice}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">
                  Transaction Fee:
                </span>
                <span className="font-bold text-[#e82429]">AED {fee}</span>
              </div>

              {/* 🎟️ COUPON DISCOUNT — ONLY IF APPLIED */}
              {couponDiscount > 0 && (
                <div
                  className="
      flex
      justify-between
      items-center
      text-lg
      mt-1
      px-2
      py-1
      rounded-lg
      bg-green-50
      border
      border-green-200
      animate-[fadeIn_0.4s_ease-in-out]
    "
                >
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    🎟️ Coupon Discount
                  </span>

                  <span className="font-extrabold text-green-700">
                    − AED {couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              {totalDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-700">
                  <span className="font-bold">You Saved:</span>
                  <span className="font-bold">
                    − AED {totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xl pt-3 border-t">
                <span className="font-extrabold text-gray-900">
                  Final Payable:
                </span>
                <span
                  className={`font-extrabold text-green-700 transition-all duration-500 ${
                    animatePrice ? "scale-110" : ""
                  }`}
                >
                  AED {finalPayable}
                </span>
              </div>

              {/* 🎟️ COUPON APPLY — FINAL PAYABLE KE NICHE */}
              <div className="mt-6 space-y-3">
                {!appliedCoupon ? (
                  <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#e82429]/40 bg-gradient-to-br from-[#fff5f6] via-white to-[#fff0f3] p-4 shadow-sm">
                    {/* glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e82429]/10 to-[#721011]/10 blur-2xl opacity-40 pointer-events-none" />

                    <p className="text-sm font-semibold text-[#721011] mb-2">
                      🎟️ Have a coupon?
                    </p>

                    {/* INPUT + APPLY */}
                    <div className="flex gap-3 relative z-10">
                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="ENTER COUPON CODE"
                        className="
            flex-1
            rounded-xl
            px-4
            py-3
            text-sm
            font-semibold
            tracking-widest
            border
            border-gray-300
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#e82429]
            focus:border-[#e82429]
            placeholder:text-gray-400
          "
                      />

                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="
            relative
            overflow-hidden
            rounded-xl
            px-6
            py-3
            font-extrabold
            text-white
            bg-gradient-to-r
            from-[#e82429]
            to-[#721011]
            shadow-lg
            hover:scale-105
            transition-all
            disabled:opacity-60
          "
                      >
                        {couponLoading ? "APPLYING..." : "APPLY"}
                      </button>
                    </div>

                    {/* VIEW OFFERS */}
                    <p
                      onClick={() => {
                        setShowCouponDropdown((prev) => !prev);
                        if (availableCoupons.length === 0) {
                          fetchAvailableCoupons();
                        }
                      }}
                      className="mt-3 text-xs font-semibold text-[#e82429] cursor-pointer hover:underline relative z-10"
                    >
                      View available offers
                    </p>

                    {/* DROPDOWN */}
                    {showCouponDropdown && (
                      <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border bg-white shadow-xl relative z-20">
                        {couponListLoading ? (
                          <p className="p-4 text-center text-sm text-gray-500">
                            Loading offers...
                          </p>
                        ) : availableCoupons.length === 0 ? (
                          <p className="p-4 text-center text-sm text-gray-500">
                            No coupons available
                          </p>
                        ) : (
                          availableCoupons.map((coupon) => (
                            <div
                              key={coupon._id}
                              className="flex items-center justify-between gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50"
                            >
                              <div>
                                <p className="font-extrabold text-[#721011] tracking-widest">
                                  {coupon.code}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% OFF`
                                    : `AED ${coupon.discountValue} OFF`}
                                  {coupon.minOrderAmount > 0 &&
                                    ` • Min AED ${coupon.minOrderAmount}`}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                  Expires on{" "}
                                  {new Date(
                                    coupon.expiryDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setShowCouponDropdown(false);
                                  applyCoupon(coupon.code); // ⭐ DIRECT PASS
                                }}
                                className="rounded-lg border border-[#e82429] px-4 py-2 text-sm font-bold text-[#e82429] hover:bg-[#e82429] hover:text-white transition"
                              >
                                APPLY
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      * Coupon will be validated instantly
                    </p>
                  </div>
                ) : (
                  /* APPLIED STATE */
                  <div className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-green-100 p-4 shadow-md">
                    <div className="absolute inset-0 bg-green-300/20 blur-2xl opacity-40 pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-lg font-extrabold text-green-700 flex items-center gap-2">
                          ✅ Coupon Applied
                        </p>
                        <p className="text-sm text-green-800 mt-1">
                          You saved <b>AED {couponDiscount.toFixed(2)}</b>
                        </p>
                      </div>

                      <button
                        onClick={removeCoupon}
                        className="text-sm font-bold text-red-600 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No items in cart 🛒
            </p>
          )}
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaUser className="text-[#e82429]" /> Traveler Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 border p-3 rounded-xl"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="guestEmail"
                value={form.guestEmail}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 border p-3 rounded-xl"
                required
              />
            </div>

            <PhoneInput
              value={form.guestContact}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, guestContact: val }))
              }
            />

            {isPickupRequired && (
              <>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="pickupPoint"
                    value={form.pickupPoint}
                    onChange={handleChange}
                    placeholder="Pickup Point"
                    className="w-full pl-10 border p-3 rounded-xl"
                    required
                  />
                </div>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="dropPoint"
                    value={form.dropPoint}
                    onChange={handleChange}
                    placeholder="Drop Point"
                    className="w-full pl-10 border p-3 rounded-xl"
                    required
                  />
                </div>
              </>
            )}

            <textarea
              name="specialRequest"
              value={form.specialRequest}
              onChange={handleChange}
              placeholder="Special Request (Optional)"
              className="w-full border p-3 rounded-xl h-24"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl text-lg font-bold hover:scale-[1.03]"
            >
              {loading ? "Processing..." : `Confirm & Pay AED ${finalPayable}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
