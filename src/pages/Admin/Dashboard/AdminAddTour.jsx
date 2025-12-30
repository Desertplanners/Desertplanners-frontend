import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/red.css";
import toast from "react-hot-toast";

export default function AdminAddTour({ tour, onSuccess }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  // const [price, setPrice] = useState("");
  // ⭐ Adult & Child Price
  const [priceAdult, setPriceAdult] = useState("");
  const [priceChild, setPriceChild] = useState("");
  // ⭐ Discount Prices (OPTIONAL)
  const [discountPriceAdult, setDiscountPriceAdult] = useState("");
  const [discountPriceChild, setDiscountPriceChild] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [relatedTours, setRelatedTours] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [removedOldImages, setRemovedOldImages] = useState([]);

  // Array fields
  const [highlights, setHighlights] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);

  const [timings, setTimings] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Naya code - Available dates ki jagah startDate aur endDate
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [maxGuests, setMaxGuests] = useState(12);
  const [pickupDropRequired, setPickupDropRequired] = useState(false);
  // NAYA FIELD - Terms and Conditions
  const [termsAndConditions, setTermsAndConditions] = useState("");

  // 🔄 UPDATED - Dynamic Cancellation Policy Array
  const [cancellationPolicy, setCancellationPolicy] = useState([]);

  // Cancellation Policy Handlers
  const addCancellationPolicy = () => {
    setCancellationPolicy((prev) => [...prev, { title: "", description: "" }]);
  };

  const removeCancellationPolicy = (index) => {
    setCancellationPolicy((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancellationPolicyChange = (index, field, value) => {
    setCancellationPolicy((prev) =>
      prev.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    );
  };

  const addTemplatePolicy = (template) => {
    setCancellationPolicy((prev) => [
      ...prev,
      { title: template.title, description: template.desc },
    ]);
  };

  // fetch categories + tours
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = DataService();
        const [catRes, tourRes] = await Promise.all([
          api.get(API.GET_CATEGORIES),
          api.get(API.GET_TOURS),
        ]);
        setCategories(catRes.data);
        setAllTours(tourRes.data);
      } catch {
        toast.error("Error fetching categories or tours");
      }
    };
    fetchData();
  }, []);

  // auto slug
  useEffect(() => {
    if (!tour) setSlug(title.toLowerCase().replace(/\s+/g, "-"));
  }, [title, tour]);

  // populate edit mode
  useEffect(() => {
    if (tour) {
      setTitle(tour.title || "");
      setSlug(tour.slug || "");
      setDescription(tour.description || "");
      // ⭐ Adult Price fallback → old price field
      setPriceAdult(
        tour.priceAdult !== undefined && tour.priceAdult !== null
          ? tour.priceAdult
          : tour.price || ""
      );

      // ⭐ Child Price fallback → stays empty in old tours
      setPriceChild(
        tour.priceChild !== undefined && tour.priceChild !== null
          ? tour.priceChild
          : ""
      );
      // ⭐ Discount Prices (Edit mode – optional)
      setDiscountPriceAdult(
        tour.discountPriceAdult !== undefined &&
          tour.discountPriceAdult !== null
          ? tour.discountPriceAdult
          : ""
      );

      setDiscountPriceChild(
        tour.discountPriceChild !== undefined &&
          tour.discountPriceChild !== null
          ? tour.discountPriceChild
          : ""
      );

      setPickupDropRequired(tour.pickupDropRequired || false);
      setDuration(tour.duration || "");
      setCategory(tour.category?._id || "");
      setHighlights(tour.highlights || []);
      setInclusions(tour.inclusions || []);
      setExclusions(tour.exclusions || []);
      setTimings(tour.timings || "");
      setLocation(tour.location || "");
      setRelatedTours(
        Array.isArray(tour.relatedTours)
          ? tour.relatedTours.map((t) => t._id || t)
          : []
      );

      // Naya code - startDate aur endDate set karna
      setStartDate(tour.startDate ? new Date(tour.startDate) : null);
      setEndDate(tour.endDate ? new Date(tour.endDate) : null);
      setMaxGuests(tour.maxGuests || 12);

      // NAYA FIELD - Terms and Conditions
      setTermsAndConditions(tour.termsAndConditions || "");

      // 🔄 UPDATED - Dynamic Cancellation Policy Population
      if (tour.cancellationPolicy) {
        if (Array.isArray(tour.cancellationPolicy)) {
          // New array format
          setCancellationPolicy(tour.cancellationPolicy);
        } else if (typeof tour.cancellationPolicy === "object") {
          // Convert old object format to array
          const policyArray = Object.entries(tour.cancellationPolicy)
            .filter(([_, value]) => value && value.trim() !== "") // Remove empty values
            .map(([key, value]) => {
              // Convert camelCase to Title Case
              const title = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();
              return { title, description: value };
            });
          setCancellationPolicy(policyArray);
        } else if (typeof tour.cancellationPolicy === "string") {
          // String format - create one section
          setCancellationPolicy([
            {
              title: "Cancellation Policy",
              description: tour.cancellationPolicy,
            },
          ]);
        }
      } else {
        // No cancellation policy - start with empty array
        setCancellationPolicy([]);
      }
    }
  }, [tour]);

  // array field helpers
  const handleAddField = (key) => {
    if (key === "highlights") setHighlights([...highlights, ""]);
    if (key === "inclusions") setInclusions([...inclusions, ""]);
    if (key === "exclusions") setExclusions([...exclusions, ""]);
    if (key === "relatedTours") setRelatedTours([...relatedTours, ""]);
  };

  const handleRemoveField = (key, idx) => {
    if (key === "highlights")
      setHighlights(highlights.filter((_, i) => i !== idx));
    if (key === "inclusions")
      setInclusions(inclusions.filter((_, i) => i !== idx));
    if (key === "exclusions")
      setExclusions(exclusions.filter((_, i) => i !== idx));
    if (key === "relatedTours")
      setRelatedTours(relatedTours.filter((_, i) => i !== idx));
  };

  const handleArrayChange = (e, key, idx) => {
    const value = e.target.value;
    if (key === "highlights") {
      const updated = [...highlights];
      updated[idx] = value;
      setHighlights(updated);
    }
    if (key === "inclusions") {
      const updated = [...inclusions];
      updated[idx] = value;
      setInclusions(updated);
    }
    if (key === "exclusions") {
      const updated = [...exclusions];
      updated[idx] = value;
      setExclusions(updated);
    }
    if (key === "relatedTours") {
      const updated = [...relatedTours];
      updated[idx] = value;
      setRelatedTours(updated);
    }
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date validation - end date start date se pehle nahi honi chahiye
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return toast.error("End date cannot be before start date");
    }

    if (
      discountPriceAdult &&
      Number(discountPriceAdult) >= Number(priceAdult)
    ) {
      return toast.error("Adult discount price must be less than actual price");
    }

    // if (
    //   discountPriceChild &&
    //   priceChild &&
    //   Number(discountPriceChild) >= Number(priceChild)
    // ) {
    //   return toast.error("Child discount price must be less than actual price");
    // }

    if (
      !title ||
      !description ||
      !priceAdult || // ⭐ NEW VALIDATION
      !category ||
      !startDate ||
      !endDate ||
      (!mainImage && !tour)
    ) {
      return toast.error("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("priceAdult", priceAdult);
    if (discountPriceAdult !== "" && discountPriceAdult !== null) {
      formData.append("discountPriceAdult", discountPriceAdult);
    } else {
      formData.append("discountPriceAdult", "");
    }

    formData.append("duration", duration);
    formData.append("category", category);

    // ⭐ Child price – ONLY if provided
    if (priceChild !== "" && priceChild !== null) {
      formData.append("priceChild", priceChild);
    }

    // 🔴 FORCE CLEAR CHILD PRICE
    if (priceChild === "" || priceChild === null) {
      formData.append("priceChild", "");
      formData.append("discountPriceChild", "");
    }
    // ⭐ Child discount – ONLY if child price exists
    if (
      priceChild !== "" &&
      priceChild !== null &&
      discountPriceChild !== "" &&
      discountPriceChild !== null
    ) {
      formData.append("discountPriceChild", discountPriceChild);
    }

    if (mainImage) formData.append("mainImage", mainImage, mainImage.name);

    galleryImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("galleryImages", file, file.name);
      }
    });
    console.log("📤 Sending FormData:", Object.fromEntries(formData.entries()));
    formData.append("removeGalleryImages", JSON.stringify(removedOldImages));
    formData.append("highlights", JSON.stringify(highlights));
    formData.append("inclusions", JSON.stringify(inclusions));
    formData.append("exclusions", JSON.stringify(exclusions));
    formData.append("pickupDropRequired", pickupDropRequired);
    formData.append("timings", timings);

    // 🔄 UPDATED - Dynamic Cancellation Policy
    formData.append("cancellationPolicy", JSON.stringify(cancellationPolicy));

    formData.append("location", location);
    relatedTours.forEach((id) => formData.append("relatedTours[]", id));

    // Naya code - availableDates ki jagah startDate aur endDate
    formData.append(
      "startDate",
      new Date(startDate).toISOString().split("T")[0]
    );
    formData.append("endDate", new Date(endDate).toISOString().split("T")[0]);

    formData.append("maxGuests", maxGuests);

    // NAYA FIELD - Terms and Conditions
    formData.append("termsAndConditions", termsAndConditions);

    try {
      setLoading(true);
      const api = DataService();
      if (tour) {
        await api.put(API.UPDATE_TOUR(tour._id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Tour updated successfully!");
      } else {
        await api.post(API.ADD_TOUR, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Tour added successfully!");
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-[#721011] mb-8 text-center">
          {tour ? "✏️ Edit Tour" : "🏖️ Add New Tour"}
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="font-semibold">Slug</label>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2 resize-none"
            ></textarea>
          </div>

          {/* Price / Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Adult Price (AED)*</label>
              <input
                type="number"
                value={priceAdult}
                onChange={(e) => setPriceAdult(e.target.value)}
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="font-semibold">Child Price (AED)</label>
              <input
                type="number"
                value={priceChild}
                onChange={(e) =>
                  setPriceChild(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onWheel={(e) => e.target.blur()} // ⭐ prevents accidental +1/-1
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="font-semibold">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Adult Discount Price (AED)</label>
            <input
              type="number"
              value={discountPriceAdult}
              onChange={(e) => setDiscountPriceAdult(e.target.value)}
              className="w-full border border-green-500 rounded-xl px-4 py-2"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="font-semibold">Child Discount Price (AED)</label>
            <input
              type="number"
              value={discountPriceChild}
              onChange={(e) => setDiscountPriceChild(e.target.value)}
              className="w-full border border-green-500 rounded-xl px-4 py-2"
              placeholder="Optional"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="font-semibold">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Gallery Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const selected = Array.from(e.target.files);
                setGalleryImages((prev) => [...prev, ...selected]);
              }}
              className="w-full"
            />

            {/* SHOW OLD GALLERY IMAGES IN EDIT MODE */}
            {tour && tour.galleryImages && tour.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 my-4">
                {tour.galleryImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      className="w-full h-24 object-cover rounded-lg border"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemovedOldImages((prev) => [...prev, img]);

                        // ⭐ Remove image from preview also
                        tour.galleryImages = tour.galleryImages.filter(
                          (i) => i !== img
                        );

                        // ⭐ Trigger re-render
                        setGalleryImages((prev) => [...prev]);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highlights / Inclusions / Exclusions */}
          {["highlights", "inclusions", "exclusions"].map((key) => {
            const values =
              key === "highlights"
                ? highlights
                : key === "inclusions"
                ? inclusions
                : exclusions;
            return (
              <div key={key} className="border rounded-xl p-4 bg-gray-50">
                <h3 className="font-semibold text-[#e82429] mb-2 capitalize">
                  {key}
                </h3>
                {values.map((val, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleArrayChange(e, key, idx)}
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveField(key, idx)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField(key)}
                  className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-lg mt-2"
                >
                  <FaPlus /> Add {key.slice(0, -1)}
                </button>
              </div>
            );
          })}

          {/* Related Tours */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-[#e82429] mb-2">Related Tours</h3>
            {relatedTours.map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={val}
                  onChange={(e) => handleArrayChange(e, "relatedTours", idx)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                >
                  <option value="">Select Tour</option>
                  {allTours
                    .filter((t) => (tour ? t._id !== tour._id : true))
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveField("relatedTours", idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg flex items-center justify-center"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("relatedTours")}
              className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-lg mt-2"
            >
              <FaPlus /> Add Related Tour
            </button>
          </div>

          {/* Timings / Location */}
          <div>
            <label className="font-semibold">Timings</label>
            <input
              type="text"
              value={timings}
              onChange={(e) => setTimings(e.target.value)}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2"
              placeholder="Example: 9:00 AM - 5:00 PM"
            />
          </div>

          <div className="border rounded-xl p-4 bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pickupDropRequired}
                onChange={(e) => setPickupDropRequired(e.target.checked)}
                className="w-5 h-5 accent-[#e82429]"
              />
              <span className="font-semibold text-gray-800">
                Pickup & Drop Required for this Tour
              </span>
            </label>

            <p className="text-sm text-gray-500 mt-1">
              Enable this if this tour requires pickup & drop details at
              checkout.
            </p>
          </div>

          {/* 🔄 UPDATED - Dynamic Cancellation Policy */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-[#e82429] mb-4">
              Cancellation Policy
            </h3>

            {cancellationPolicy.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No cancellation policy sections added. Click "Add Policy
                Section" to start.
              </div>
            )}

            {cancellationPolicy.map((policy, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={policy.title}
                    onChange={(e) =>
                      handleCancellationPolicyChange(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Policy Title (e.g., Refund Timeline, No-Show Policy)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                  />
                  <button
                    type="button"
                    onClick={() => removeCancellationPolicy(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <textarea
                  value={policy.description}
                  onChange={(e) =>
                    handleCancellationPolicyChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Enter policy details..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addCancellationPolicy}
              className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-lg"
            >
              <FaPlus /> Add Policy Section
            </button>

            {/* Pre-defined Templates */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Quick Templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    title: "Refund Timeline",
                    desc: "Full Refund: Cancellations made more than 24 hours before the tour start time.",
                  },
                  {
                    title: "No-Show Policy",
                    desc: "100% Charge: For no-shows or cancellations made within 24 hours of the tour start time.",
                  },
                  {
                    title: "Non-Refundable Items",
                    desc: "Strictly Non-Refundable: Dated/specific-time tickets, coupon tickets, events, attractions, or accommodations marked 'no refund/replacement'.",
                  },
                  {
                    title: "Refund Method",
                    desc: "Payment Mode: Refunds are processed only to the original payment method.",
                  },
                  {
                    title: "Rescheduling Policy",
                    desc: "More than 24 hours before the tour: Amendments or rescheduling are subject to availability and any price differences or supplier fees.",
                  },
                ].map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addTemplatePolicy(template)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg"
                  >
                    + {template.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold">Location / Map URL</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2"
            />
          </div>

          {/* NAYA FIELD - Terms and Conditions */}
          <div>
            <label className="font-semibold">Terms and Conditions</label>
            <textarea
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              rows={4}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2 resize-none"
              placeholder="Enter terms and conditions for this tour..."
            ></textarea>
          </div>

          {/* Naya Code - Availability (Start Date & End Date) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Start Date*</label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                minDate={new Date()}
                format="YYYY-MM-DD"
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="font-semibold">End Date*</label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                minDate={startDate || new Date()}
                format="YYYY-MM-DD"
                className="w-full border border-[#e82429] rounded-xl px-4 py-2"
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Max Guests */}
          <div>
            <label className="font-semibold">Max Guests</label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxGuests}
              onChange={(e) => setMaxGuests(parseInt(e.target.value) || 1)}
              className="w-full border border-[#e82429] rounded-xl px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:scale-105 transition-transform shadow-lg"
          >
            <FaPlus />
            {loading
              ? tour
                ? "Updating..."
                : "Adding..."
              : tour
              ? "Update Tour"
              : "Add Tour"}
          </button>
        </form>
      </div>
    </div>
  );
}
