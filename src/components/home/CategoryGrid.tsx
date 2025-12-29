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
      {!isCompact && <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리</h2>}
      <div className={isCompact ? "flex flex-wrap gap-2" : "grid grid-cols-3 gap-4"}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.key)}
            className={
              isCompact
                ? "px-4 py-2 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium flex items-center gap-1.5"
                : "px-8 py-4 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all text-lg font-medium flex items-center justify-center gap-2 relative"
            }
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(category.id);
              }}
              className={
                isCompact
                  ? "cursor-pointer text-base hover:scale-110 transition-transform text-yellow-400"
                  : "cursor-pointer text-xl hover:scale-110 transition-transform text-yellow-400"
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