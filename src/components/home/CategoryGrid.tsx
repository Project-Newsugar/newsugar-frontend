import { FaRegStar, FaStar } from "react-icons/fa";
import type { UserCategory } from "../../types/category";

interface CategoryGridProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
  favorites: UserCategory[];
  onToggleFavorite: (category: string) => void;
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
      {/* 카테고리 버튼 클릭시 해당 카테고리 상세 페이지로 이동 (아직 페이지 미구현) */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className="px-8 py-4 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-lg font-medium flex items-center justify-center gap-2 relative"
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(category);
              }}
              className="cursor-pointer text-xl hover:scale-110 transition-transform text-yellow-400"
            >
              {favorites.some(fav => fav.name === category) ? <FaStar /> : <FaRegStar />}
            </span>
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
