import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ArrowLeft, FileText, Image, HelpCircle, Tags } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSEOEditor({ data, setActiveTab }) {
  const { type, id } = data;

  const [loading, setLoading] = useState(true);
  const [seoId, setSeoId] = useState(null);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [ogFile, setOgFile] = useState(null);

  const [faqs, setFaqs] = useState([]);

  const [itemTitle, setItemTitle] = useState("Loading...");
  const api = DataService();

  // ⭐ Fetch correct item title
  const fetchItemTitle = async () => {
    try {
      let res;
      if (type === "tour") res = await api.get(API.GET_TOUR_BY_ID(id));
      else if (type === "visa") res = await api.get(API.GET_VISA_BY_ID(id));
      else res = await api.get(API.GET_HOLIDAY_TOUR_BY_ID(id));

      setItemTitle(res.data?.title || "Untitled");
    } catch (err) {
      console.log(err);
      setItemTitle("Not Found");
    }
  };

  // ⭐ Fetch SEO data
  const fetchSEO = async () => {
    try {
      const res = await api.get(API.GET_SEO(type, id));

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
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemTitle();
    fetchSEO();
  }, [type, id]);

  // ⭐ Add FAQ
  const addFAQ = () => setFaqs([...faqs, { question: "", answer: "" }]);

  // ⭐ Remove FAQ
  const removeFAQ = (i) => setFaqs(faqs.filter((_, idx) => idx !== i));

  // ⭐ Update FAQ
  const updateFAQ = (i, key, value) => {
    const arr = [...faqs];
    arr[i][key] = value;
    setFaqs(arr);
  };

  // ⭐ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("parentType", type);
    form.append("parentId", id);
    form.append("seoTitle", seoTitle);
    form.append("seoDescription", seoDescription);
    form.append("seoKeywords", seoKeywords);
    form.append("faqs", JSON.stringify(faqs));

    if (ogFile) form.append("ogImage", ogFile);

    try {
      setLoading(true);

      if (seoId) {
        await api.put(API.UPDATE_SEO, form);
      } else {
        await api.post(API.CREATE_SEO, form);
      }

      toast.success("SEO Saved Successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save SEO");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <h2 className="text-center py-10 text-xl">Loading SEO...</h2>;

  return (
    <div className="p-6">

      {/* HEADER — TITLE + CANCEL BUTTON */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#721011]">
            Edit SEO ({type.toUpperCase()})
          </h1>
          <p className="text-gray-600 text-lg mt-1 font-medium">{itemTitle}</p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => setActiveTab("seo")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100
                     hover:bg-gray-200 transition border shadow-sm text-gray-700"
        >
          <ArrowLeft size={18} /> Cancel
        </button>
      </div>

      {/* MAIN FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border"
      >
        {/* SEO Title */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <FileText size={18} className="text-[#e82429]" /> Meta Title
          </label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#e82429]"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <FileText size={18} className="text-[#e82429]" /> Meta Description
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#e82429]"
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="font-semibold text-gray-700 flex gap-2 mb-1">
            <Tags className="text-[#e82429]" /> Meta Keywords
          </label>
          <input
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#e82429]"
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

        {/* FAQ Section */}
        <div className="border p-6 rounded-2xl bg-gray-50 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex gap-2">
            <HelpCircle className="text-[#e82429]" /> FAQs
          </h3>

          {faqs.length === 0 && (
            <p className="text-gray-500 mb-3">No FAQ added yet.</p>
          )}

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

          {/* Add FAQ */}
          <button
            type="button"
            onClick={addFAQ}
            className="bg-[#e82429] text-white px-5 py-2 rounded-xl shadow flex items-center gap-2"
          >
            <FaPlus /> Add FAQ
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-[#e82429] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition"
        >
          Save SEO
        </button>
      </form>
    </div>
  );
}
