import React, { useEffect, useState } from "react";
import { API } from "../config/API";
import DataService from "../config/DataService";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart({ userId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  // ✅ Get userId from localStorage
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || null;
  };

  // ✅ Fetch user cart from backend
  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      const api = DataService("user");
      const res = await api.get(API.GET_CART(uid));
      const data = res.data;

      const items =
        data?.cart?.items ||
        data?.cart ||
        data?.items ||
        data?.data ||
        data ||
        [];

      setCart(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load your cart. Please try again.");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && cart.length > 0) {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "view_cart",
        items: cart.map((item) => {
          const adultGuests = Number(item.guestsAdult || item.guests || 0);
          const childGuests = Number(item.guestsChild || 0);
          const adultPrice = Number(
            item.adultPrice || item.tourId?.priceAdult || item.price || 0
          );
          const childPrice = Number(
            item.childPrice || item.tourId?.priceChild || 0
          );

          return {
            item_id: item.tourId?._id || item.tourId || item._id,
            item_name: item.tourId?.title || item.title,
            price: adultPrice, // GA4 uses single price field
            price_child: childPrice,
            quantity: adultGuests + childGuests,
            date: item.date,
          };
        }),
        total_value: totalPrice,
        currency: "AED",
      });

      console.log("📡 DATA LAYER — view_cart fired");
    }
  }, [loading, cart]);

  // ✅ Remove single item
  const removeItem = async (itemId) => {
    const uid = getUserId();

    if (!uid) {
      // Guest user flow
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.filter(
        (item) =>
          item._id !== itemId &&
          item.tourId !== itemId &&
          item.tourId?._id !== itemId
      );
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      toast.success("Item removed!");
      return;
    }

    // Logged-in user flow
    try {
      setRemovingItemId(itemId);
      const api = DataService("user");
      const res = await api.delete(API.REMOVE_FROM_CART(uid, itemId));

      const data = res.data;
      const items =
        data?.cart?.items ||
        data?.cart ||
        data?.items ||
        data?.data ||
        data ||
        [];

      setCart(Array.isArray(items) ? items : []);
      toast.success("Item removed!");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item.");
    } finally {
      setRemovingItemId(null);
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    const uid = getUserId();

    if (!uid) {
      localStorage.removeItem("guestCart");
      setCart([]);
      toast.success("Cart cleared!");
      return;
    }

    try {
      setClearing(true);
      const api = DataService("user");
      const res = await api.delete(API.CLEAR_CART(uid));

      const data = res.data;
      const items =
        data?.cart?.items ||
        data?.cart ||
        data?.items ||
        data?.data ||
        data ||
        [];

      setCart(Array.isArray(items) ? items : []);
      toast.success("Cart cleared!");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart.");
    } finally {
      setClearing(false);
    }
  };

  // ✅ Load cart on mount
  useEffect(() => {
    const uid = getUserId();

    if (uid) {
      fetchCart(uid);
    } else {
      try {
        const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(localCart);
      } catch {
        setCart([]);
      } finally {
        setLoading(false);
      }
    }
  }, [userId, location.key]);

  // ✅ Calculate total price (adult + child)
  const totalPrice = cart.reduce((sum, item) => {
    const t = item.tourId || item;

    const adultPrice = Number(item.adultPrice || t.priceAdult || t.price || 0);
    const childPrice = Number(item.childPrice || t.priceChild || 0);

    const adultGuests = Number(item.guestsAdult || item.guests || 0);
    const childGuests = Number(item.guestsChild || 0);

    return sum + adultPrice * adultGuests + childPrice * childGuests;
  }, 0);

  // ✅ Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // ⭐ DATA LAYER — BEGIN_CHECKOUT
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "begin_checkout",
      items: cart.map((item) => ({
        tour_id: item.tourId?._id || item.tourId || item._id,
        tour_name: item.tourId?.title || item.title,
        date: item.date,
        guests_adult: Number(item.guestsAdult || item.guests || 0),
        guests_child: Number(item.guestsChild || 0),
        price_adult: Number(
          item.adultPrice || item.tourId?.priceAdult || item.price || 0
        ),
        price_child: Number(item.childPrice || item.tourId?.priceChild || 0),
        quantity:
          Number(item.guestsAdult || item.guests || 0) +
          Number(item.guestsChild || 0),
      })),
      total_value: totalPrice,
      currency: "AED",
    });

    console.log("📡 DATA LAYER — begin_checkout fired");

    navigate("/checkout", { state: { cart } });
  };

  // ================================
  // UI STARTS HERE
  // ================================

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading your cart...
        </p>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-gradient-to-b from-gray-50 to-white p-8 rounded-3xl shadow-inner">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          className="w-40 h-40 mb-6 animate-bounce-slow"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Your Cart is Empty 🛒
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Looks like you haven’t added anything yet. Explore amazing tours and
          add them to your cart!
        </p>
        <button
          onClick={() => navigate("/tours")}
          className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:scale-105 transition-transform"
        >
          Browse Tours
        </button>
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-[#721011]">Your Cart</h2>

      <div className="grid gap-6">
        {cart.map((item, index) => {
          const imageSrc =
            item.tourId?.mainImage ||
            item.mainImage ||
            "https://cdn-icons-png.flaticon.com/512/854/854878.png";

          return (
            <div
              key={item._id || index}
              className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    imageSrc.startsWith("http")
                      ? imageSrc
                      : `https://desetplanner-backend.onrender.com/${imageSrc}`
                  }
                  alt={item.tourId?.title || item.title}
                  className="w-28 h-20 object-cover rounded-xl"
                />

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.tourId?.title || item.title}
                  </h3>

                  {item.date && (
                    <p className="text-gray-600 text-sm">
                      Date: {new Date(item.date).toDateString()}
                    </p>
                  )}

                  {/* Guests Display */}
                  <p className="text-gray-600 text-sm">
                    Adults: {item.guestsAdult || item.guests || 0}
                  </p>

                  {item.guestsChild > 0 && (
                    <p className="text-gray-600 text-sm">
                      Child: {item.guestsChild}
                    </p>
                  )}

                  {/* Price Calculation */}
                  <p className="text-gray-800 font-bold">
                    AED{" "}
                    {Number(item.adultPrice || item.tourId?.priceAdult || 0) *
                      Number(item.guestsAdult || item.guests || 0) +
                      Number(item.childPrice || item.tourId?.priceChild || 0) *
                        Number(item.guestsChild || 0)}
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() =>
                  removeItem(item._id || item.tourId?._id || item.tourId)
                }
                disabled={
                  removingItemId ===
                  (item._id || item.tourId?._id || item.tourId)
                }
                className={`mt-3 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 transition ${
                  removingItemId ===
                  (item._id || item.tourId?._id || item.tourId)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaTrashAlt />
                {removingItemId ===
                (item._id || item.tourId?._id || item.tourId)
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xl font-bold text-gray-800">
          Total:{" "}
          <span className="text-[#e82429]">AED {totalPrice.toFixed(2)}</span>
        </p>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={clearCart}
            disabled={clearing}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600 transition disabled:opacity-50"
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </button>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
