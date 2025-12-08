import type { NewsSummary, Quiz, QuizSubmission, QuizResult } from '../types/news';

export const newsApi = {
  getNewsSummary: async (): Promise<NewsSummary> => {
    // TODO: Replace with actual API call
    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    // const response = await fetch(`${API_BASE_URL}/news/summary`);
    // if (!response.ok) throw new Error('Failed to fetch news summary');
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary:
            '여기에 백엔드에서 받아온 주요 뉴스 요약 내용이 표시됩니다. 오늘의 가장 중요한 뉴스들을 한눈에 파악할 수 있도록 핵심 내용을 간결하게 정리하여 제공합니다. 정치, 경제, 사회, 문화 등 다양한 분야의 주요 이슈들을 빠르게 확인하세요.',
          date: new Date().toISOString(),
        });
      }, 1000);
    });
  },

  getNewsByCategory: async (category: string): Promise<NewsSummary> => {
    // TODO: Replace with actual API call
    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    // const response = await fetch(`${API_BASE_URL}/news/category/${category}`);
    // if (!response.ok) throw new Error('Failed to fetch news by category');
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `${category} 카테고리의 뉴스 요약 내용입니다.`,
          date: new Date().toISOString(),
        });
      }, 1000);
    });
  },

  getTodayQuiz: async (): Promise<Quiz> => {
    // TODO: Replace with actual API call
    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    // const response = await fetch(`${API_BASE_URL}/quiz/today`);
    // if (!response.ok) throw new Error('Failed to fetch today's quiz');
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          question: '오늘의 주요 뉴스를 요약한 서비스의 이름은 무엇일까요?',
          correctAnswer: '뉴슈가',
          explanation:
            '뉴슈가(NewSugar)는 "당신의 뉴스를 더 달콤하게"라는 슬로건으로 주요 뉴스를 간결하게 요약하여 제공하는 서비스입니다. 바쁜 현대인들이 핵심 뉴스를 빠르게 파악할 수 있도록 돕습니다.',
        });
      }, 1000);
    });
  },

  submitQuizAnswer: async (
    submission: QuizSubmission
  ): Promise<QuizResult> => {
    // TODO: Replace with actual API call
    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    // const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submission),
    // });
    // if (!response.ok) throw new Error('Failed to submit quiz answer');
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        const isCorrect = submission.userAnswer === '뉴슈가';
        resolve({
          isCorrect,
          correctAnswer: '뉴슈가',
          explanation:
            '뉴슈가(NewSugar)는 "당신의 뉴스를 더 달콤하게"라는 슬로건으로 주요 뉴스를 간결하게 요약하여 제공하는 서비스입니다. 바쁜 현대인들이 핵심 뉴스를 빠르게 파악할 수 있도록 돕습니다.',
        });
      }, 500);
    });
  },
};
