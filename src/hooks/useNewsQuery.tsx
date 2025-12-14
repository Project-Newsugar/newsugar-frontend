import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { SubmitQuizAnswerRequest } from "../types/quiz";
import { getNewsByCategory } from '../api/news';
import type { NewsItem } from '../types/news';
import { generateQuiz, getAllQuizzes, getQuizById, getQuizResult, submitQuizAnswer } from '../api/quiz';


export const useNewsByCategory = (category: string | null) => {
  return useQuery<NewsItem[]>({
    queryKey: ["news", "category", category ?? "all"],
    queryFn: () => getNewsByCategory(category),       
    enabled: true,                                 
    staleTime: 5 * 60 * 1000,                      
  });
};
