import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation

const attractions = [
  {
    name: "Burj Khalifa",
    price: "AED 350",
    img: "https://plus.unsplash.com/premium_photo-1694475634077-e6e4b623b574?auto=format&fit=crop&w=1071&q=80",
    path: "tours/burj-khalifa/burj-khalifa---124th-+-125th-floor-non-prime-hours",
  },
  {
    name: "Desert Safari",
    price: "AED 250",
    img: "https://images.unsplash.com/photo-1588310558566-b983c7d257e4?auto=format&fit=crop&w=688&q=80",
    path: "tours/desert-safari/desert-safari-with-bbq-dinner-by-4*4-vechicle-on-sharing-basis",
  },
  {
    name: "Ferrari World",
    price: "AED 450",
    img: "https://images.unsplash.com/photo-1578152882785-df9744e359e5?auto=format&fit=crop&w=735&q=80",
    path: "/tours/yas-island/ferrari-world",
  },
  {
    name: "Dubai Marina",
    price: "AED 150",
    img: "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=633&q=80",
    path: "tours/excursion-tickets/dubai-miracle-garden",
  },
  {
    name: "The Dubai Balloon",
    price: "AED 100",
    img: "https://i.pinimg.com/736x/e9/34/0a/e9340ae93dddb0f831937ba1a70c3c60.jpg",
    path: "tours/adventure-tour/the-dubai-balloon",
  },
];

export default function TopAttractionsCarousel() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCardsPerView(4);
      else if (window.innerWidth >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % attractions.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + attractions.length) % attractions.length);

  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(attractions[(current + i) % attractions.length]);
    }
    return visible;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const visibleAttractions = getVisible();

  // ✅ Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % attractions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(attractions.length / cardsPerView);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-6 text-left"
          style={{ color: "#404041" }}
        >
          Top Attractions
        </h2>

        <div
          className="relative flex items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Button */}
          <button
            onClick={prev}
            className="absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:flex"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-hidden w-full transition-transform duration-500">
            {visibleAttractions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="relative flex-shrink-0 rounded-xl shadow-md overflow-hidden bg-white transition-transform duration-500 cursor-pointer hover:scale-[1.03]"
                style={{ width: `${100 / cardsPerView - 1.5}%` }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-80 object-cover transform transition duration-500 hover:scale-105"
                />
                {/* ✅ Text inside image */}
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
                    {item.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-100">
                    From{" "}
                    <span className="text-[#e82429] font-extrabold">
                      {item.price}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={next}
            className="absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:flex"
          >
            <FiChevronRight size={22} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2 sm:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * cardsPerView)}
              className={`w-3 h-3 rounded-full transition ${
                idx === Math.floor(current / cardsPerView)
                  ? "bg-[#e82429]"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
