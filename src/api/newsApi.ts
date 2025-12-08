import type { NewsSummary, Quiz, QuizSubmission, QuizResult } from '../types/news';
import { axiosInstance } from './axios';

export const newsApi = {
  getNewsSummary: async (): Promise<NewsSummary> => {
    const { data } = await axiosInstance.get<NewsSummary>('/news/summary');
    return data;
  },

  getNewsByCategory: async (category: string): Promise<NewsSummary> => {
    const { data } = await axiosInstance.get<NewsSummary>(`/news/category/${category}`);
    return data;
  },

  getTodayQuiz: async (): Promise<Quiz> => {
    const { data } = await axiosInstance.get<Quiz>('/quiz/today');
    return data;
  },

  submitQuizAnswer: async (
    submission: QuizSubmission
  ): Promise<QuizResult> => {
    const { data } = await axiosInstance.post<QuizResult>('/quiz/submit', submission);
    return data;
  },
};
