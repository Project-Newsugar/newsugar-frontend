import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryName } from "../utils/getCategorySlug";
import type { NewsItem } from '../types/news';
import IndNewsFeed from '../components/news/IndNewsFeed';
import { useCategoryNewsSummary, useNewsByCategory } from '../hooks/useNewsQuery';
import LoadingSpinner from '../components/LoadingSpanner';
import IndNewsFeedSkeleton from '../components/news/IndNewsFeedSkeleton';

const CategoryPage = () => {
  const { categoryName: categorySlug } = useParams<{ categoryName: string }>();

  const initialCategory = getCategoryName(categorySlug || "economy");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "경제"
  );

  useEffect(() => {
    if (categorySlug) {
      const converted = getCategoryName(categorySlug);
      if (converted) setSelectedCategory(converted);
    }
  }, [categorySlug]);


  const { data: currentNews, isLoading, error } = useNewsByCategory(categorySlug!);

  const {
  data: summary,
  refetch: refetchSummary,
  isFetching: isSummaryFetching
} = useCategoryNewsSummary(categorySlug!);

// 최초 fetch
useEffect(() => {
  refetchSummary();
}, [refetchSummary, categorySlug]);

// 정각마다 자동 refetch
useEffect(() => {
  const scheduleNextRefetch = () => {
    const now = new Date();
    const nextHour = new Date();
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const timeout = nextHour.getTime() - now.getTime();

    const timer = setTimeout(() => {
      refetchSummary();
      scheduleNextRefetch();
    }, timeout);

    return () => clearTimeout(timer);
  };

  const cleanup = scheduleNextRefetch();
  return cleanup;
}, [refetchSummary]);

const displayedSummary = useMemo(() => summary || "요약이 준비되는 중입니다...", [summary]);

  return (
    <div>
      <main className="max-w-6xl mx-auto px-6 py-8 min-h-screen">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedCategory}
          </h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                {selectedCategory} 뉴스 요약
              </h4>
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                <span>·</span>
                <span>요약</span>
              </div>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {isSummaryFetching ? <LoadingSpinner size={40} /> : <p>{displayedSummary}</p>}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">관련 뉴스</h3>
          <div className="space-y-4">
            {isLoading ? (
              // 뉴스 로딩 중일 때 스켈레톤 5개 렌더링
              <>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <IndNewsFeedSkeleton key={idx} />
                ))}
              </>
            ) : currentNews && currentNews.length > 0 ? (
              // 뉴스가 있을 때
              currentNews.map((news: NewsItem) => (
                <IndNewsFeed key={news.id} news={news} />
              ))
            ) : (
              // 뉴스가 없을 때
              <div className="bg-white border border-gray-200 rounded p-12 text-center">
                <p className="text-gray-500">
                  해당 카테고리의 뉴스가 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CategoryPage;
