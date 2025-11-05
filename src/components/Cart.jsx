import React, { useEffect, useState } from "react";
import { API } from "../config/API";
import DataService from "../config/DataService";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Cart({ userId }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  const getUserId = () => {
    const uid = userId || localStorage.getItem("userId");
    return uid && /^[0-9a-fA-F]{24}$/.test(uid) ? uid : null;
  };

  const isLoggedIn = () => !!localStorage.getItem("userToken");

  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      const api = DataService();
      const res = await api.get(API.GET_CART(uid));
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setRemovingItemId(itemId);
      const api = DataService();
      const uid = getUserId();
      if (!uid) return alert("Invalid userId");
      const res = await api.delete(API.REMOVE_FROM_CART(uid, itemId));
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const clearCart = async () => {
    try {
      setClearing(true);
      const api = DataService();
      const uid = getUserId();
      if (!uid) return alert("Invalid userId");
      const res = await api.delete(API.CLEAR_CART(uid));
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Error clearing cart:", err);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const uid = getUserId();
    if (uid) fetchCart(uid);
    else setLoading(false);
  }, [userId]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.tourId?.price || 0) * item.guests,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { cart } });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg animate-pulse">Loading your cart...</p>
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
          Looks like you haven’t added anything yet.  
          Explore amazing tours and add them to your cart!
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
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://desetplanner-backend.onrender.com/${item.tourId?.mainImage}`}
                alt={item.tourId?.title}
                className="w-28 h-20 object-cover rounded-xl"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.tourId?.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  Date: {new Date(item.date).toDateString()}
                </p>
                <p className="text-gray-600 text-sm">Guests: {item.guests}</p>
                <p className="text-gray-800 font-bold">
                  AED {(item.tourId?.price || 0) * item.guests}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeItem(item._id)}
              disabled={removingItemId === item._id}
              className={`mt-3 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 transition ${
                removingItemId === item._id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FaTrashAlt />
              {removingItemId === item._id ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
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
