import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const attractions = [
  {
    name: "Burj Khalifa",
    price: "AED 350",
    img: "https://plus.unsplash.com/premium_photo-1694475634077-e6e4b623b574?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1071",
  },
  {
    name: "Desert Safari",
    price: "AED 250",
    img: "https://images.unsplash.com/photo-1588310558566-b983c7d257e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688",
  },
  {
    name: "Ferrari World",
    price: "AED 450",
    img: "https://images.unsplash.com/photo-1578152882785-df9744e359e5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
  },
  {
    name: "Palm Jumeirah",
    price: "AED 200",
    img: "https://images.unsplash.com/photo-1682410601904-24ec1d9858e6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
  },
  {
    name: "Dubai Marina",
    price: "AED 150",
    img: "https://images.unsplash.com/photo-1459787915554-b34915863013?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=633",
  },
  {
    name: "Global Village",
    price: "AED 100",
    img: "https://images.unsplash.com/photo-1671949047848-847819cdc705?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
  },
];

export default function TopAttractionsCarousel() {
  const [current, setCurrent] = useState(0);
  const cardsPerView = 3;

  const next = () => {
    setCurrent((prev) => (prev + 1) % attractions.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + attractions.length) % attractions.length);
  };

  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(attractions[(current + i) % attractions.length]);
    }
    return visible;
  };

  const visibleAttractions = getVisible();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-10 text-left"
          style={{ color: "#404041" }}
        >
          Top Attractions
        </h2>

        <div className="relative flex items-center">
          {/* Left Button */}
          <button
            onClick={prev}
            className="absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-hidden w-full">
            {visibleAttractions.map((item, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[32%] rounded-xl shadow-lg group overflow-hidden transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-80 object-cover"
                />
                {/* Price Ribbon */}
                <span className="absolute top-2 left-2 bg-[#e82429] text-white px-3 py-1 rounded-full font-semibold text-sm">
                  {item.price}
                </span>
                {/* Bottom Text Overlay */}
                <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-sm px-4 py-3 text-white font-semibold text-lg text-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={next}
            className="absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
