import type {
  NewsSummary,
  Quiz,
  QuizSubmission,
  QuizResult,
} from "../types/news";
import { axiosInstance } from "./axios";

const MOCK_NEWS_SUMMARY: NewsSummary = {
  summary:
    "여기에 백엔드에서 받아온 주요 뉴스 요약 내용이 표시됩니다. 오늘의 가장 중요한 뉴스들을 한눈에 파악할 수 있도록 핵심 내용을 간결하게 정리하여 제공합니다. 정치, 경제, 사회, 문화 등 다양한 분야의 주요 이슈들을 빠르게 확인하세요.",
  date: new Date().toISOString(),
};

const MOCK_QUIZ: Quiz = {
  id: 1,
  question: "오늘의 주요 뉴스를 요약한 서비스의 이름은 무엇일까요?",
  options: ["뉴슈가", "뉴스톡", "데일리뉴스", "뉴스요약"],
  correctAnswer: "뉴슈가",
  explanation:
    '뉴슈가(NewSugar)는 "당신의 뉴스를 더 달콤하게"라는 슬로건으로 주요 뉴스를 간결하게 요약하여 제공하는 서비스입니다. 바쁜 현대인들이 핵심 뉴스를 빠르게 파악할 수 있도록 돕습니다.',
};

export const newsApi = {
  getNewsSummary: async (): Promise<NewsSummary> => {
    try {
      const { data } = await axiosInstance.get<NewsSummary>("/news/summary");
      return data;
    } catch (error) {
      console.warn("Failed to fetch news summary, using mock data:", error);
      return MOCK_NEWS_SUMMARY;
    }
  },

  getNewsByCategory: async (category: string): Promise<NewsSummary> => {
    try {
      const { data } = await axiosInstance.get<NewsSummary>(
        `/news/category/${category}`
      );
      return data;
    } catch (error) {
      console.warn(
        `Failed to fetch news for category ${category}, using mock data:`,
        error
      );
      return {
        summary: `${category} 카테고리의 뉴스 요약 내용입니다.`,
        date: new Date().toISOString(),
      };
    }
  },

  getTodayQuiz: async (): Promise<Quiz> => {
    try {
      const { data } = await axiosInstance.get<Quiz>("/quiz/today");
      return data;
    } catch (error) {
      console.warn("Failed to fetch today's quiz, using mock data:", error);
      return MOCK_QUIZ;
    }
  },

  submitQuizAnswer: async (submission: QuizSubmission): Promise<QuizResult> => {
    try {
      const { data } = await axiosInstance.post<QuizResult>(
        "/quiz/submit",
        submission
      );
      return data;
    } catch (error) {
      console.warn(
        "Failed to submit quiz answer, using mock validation:",
        error
      );
      const isCorrect = submission.userAnswer === MOCK_QUIZ.correctAnswer;
      return {
        isCorrect,
        correctAnswer: MOCK_QUIZ.correctAnswer,
        explanation: MOCK_QUIZ.explanation,
      };
    }
  },
};
