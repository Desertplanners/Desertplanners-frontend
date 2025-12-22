import React, { useEffect, useMemo, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";

export default function CouponManagement() {
  const api = DataService("admin");

  const [coupons, setCoupons] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const [couponScope, setCouponScope] = useState("general");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiryDate: "",
    totalUsageLimit: "",
    applicableTours: [],
  });

  /* ================= FETCH ================= */
  const fetchCoupons = async () => {
    try {
      const res = await api.get(API.GET_ALL_COUPONS);
      setCoupons(res.data.coupons || []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await api.get(API.GET_TOURS);
      setTours(res.data || []);
    } catch {
      toast.error("Failed to load tours");
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchTours();
  }, []);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const expiringSoon = coupons.filter((c) => {
      const d = new Date(c.expiryDate);
      const diff = (d - new Date()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    }).length;

    return { total, active, expiringSoon };
  }, [coupons]);

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      expiryDate: "",
      totalUsageLimit: "",
      applicableTours: [],
    });
    setCouponScope("general");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        applicableTours:
          couponScope === "specific" ? form.applicableTours : [],
      };

      editingId
        ? await api.put(API.UPDATE_COUPON(editingId), payload)
        : await api.post(API.CREATE_COUPON, payload);

      toast.success(editingId ? "Coupon updated" : "Coupon created");
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setCouponScope(c.applicableTours?.length ? "specific" : "general");
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || "",
      maxDiscountAmount: c.maxDiscountAmount || "",
      expiryDate: c.expiryDate?.split("T")[0],
      totalUsageLimit: c.totalUsageLimit || "",
      applicableTours: c.applicableTours || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatus = async (id) => {
    await api.patch(API.TOGGLE_COUPON_STATUS(id));
    fetchCoupons();
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(API.DELETE_COUPON(id));
    fetchCoupons();
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-[1500px] mx-auto px-6 py-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 mb-10 bg-gradient-to-br from-[#0f172a] to-[#1f2933] text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Coupons & Promotions
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Control discounts, visibility & campaign lifecycle
            </p>
          </div>

          <div className="flex gap-4">
            {[
              ["Total", stats.total],
              ["Active", stats.active],
              ["Expiring Soon", stats.expiringSoon],
            ].map(([label, value]) => (
              <div
                key={label}
                className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur text-center"
              >
                <p className="text-xs text-gray-300">{label}</p>
                <p className="text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 lg:col-span-3 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </h2>
            {editingId && (
              <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                Editing Mode
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="code"
              placeholder="Coupon Code"
              value={form.code}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
              required
            />

            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (AED)</option>
            </select>

            <input
              name="discountValue"
              placeholder="Discount Value"
              type="number"
              value={form.discountValue}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
              required
            />

            <input
              name="minOrderAmount"
              placeholder="Min Order Amount"
              type="number"
              value={form.minOrderAmount}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
            />

            <input
              name="maxDiscountAmount"
              placeholder="Max Discount"
              type="number"
              value={form.maxDiscountAmount}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
            />

            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
              required
            />
          </div>

          {/* SCOPE */}
          <div className="mt-6">
            <p className="text-sm font-semibold mb-2">Coupon Scope</p>
            <div className="flex gap-3">
              {["general", "specific"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setCouponScope(t);
                    if (t === "general")
                      setForm({ ...form, applicableTours: [] });
                  }}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    couponScope === t
                      ? "bg-[#e82429] text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {t === "general" ? "All Tours" : "Specific Tours"}
                </button>
              ))}
            </div>

            {couponScope === "specific" && (
              <select
                multiple
                value={form.applicableTours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    applicableTours: Array.from(
                      e.target.selectedOptions,
                      (o) => o.value
                    ),
                  })
                }
                className="mt-4 w-full px-4 py-3 rounded-xl border"
              >
                {tours.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-10 py-3 rounded-full font-bold shadow-lg">
              {editingId ? "Update Coupon" : "Create Coupon"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-10 py-3 rounded-full border font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* COUPON LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="group flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white rounded-2xl shadow hover:shadow-xl transition border-l-4 border-[#e82429]"
            >
              <div>
                <h3 className="font-extrabold text-lg">{c.code}</h3>
                <p className="text-sm text-gray-600">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% discount`
                    : `AED ${c.discountValue} discount`}{" "}
                  ·{" "}
                  {c.applicableTours?.length > 0
                    ? "Tour Specific"
                    : "General"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.isActive ? "ACTIVE" : "DISABLED"}
                </span>

                <div className="opacity-0 group-hover:opacity-100 transition flex gap-4 text-sm font-semibold">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(c._id)}
                    className="text-yellow-600"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => deleteCoupon(c._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
