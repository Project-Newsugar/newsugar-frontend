export const CATEGORIES = [
  { id: 1, key: "politics", label: "정치" },
  { id: 2, key: "economy", label: "경제" },
  { id: 3, key: "society", label: "사회" },
  { id: 4, key: "culture", label: "문화" },
  { id: 5, key: "world", label: "해외" },
  { id: 6, key: "tech", label: "과학/기술" },
  { id: 7, key: "entertainment", label: "엔터테인먼트" },
  { id: 8, key: "opinion", label: "오피니언" },
] as const;

export type NewsCategoryKey = typeof CATEGORIES[number]["key"];
export type NewsCategoryLabel = typeof CATEGORIES[number]["label"];
export type CategoryId = typeof CATEGORIES[number]["id"];