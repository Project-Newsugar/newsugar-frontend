// 한글 카테고리명 -> 영문
export const categorySlugMap = {
  '정치': 'politics',
  '경제': 'economy',
  '사회': 'society',
  '문화': 'culture',
  '과학/기술': 'tech',
  '해외': 'world',
  '엔터테인먼트': 'entertainment',
  '오피니언': 'opinion',
} as const;

// 영문 -> 한글 카테고리명
export const categoryNameMap = {
  "politics": "정치",
  "economy": "경제",
  "society": "사회",
  "culture": "문화",
  "world": "해외",
  "tech": "과학/기술",
  "entertainment": "엔터테인먼트",
  "opinion": "오피니언",
} as const;

// 카테고리명 변환
export function getCategorySlug(categoryName: string): string {
  return categorySlugMap[categoryName as keyof typeof categorySlugMap] || categoryName;
}

// slug 변환
export function getCategoryName(slug: string): string {
  return categoryNameMap[slug as keyof typeof categoryNameMap] || slug;
}