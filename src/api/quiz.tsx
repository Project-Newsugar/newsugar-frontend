import type {
  GenerateQuizResponse,
  GetAllQuizzesResponse,
  GetQuizResponse,
  GetQuizResultResponse,
  GetQuizStatsResponse,
  SubmitQuizAnswerRequest,
  SubmitQuizAnswerResponse,
} from "../types/quiz";
import { axiosInstance } from "./axios";

// ========== 퀴즈 API ==========

export const getAllQuizzes = async (params?: {
  scope?: "period";
  from?: string;
  to?: string;
}): Promise<GetAllQuizzesResponse> => {
  const { data } = await axiosInstance.get<GetAllQuizzesResponse>(
    "/api/v1/quizzes",
    { params }
  );
  return data;
};

export const getQuizById = async (id: number): Promise<GetQuizResponse> => {
  const { data } = await axiosInstance.get<GetQuizResponse>(
    `/api/v1/quizzes/${id}`
  );
  return data;
};

export const getQuizResult = async (id: number): Promise<GetQuizResultResponse> => {
  const { data } = await axiosInstance.get<GetQuizResultResponse>(
    `/api/v1/quizzes/${id}/result`
  );
  return data;
};

export const submitQuizAnswer = async (
  id: number,
  answerData: SubmitQuizAnswerRequest
): Promise<SubmitQuizAnswerResponse> => {
  const { data } = await axiosInstance.post<SubmitQuizAnswerResponse>(
    `/api/v1/quizzes/${id}/submit`,
    answerData
  );
  return data;
};

export const generateQuiz = async (summaryId: number): Promise<GenerateQuizResponse> => {
  const { data } = await axiosInstance.post<GenerateQuizResponse>(
    `/api/v1/quizzes/summary/${summaryId}/generate`
  );
  return data;
};

export const getQuizStats = async (): Promise<GetQuizStatsResponse> => {
  const { data } = await axiosInstance.get<GetQuizStatsResponse>(
    "/api/v1/quizzes/stats"
  );
  return data;
};