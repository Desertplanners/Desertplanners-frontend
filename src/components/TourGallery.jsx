import React, { useState, useEffect } from "react";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";

const TourGallery = ({ tour }) => {
  if (!tour) {
    return (
      <div className="text-center text-gray-500 p-10">
        Loading gallery...
      </div>
    );
  }

  const baseURL =
    import.meta.env.VITE_API_URL ||
    "https://desetplanner-backend.onrender.com";

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // ✅ Convert only galleryImages
  const images =
    tour?.galleryImages?.map((img) =>
      img?.startsWith("http") ? img : `${baseURL}/${img}`
    ) || [];

  const [mainImage, setMainImage] = useState(images[0]);

  // 🧠 FIX: Jab tour change ho → mainImage ko reset karo
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
      setPhotoIndex(0);
    }
  }, [tour?._id, tour?.galleryImages]);

  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 p-10">
        No gallery images available
      </div>
    );
  }

  return (
    <div className="relative flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Sidebar Thumbnails */}
      <div className="flex md:flex-col gap-2 p-2 bg-white shadow-inner rounded-l-xl overflow-x-auto md:overflow-y-auto max-h-[420px]">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${tour?.title || "Tour"} thumb ${idx + 1}`}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-transform duration-200 hover:scale-105 ${
              mainImage === img ? "border-[#e82429]" : "border-transparent"
            }`}
            onClick={() => {
              setMainImage(img);
              setPhotoIndex(idx);
            }}
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative">
        <img
          src={mainImage}
          alt={tour?.title || "Tour Image"}
          className="w-full h-[420px] object-cover rounded-r-2xl cursor-pointer"
          onClick={() => {
            setPhotoIndex(images.indexOf(mainImage));
            setTimeout(() => setIsOpen(true), 0);
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          Click to zoom
        </div>
      </div>

      {/* ✅ Safe Lightbox Rendering */}
      {typeof window !== "undefined" && isOpen && images.length > 0 && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={
            images[(photoIndex + images.length - 1) % images.length]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + images.length - 1) % images.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
          imageTitle={tour?.title || ""}
        />
      )}
    </div>
  );
};

export default TourGallery;
