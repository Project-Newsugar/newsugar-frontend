import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';
import type { SubmitQuizAnswerRequest } from '../types/quiz';
import type { CategoryType } from '../types/news';

// ========== 새로운 API (명세서 기준) ==========

// 1. 뉴스 전체 조회 (페이지네이션)
export const useAllNews = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['news', 'all', page, size],
    queryFn: () => newsApi.getAllNews(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 2. 카테고리별 뉴스 조회
export const useNewsByCategory = (category: CategoryType) => {
  return useQuery({
    queryKey: ['news', 'category', category],
    queryFn: () => newsApi.getNewsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 3. 단일 뉴스 조회
export const useNewsById = (newsId: number) => {
  return useQuery({
    queryKey: ['news', newsId],
    queryFn: () => newsApi.getNewsById(newsId),
    enabled: !!newsId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 4. 뉴스 저장 (크롤러/배치 서버용)
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newsApi.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

// 5. URL 중복 확인
export const useCheckNewsExists = (url: string) => {
  return useQuery({
    queryKey: ['news', 'exists', url],
    queryFn: () => newsApi.checkNewsExists(url),
    enabled: !!url,
  });
};

// 6. 퀴즈 조회 (Quiz 타입 반환)
export const useQuizById = (quizId: number) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => newsApi.getQuizById(quizId),
    enabled: !!quizId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 7. 퀴즈 생성
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newsApi.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
  });
};

// 8. 퀴즈 답안 제출 (새 API)
export const useSubmitQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerData: SubmitQuizAnswerRequest) =>
      newsApi.submitQuizAnswer(answerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
  });
};
