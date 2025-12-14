import { useEffect, useRef, useState } from "react";
import type { NewsItem } from "../../types/news";

interface NewsModalProps {
  news: NewsItem;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_LINES = 5; // 기본 보여줄 줄 수
const LINE_HEIGHT = 24; // px, Tailwind text-base 기준 line-height

const NewsModal: React.FC<NewsModalProps> = ({ news, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialMaxHeight, setInitialMaxHeight] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 요약 길이에 따라 펼치기 버튼 여부와 기본 높이 결정
  useEffect(() => {
    if (summaryRef.current) {
      const el = summaryRef.current;
      const fullHeight = el.scrollHeight; // 전체 높이
      const defaultHeight = LINE_HEIGHT * MAX_LINES; // 기본 보여줄 높이
      setInitialMaxHeight(Math.max(fullHeight, defaultHeight));
    }
    setIsExpanded(false); // 새 뉴스 열릴 때 초기화
  }, [news.summary, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 + 반투명 */}
      <div
        className="absolute inset-0 bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 z-10">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 제목과 요약 배지 */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-3">
            {news.title}
          </h3>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            요약
          </span>
        </div>

        {/* 요약 내용 */}
        <div
          ref={summaryRef}
          className="text-gray-700 mb-2 whitespace-pre-wrap leading-relaxed border-l-4 border-blue-500 rounded p-2 bg-blue-50 transition-max-height duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: isExpanded ? "none" : initialMaxHeight,
          }}
        >
          {news.summary}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.open(news.content_url, "_blank")}
          >
            기사로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;