import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';
import type { QuizSubmission } from '../types/news';

export const useNewsSummary = () => {
  return useQuery({
    queryKey: ['newsSummary'],
    queryFn: newsApi.getNewsSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['news', 'category', category],
    queryFn: () => newsApi.getNewsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTodayQuiz = () => {
  return useQuery({
    queryKey: ['quiz', 'today'],
    queryFn: newsApi.getTodayQuiz,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubmitQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: QuizSubmission) =>
      newsApi.submitQuizAnswer(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', 'today'] });
    },
  });
};
