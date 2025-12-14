import { useQuery } from "@tanstack/react-query";

import { getNewsByCategory } from '../api/news';
import type { NewsItem } from '../types/news';

const normalizeCategory = (category: string | string[] | null) => {
  if (!category) return null;
  if (Array.isArray(category)) {
    if (category.length === 0) return null;
    return [...category].sort().join(",");
  }
  return category;
};

export const useNewsByCategory = (
  category: string | string[] | null
) => {
  const normalizedCategory = normalizeCategory(category);

  return useQuery<NewsItem[]>({
    queryKey: ["news", "category", normalizedCategory ?? "all"],
    queryFn: () => getNewsByCategory(normalizedCategory),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};