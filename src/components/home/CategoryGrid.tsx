import { FaRegStar, FaStar } from 'react-icons/fa';
import type { CATEGORIES, CategoryId, NewsCategoryKey } from '../../constants/CategoryData';

interface CategoryGridProps {
  categories: typeof CATEGORIES;
  onCategoryClick: (categoryKey: NewsCategoryKey) => void;
  favorites: CategoryId[];
  onToggleFavorite: (categoryId: CategoryId) => void;
  variant?: 'default' | 'compact';
}

export default function CategoryGrid({
  categories,
  onCategoryClick,
  favorites,
  onToggleFavorite,
  variant = 'default',
}: CategoryGridProps) {
  const isCompact = variant === 'compact';

  return (
    <div>
      {!isCompact && <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">카테고리</h2>}
      <div className={isCompact ? "flex flex-wrap gap-2" : "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.key)}
            className={
              isCompact
                ? "px-3 sm:px-4 py-2 min-h-[44px] rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium flex items-center gap-1.5"
                : "px-4 sm:px-6 md:px-8 py-3 sm:py-4 min-h-[48px] rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all text-base sm:text-lg font-medium flex items-center justify-center gap-2 relative"
            }
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(category.id);
              }}
              className={
                isCompact
                  ? "cursor-pointer text-sm sm:text-base hover:scale-110 transition-transform text-yellow-400 min-w-[20px] min-h-[20px] flex items-center justify-center"
                  : "cursor-pointer text-lg sm:text-xl hover:scale-110 transition-transform text-yellow-400 min-w-[24px] min-h-[24px] flex items-center justify-center"
              }
            >
              {favorites.includes(category.id) ? <FaStar /> : <FaRegStar />}
            </span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}