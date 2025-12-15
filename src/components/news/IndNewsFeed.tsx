import { useState } from "react";
import type { NewsItem } from "../../types/news";
import { getCategoryName } from "../../utils/getCategorySlug";
import NewsModal from './IndNewsModal';

interface IndNewsFeedProps {
  news: NewsItem;
  category?: string;
}

const IndNewsFeed: React.FC<IndNewsFeedProps> = ({ news, category }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryLabel = category ? getCategoryName(category) : null;

  return (
    <>
      <article
        className="bg-white border border-gray-200 rounded p-4 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex gap-4"
        onClick={() => setIsModalOpen(true)}
      >
        {news.image_url && (
          <img
            src={news.image_url}
            alt={news.title}
            className="w-24 h-24 object-cover rounded shrink-0"
          />
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {news.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-3">
              {news.summary}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{new Date(news.published_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{news.publisher}</span>
            {category && (
              <>
                <span>·</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                  {categoryLabel}
                </span>
              </>
            )}
          </div>
        </div>
      </article>

      <NewsModal
        news={news}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default IndNewsFeed;