import type {
  News,
  NewsListResponse,
  CreateNewsRequest,
  CreateNewsResponse,
  NewsExistsResponse,
  CategoryType,
} from "../types/news";
import type {
  GenerateQuizResponse,
  GetAllQuizzesResponse,
  GetQuizResponse,
  GetQuizResultResponse,
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
      // API 성공했지만 데이터가 없는 경우 Mock 데이터 사용
      if (!data || !data.content || data.content.length === 0) {
        console.warn("API 응답 데이터가 비어있음, Mock 데이터 사용");
        return MOCK_NEWS_LIST;
      }
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
      // API 성공했지만 데이터가 없는 경우 Mock 데이터 사용
      if (!data || data.length === 0) {
        console.warn("API 응답 데이터가 비어있음, Mock 데이터 사용");
        return MOCK_NEWS_LIST.content.filter(
          (news) => news.category === category
        );
      }
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

  // 6. 퀴즈 전체 조회
  getAllQuizzes: async (params?: {
    scope?: "period";
    from?: string;
    to?: string;
  }): Promise<GetAllQuizzesResponse> => {
    try {
      const { data } = await axiosInstance.get<GetAllQuizzesResponse>(
        "/api/v1/quizzes",
        { params }
      );
      // API 성공했지만 데이터가 없는 경우 Mock 데이터 사용
      if (!data || !data.data || data.data.length === 0) {
        console.warn("API 응답 데이터가 비어있음, Mock 데이터 사용");
        return {
          success: true,
          code: "200",
          message: "퀴즈 목록 조회 성공",
          data: Object.values(MOCK_QUIZZES).map((quiz) => quiz.data),
          timestamp: new Date().toISOString(),
        };
      }
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);
      return {
        success: true,
        code: "200",
        message: "퀴즈 목록 조회 성공",
        data: Object.values(MOCK_QUIZZES).map((quiz) => quiz.data),
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 7. 단일 퀴즈 조회
  getQuizById: async (id: number): Promise<GetQuizResponse> => {
    try {
      const { data } = await axiosInstance.get<GetQuizResponse>(
        `/api/v1/quizzes/${id}`
      );
      // API 성공했지만 데이터가 없거나 유효하지 않은 경우 Mock 데이터 사용
      if (
        !data ||
        !data.data ||
        !data.data.questions ||
        data.data.questions.length === 0
      ) {
        console.warn(`퀴즈 ID ${id} 데이터가 비어있음, Mock 데이터 사용`);
        return MOCK_QUIZZES[id] || MOCK_QUIZZES[1];
      }
      return data;
    } catch (error) {
      console.warn(`퀴즈 ID ${id} API 호출 실패, Mock 데이터 사용:`, error);
      return MOCK_QUIZZES[id] || MOCK_QUIZZES[1];
    }
  },

  // 8. 퀴즈 결과 조회 (사용자의 전체 퀴즈 통계 조회)
  getQuizResult: async (id: number): Promise<GetQuizResultResponse> => {
    try {
      const { data } = await axiosInstance.get<GetQuizResultResponse>(
        `/api/v1/quizzes/${id}/result`
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 데이터 사용:", error);

      // Mock: 기본값 반환
      const results = JSON.parse(localStorage.getItem("quiz_results") || "[]");

      return {
        success: true,
        code: "200",
        message: "퀴즈 결과 조회 성공",
        data: {
          total: 0,
          correct: 0,
          results: results,
          userId: 1,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 9. 퀴즈 답안 제출
  submitQuizAnswer: async (
    id: number,
    answerData: SubmitQuizAnswerRequest
  ): Promise<SubmitQuizAnswerResponse> => {
    try {
      const { data } = await axiosInstance.post<SubmitQuizAnswerResponse>(
        `/api/v1/quizzes/${id}/submit`,
        answerData
      );
      return data;
    } catch (error) {
      console.warn("API 호출 실패, Mock 답안 검증 사용:", error);
      const quiz = MOCK_QUIZZES[id] || MOCK_QUIZZES[1];

      // 현재 퀴즈의 정답 여부 계산 (각 문제별)
      const currentResults = answerData.answers.map(
        (answer, index) => answer === quiz.data.questions[index]?.correctIndex
      );
      const currentCorrectCount = currentResults.filter(Boolean).length;

      // Mock: 현재 퀴즈 결과만 반환
      return {
        success: true,
        code: "200",
        message: "퀴즈 제출 성공",
        data: {
          total: answerData.answers.length,
          correct: currentCorrectCount,
          results: currentResults, // 현재 퀴즈의 각 문제별 정답 여부
          userId: answerData.userId,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 10. 퀴즈 생성 (summaryId 기반)
  generateQuiz: async (summaryId: number): Promise<GenerateQuizResponse> => {
    const { data } = await axiosInstance.post<GenerateQuizResponse>(
      `/api/v1/quizzes/summary/${summaryId}/generate`
    );
    return data;
  },
};
