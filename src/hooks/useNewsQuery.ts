import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { SubmitQuizAnswerRequest } from "../types/quiz";
import { getNewsByCategory } from '../api/news';
import type { NewsItem } from '../types/news';
import { newsApi } from '../api/newsApi';


export const useNewsByCategory = (category: string | null) => {
  return useQuery<NewsItem[]>({
    queryKey: ["news", "category", category ?? "all"],
    queryFn: () => getNewsByCategory(category),       
    enabled: true,                                 
    staleTime: 5 * 60 * 1000,                      
  });
};


// 6. 퀴즈 전체 조회
export const useAllQuizzes = () => {
  return useQuery({
    queryKey: ["quiz", "all"],
    queryFn: () => newsApi.getAllQuizzes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 한국 시간대로 ISO-8601 형식 문자열 생성 (YYYY-MM-DDTHH:mm:ss+09:00)
const formatKST = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
};

// 6-1. 시간대별 퀴즈 조회 (06시, 12시, 18시, 24시)
// timeSlot: "06" | "12" | "18" | "24"
export const useQuizByTimeSlot = (timeSlot: string) => {
  return useQuery({
    queryKey: ["quiz", "timeSlot", timeSlot],
    queryFn: async () => {
      let from: Date;
      let to: Date;

      // 시간대에 따른 퀴즈 시간 범위 설정
      const getTimeRange = (slot: string) => {
        const today = new Date();
        const currentHour = today.getHours();

        switch (slot) {
          case "06":
            // 06:00 ~ 11:59
            // 현재 시각이 06:00 이전이면 전날 06시 퀴즈
            if (currentHour < 6) {
              return {
                from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 6, 0, 0),
                to: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 59, 59),
              };
            }
            return {
              from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0, 0),
              to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 59, 59),
            };

          case "12":
            // 12:00 ~ 17:59
            if (currentHour < 6) {
              return {
                from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12, 0, 0),
                to: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 17, 59, 59),
              };
            }
            return {
              from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
              to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 59, 59),
            };

          case "18":
            // 18:00 ~ 23:59
            if (currentHour < 6) {
              return {
                from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 18, 0, 0),
                to: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59),
              };
            }
            return {
              from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0),
              to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
            };

          case "24":
            // 00:00 ~ 05:59 (다음날 새벽)
            if (currentHour < 6) {
              return {
                from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
                to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5, 59, 59),
              };
            }
            // 06시 이후에는 오늘 밤 24시(다음날 00시) 퀴즈를 미리 조회
            return {
              from: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0),
              to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 5, 59, 59),
            };

          default:
            throw new Error(`Invalid time slot: ${slot}`);
        }
      };

      const timeRange = getTimeRange(timeSlot);
      from = timeRange.from;
      to = timeRange.to;

      // from이 to보다 늦으면 안됨
      if (from.getTime() > to.getTime()) {
        throw new Error("시작 시간이 종료 시간보다 늦을 수 없습니다");
      }

      const response = await newsApi.getAllQuizzes({
        scope: "period",
        from: formatKST(from),
        to: formatKST(to),
      });

      if (!response.data || response.data.length === 0) {
        throw new Error(`${timeSlot}시 퀴즈가 없습니다`);
      }

      // startAt 기준으로 내림차순 정렬하여 가장 최신 퀴즈 반환
      const sortedQuizzes = [...response.data].sort((a, b) =>
        new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      );

      return {
        ...response,
        data: sortedQuizzes[0], // 해당 시간대의 가장 최신 퀴즈
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!timeSlot, // timeSlot이 있을 때만 쿼리 실행
  });
};

// 6-2. 최신 퀴즈 조회 (하위 호환성을 위해 유지, 현재 시간대의 퀴즈 반환)
export const useLatestQuiz = () => {
  const getCurrentTimeSlot = (): string => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return "24";
    if (hour >= 6 && hour < 12) return "06";
    if (hour >= 12 && hour < 18) return "12";
    return "18";
  };

  const currentTimeSlot = getCurrentTimeSlot();
  return useQuizByTimeSlot(currentTimeSlot);
};

// 7. 퀴즈 조회 (Quiz 타입 반환)
export const useQuizById = (id: number) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => newsApi.getQuizById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 7. 퀴즈 생성 (summaryId 기반)
export const useGenerateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryId: number) => newsApi.generateQuiz(summaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
};

// 8. 퀴즈 결과 조회
export const useQuizResult = (id: number) => {
  return useQuery({
    queryKey: ["quiz", "result", id],
    queryFn: () => newsApi.getQuizResult(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 9. 퀴즈 답안 제출 (새 API)
export const useSubmitQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      answerData,
    }: {
      id: number;
      answerData: SubmitQuizAnswerRequest;
    }) => newsApi.submitQuizAnswer(id, answerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
};
