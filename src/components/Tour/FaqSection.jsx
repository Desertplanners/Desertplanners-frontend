import React, { useState } from "react";

export default function FaqSection() {
  const faqs = [
    {
      question: "What is the best time to visit Dubai for tours?",
      answer:
        "The best time to visit Dubai is between November and March when the weather is pleasant, making it ideal for sightseeing and outdoor activities.",
    },
    {
      question: "Do I need to book Dubai tours in advance?",
      answer:
        "Yes, it is recommended to book popular tours in advance to secure your spot, especially for experiences like Desert Safari, Burj Khalifa, and Helicopter tours.",
    },
    {
      question: "Are Dubai tours suitable for families and children?",
      answer:
        "Absolutely! Dubai offers family-friendly attractions like theme parks, aquariums, and city tours suitable for all ages.",
    },
    {
      question: "What should I wear on Dubai desert safaris?",
      answer:
        "Wear comfortable, lightweight clothing during the day, a hat and sunglasses for sun protection, and bring a light jacket in the evening as desert temperatures can drop.",
    },
    {
      question: "Can I customize my Dubai tour packages?",
      answer:
        "Yes, many tour operators offer flexible and customizable packages allowing you to combine city tours, adventure activities, and sightseeing based on your preferences.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-[1200px] mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center text-[#1c1c1c] mb-8">
        Frequently Asked Questions About Tours in Dubai
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              className="w-full text-left p-4 bg-[#f7f7f7] hover:bg-[#eaeaea] flex justify-between items-center"
              onClick={() => toggleFaq(index)}
            >
              <span className="text-lg md:text-xl font-semibold" style={{ color: "#e82429" }}>
                {faq.question}
              </span>
              <span className="text-2xl text-gray-500">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            <div
              className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-96 p-4" : "max-h-0 p-0"
              }`}
            >
              <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
