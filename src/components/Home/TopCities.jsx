import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const cities = [
  {
    name: "Dubai",
    img: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?auto=format&fit=crop&q=80&w=1171",
  },
  {
    name: "Abu Dhabi",
    img: "https://images.unsplash.com/photo-1603565095944-2a6f33bb517c?auto=format&fit=crop&q=80&w=1171",
  },
  {
    name: "Ajman",
    img: "https://images.unsplash.com/photo-1557678493-c54624d611fc?auto=format&fit=crop&q=80&w=687",
  },
  {
    name: "Sharjah",
    img: "https://plus.unsplash.com/premium_photo-1697730012360-d49e7ca1a776?auto=format&fit=crop&q=80&w=1192",
  },
  {
    name: "Paris",
    img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TopCitiesSlider() {
  const [current, setCurrent] = useState(0);

  // ✅ Adjust visible cards based on screen width
  const getVisibleCards = () => {
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 4; // desktop
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    const handleResize = () => setVisibleCards(getVisibleCards());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev - 1 + cities.length) % cities.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev + 1) % cities.length);
  };

  const getVisibleCities = () => {
    const result = [];
    for (let i = 0; i < visibleCards; i++) {
      result.push(cities[(current + i) % cities.length]);
    }
    return result;
  };

  const visibleCities = getVisibleCities();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1200px] mx-auto relative px-4">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-10 text-left"
          style={{ color: "#404041" }}
        >
          Top Cities to Visit
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex justify-between gap-5 overflow-hidden w-full transition-transform duration-700 ease-in-out">
            {visibleCities.map((city, index) => (
              <div
                key={index}
                className="flex-shrink-0 transition-transform duration-700 ease-in-out"
                style={{
                  width:
                    visibleCards === 4
                      ? "23%"
                      : visibleCards === 2
                      ? "48%"
                      : "100%",
                }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg group">
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />
                  <h3 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-2xl font-semibold tracking-wide drop-shadow-lg">
                    {city.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
