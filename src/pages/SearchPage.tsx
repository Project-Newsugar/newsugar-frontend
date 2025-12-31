import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNewsByCategory } from "../api/news";
import IndNewsFeed from "../components/news/IndNewsFeed";
import IndNewsFeedSkeleton from "../components/news/IndNewsFeedSkeleton";
import type { NewsItem } from "../types/news";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  // 검색어가 변경되면 input 값도 업데이트
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // 전체 뉴스 조회 (검색어로 필터링)
  const { data: newsData, isLoading } = useQuery({
    queryKey: ["news", "search"],
    queryFn: async () => {
      // 전체 뉴스를 가져옴 (카테고리 null, 페이지 사이즈 100)
      return await getNewsByCategory(null, 1, 100);
    },
  });

  // 검색 결과 필터링 (클라이언트 사이드)
  const searchResults = newsData?.filter((news: NewsItem) => {
    if (!query) return true;
    const searchTerm = query.toLowerCase();
    return (
      news.title.toLowerCase().includes(searchTerm) ||
      news.summary.toLowerCase().includes(searchTerm) ||
      news.publisher.toLowerCase().includes(searchTerm)
    );
  }) || [];

  // 검색 제출 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* 검색 입력 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">뉴스 검색</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="뉴스 검색"
            className="w-full px-5 py-3 border border-gray-200 rounded-xl
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                     shadow-sm transition-all"
            autoFocus
          />
        </form>
      </div>

      {/* 검색 결과 헤더 */}
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            '<span className="text-blue-600">{query}</span>' 검색 결과
            {!isLoading && (
              <span className="ml-2 text-gray-500 font-normal">
                ({searchResults.length}개)
              </span>
            )}
          </h2>
        </div>
      )}

      {/* 검색 결과 리스트 */}
      <div className="space-y-4">
        {isLoading ? (
          // 로딩 중
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <IndNewsFeedSkeleton key={index} />
            ))}
          </>
        ) : searchResults.length > 0 ? (
          // 검색 결과 있음
          searchResults.map((news: NewsItem) => (
            <IndNewsFeed
              key={news.id}
              news={news}
              category={news.sections[0]}
            />
          ))
        ) : query ? (
          // 검색어는 있지만 결과 없음
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어로 다시 시도해보세요
            </p>
          </div>
        ) : (
          // 검색어 없음
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              검색어를 입력하세요
            </h3>
            <p className="text-gray-500">
              뉴스 제목, 내용, 언론사 등으로 검색할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
