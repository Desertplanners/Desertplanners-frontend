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

  const images =
    tour?.galleryImages?.map((img) =>
      img?.startsWith("http") ? img : `${baseURL}/${img}`
    ) || [];

  const [mainImage, setMainImage] = useState(images[0]);

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
      {/* ✅ Sidebar Thumbnails (equal size, full visible) */}
      <div className="flex md:flex-col gap-2 p-3 bg-white shadow-inner rounded-l-xl overflow-x-auto md:overflow-y-auto max-h-[420px] min-w-[100px]">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`w-20 h-20 rounded-lg flex items-center justify-center border-2 cursor-pointer transition-all duration-200 hover:scale-105 bg-gray-100 bg-center bg-no-repeat bg-contain ${
              mainImage === img
                ? "border-[#e82429] shadow-md scale-105"
                : "border-transparent"
            }`}
            style={{ backgroundImage: `url(${img})` }}
            onClick={() => {
              setMainImage(img);
              setPhotoIndex(idx);
            }}
          ></div>
        ))}
      </div>

      {/* ✅ Main Image (same size, full visible) */}
      <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
        <div
          className="w-full h-[420px] bg-center bg-no-repeat bg-contain rounded-r-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
          style={{ backgroundImage: `url(${mainImage})` }}
          onClick={() => {
            setPhotoIndex(images.indexOf(mainImage));
            setTimeout(() => setIsOpen(true), 0);
          }}
        ></div>
      </div>

      {/* ✅ Lightbox */}
      {typeof window !== "undefined" && isOpen && images.length > 0 && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
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
