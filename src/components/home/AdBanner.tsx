import { useState, useEffect } from "react";

const adImages = [
  {
    id: 1,
    src: "/likelion_kor_logo_renew.svg",
    alt: "멋쟁이사자처럼",
    link: "https://www.likelion.net/",
  },
  {
    id: 2,
    src: "/likelion-bootcamp.svg",
    alt: "멋쟁이사자처럼 부트캠프",
    link: "https://bootcamp.likelion.net/",
  },
];

export default function AdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % adImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getPrevIndex = (index: number) =>
    (index - 1 + adImages.length) % adImages.length;
  const getNextIndex = (index: number) => (index + 1) % adImages.length;

  return (
    <section className="relative w-full py-4 overflow-hidden">
      <div className="relative h-16 flex items-center justify-center">
        {/* 이전 광고 (왼쪽 30%) */}
        <div
          className={`absolute left-0 h-full flex items-center transition-all duration-500 ${
            isTransitioning ? "opacity-0 -translate-x-8" : "opacity-30"
          }`}
          style={{ transform: "translateX(-70%)" }}
        >
          <a
            href={adImages[getPrevIndex(currentIndex)].link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full flex items-center pointer-events-none"
          >
            <img
              src={adImages[getPrevIndex(currentIndex)].src}
              alt={adImages[getPrevIndex(currentIndex)].alt}
              className="h-10 w-auto object-contain"
            />
          </a>
        </div>

        {/* 현재 광고 (중앙) */}
        <div
          className={`relative z-10 transition-all duration-500 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <a
            href={adImages[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-sm hover:shadow-sm transition-shadow px-6 py-3 border border-gray-100"
          >
            <img
              src={adImages[currentIndex].src}
              alt={adImages[currentIndex].alt}
              className="h-10 w-auto object-contain mx-auto"
            />
          </a>
        </div>

        {/* 다음 광고 (오른쪽 30%) */}
        <div
          className={`absolute right-0 h-full flex items-center transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-x-8" : "opacity-30"
          }`}
          style={{ transform: "translateX(70%)" }}
        >
          <a
            href={adImages[getNextIndex(currentIndex)].link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full flex items-center pointer-events-none"
          >
            <img
              src={adImages[getNextIndex(currentIndex)].src}
              alt={adImages[getNextIndex(currentIndex)].alt}
              className="h-10 w-auto object-contain"
            />
          </a>
        </div>
      </div>

      {/* 인디케이터 점 */}
      <div className="flex justify-center gap-2 mt-2">
        {adImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-gray-400 w-4"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`${index + 1}번 광고로 이동`}
          />
        ))}
      </div>
    </section>
  );
}
