import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaBed,
  FaUtensils,
  FaUser,
} from "react-icons/fa";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function HolidayPage() {
  const { categorySlug, packageSlug } = useParams();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // slider state
  const [activeSlide, setActiveSlide] = useState(0);

  // enquiry form state (kept same fields but dynamic selectedTour)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    selectedTour: "",
    location: "",
    message: "",
  });

  // fetch package data
  useEffect(() => {
    const api = DataService();
    setLoading(true);
    setError(null);

    api
      .get(API.GET_HOLIDAY_PACKAGE_BY_SLUG(categorySlug, packageSlug))
      .then((res) => {
        // backend returns the tour object (we saw res.json(tour) in controller)
        const data = res.data || res; // adapt if wrapper differs
        setPackageData(data);
        setForm((prev) => ({ ...prev, selectedTour: data?.title || prev.selectedTour }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load package:", err);
        setError("Package not found");
        setLoading(false);
      });
  }, [categorySlug, packageSlug]);

  // auto slider (uses packageData.sliderImages if available, otherwise fallback)
  useEffect(() => {
    if (!packageData) return;
    const slidesCount = Math.max(packageData.sliderImages?.length || 0, 4);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [packageData]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Keeping enquiry static — just show confirmation for now
    alert("Enquiry submitted successfully!");
    // optionally: send to backend if you have an enquiries endpoint
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-600 font-semibold">
        {error}
      </div>
    );

  if (!packageData) return null;

  // convenience vars with safe fallbacks
  const slides = packageData.sliderImages && packageData.sliderImages.length > 0
    ? packageData.sliderImages
    : [
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      ];

  const title = packageData.title || "Package";
  const duration = packageData.duration || "N/A";
  const categoryName =
    typeof packageData.category === "object"
      ? packageData.category?.name || categorySlug.replaceAll("-", " ")
      : // category might be id — fallback to categorySlug
        categorySlug?.replaceAll("-", " ");
  const priceAdult = packageData.priceAdult ?? "Contact";
  const description = packageData.description || "";
  const highlights = packageData.highlights || {};
  const itinerary = packageData.itinerary || [];
  const knowBefore = packageData.knowBefore || [];
  const inclusions = packageData.inclusions || [];
  const exclusions = packageData.exclusions || [];
  const cancellationPolicy = packageData.cancellationPolicy || [];
  const terms = packageData.terms || [];

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* LEFT SIDE */}
      <div className="md:col-span-2 space-y-10">
        {/* MAIN IMAGE / SLIDER HERO */}
        <div className="rounded-3xl overflow-hidden shadow-xl relative h-[420px] md:h-[480px]">
          {slides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${title} slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* DOTS INDICATORS */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === i ? "bg-[#e82429] scale-125" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-7 border border-[#e82429]/10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-[#721011]">{title}</h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-[#ffe4e4] px-4 py-1.5 rounded-full flex items-center gap-2 font-semibold">
                  <FaClock className="text-[#e82429]" /> {duration}
                </span>

                <span className="bg-[#fff4f4] px-4 py-1.5 rounded-full font-semibold">
                  {categoryName}
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex flex-col items-start md:items-end">
              <p className="text-4xl font-black text-[#e82429]">
                {typeof priceAdult === "number" ? `$   ${priceAdult}` : priceAdult}
              </p>

              <p className="text-gray-500 text-sm">(Per Person)</p>

              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                <span className="text-gray-600 text-sm">4.9 • 134 reviews</span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-gray-700">{description}</p>
        </div>

        {/* TABS BLOCK (keeps exact same design) */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#e82429]/20">
          <TabsArea
            highlights={highlights}
            itinerary={itinerary}
            knowBefore={knowBefore}
            inclusions={inclusions}
            exclusions={exclusions}
            cancellationPolicy={cancellationPolicy}
            terms={terms}
          />
        </div>
      </div>

      {/* RIGHT SIDE (STATIC sections as requested) */}
      <aside className="md:col-span-1 space-y-8">
        {/* WHY BOOK WITH US (STATIC) */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-[#e82429]/20">
          <h3 className="text-lg font-bold text-[#721011] mb-4">⭐ Why Book With Us?</h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              ["⚡", "Instant", "Confirmation"],
              ["🎓", "Trained", "Team"],
              ["💰", "Best", "Price"],
              ["🕒", "24/7", "Support"],
              ["🏆", "Quality", "Service"],
              ["😊", "Happy", "Clients"],
            ].map(([icon, title, sub], idx) => (
              <div key={idx} className="p-4 bg-[#fff4f4] rounded-xl border border-[#e82429]/20">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ENQUIRY FORM (STATIC layout but selected tour filled dynamically) */}
        <div className="bg-white rounded-3xl shadow-xl p-7 border border-[#e82429]/20">
          <h3 className="text-2xl font-extrabold text-[#721011] mb-6">Enquire Now</h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="p-3 border rounded-xl w-full"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-xl w-full"
            />
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              className="p-3 border rounded-xl w-full"
            />

            <select
              name="selectedTour"
              value={form.selectedTour}
              onChange={handleChange}
              className="p-3 border rounded-xl w-full"
            >
              <option>{title}</option>
            </select>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Your Location"
              className="p-3 border rounded-xl w-full"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message / Enquiry"
              className="p-3 border rounded-xl w-full h-28"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-bold rounded-xl"
            >
              Submit Enquiry
            </button>
          </form>
        </div>

        {/* NEED HELP (STATIC) */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-[#e82429]/20">
          <h3 className="text-lg font-bold text-[#721011] mb-3">🆘 Need Help?</h3>

          <div className="p-3 bg-[#fff4f4] rounded-xl mb-3 border">📞 <b>+971 50 000 0000</b></div>

          <div className="p-3 bg-[#fff4f4] rounded-xl border">📧 support@desertplanners.com</div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------------------
   TABS AREA (keeps SAME DESIGN)
   --------------------------- */
function TabsArea({
  highlights,
  itinerary,
  knowBefore,
  inclusions,
  exclusions,
  cancellationPolicy,
  terms,
}) {
  const [activeTab, setActiveTab] = useState("highlights");

  // safe extractors with fallbacks
  const nights = highlights?.nights || highlights?.night || highlights?.noOfNights || "—";
  const persons = highlights?.persons || highlights?.person || "—";
  const room = highlights?.room || "—";
  const mealPlan = highlights?.mealPlan || highlights?.meals || "—";

  // normalize terms: could be array or string
  const termsArray =
    Array.isArray(terms) ? terms : typeof terms === "string" ? terms.split("•").filter((t) => t.trim()) : [];

  return (
    <div>
      {/* TAB BUTTONS */}
      <div className="flex gap-3 border-b pb-3 overflow-x-auto no-scrollbar whitespace-nowrap">
        {[
          ["highlights", "Highlights"],
          ["itinerary", "Itinerary"],
          ["know", "Need to Know"],
          ["cancel", "Cancellation "],
          ["terms", "Terms & Conditions"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-[0.95rem] font-semibold transition-all shrink-0 ${
              activeTab === key ? "bg-[#e82429] text-white shadow" : "bg-[#fff4f4] text-[#721011]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* HIGHLIGHTS */}
        {activeTab === "highlights" && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#721011]">Package Highlights</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex gap-3">
                <FaCalendarAlt className="text-[#e82429] text-xl" />
                <div>
                  <p className="font-semibold">NO OF NIGHT</p>
                  <p>{nights || "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaUser className="text-[#e82429] text-xl" />
                <div>
                  <p className="font-semibold">NO OF PERSON</p>
                  <p>{persons || "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaBed className="text-[#e82429] text-xl" />
                <div>
                  <p className="font-semibold">NO OF ROOM</p>
                  <p>{room || "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaUtensils className="text-[#e82429] text-xl" />
                <div>
                  <p className="font-semibold">MEAL PLAN</p>
                  <p>{mealPlan || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY */}
        {activeTab === "itinerary" && (
          <div className="space-y-16">
            {itinerary.length === 0 ? (
              <p className="text-gray-600">No itinerary available.</p>
            ) : (
              itinerary.map((d, i) => (
                <div key={i} className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#e82429]/20 group">
                  <div className="relative">
                    <img
                      src={d.image || d.img || ""}
                      alt={d.title || `Day ${i + 1}`}
                      className="w-full h-[380px] md:h-[450px] object-cover transform group-hover:scale-105 transition-all duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xl border border-white">
                      <p className="text-[#721011] font-bold text-lg">DAY {d.day ?? i + 1}</p>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-[#e82429]/20">
                      <h3 className="text-2xl font-bold text-[#721011] mb-2">{d.title || `Day ${i + 1}`}</h3>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NEED TO KNOW */}
        {activeTab === "know" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#721011]">Need to Know</h3>

            <ul className="space-y-3">
              {knowBefore.length === 0 ? (
                <li className="text-gray-600">No notes available.</li>
              ) : (
                knowBefore.map((x, i) => (
                  <li key={i} className="bg-[#fff4f4] p-3 rounded-xl border flex gap-3">
                    <span className="text-xl">ℹ️</span> {x}
                  </li>
                ))
              )}
            </ul>

            <h3 className="text-xl font-bold text-[#e82429] mt-5">Inclusions</h3>
            <ul className="space-y-2">
              {inclusions.length === 0 ? (
                <li className="text-gray-600">N/A</li>
              ) : (
                inclusions.map((x, i) => (
                  <li key={i} className="bg-[#fff4f4] p-2 rounded-lg border">✅ {x}</li>
                ))
              )}
            </ul>

            <h3 className="text-xl font-bold text-[#e82429] mt-5">Exclusions</h3>
            <ul className="space-y-2">
              {exclusions.length === 0 ? (
                <li className="text-gray-600">N/A</li>
              ) : (
                exclusions.map((x, i) => (
                  <li key={i} className="bg-[#fff4f4] p-2 rounded-lg border">❌ {x}</li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* CANCELLATION */}
        {activeTab === "cancel" && (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-[#721011] mb-3">
      Cancellation Policy
    </h3>

    {cancellationPolicy.length === 0 ? (
      <p className="text-gray-600 bg-[#fff4f4] p-4 rounded-xl border text-center">
        No cancellation policy provided.
      </p>
    ) : (
      <div className="space-y-4">
        {cancellationPolicy.map((c, idx) => (
          <div
            key={idx}
            className="flex gap-4 bg-[#fff4f4] p-4 rounded-xl border border-[#e82429]/20 items-start shadow-sm hover:shadow-md transition"
          >
            {/* ICON CIRCLE */}
            <div className="min-w-[40px] min-h-[40px] bg-[#e82429] text-white flex items-center justify-center rounded-full font-bold">
              {idx + 1}
            </div>

            {/* TEXT */}
            <p className="text-gray-700 leading-relaxed">{c}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* ⭐ TERMS & CONDITIONS */}
{activeTab === "terms" && (
  <div className="space-y-5">
    <h3 className="text-xl font-bold text-[#721011]">Terms & Conditions</h3>

    {termsArray.length === 0 ? (
      <p className="text-gray-600 bg-[#fff4f4] p-4 rounded-xl border text-center">
        No terms provided.
      </p>
    ) : (
      <div className="space-y-4">
        {termsArray.map((line, index) => (
          <div
            key={index}
            className="flex gap-4 bg-[#fff7f7] p-5 rounded-2xl border border-[#e82429]/20 shadow-sm hover:shadow-md transition-all items-start"
          >
            {/* NUMBER BADGE */}
            <div className="min-w-[42px] min-h-[42px] bg-[#e82429] text-white flex items-center justify-center rounded-full font-bold text-lg shadow">
              {index + 1}
            </div>

            {/* TERM TEXT */}
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {line.trim()}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
}
