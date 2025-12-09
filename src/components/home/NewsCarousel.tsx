import { useState, useEffect } from "react";
import { NEWS_DATA, CATEGORIES } from "../../constants/CategoryData";
import type { NewsItem, CategoryType } from "../../types/news";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);
  const [clickedButton, setClickedButton] = useState<"prev" | "next" | null>(
    null
  );
  const navigate = useNavigate();

  const categorizedNews = CATEGORIES.reduce((acc, category) => {
    const categoryNews = NEWS_DATA.filter((news) => news.tags === category);
    if (categoryNews.length > 0) {
      acc.push(categoryNews[0]);
    }
    return acc;
  }, [] as NewsItem[]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categorizedNews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categorizedNews.length, resetTimer]);

  const currentNews = categorizedNews[currentIndex];

  if (!currentNews) return null;

  const handleCardClick = () => {
    navigate(`/news/${currentNews.id}`);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickedButton("prev");
    setCurrentIndex((prev) =>
      prev === 0 ? categorizedNews.length - 1 : prev - 1
    );
    setResetTimer((prev) => prev + 1);
    setTimeout(() => setClickedButton(null), 300);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickedButton("next");
    setCurrentIndex((prev) => (prev + 1) % categorizedNews.length);
    setResetTimer((prev) => prev + 1);
    setTimeout(() => setClickedButton(null), 300);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-1 group">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        className={`
            absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg
            flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-all duration-300
            ${
              clickedButton === "prev"
                ? "bg-blue-50 text-blue-600"
                : "bg-white/90 hover:bg-blue-50 hover:text-blue-600 text-gray-700"
            }
          `}
        aria-label="이전 뉴스"
      >
        <FaChevronLeft />
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        className={`
            absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg
            flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-all duration-300
            ${
              clickedButton === "next"
                ? "bg-blue-50 text-blue-600"
                : "bg-white/90 hover:bg-blue-50 hover:text-blue-600 text-gray-700"
            }
          `}
        aria-label="다음 뉴스"
      >
        <FaChevronRight />
      </button>

      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* 이미지 영역 */}
          <div className="md:w-1/3 flex-shrink-0">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400 text-sm">이미지</span>
              </div>
            </div>
          </div>

          {/* 내용 영역 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {currentNews.tags}
                </span>
                <span className="text-gray-500 text-sm">
                  {currentNews.source}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                {currentNews.title}
              </h3>

              <p className="text-gray-600 text-base line-clamp-2 mb-4">
                {currentNews.summary}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">
                {currentNews.author}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(currentNews.date).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>

        {/* 진행 상황 인디케이터 */}
        <div className="flex gap-1.5 mt-6 justify-center">
          {categorizedNews.map((_, index) => (
            <div
              key={index}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-1.5 bg-gray-300"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
