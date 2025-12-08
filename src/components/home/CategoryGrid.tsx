interface CategoryGridProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

export default function CategoryGrid({
  categories,
  onCategoryClick,
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
            className="px-8 py-4 rounded-full border bg-white text-gray-700 border-gray-200 hover:border-gray-300 transition-all text-lg font-medium"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
