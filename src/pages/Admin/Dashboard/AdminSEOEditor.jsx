import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ArrowLeft, FileText, Image, HelpCircle, Tags } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSEOEditor({ data, closeModal }) {
  const api = DataService();

  const typeMap = {
    "tour-category": "tourCategory",
    "visa-category": "visaCategory",
    "holiday-category": "holidayCategory",
    page: "page",
    tour: "tour",
    visa: "visa",
    holiday: "holiday",
    blog: "blog",               // ✅ NEW
    blogCategory: "blogCategory" // ✅ NEW
  };

  const rawType = data?.type || "";
  const backendType = typeMap[rawType] || rawType.replace("-", "");
  const { id } = data;

  const [loading, setLoading] = useState(true);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [ogFile, setOgFile] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const [itemTitle, setItemTitle] = useState(data?.title || "Loading...");

  // ⭐ Character Limits
  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 160;

  // -------- FETCH TITLE --------
  const fetchItemTitle = async () => {
    try {
      let res;

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
          blog: "Blog Main Page",
        };
        return setItemTitle(titles[id] || "Static Page");
      }

      if (backendType === "tour") {
        res = await api.get(API.GET_TOUR_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Tour");
      }

      if (backendType === "visa") {
        res = await api.get(API.GET_VISA_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Visa");
      }

      if (backendType === "holiday") {
        res = await api.get(API.GET_HOLIDAY_TOUR_BY_ID(id));
        return setItemTitle(res.data?.title || "Unknown Holiday");
      }

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
      if (backendType === "blogCategory") {
        res = await api.get(API.GET_BLOG_CATEGORY_BY_ID(id));
        return setItemTitle(res.data?.name || "Blog Category");
      }
      
    } catch {
      setItemTitle("Not Found");
    }
  };

  // -------- FETCH SEO --------
  const fetchSEO = async () => {
    try {
      const res = await api.get(API.GET_SEO(backendType, id));

      if (res.data?.seo) {
        const s = res.data.seo;
        setSeoTitle(s.seoTitle || "");
        setSeoDescription(s.seoDescription || "");
        setSeoKeywords(s.seoKeywords || "");
        setSeoOgImage(s.seoOgImage || "");
        setFaqs(s.faqs || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchItemTitle();
    fetchSEO();
  }, [backendType, id]);

  // -------- FAQ --------
  const addFAQ = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFAQ = (i) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const updateFAQ = (i, key, val) => {
    const clone = [...faqs];
    clone[i][key] = val;
    setFaqs(clone);
  };

  // -------- SUBMIT --------
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
      await api.post(API.SAVE_SEO, form);
      toast.success("SEO Saved Successfully!");
      closeModal();
    } catch {
      toast.error("Failed to save SEO");
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <h2 className="text-center py-10 text-xl">Loading SEO...</h2>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#721011] mb-2">
        Edit SEO ({backendType.toUpperCase()})
      </h1>
      <p className="text-gray-600 text-lg mb-6">{itemTitle}</p>

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
            className={`w-full border rounded-xl p-3 shadow-sm ${
              seoTitle.length > TITLE_LIMIT ? "border-red-500" : ""
            }`}
          />

          <p
            className={`text-right text-sm mt-1 ${
              seoTitle.length > TITLE_LIMIT ? "text-red-600 font-semibold" : "text-gray-500"
            }`}
          >
            {seoTitle.length} / {TITLE_LIMIT}
          </p>
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
            className={`w-full border rounded-xl p-3 shadow-sm ${
              seoDescription.length > DESC_LIMIT ? "border-red-500" : ""
            }`}
          />

          <p
            className={`text-right text-sm mt-1 ${
              seoDescription.length > DESC_LIMIT ? "text-red-600 font-semibold" : "text-gray-500"
            }`}
          >
            {seoDescription.length} / {DESC_LIMIT}
          </p>
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
            <div key={i} className="bg-white p-4 rounded-xl shadow mb-3 border">
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
