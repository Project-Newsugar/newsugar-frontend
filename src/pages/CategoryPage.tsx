import { useEffect, useState } from 'react';
import { CATEGORY_SUMMARIES, NEWS_DATA } from '../constants/CategoryData';
import type { CategoryType, NewsItem } from '../types/news';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryName } from '../utils/getCategorySlug';

const CategoryPage = () => {
  const { categoryName: categorySlug } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();

  const initialCategory = getCategoryName(categorySlug || 'economy') as CategoryType;

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    initialCategory || '경제'
  );

  useEffect(() => {
    if (categorySlug) {
      const converted = getCategoryName(categorySlug) as CategoryType;
      if (converted) setSelectedCategory(converted);
    }
  }, [categorySlug]);

  const currentNews: NewsItem[] = NEWS_DATA.filter(
    (news) => news.tags === selectedCategory
  );

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
              {CATEGORY_SUMMARIES[selectedCategory]}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">관련 뉴스</h3>
          <div className="space-y-4">
            {currentNews.length > 0 ? (
              currentNews.map((news : NewsItem) => (
                <article
                  key={news.id}
                  className="bg-white border border-gray-200 rounded p-6 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {news.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {news.content}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{news.date}</span>
                    <span>·</span>
                    <span>{news.source}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded p-12 text-center">
                <p className="text-gray-500">해당 카테고리의 뉴스가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CategoryPage;