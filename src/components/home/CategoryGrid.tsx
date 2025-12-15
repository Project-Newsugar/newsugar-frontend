import { FaRegStar, FaStar } from 'react-icons/fa';
import type { CATEGORIES, CategoryId, NewsCategoryKey } from '../../constants/CategoryData';

interface CategoryGridProps {
  categories: typeof CATEGORIES;
  onCategoryClick: (categoryKey: NewsCategoryKey) => void;
  favorites: CategoryId[];
  onToggleFavorite: (categoryId: CategoryId) => void;
}

export default function CategoryGrid({
  categories,
  onCategoryClick,
  favorites,
  onToggleFavorite,
}: CategoryGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.key)}
            className="px-8 py-4 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all text-lg font-medium flex items-center justify-center gap-2 relative"
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(category.id);
              }}
              className="cursor-pointer text-xl hover:scale-110 transition-transform text-yellow-400"
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