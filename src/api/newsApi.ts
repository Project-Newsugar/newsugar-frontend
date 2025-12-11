import type {
  News,
  NewsListResponse,
  CreateNewsRequest,
  CreateNewsResponse,
  NewsExistsResponse,
  CategoryType,
} from "../types/news";
import type {
  Quiz,
  CreateQuizRequest,
  CreateQuizResponse,
  GetQuizResponse,
  SubmitQuizAnswerRequest,
  SubmitQuizAnswerResponse,
} from "../types/quiz";
import { axiosInstance } from "./axios";

export const newsApi = {
  // 1. 뉴스 전체 조회 (페이지네이션)
  getAllNews: async (
    page: number = 0,
    size: number = 20
  ): Promise<NewsListResponse> => {
    const { data } = await axiosInstance.get<NewsListResponse>("/v1/news", {
      params: { page, size },
    });
    return data;
  },

  // 2. 카테고리별 뉴스 조회
  getNewsByCategory: async (category: CategoryType): Promise<News[]> => {
    const { data } = await axiosInstance.get<News[]>(
      `/v1/news/category/${category}`
    );
    return data;
  },

  // 3. 단일 뉴스 조회
  getNewsById: async (newsId: number): Promise<News> => {
    const { data } = await axiosInstance.get<News>(`/v1/news/${newsId}`);
    return data;
  },

  // 4. 뉴스 저장 (크롤러/배치 서버용)
  createNews: async (
    newsData: CreateNewsRequest
  ): Promise<CreateNewsResponse> => {
    const { data } = await axiosInstance.post<CreateNewsResponse>(
      "/v1/news",
      newsData
    );
    return data;
  },

  // 5. 중복 URL 여부 확인
  checkNewsExists: async (url: string): Promise<NewsExistsResponse> => {
    const { data } = await axiosInstance.get<NewsExistsResponse>(
      "/v1/news/exists",
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
      "/v1/quizzes",
      quizData
    );
    return data;
  },

  // 7. 퀴즈 조회 (GetQuizResponse를 Quiz 타입으로 변환)
  getQuizById: async (quizId: number): Promise<Quiz> => {
    const { data } = await axiosInstance.get<GetQuizResponse>(
      `/v1/quizzes/${quizId}`
    );

    // GetQuizResponse를 기존 Quiz 타입으로 변환
    return {
      id: data.data.id,
      question: data.data.question,
      options: ["1", "2", "3", "4"], // TODO: 백엔드에서 options 제공 필요
      correctAnswer: data.data.correct_answer,
      explanation: "퀴즈 해설입니다.", // TODO: 백엔드에서 explanation 제공 필요
    };
  },

  // 8. 퀴즈 답안 제출
  submitQuizAnswer: async (
    answerData: SubmitQuizAnswerRequest
  ): Promise<SubmitQuizAnswerResponse> => {
    const { data } = await axiosInstance.post<SubmitQuizAnswerResponse>(
      "/v1/quiz-answers",
      answerData
    );
    return data;
  },
};
