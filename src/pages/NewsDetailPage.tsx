import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NEWS_DATA } from "../constants/CategoryData";
import type { LocalNewsItem } from "../types/news";
import Modal from "../components/Modal";

const NewsDetailPage = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();

  const news: LocalNewsItem | undefined = NEWS_DATA.find(
    (item) => item.id === Number(newsId)
  );

  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    if (showSummaryModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSummaryModal]);

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            뉴스를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8 relative">
        {/* 상단 버튼 영역 */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 text-sm hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← 목록으로 돌아가기
          </button>
          {news.summary && (
            <button
              onClick={() => setShowSummaryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              요약 보기
            </button>
          )}
        </div>

        {/* 뉴스 본문 */}
        <article className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <header className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{news.date}</span>
              <span>·</span>
              <span>{news.source}</span>
              {news.author && (
                <>
                  <span>·</span>
                  <span>{news.author}</span>
                </>
              )}
            </div>
          </header>

          {news.imageUrl && (
            <div className="mb-8">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                {news.imageUrl}
              </p>
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>

          {news.tags && (
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                #{news.tags}
              </span>
            </div>
          )}

          {news.originalUrl && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <a
                href={news.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2"
              >
                원문 기사 보기 →
              </a>
            </div>
          )}
        </article>
        {/* 요약 모달 */}
        <Modal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          title="뉴스 요약"
          content={news.summary || "요약 내용이 없습니다."}
          type="alert"
        />
      </main>
    </div>
  );
};

export default NewsDetailPage;
