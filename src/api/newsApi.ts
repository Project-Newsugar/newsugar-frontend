import type {
  GenerateQuizResponse,
  GetAllQuizzesResponse,
  GetQuizResponse,
  GetQuizResultResponse,
  SubmitQuizAnswerRequest,
  SubmitQuizAnswerResponse,
} from "../types/quiz";
import { axiosInstance } from "./axios";

export const newsApi = {


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
      return data;
    } catch (error) {
      console.warn("API 호출 실패 :", error);
      throw error;
    }
  },

  // 7. 단일 퀴즈 조회
  getQuizById: async (id: number): Promise<GetQuizResponse> => {
    try {
      const { data } = await axiosInstance.get<GetQuizResponse>(
        `/api/v1/quizzes/${id}`
      );
      return data;
    } catch (error) {
      console.warn(`퀴즈 ID ${id} API 호출 실패 :`, error);
      throw error;
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
      console.warn("API 호출 실패 :", error);
      throw error;
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
      console.warn("API 호출 실패 :", error);
      throw error;
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
