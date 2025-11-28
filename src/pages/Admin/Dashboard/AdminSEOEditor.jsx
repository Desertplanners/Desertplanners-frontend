import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ArrowLeft, FileText, Image, HelpCircle, Tags } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSEOEditor({ data, setActiveTab }) {
  const api = DataService();

  // ⭐ FRONTEND → BACKEND TYPE MAP
  const typeMap = {
    "tour-category": "tourCategory",
    "visa-category": "visaCategory",
    "holiday-category": "holidayCategory",
    page: "page",
    tour: "tour",
    visa: "visa",
    holiday: "holiday",
  };

  // ⭐ SAFE TYPE FIX (never undefined)
  const rawType = data?.type || "";
  const backendType = typeMap[rawType] || rawType.replace("-", "");

  const { id } = data;

  const [loading, setLoading] = useState(true);
  const [seoId, setSeoId] = useState(null);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [ogFile, setOgFile] = useState(null);

  const [faqs, setFaqs] = useState([]);

  const [itemTitle, setItemTitle] = useState("Loading...");

  // -----------------------------------------------------
  // ⭐ FETCH TITLE BASED ON TYPE
  // -----------------------------------------------------
  const fetchItemTitle = async () => {
    try {
      let res;

      // STATIC PAGES
      if (backendType === "page") {
        const titles = {
          home: "Home",
          "about-us": "About Us",
          "contact-us": "Contact Us",
          "privacy-policy": "Privacy Policy",
          "terms-and-conditions": "Terms & Conditions",
          tours: "Tours Listing Page",
          visa: "Visa Listing Page",
          holidays: "Holiday Packages Listing Page",
        };
        return setItemTitle(titles[id] || "Static Page");
      }

      // TOURS
      if (backendType === "tour") {
        res = await api.get(API.GET_TOUR_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Tour");
      }

      // VISA
      if (backendType === "visa") {
        res = await api.get(API.GET_VISA_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Visa");
      }

      // HOLIDAY TOUR
      if (backendType === "holiday") {
        res = await api.get(API.GET_HOLIDAY_TOUR_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Holiday");
      }

      // CATEGORIES
      if (backendType === "tourCategory") {
        res = await api.get(API.GET_TOUR_CATEGORY_BY_ID(id));
        return setItemTitle(res.data?.name || "Tour Category");
      }

      if (backendType === "visaCategory") {
        res = await api.get(API.GET_VISA_CATEGORY_BY_ID(id));
        return setItemTitle(res.data?.name || "Visa Category");
      }

      if (backendType === "holidayCategory") {
        res = await api.get(API.GET_HOLIDAY_CATEGORY_BY_ID(id));
        return setItemTitle(res.data?.name || "Holiday Category");
      }
    } catch (err) {
      console.log(err);
      setItemTitle("Not Found");
    }
  };

  // -----------------------------------------------------
  // ⭐ FETCH SEO
  // -----------------------------------------------------
  const fetchSEO = async () => {
    try {
      const res = await api.get(API.GET_SEO(backendType, id));

      if (res.data?.seo) {
        const s = res.data.seo;
        setSeoId(s._id);
        setSeoTitle(s.seoTitle || "");
        setSeoDescription(s.seoDescription || "");
        setSeoKeywords(s.seoKeywords || "");
        setSeoOgImage(s.seoOgImage || "");
        setFaqs(s.faqs || []);
      }
    } catch (err) {
      console.log("SEO missing (first time create)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemTitle();
    fetchSEO();
  }, [backendType, id]);

  // -----------------------------------------------------
  // ⭐ FAQ FUNCTIONS
  // -----------------------------------------------------
  const addFAQ = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const removeFAQ = (i) => {
    setFaqs(faqs.filter((_, idx) => idx !== i));
  };

  const updateFAQ = (i, key, val) => {
    const clone = [...faqs];
    clone[i][key] = val;
    setFaqs(clone);
  };

  // -----------------------------------------------------
  // ⭐ SUBMIT (Create / Update)
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("parentType", backendType);
    form.append("parentId", id);
    form.append("seoTitle", seoTitle);
    form.append("seoDescription", seoDescription);
    form.append("seoKeywords", seoKeywords);
    form.append("faqs", JSON.stringify(faqs));

    if (ogFile) form.append("ogImage", ogFile);

    try {
      setLoading(true);

      if (seoId) {
        await api.put(API.UPDATE_SEO, form); // update existing
      } else {
        await api.post(API.CREATE_SEO, form); // first time create
      }

      toast.success("SEO Saved Successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save SEO");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 className="text-center py-10 text-xl">Loading SEO...</h2>;

  // -----------------------------------------------------
  // ⭐ UI
  // -----------------------------------------------------

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#721011]">
            Edit SEO ({backendType.toUpperCase()})
          </h1>
          <p className="text-gray-600 text-lg mt-1 font-medium">{itemTitle}</p>
        </div>

        <button
          onClick={() => setActiveTab("seo")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition border shadow-sm text-gray-700"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border"
      >

        {/* TITLE */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <FileText size={18} className="text-[#e82429]" /> Meta Title
          </label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border rounded-xl p-3 shadow-sm"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <FileText size={18} className="text-[#e82429]" /> Meta Description
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-xl p-3 shadow-sm"
          />
        </div>

        {/* KEYWORDS */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <Tags className="text-[#e82429]" /> Meta Keywords
          </label>
          <input
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="w-full border rounded-xl p-3 shadow-sm"
          />
        </div>

        {/* OG IMAGE */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-2">
            <Image className="text-[#e82429]" /> OG Image
          </label>

          {seoOgImage && (
            <img
              src={seoOgImage}
              className="w-40 h-40 rounded-xl object-cover border mb-3 shadow"
            />
          )}

          <input
            type="file"
            onChange={(e) => setOgFile(e.target.files[0])}
            className="text-sm"
          />
        </div>

        {/* FAQ */}
        <div className="border p-6 rounded-2xl bg-gray-50 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex gap-2">
            <HelpCircle className="text-[#e82429]" /> FAQs
          </h3>

          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow mb-3 border"
            >
              <input
                value={faq.question}
                onChange={(e) => updateFAQ(i, "question", e.target.value)}
                placeholder="FAQ Question"
                className="w-full border rounded-xl p-3 mb-3"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                placeholder="FAQ Answer"
                className="w-full border rounded-xl p-3"
              />

              <button
                type="button"
                onClick={() => removeFAQ(i)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-3 flex gap-2 items-center"
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addFAQ}
            className="bg-[#e82429] text-white px-5 py-2 rounded-xl shadow flex items-center gap-2"
          >
            <FaPlus /> Add FAQ
          </button>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#e82429] text-white py-3 rounded-xl font-bold shadow-lg"
        >
          Save SEO
        </button>
      </form>
    </div>
  );
}
