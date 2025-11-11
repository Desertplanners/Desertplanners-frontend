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
        data?.items ||
        data?.cart?.items ||
        data?.cart ||
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
        data?.items ||
        data?.cart?.items ||
        data?.cart ||
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
        data?.items ||
        data?.cart?.items ||
        data?.cart ||
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

  // ✅ Calculate total price safely
  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.tourId?.price || item.price || 0);
    const guests = Number(item.guests || 1);
    return sum + price * guests;
  }, 0);

  // ✅ Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  // ✅ Loading UI
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading your cart...
        </p>
      </div>
    );

  // ✅ Empty cart UI
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

  // ✅ Main cart UI
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-[#721011]">Your Cart</h2>

      <div className="grid gap-6">
        {cart.map((item, index) => {
          const imageSrc = item.tourId?.mainImage
            ? `https://desetplanner-backend.onrender.com/${item.tourId.mainImage}`
            : item.mainImage
            ? `https://desetplanner-backend.onrender.com/${item.mainImage}`
            : item.tourId?.image
            ? `https://desetplanner-backend.onrender.com/${item.tourId.image}`
            : "https://cdn-icons-png.flaticon.com/512/854/854878.png";

          return (
            <div
              key={item._id || index}
              className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.tourId?.mainImage?.startsWith("http")
                      ? item.tourId.mainImage
                      : item.mainImage?.startsWith("http")
                      ? item.mainImage
                      : "https://cdn-icons-png.flaticon.com/512/854/854878.png"
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
                  {item.guests && (
                    <p className="text-gray-600 text-sm">
                      Guests: {item.guests}
                    </p>
                  )}
                  <p className="text-gray-800 font-bold">
                    AED{" "}
                    {Number(item.tourId?.price || item.price || 0) *
                      Number(item.guests || 1)}
                  </p>
                </div>
              </div>

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

      <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xl font-bold text-gray-800">
          Total: <span className="text-[#e82429]">AED {totalPrice}</span>
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
