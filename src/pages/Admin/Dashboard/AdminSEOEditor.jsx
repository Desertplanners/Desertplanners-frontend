import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminSEOEditor({ data }) {
  const { type, id } = data;

  const [loading, setLoading] = useState(true);
  const [seoId, setSeoId] = useState(null);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [ogFile, setOgFile] = useState(null);

  const [faqs, setFaqs] = useState([]);

  // ⭐ item title
  const [itemTitle, setItemTitle] = useState("Loading...");

  const api = DataService();

  // ⭐ FETCH CORRECT ITEM TITLE
  const fetchItemTitle = async () => {
    try {
      if (type === "tour") {
        const res = await api.get(API.GET_TOUR_BY_ID(id));
setItemTitle(res.data?.title || "Untitled Tour");
      } 
      else if (type === "visa") {
        const res = await api.get(API.GET_VISA_BY_ID(id));
        setItemTitle(res.data?.title || "Untitled Visa");
      } 
      else if (type === "holiday") {
        const res = await api.get(API.GET_HOLIDAY_TOUR_BY_ID(id));
        setItemTitle(res.data?.title || "Untitled Holiday");
      }
    } catch (err) {
      console.log("❌ Title Load Error:", err);
      setItemTitle("Not Found");
    }
  };

  // ⭐ FETCH SEO DATA
  const fetchSEO = async () => {
    try {
      const res = await api.get(API.GET_SEO(type, id));
      if (res.data) {
        const d = res.data;
        setSeoId(d._id);
        setSeoTitle(d.seoTitle || "");
        setSeoDescription(d.seoDescription || "");
        setSeoKeywords(d.seoKeywords || "");
        setSeoOgImage(d.seoOgImage || "");
        setFaqs(d.faqs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemTitle();
    fetchSEO();
  }, [type, id]);

  const addFAQ = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const removeFAQ = (i) => {
    setFaqs(faqs.filter((_, idx) => idx !== i));
  };

  const updateFAQ = (i, key, value) => {
    const newFaqs = [...faqs];
    newFaqs[i][key] = value;
    setFaqs(newFaqs);
  };

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
    } catch (e) {
      toast.error("Error while saving SEO");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <h2 className="text-center py-10 text-xl">Loading SEO...</h2>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">

        <h1 className="text-3xl text-center font-bold text-[#721011] mb-2">
          Edit SEO ({type.toUpperCase()})
        </h1>

        <h2 className="text-xl text-center text-gray-700 mb-6 font-semibold">
          {itemTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label>SEO Title</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label>SEO Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full border rounded-lg p-2"
              rows={4}
            />
          </div>

          {/* Keywords */}
          <div>
            <label>SEO Keywords</label>
            <input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* OG Image */}
          {seoOgImage && (
            <img
              src={seoOgImage}
              className="w-40 h-40 rounded-xl object-cover mb-2"
            />
          )}

          <input type="file" onChange={(e) => setOgFile(e.target.files[0])} />

          {/* FAQ */}
          <div className="border p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">FAQs</h3>

            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow mb-3">
                <input
                  value={faq.question}
                  onChange={(e) => updateFAQ(i, "question", e.target.value)}
                  placeholder="Question"
                  className="w-full border p-2 mb-2"
                />

                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                  placeholder="Answer"
                  className="w-full border p-2"
                />

                <button
                  type="button"
                  onClick={() => removeFAQ(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg mt-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addFAQ}
              className="bg-[#e82429] text-white px-4 py-2 rounded-lg"
            >
              <FaPlus /> Add FAQ
            </button>
          </div>

          <button className="w-full bg-[#e82429] text-white py-3 rounded-xl font-bold">
            Save SEO
          </button>
        </form>
      </div>
    </div>
  );
}
