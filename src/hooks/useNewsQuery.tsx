import { useQuery } from "@tanstack/react-query";

import { getNewsByCategory } from '../api/news';
import type { NewsItem } from '../types/news';


export const useNewsByCategory = (category: string | null) => {
  return useQuery<NewsItem[]>({
    queryKey: ["news", "category", category ?? "all"],
    queryFn: () => getNewsByCategory(category),       
    enabled: true,                                 
    staleTime: 5 * 60 * 1000,                      
  });
};
