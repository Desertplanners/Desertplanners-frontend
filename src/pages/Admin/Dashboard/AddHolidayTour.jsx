// AdminAddHolidayTour.final.jsx
import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaImage, FaTimes } from "react-icons/fa";

/**
 * AdminAddHolidayTour.final.jsx
 * - Final fixed version: split state to avoid full-form re-renders
 * - Stable id-based arrays, onMouseDown preventDefault for buttons
 * - No main image (removed as requested)
 * - Slider + Itinerary images with blob preview + cleanup
 *
 * Drop-in replacement for your existing component.
 */

// small id generator for stable keys
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminAddHolidayTour({ closeModal, fetchHolidays, editHoliday }) {
  const api = DataService();

  // -----------------------
  // Basic states (split to avoid whole-form replace)
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

  const [highlights, setHighlights] = useState({ nights: "", persons: "", room: "", mealPlan: "" });

  // arrays stored as objects with stable ids
  const [knowBefore, setKnowBefore] = useState([{ id: makeId(), text: "" }]);
  const [inclusions, setInclusions] = useState([{ id: makeId(), text: "" }]);
  const [exclusions, setExclusions] = useState([{ id: makeId(), text: "" }]);
  const [cancellationPolicy, setCancellationPolicy] = useState([{ id: makeId(), text: "" }]);
  const [terms, setTerms] = useState([{ id: makeId(), text: "" }]);

  // itinerary: { id, title } — images parallel arrays
  const [itinerary, setItinerary] = useState([{ id: makeId(), title: "" }]);
  const [itineraryFiles, setItineraryFiles] = useState([]); // file objects parallel by index
  const [itineraryPreviews, setItineraryPreviews] = useState([]); // urls (cloud or blob)

  // slider images
  const [sliderFiles, setSliderFiles] = useState([]);
  const [sliderPreviews, setSliderPreviews] = useState([]);

  // created blob URLs registry for cleanup
  const createdUrlsRef = useRef([]);

  const registerUrl = (u) => createdUrlsRef.current.push(u);

  // cleanup on unmount
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
  // Load categories (once)
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

  // -----------------------
  // Prefill when editing (runs when editHoliday changes)
  // -----------------------
  useEffect(() => {
    if (!editHoliday) {
      // reset to defaults
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

      setItinerary([{ id: makeId(), title: "" }]);
      setItineraryFiles([]);
      setItineraryPreviews([]);

      setSliderFiles([]);
      setSliderPreviews([]);
      return;
    }

    const h = editHoliday;

    setTitle(h.title || "");
    setSlug(h.slug || "");
    setDuration(h.duration || "");
    setCategory(h.category?._id || "");
    setPriceAdult(h.priceAdult || "");
    setPriceChild(h.priceChild || "");
    setDescription(h.description || "");
    setHighlights(h.highlights || { nights: "", persons: "", room: "", mealPlan: "" });

    const mapToObjects = (arr) => (arr?.length ? arr.map((txt) => ({ id: makeId(), text: txt })) : [{ id: makeId(), text: "" }]);

    setKnowBefore(mapToObjects(h.knowBefore));
    setInclusions(mapToObjects(h.inclusions));
    setExclusions(mapToObjects(h.exclusions));
    setCancellationPolicy(mapToObjects(h.cancellationPolicy));
    setTerms(mapToObjects(h.terms));

    setItinerary(h.itinerary?.length ? h.itinerary.map((it) => ({ id: makeId(), title: it.title })) : [{ id: makeId(), title: "" }]);

    // slider images (cloud urls allowed)
    setSliderPreviews(h.sliderImages || []);
    setSliderFiles([]);

    // itinerary image previews (cloud urls) mapped by index if provided
    if (h.itinerary) {
      setItineraryPreviews(h.itinerary.map((i) => i.image || ""));
      setItineraryFiles(new Array(h.itinerary.length).fill(null));
    } else {
      setItineraryPreviews([]);
      setItineraryFiles([]);
    }
  }, [editHoliday]);

  // -----------------------
  // Array helpers (stable IDs)
  // -----------------------
  const updateArrayItem = (setter, id, value) => setter((prev) => prev.map((p) => (p.id === id ? { ...p, text: value } : p)));
  const addArrayItem = (setter) => setter((prev) => [...prev, { id: makeId(), text: "" }]);
  const removeArrayItem = (setter, id) => setter((prev) => prev.filter((p) => p.id !== id));

  // itinerary helpers
  const updateItineraryTitle = (id, value) => setItinerary((prev) => prev.map((it) => (it.id === id ? { ...it, title: value } : it)));
  const addItinerary = () => {
    setItinerary((p) => [...p, { id: makeId(), title: "" }]);
    setItineraryFiles((p) => [...p, null]);
    setItineraryPreviews((p) => [...p, ""]);
  };
  const removeItinerary = (id, index) => {
    setItinerary((p) => p.filter((it) => it.id !== id));
    setItineraryFiles((p) => {
      const arr = [...p];
      arr.splice(index, 1);
      return arr;
    });
    setItineraryPreviews((p) => {
      const arr = [...(p || [])];
      if (arr[index] && arr[index].startsWith("blob:")) {
        try {
          URL.revokeObjectURL(arr[index]);
        } catch {}
      }
      arr.splice(index, 1);
      return arr;
    });
  };

  // -----------------------
  // Image handlers
  // -----------------------
  const onSliderFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // revoke previous blob urls we created
    createdUrlsRef.current.forEach((u) => {
      if (u && u.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      }
    });
    createdUrlsRef.current = [];

    setSliderFiles(files);

    const previews = files.map((f) => {
      const u = URL.createObjectURL(f);
      registerUrl(u);
      return u;
    });
    setSliderPreviews(previews);
  };

  const onItineraryImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setItineraryFiles((p) => {
      const arr = [...p];
      arr[index] = file;
      return arr;
    });

    // revoke previous blob at this index if any
    if (itineraryPreviews[index] && itineraryPreviews[index].startsWith("blob:")) {
      try {
        URL.revokeObjectURL(itineraryPreviews[index]);
      } catch {}
    }

    const u = URL.createObjectURL(file);
    registerUrl(u);

    setItineraryPreviews((p) => {
      const arr = [...(p || [])];
      arr[index] = u;
      return arr;
    });
  };

  // -----------------------
  // Prevent buttons stealing focus while typing
  // (preventDefault in onMouseDown keeps input focus when clicking)
  // -----------------------
  const preventStealFocus = (e) => {
    e.preventDefault();
  };

  // -----------------------
  // Submit
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

      [knowBefore, inclusions, exclusions, cancellationPolicy, terms].forEach((arr, idx) => {
        const keys = ["knowBefore", "inclusions", "exclusions", "cancellationPolicy", "terms"];
        arr.forEach((x) => fd.append(keys[idx], x.text));
      });

      itinerary.forEach((it) => fd.append("itineraryTitle[]", it.title));

      sliderPreviews.forEach((u) => {
        if (!u.startsWith("blob:")) fd.append("existingSliderImages", u);
      });
      sliderFiles.forEach((f) => fd.append("sliderImages", f));
      itineraryFiles.forEach((f) => f && fd.append("itineraryImages", f));

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
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Small UI render helpers
  // -----------------------
  const renderArrayInputs = (arr, setAdd, setUpdate, setRemove, label) => (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onMouseDown={preventStealFocus}
          onClick={() => setAdd((s) => s((prev) => [...prev]))}
          className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>

      <div className="space-y-3 mt-3">
        {arr.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              autoComplete="off"
              spellCheck={false}
              className="flex-1 p-3 border rounded-lg"
              value={item.text}
              onChange={(e) => setUpdate(item.id, e.target.value)}
            />
            <button
              type="button"
              onMouseDown={preventStealFocus}
              onClick={() => setRemove(item.id)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // local wrappers to pass appropriate setters into renderArrayInputs
  const renderKnowBefore = () =>
    renderArrayInputs(knowBefore, (cb) => setKnowBefore((p) => [...p, { id: makeId(), text: "" }]), updateArrayItem.bind(null, setKnowBefore), (id) => removeArrayItem(setKnowBefore, id), "Need to Know");

  const renderInclusions = () =>
    renderArrayInputs(inclusions, (cb) => setInclusions((p) => [...p, { id: makeId(), text: "" }]), updateArrayItem.bind(null, setInclusions), (id) => removeArrayItem(setInclusions, id), "Inclusion");

  const renderExclusions = () =>
    renderArrayInputs(exclusions, (cb) => setExclusions((p) => [...p, { id: makeId(), text: "" }]), updateArrayItem.bind(null, setExclusions), (id) => removeArrayItem(setExclusions, id), "Exclusion");

  const renderCancellation = () =>
    renderArrayInputs(cancellationPolicy, (cb) => setCancellationPolicy((p) => [...p, { id: makeId(), text: "" }]), updateArrayItem.bind(null, setCancellationPolicy), (id) => removeArrayItem(setCancellationPolicy, id), "Cancellation");

  const renderTerms = () =>
    renderArrayInputs(terms, (cb) => setTerms((p) => [...p, { id: makeId(), text: "" }]), updateArrayItem.bind(null, setTerms), (id) => removeArrayItem(setTerms, id), "Term");

  // -----------------------
  // JSX
  // -----------------------
  return (
    <div className="p-6 bg-white rounded-2xl max-h-[88vh] overflow-auto space-y-6">
      <h2 className="text-2xl font-bold text-[#721011]">{editHoliday ? "Edit Holiday Tour" : "Add Holiday Tour"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GENERAL */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#721011]">General Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="title"
              placeholder="Package Title"
              autoComplete="off"
              spellCheck={false}
              className="p-3 border rounded-lg"
              value={title}
              onChange={(e) => {
                const v = e.target.value;
                setTitle(v);
                setSlug(v.toLowerCase().trim().replace(/\s+/g, "-"));
              }}
            />

            <input
              name="slug"
              placeholder="Slug"
              autoComplete="off"
              className="p-3 border rounded-lg"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <input
              name="duration"
              placeholder="Duration (e.g., 3N - 4D)"
              autoComplete="off"
              className="p-3 border rounded-lg"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="category" className="p-3 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="priceAdult"
              placeholder="Adult Price"
              autoComplete="off"
              className="p-3 border rounded-lg"
              value={priceAdult}
              onChange={(e) => setPriceAdult(e.target.value)}
            />

            <input
              name="priceChild"
              placeholder="Child Price"
              autoComplete="off"
              className="p-3 border rounded-lg"
              value={priceChild}
              onChange={(e) => setPriceChild(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <textarea
            name="description"
            placeholder="Write package description"
            className="p-3 border rounded-lg w-full h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

{/* ======================== SLIDER IMAGES ======================== */}
<div className="bg-white border rounded-2xl p-6 shadow-md space-y-4">
  <h3 className="text-xl font-semibold text-[#721011]">Slider Images</h3>

  {/* Upload Box */}
  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition">
    <span className="text-gray-600 text-sm mb-2">Upload Slider Images</span>
    <span className="px-4 py-2 bg-[#721011] text-white text-sm rounded-lg">Choose Files</span>
    <input
      type="file"
      className="hidden"
      multiple
      accept="image/*"
      onChange={onSliderFilesChange}
    />
  </label>

  {/* Clear Button */}
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
      className="text-sm text-red-600 underline hover:text-red-800"
    >
      Clear All Slider Images
    </button>
  )}

  {/* Preview Grid */}
  <div className="grid grid-cols-3 gap-3">
    {sliderPreviews.map((src, i) => (
      <div key={i} className="relative group">
        <img
          src={src}
          className="h-28 w-full rounded-xl object-cover shadow-md group-hover:opacity-70 transition"
          alt=""
        />
        <button
          type="button"
          onMouseDown={preventStealFocus}
          onClick={() => {
            setSliderPreviews((p) => p.filter((_, idx) => idx !== i));
            setSliderFiles((p) => p.filter((_, idx) => idx !== i));
            if (src.startsWith("blob:")) URL.revokeObjectURL(src);
          }}
          className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 p-1 rounded-full shadow"
        >
          <FaTimes size={12} />
        </button>
      </div>
    ))}
  </div>
</div>



{/* ======================== ITINERARY IMAGES ======================== */}
<div className="bg-white border rounded-2xl p-6 shadow-md space-y-4 mt-8">
  <h3 className="text-xl font-semibold text-[#721011]">Itinerary Images & Titles</h3>

  <div className="space-y-5">
    {itinerary.map((it, idx) => (
      <div
        key={it.id}
        className="border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition space-y-3"
      >
        {/* Title + Upload Row */}
        <div className="flex gap-3 items-center">
          <input
            className="p-3 border rounded-lg w-full bg-white"
            placeholder={`Day ${idx + 1} Title`}
            value={it.title}
            onChange={(e) => updateItineraryTitle(it.id, e.target.value)}
          />

          <label className="px-3 py-2 bg-[#721011] text-white rounded-lg text-xs cursor-pointer hover:bg-[#8a1516] transition">
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onItineraryImageChange(e, idx)}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview */}
        {itineraryPreviews[idx] ? (
          <img
            src={itineraryPreviews[idx]}
            className="h-36 w-full object-cover rounded-lg shadow-md"
            alt=""
          />
        ) : (
          <div className="h-36 bg-white border rounded-lg flex items-center justify-center text-gray-400">
            <FaImage size={26} />
          </div>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onMouseDown={preventStealFocus}
          onClick={() => removeItinerary(it.id, idx)}
          className="text-red-600 flex items-center gap-1 text-sm hover:underline"
        >
          <FaTrash size={14} /> Remove Day
        </button>
      </div>
    ))}

    {/* Add New Day */}
    <button
      type="button"
      onMouseDown={preventStealFocus}
      onClick={addItinerary}
      className="px-5 py-2 bg-[#e82429] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#cf1c21] transition text-sm"
    >
      <FaPlus /> Add Day
    </button>
  </div>
</div>



        {/* Highlights */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#721011]">Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["nights", "persons", "room", "mealPlan"].map((k) => (
              <input
                key={k}
                placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                className="p-3 border rounded-lg"
                value={highlights[k]}
                onChange={(e) => setHighlights((prev) => ({ ...prev, [k]: e.target.value }))}
              />
            ))}
          </div>
        </div>

        {/* Listing sections */}
        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Need to Know</h3>
            {renderArrayInputs ? null : null}
            {/* renderKnowBefore */}
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={preventStealFocus} onClick={() => setKnowBefore((p) => [...p, { id: makeId(), text: "" }])} className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {knowBefore.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input autoComplete="off" spellCheck={false} className="flex-1 p-3 border rounded-lg" value={item.text} onChange={(e) => updateArrayItem(setKnowBefore, item.id, e.target.value)} />
                    <button type="button" onMouseDown={preventStealFocus} onClick={() => removeArrayItem(setKnowBefore, item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Inclusions</h3>
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={preventStealFocus} onClick={() => setInclusions((p) => [...p, { id: makeId(), text: "" }])} className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {inclusions.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input autoComplete="off" spellCheck={false} className="flex-1 p-3 border rounded-lg" value={item.text} onChange={(e) => updateArrayItem(setInclusions, item.id, e.target.value)} />
                    <button type="button" onMouseDown={preventStealFocus} onClick={() => removeArrayItem(setInclusions, item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Exclusions</h3>
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={preventStealFocus} onClick={() => setExclusions((p) => [...p, { id: makeId(), text: "" }])} className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {exclusions.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input autoComplete="off" spellCheck={false} className="flex-1 p-3 border rounded-lg" value={item.text} onChange={(e) => updateArrayItem(setExclusions, item.id, e.target.value)} />
                    <button type="button" onMouseDown={preventStealFocus} onClick={() => removeArrayItem(setExclusions, item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Cancellation Policy</h3>
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={preventStealFocus} onClick={() => setCancellationPolicy((p) => [...p, { id: makeId(), text: "" }])} className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {cancellationPolicy.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input autoComplete="off" spellCheck={false} className="flex-1 p-3 border rounded-lg" value={item.text} onChange={(e) => updateArrayItem(setCancellationPolicy, item.id, e.target.value)} />
                    <button type="button" onMouseDown={preventStealFocus} onClick={() => removeArrayItem(setCancellationPolicy, item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#721011]">Terms & Conditions</h3>
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onMouseDown={preventStealFocus} onClick={() => setTerms((p) => [...p, { id: makeId(), text: "" }])} className="px-3 py-1 bg-[#721011] text-white rounded flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {terms.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input autoComplete="off" spellCheck={false} className="flex-1 p-3 border rounded-lg" value={item.text} onChange={(e) => updateArrayItem(setTerms, item.id, e.target.value)} />
                    <button type="button" onMouseDown={preventStealFocus} onClick={() => removeArrayItem(setTerms, item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-[#e82429] to-[#721011] text-white rounded-xl font-bold shadow-md">
          {loading ? "Saving..." : editHoliday ? "Update Holiday" : "Save Holiday"}
        </button>
      </form>
    </div>
  );
}
