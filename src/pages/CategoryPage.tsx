import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryName } from "../utils/getCategorySlug";
import type { NewsItem } from '../types/news';
import IndNewsFeed from '../components/news/IndNewsFeed';
import { useNewsByCategory } from '../hooks/useNewsQuery';

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

useEffect(() => {
  console.log("🔥 currentNews:", currentNews);
}, [currentNews]);

  if (isLoading) return <div>뉴스 로딩 중...</div>;
  if (error) return <div>뉴스를 불러올 수 없습니다.</div>;

  return (
    <div>
      <main className="max-w-6xl mx-auto px-6 py-8 min-h-screen">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedCategory}
          </h2>
          <div className="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
            <div className="flex gap-3 text-sm text-gray-500 mb-4">
              <span>2024.12.08</span>
              <span>·</span>
              <span>AI 요약</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {/* {CATEGORY_SUMMARIES[selectedCategory]} */}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">관련 뉴스</h3>
          <div className="space-y-4">
            {currentNews!.length > 0 ? (
              currentNews!.map((news: NewsItem) => (
                <IndNewsFeed key={news.id} news={news} />
              ))
            ) : (
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
