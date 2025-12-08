// 한글 카테고리명 -> 영문
export const categorySlugMap = {
  '정치': 'politics',
  '경제': 'economy',
  '과학/기술': 'science-tech',
  '스포츠': 'sports',
  '문화': 'culture',
  '국제': 'international',
} as const;

// 영문 -> 한글 카테고리명
export const categoryNameMap = {
  'politics': '정치',
  'economy': '경제',
  'science-tech': '과학/기술',
  'sports': '스포츠',
  'culture': '문화',
  'international': '국제',
} as const;

// 카테고리명 변환
export function getCategorySlug(categoryName: string): string {
  return categorySlugMap[categoryName as keyof typeof categorySlugMap] || categoryName;
}

// slug 변환
export function getCategoryName(slug: string): string {
  return categoryNameMap[slug as keyof typeof categoryNameMap] || slug;
}