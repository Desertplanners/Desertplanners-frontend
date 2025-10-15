export default function Banner() {
  const slide = {
    title: "Discover Dubai Like Never Before",
    subtitle: "Experience luxury tours and make unforgettable memories.",
    video: "/desertbannervideo.mp4", // your video URL
    cta: "Explore Tours",
    link: "/tours",
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] overflow-hidden">
      <video
        src={slide.video}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60 flex justify-center items-center">
        <div className="max-w-[1200px] w-full px-4 text-left text-white mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {slide.title}
          </h2>
          <p className="text-sm sm:text-md md:text-xl mb-4 sm:mb-6 drop-shadow-md max-w-lg">
            {slide.subtitle}
          </p>
          <a
            href={slide.link}
            className="px-5 py-2 sm:px-6 sm:py-3 bg-[#e82429] hover:bg-[#721011] rounded-lg font-semibold text-white shadow-lg transition duration-300 transform hover:scale-105"
          >
            {slide.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
