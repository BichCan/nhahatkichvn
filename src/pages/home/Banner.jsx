import { useState, useEffect } from "react";
import bannerImages from "../../data/BannerData.js";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [resetKey]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
    setResetKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrent((prev) =>
      (prev - 1 + bannerImages.length) % bannerImages.length
    );
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="relative w-full sm:h-fit overflow-hidden">
      <img
        src={bannerImages[current].src}
        alt={bannerImages[current].alt}
        className=" w-full h-56 sm:w-full sm:h-[490px]  overflow-hidden object-cover"
      />

      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 text-black px-2 py-2 rounded-md hover:bg-opacity-75" onClick={handlePrev}><IoIosArrowBack /></button>
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 text-black px-2 py-2 rounded-md hover:bg-opacity-75" onClick={handleNext}><IoIosArrowForward /></button>
    </div>
  );
}