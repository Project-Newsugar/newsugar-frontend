import type {
  News,
  NewsListResponse,
  CreateNewsRequest,
  CreateNewsResponse,
  NewsExistsResponse,
  CategoryType,
} from "../types/news";
import type {
  CreateQuizRequest,
  CreateQuizResponse,
  GetQuizResponse,
  SubmitQuizAnswerRequest,
  SubmitQuizAnswerResponse,
} from "../types/quiz";
import { axiosInstance } from "./axios";
import { MOCK_NEWS_LIST, MOCK_QUIZZES } from "./mockData";

export const newsApi = {
  // 1. 뉴스 전체 조회 (페이지네이션)
  getAllNews: async (
    page: number = 0,
    size: number = 20
  ): Promise<NewsListResponse> => {
    try {
      const { data } = await axiosInstance.get<NewsListResponse>(
        "/api/v1/news",
        {
          params: { page, size },
        }
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);
      return MOCK_NEWS_LIST;
    }
  },

  // 2. 카테고리별 뉴스 조회
  getNewsByCategory: async (category: CategoryType): Promise<News[]> => {
    try {
      const { data } = await axiosInstance.get<News[]>(
        `/api/v1/news/category/${category}`
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);
      // 카테고리에 맞는 뉴스만 필터링
      return MOCK_NEWS_LIST.content.filter(
        (news) => news.category === category
      );
    }
  },

  // 3. 단일 뉴스 조회
  getNewsById: async (newsId: number): Promise<News> => {
    try {
      const { data } = await axiosInstance.get<News>(`/api/v1/news/${newsId}`);
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);
      const mockNews = MOCK_NEWS_LIST.content.find(
        (news) => news.id === newsId
      );
      if (!mockNews) {
        throw new Error(`뉴스 ID ${newsId}를 찾을 수 없습니다.`);
      }
      return mockNews;
    }
  },

  // 4. 뉴스 저장 (크롤러/배치 서버용)
  createNews: async (
    newsData: CreateNewsRequest
  ): Promise<CreateNewsResponse> => {
    const { data } = await axiosInstance.post<CreateNewsResponse>(
      "/api/v1/news",
      newsData
    );
    return data;
  },

  // 5. 중복 URL 여부 확인
  checkNewsExists: async (url: string): Promise<NewsExistsResponse> => {
    const { data } = await axiosInstance.get<NewsExistsResponse>(
      "/api/v1/news/exists",
      {
        params: { url },
      }
    );
    return data;
  },

  // ========== 퀴즈 API (API 명세 기준) ==========

  // 6. 퀴즈 생성
  createQuiz: async (
    quizData: CreateQuizRequest
  ): Promise<CreateQuizResponse> => {
    const { data } = await axiosInstance.post<CreateQuizResponse>(
      "/api/v1/quizzes",
      quizData
    );
    return data;
  },

  // 7. 퀴즈 조회
  getQuizById: async (quizId: number): Promise<GetQuizResponse> => {
    try {
      const { data } = await axiosInstance.get<GetQuizResponse>(
        `/api/v1/quizzes/${quizId}`
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);
      return MOCK_QUIZZES[quizId] || MOCK_QUIZZES[1];
    }
  },

  // 8. 퀴즈 답안 제출
  submitQuizAnswer: async (
    answerData: SubmitQuizAnswerRequest
  ): Promise<SubmitQuizAnswerResponse> => {
    try {
      const { data } = await axiosInstance.post<SubmitQuizAnswerResponse>(
        "/api/v1/quiz-answers",
        answerData
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 답안 검증 사용:", error);
      // Mock 퀴즈에서 정답 확인
      const quiz = MOCK_QUIZZES[answerData.quiz_id] || MOCK_QUIZZES[1];
      const isCorrect =
        answerData.user_answer.toString() === quiz.data.correct_answer;

      return {
        code: 200,
        message: isCorrect ? "정답입니다!" : "오답입니다.",
        data: {
          id: Date.now(),
          quiz_id: answerData.quiz_id,
          user_id: answerData.user_id,
          user_answer: answerData.user_answer,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        },
      };
    }
  },
};
