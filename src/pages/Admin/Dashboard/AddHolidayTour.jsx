// AdminAddHolidayTour.final.jsx
import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaImage, FaTimes } from "react-icons/fa";

// Stable ID generator
const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminAddHolidayTour({
  closeModal,
  fetchHolidays,
  editHoliday,
}) {
  const api = DataService();

  // -----------------------
  // Basic form states
  // -----------------------
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [priceAdult, setPriceAdult] = useState("");
  const [priceChild, setPriceChild] = useState("");
  const [description, setDescription] = useState("");

  const [highlights, setHighlights] = useState({
    nights: "",
    persons: "",
    room: "",
    mealPlan: "",
  });

  // sections stored as arrays with stable ids
  const [knowBefore, setKnowBefore] = useState([{ id: makeId(), text: "" }]);
  const [inclusions, setInclusions] = useState([{ id: makeId(), text: "" }]);
  const [exclusions, setExclusions] = useState([{ id: makeId(), text: "" }]);
  const [cancellationPolicy, setCancellationPolicy] = useState([
    { id: makeId(), text: "" },
  ]);
  const [terms, setTerms] = useState([{ id: makeId(), text: "" }]);

  // itinerary & image files (parallel arrays)
  const [itinerary, setItinerary] = useState([
    { id: makeId(), title: "", points: [""] },
  ]);

  const [itineraryFiles, setItineraryFiles] = useState([]);
  const [itineraryPreviews, setItineraryPreviews] = useState([]);

  // slider images
  const [sliderFiles, setSliderFiles] = useState([]);
  const [sliderPreviews, setSliderPreviews] = useState([]);
  const [removeSliderImages, setRemoveSliderImages] = useState([]);
  const [status, setStatus] = useState("draft");

  // blob url cleanup registry
  const createdUrlsRef = useRef([]);

  const registerUrl = (u) => createdUrlsRef.current.push(u);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      createdUrlsRef.current = [];
    };
  }, []);

  // -----------------------
  // Load categories
  // -----------------------
  useEffect(() => {
    api
      .get(API.GET_HOLIDAY_CATEGORIES)
      .then((res) => {
        const cats = res?.data?.categories || res?.data || [];
        setCategories(cats);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // ================================================================
  // ⭐⭐⭐⭐ FIXED — FULL EDIT MODE PREFILL (YOUR REQUIRED FIX) ⭐⭐⭐⭐
  // ================================================================
  useEffect(() => {
    if (!editHoliday) {
      setTitle("");
      setSlug("");
      setDuration("");
      setCategory("");
      setPriceAdult("");
      setPriceChild("");
      setDescription("");
      setHighlights({ nights: "", persons: "", room: "", mealPlan: "" });

      setKnowBefore([{ id: makeId(), text: "" }]);
      setInclusions([{ id: makeId(), text: "" }]);
      setExclusions([{ id: makeId(), text: "" }]);
      setCancellationPolicy([{ id: makeId(), text: "" }]);
      setTerms([{ id: makeId(), text: "" }]);

      setItinerary([{ id: makeId(), title: "", image: "", points: [""] }]);
      setItineraryFiles([]);
      setItineraryPreviews([]);

      setSliderFiles([]);
      setSliderPreviews([]);

      return;
    }

    const h = editHoliday;

    // ---------------- Basic fields ----------------
    setTitle(h.title || "");
    setSlug(h.slug || "");
    setDuration(h.duration || "");
    setCategory(h.category?._id || "");
    setPriceAdult(h.priceAdult || "");
    setPriceChild(h.priceChild || "");
    setDescription(h.description || "");
    setHighlights(
      h.highlights || { nights: "", persons: "", room: "", mealPlan: "" }
    );

    const mapToObjects = (arr) =>
      arr?.length
        ? arr.map((txt) => ({ id: makeId(), text: txt }))
        : [{ id: makeId(), text: "" }];

    setKnowBefore(mapToObjects(h.knowBefore));
    setInclusions(mapToObjects(h.inclusions));
    setExclusions(mapToObjects(h.exclusions));
    setCancellationPolicy(mapToObjects(h.cancellationPolicy));
    setTerms(mapToObjects(h.terms));

    // ---------------- FIXED ITINERARY LOAD ----------------
    const itList = h.itinerary?.length
      ? h.itinerary.map((it) => ({
          id: makeId(),
          title: it.title,
          image: it.image || "",
          points:
            Array.isArray(it.points) && it.points.length ? it.points : [""], // ✅ SAFE DEFAULT
        }))
      : [{ id: makeId(), title: "", image: "", points: [""] }];

    setItinerary(itList);

    // previews EXACT index matched
    setItineraryPreviews(itList.map((i) => i.image || ""));

    // empty file slots
    setItineraryFiles(Array(itList.length).fill(null));

    // slider
    setSliderPreviews(h.sliderImages || []);
    setSliderFiles([]);
  }, [editHoliday]);

  // -----------------------
  // Helpers for lists
  // -----------------------
  const updateArrayItem = (setter, id, value) =>
    setter((prev) =>
      prev.map((p) => (p.id === id ? { ...p, text: value } : p))
    );

  const addArrayItem = (setter) =>
    setter((prev) => [...prev, { id: makeId(), text: "" }]);

  const removeArrayItem = (setter, id) =>
    setter((prev) => prev.filter((p) => p.id !== id));

  // -----------------------
  // Itinerary add/remove
  // -----------------------
  const updateItineraryTitle = (id, value) =>
    setItinerary((prev) =>
      prev.map((it) => (it.id === id ? { ...it, title: value } : it))
    );

  const addItinerary = () => {
    setItinerary((prev) => {
      const updated = [
        ...prev,
        { id: makeId(), title: "", image: "", points: [""] },
      ];

      setItineraryFiles((files) => {
        const arr = [...files];
        while (arr.length < updated.length) arr.push(null);
        return arr;
      });

      setItineraryPreviews((prevs) => {
        const arr = [...prevs];
        while (arr.length < updated.length) arr.push("");
        return arr;
      });

      return updated;
    });
  };

  const removeItinerary = (id, index) => {
    setItinerary((prev) => prev.filter((it) => it.id !== id));

    setItineraryFiles((prev) => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });

    setItineraryPreviews((prev) => {
      const arr = [...prev];
      if (arr[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(arr[index]);
      }
      arr.splice(index, 1);
      return arr;
    });
  };

  const addPoint = (dayId) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              points: Array.isArray(d.points) ? [...d.points, ""] : [""],
            }
          : d
      )
    );
  };

  const updatePoint = (dayId, index, value) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              points: d.points.map((p, i) => (i === index ? value : p)),
            }
          : d
      )
    );
  };

  const removePoint = (dayId, index) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              points: d.points.filter((_, i) => i !== index),
            }
          : d
      )
    );
  };
  // -----------------------
  // IMAGE HANDLERS
  // -----------------------
  const onSliderFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // NEW PREVIEWS
    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      registerUrl(url);
      return url;
    });

    // 1️⃣ Append new files with old files
    setSliderFiles((prev) => [...prev, ...files]);

    // 2️⃣ Append new previews with old previews
    setSliderPreviews((prev) => [...prev, ...newPreviews]);
  };

  const onItineraryImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setItineraryFiles((prev) => {
      const arr = [...prev];
      arr[index] = file;
      return arr;
    });

    const url = URL.createObjectURL(file);
    registerUrl(url);

    setItineraryPreviews((prev) => {
      const arr = [...prev];
      arr[index] = url;
      return arr;
    });
  };

  const preventStealFocus = (e) => e.preventDefault();

  // -----------------------
  // SUBMIT
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return toast.error("Enter title");
    if (!duration) return toast.error("Enter duration");
    if (!category) return toast.error("Select category");
    if (!priceAdult) return toast.error("Enter price");
    if (!description) return toast.error("Enter description");

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", title);
      fd.append("slug", slug);
      fd.append("duration", duration);
      fd.append("category", category);
      fd.append("priceAdult", priceAdult);
      fd.append("priceChild", priceChild);
      fd.append("description", description);
      fd.append("highlights", JSON.stringify(highlights));
      fd.append("status", status);

      const arrayMap = {
        knowBefore,
        inclusions,
        exclusions,
        cancellationPolicy,
        terms,
      };

      Object.keys(arrayMap).forEach((key) => {
        arrayMap[key].forEach((item) => fd.append(key, item.text));
      });

      itinerary.forEach((it, index) => {
        it.points.forEach((p) => {
          fd.append(`itineraryPoints[${index}][]`, p);
        });
      });

      // 1️⃣ existing old images (user kept)
      fd.append(
        "existingSliderImages",
        JSON.stringify(sliderPreviews.filter((u) => !u.startsWith("blob:")))
      );

      // 2️⃣ old images user removed
      fd.append("removeSliderImages", JSON.stringify(removeSliderImages));

      sliderFiles.forEach((file) => fd.append("sliderImages", file));

      itineraryFiles.forEach((file, index) => {
        if (file) {
          fd.append(`itineraryImages_${index}`, file);
        } else {
          fd.append(`itineraryImages_${index}`, "__KEEP_OLD__");
        }
      });

      if (editHoliday) {
        await api.put(API.UPDATE_HOLIDAY_TOUR(editHoliday._id), fd);
        toast.success("Holiday updated");
      } else {
        await api.post(API.ADD_HOLIDAY_TOUR, fd);
        toast.success("Holiday created");
      }

      fetchHolidays?.();
      closeModal?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    }

    setLoading(false);
  };

  // -----------------------
  // JSX UI START
  // -----------------------
  return (
    <div className="p-6 bg-white rounded-2xl max-h-[88vh] overflow-auto space-y-6">
      <h2 className="text-2xl font-bold text-[#721011]">
        {editHoliday ? "Edit Holiday Tour" : "Add Holiday Tour"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GENERAL INFO */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#721011]">
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="p-3 border rounded-lg"
              placeholder="Package Title"
              autoComplete="off"
              value={title}
              onChange={(e) => {
                const v = e.target.value;
                setTitle(v);
                setSlug(v.toLowerCase().trim().replace(/\s+/g, "-"));
              }}
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Slug"
              autoComplete="off"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Duration (e.g., 3N - 4D)"
              autoComplete="off"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="p-3 border rounded-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              className="p-3 border rounded-lg"
              placeholder="Adult Price"
              autoComplete="off"
              value={priceAdult}
              onChange={(e) => setPriceAdult(e.target.value)}
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Child Price"
              autoComplete="off"
              value={priceChild}
              onChange={(e) =>
                setPriceChild(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <select
            className="p-3 border rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <textarea
            className="p-3 border rounded-lg w-full h-28"
            placeholder="Write package description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* ================= SLIDER IMAGES ================= */}
        <div className="bg-white border rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-[#721011]">
            Slider Images
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Recommended size:{" "}
            <span className="font-semibold">1600 × 900 px</span>
          </p>

          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition">
            <span className="text-gray-600 text-sm mb-2">
              Upload Slider Images
            </span>
            <span className="px-4 py-2 bg-[#721011] text-white text-sm rounded-lg">
              Choose Files
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onSliderFilesChange}
            />
          </label>

          {sliderPreviews.length > 0 && (
            <button
              type="button"
              onMouseDown={preventStealFocus}
              onClick={() => {
                sliderPreviews.forEach((u) => {
                  if (u.startsWith("blob:")) URL.revokeObjectURL(u);
                });
                setSliderFiles([]);
                setSliderPreviews([]);
              }}
              className="text-red-600 underline text-sm"
            >
              Clear All Slider Images
            </button>
          )}

          <div className="grid grid-cols-3 gap-3">
            {sliderPreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  className="h-28 w-full rounded-xl object-cover shadow-md group-hover:opacity-70 transition"
                />
                <button
                  type="button"
                  onMouseDown={preventStealFocus}
                  onClick={() => {
                    // 1️⃣ If it's OLD image → add to remove list
                    if (!src.startsWith("blob:")) {
                      setRemoveSliderImages((prev) => [...prev, src]);
                    }

                    // 2️⃣ Remove from UI preview
                    setSliderPreviews((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    );

                    // 3️⃣ Remove from new uploaded files
                    setSliderFiles((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    );

                    // 4️⃣ Cleanup blob URLs
                    if (src.startsWith("blob:")) URL.revokeObjectURL(src);
                  }}
                  className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ITINERARY IMAGES ================= */}
        <div className="bg-white border rounded-2xl p-6 shadow-md space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-[#721011]">
            Itinerary Images & Titles
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Recommended size:{" "}
            <span className="font-semibold">1600 × 900 px</span>
          </p>

          <div className="space-y-5">
            {itinerary.map((it, idx) => (
              <div
                key={it.id}
                className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-3"
              >
                <div className="flex gap-3 items-center">
                  <input
                    className="p-3 border rounded-lg w-full bg-white"
                    placeholder={`Day ${idx + 1} Title`}
                    value={it.title}
                    onChange={(e) =>
                      updateItineraryTitle(it.id, e.target.value)
                    }
                  />

                  <label className="px-3 py-2 bg-[#721011] text-white rounded-lg text-xs cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onItineraryImageChange(e, idx)}
                    />
                  </label>
                </div>

                {itineraryPreviews[idx] ? (
                  <img
                    src={itineraryPreviews[idx]}
                    className="h-36 w-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="h-36 border rounded-lg bg-white flex items-center justify-center text-gray-400">
                    <FaImage size={26} />
                  </div>
                )}

                <button
                  type="button"
                  onMouseDown={preventStealFocus}
                  onClick={() => removeItinerary(it.id, idx)}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <FaTrash size={14} /> Remove Day
                </button>

                {/* BULLET POINTS */}
                <div className="space-y-2 mt-3">
                  {it.points?.map((point, pIndex) => (
                    <div key={pIndex} className="flex gap-2">
                      <input
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Enter bullet point"
                        value={point}
                        onChange={(e) =>
                          updatePoint(it.id, pIndex, e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() => removePoint(it.id, pIndex)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addPoint(it.id)}
                    className="text-sm text-[#721011] font-semibold"
                  >
                    + Add Point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onMouseDown={preventStealFocus}
              onClick={addItinerary}
              className="px-5 py-2 bg-[#e82429] text-white rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaPlus /> Add Day
            </button>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#721011]">Highlights</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["nights", "persons", "room", "mealPlan"].map((k) => (
              <input
                key={k}
                className="p-3 border rounded-lg"
                placeholder={k}
                value={highlights[k]}
                onChange={(e) =>
                  setHighlights((prev) => ({ ...prev, [k]: e.target.value }))
                }
              />
            ))}
          </div>
        </div>

        {/* LISTING SECTIONS */}
        <div className="space-y-4">
          {/* Need to Know */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">
              Need to Know
            </h3>
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
              onMouseDown={preventStealFocus}
              onClick={() => addArrayItem(setKnowBefore)}
            >
              <FaPlus /> Add
            </button>

            <div className="space-y-3 mt-3">
              {knowBefore.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 p-3 border rounded-lg"
                    value={item.text}
                    onChange={(e) =>
                      updateArrayItem(setKnowBefore, item.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onMouseDown={preventStealFocus}
                    onClick={() => removeArrayItem(setKnowBefore, item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Inclusions</h3>
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
              onMouseDown={preventStealFocus}
              onClick={() => addArrayItem(setInclusions)}
            >
              <FaPlus /> Add
            </button>

            <div className="space-y-3 mt-3">
              {inclusions.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 p-3 border rounded-lg"
                    value={item.text}
                    onChange={(e) =>
                      updateArrayItem(setInclusions, item.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onMouseDown={preventStealFocus}
                    onClick={() => removeArrayItem(setInclusions, item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Exclusions</h3>
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
              onMouseDown={preventStealFocus}
              onClick={() => addArrayItem(setExclusions)}
            >
              <FaPlus /> Add
            </button>

            <div className="space-y-3 mt-3">
              {exclusions.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 p-3 border rounded-lg"
                    value={item.text}
                    onChange={(e) =>
                      updateArrayItem(setExclusions, item.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onMouseDown={preventStealFocus}
                    onClick={() => removeArrayItem(setExclusions, item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">
              Cancellation Policy
            </h3>
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
              onMouseDown={preventStealFocus}
              onClick={() => addArrayItem(setCancellationPolicy)}
            >
              <FaPlus /> Add
            </button>

            <div className="space-y-3 mt-3">
              {cancellationPolicy.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 p-3 border rounded-lg"
                    value={item.text}
                    onChange={(e) =>
                      updateArrayItem(
                        setCancellationPolicy,
                        item.id,
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onMouseDown={preventStealFocus}
                    onClick={() =>
                      removeArrayItem(setCancellationPolicy, item.id)
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">
              Terms & Conditions
            </h3>
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
              onMouseDown={preventStealFocus}
              onClick={() => addArrayItem(setTerms)}
            >
              <FaPlus /> Add
            </button>

            <div className="space-y-3 mt-3">
              {terms.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 p-3 border rounded-lg"
                    value={item.text}
                    onChange={(e) =>
                      updateArrayItem(setTerms, item.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onMouseDown={preventStealFocus}
                    onClick={() => removeArrayItem(setTerms, item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#e82429] to-[#721011] text-white rounded-xl font-bold shadow-md"
        >
          {loading
            ? "Saving..."
            : editHoliday
            ? "Update Holiday"
            : "Save Holiday"}
        </button>
      </form>
    </div>
  );
}
