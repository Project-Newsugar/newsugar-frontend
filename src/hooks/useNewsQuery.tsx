import { useQuery } from "@tanstack/react-query";

import {
  getCategoryNewsSummary,
  getMainSummary,
  getNewsByCategory,
} from "../api/news";
import type { NewsItem } from "../types/news";

const normalizeCategory = (category: string | string[] | null) => {
  if (!category) return null;
  if (Array.isArray(category)) {
    if (category.length === 0) return null;
    return [...category].sort().join(",");
  }
  return category;
};

export const useNewsByCategory = (category: string | string[] | null) => {
  const normalizedCategory = normalizeCategory(category);

  return useQuery<NewsItem[]>({
    queryKey: ["news", "category", normalizedCategory ?? "all"],
    queryFn: () => getNewsByCategory(normalizedCategory),
    enabled: true,
    staleTime: 0,
  });
};

export const useCategoryNewsSummary = (category: string) => {
  return useQuery<string>({
    queryKey: ["categorySummary", category],
    queryFn: async () => {
      const summary = await getCategoryNewsSummary(category);
      return summary;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: true,
  });
};

export const useMainSummary = () => {
  return useQuery<string>({
    queryKey: ["mainSummary"],
    queryFn: async () => {
      const summary = await getMainSummary();
      return summary;
    },
    staleTime: 0,
    enabled: true,
  });
};
