import React, { useEffect, useState } from "react";
import { API } from "../../config/API";
import DataService from "../../config/DataService";

/* -------------------------------------------------------
   SLIDER COMPONENT (CHILD) – SAFE FOR HOOKS
---------------------------------------------------------*/
function ImageSlider({ images, category, isReversed }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0));
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative h-[260px] sm:h-[300px] lg:h-[380px]
                    w-full lg:w-1/2 rounded-2xl overflow-hidden bg-gray-200">

      {/* Slider Image */}
      <img
        src={images?.[index] || "/no-image.png"}
        className="absolute inset-0 w-full h-full object-cover transition duration-700"
        alt="slider"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/25 to-transparent"></div>

      {/* CATEGORY BADGE — now zig-zag dynamic */}
      <div className={`
        absolute top-4 
        ${isReversed ? "right-4" : "left-4"} 
        bg-white/90 backdrop-blur-md px-3 py-1 rounded-full
        text-[#b40303] text-xs sm:text-sm font-semibold shadow-lg
      `}>
        ✦ {category || "Holiday Package"}
      </div>

      {/* Dots */}
      {images?.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, d) => (
            <div
              key={d}
              className={`w-2 h-2 rounded-full ${
                index === d ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   MAIN HOLIDAY PACKAGES SECTION
---------------------------------------------------------*/
export default function HolidayPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHolidayTours = async () => {
    try {
      const res = await DataService().get(API.GET_ALL_HOLIDAY_TOURS);
      setPackages(res.data?.tours || []);
      setLoading(false);
    } catch (error) {
      console.log("Error loading holiday tours:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidayTours();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-2 py-16 text-center text-gray-500">
        Loading holiday tours...
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-2 relative">

        <h2 className="text-4xl font-bold text-left mb-6 text-[#404041]">
          Holiday Packages
        </h2>

        <div className="flex flex-col gap-28">

          {packages.map((item, i) => {
            const isReversed = i % 2 !== 0;

            return (
              <div
                key={item._id}
                className={`
                  flex flex-col lg:flex-row
                  ${isReversed ? "lg:flex-row-reverse" : ""}
                  items-start lg:items-center
                  relative
                `}
              >

                {/* LEFT / RIGHT SLIDER (auto zig-zag) */}
                <ImageSlider
                  images={item.sliderImages}
                  category={item.category?.name}
                  isReversed={isReversed}
                />

                {/* RIGHT / LEFT CONTENT BOX */}
                <div
                  className={`
                    bg-[#b40303] text-white rounded-2xl border border-white/10
                    p-7 sm:p-8 lg:p-10 
                    shadow-[0_10px_35px_rgba(0,0,0,0.30)]
                    -mt-6 sm:-mt-8 lg:mt-0
                    w-full lg:w-[53%]
                    relative z-20
                    ${isReversed ? "lg:-mr-10" : "lg:-ml-10"}
                  `}
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    {item.title}
                  </h3>

                  <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-row items-center justify-between gap-4">
  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
    ${" "}{item.priceAdult}
  </p>

  <button
    className="
      px-6 py-3 bg-white text-[#b40303] font-semibold 
      rounded-xl shadow-lg hover:scale-105 transition-all
      w-auto
    "
  >
    View Details
  </button>
</div>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
