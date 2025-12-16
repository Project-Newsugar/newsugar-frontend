import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateQuiz,
  getAllQuizzes,
  getQuizAnswers,
  getQuizById,
  getQuizResult,
  getQuizStats,
  submitQuizAnswer,
} from "../api/quiz";
import type { SubmitQuizAnswerRequest } from "../types/quiz";

export const useAllQuizzes = () => {
  return useQuery({
    queryKey: ["quiz", "all"],
    queryFn: () => getAllQuizzes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 한국 시간대로 ISO-8601 형식 문자열 생성 (YYYY-MM-DDTHH:mm:ss+09:00)
const formatKST = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
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
                from: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  6,
                  0,
                  0
                ),
                to: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  11,
                  59,
                  59
                ),
              };
            }
            return {
              from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                6,
                0,
                0
              ),
              to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                11,
                59,
                59
              ),
            };

          case "12":
            // 12:00 ~ 17:59
            if (currentHour < 6) {
              return {
                from: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  12,
                  0,
                  0
                ),
                to: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  17,
                  59,
                  59
                ),
              };
            }
            return {
              from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                12,
                0,
                0
              ),
              to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                17,
                59,
                59
              ),
            };

          case "18":
            // 18:00 ~ 23:59
            if (currentHour < 6) {
              return {
                from: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  18,
                  0,
                  0
                ),
                to: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  23,
                  59,
                  59
                ),
              };
            }
            return {
              from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                18,
                0,
                0
              ),
              to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23,
                59,
                59
              ),
            };

          case "24":
            // 00:00 ~ 05:59 (다음날 새벽)
            if (currentHour < 6) {
              return {
                from: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  0,
                  0,
                  0
                ),
                to: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  5,
                  59,
                  59
                ),
              };
            }
            // 06시 이후에는 오늘 밤 24시(다음날 00시) 퀴즈를 미리 조회
            return {
              from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
                0,
                0,
                0
              ),
              to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
                5,
                59,
                59
              ),
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

      // 해당 시간대의 퀴즈 조회
      const response = await getAllQuizzes({
        scope: "period",
        from: formatKST(from),
        to: formatKST(to),
      });

      // 캐싱 - 빈 데이터도 반환하도록
      console.log(`[Quiz Cache] ${timeSlot}시 API 호출 완료:`, {
        dataLength: response.data?.length ?? 0,
        from: formatKST(from),
        to: formatKST(to),
      });
      // 캐싱 - 빈 데이터도 반환하도록

      // 퀴즈가 있으면 가장 최신 퀴즈 반환
      if (response.data && response.data.length > 0) {
        const sortedQuizzes = [...response.data].sort(
          (a, b) =>
            new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        );

        return {
          ...response,
          data: sortedQuizzes[0],
        };
      }

      // 캐싱 - 빈 데이터도 반환하도록
      // 기존
      // 퀴즈가 없으면 에러 (백엔드 스케줄러가 생성할 예정)
      // throw new Error(`${timeSlot}시 퀴즈가 아직 생성되지 않았습니다`);

      // 새로운 거
      // 퀴즈가 없으면 null 반환 (에러를 throw하지 않음으로써 캐싱 가능)
      console.warn(
        `[Quiz Cache] ${timeSlot}시 퀴즈가 아직 생성되지 않았습니다`
      );
      return {
        ...response,
        data: null,
      };
      // 캐싱 - 빈 데이터도 반환하도록
    },
    // 캐싱 기능 설정 전
    // staleTime: 10 * 60 * 1000,

    // 캐싱 기능 사용 시작
    staleTime: Infinity, // 한 번 불러온 퀴즈 데이터는 페이지 새로고침 전까지 계속 사용
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지 (메모리에서 제거되지 않음)
    // 캐싱 기능 사용 끝
    // 아마 지금 캐시 저장될 정보가 없어서..?

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
    queryFn: () => getQuizById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 7. 퀴즈 생성 (summaryId 기반)
export const useGenerateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryId: number) => generateQuiz(summaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
};

// 8. 퀴즈 결과 조회
export const useQuizResult = (id: number, isLoggedIn: boolean) => {
  return useQuery({
    queryKey: ["quiz", "result", id],
    queryFn: async () => {
      try {
        return await getQuizResult(id);
      } catch (error: any) {
        // 404는 아직 퀴즈를 풀지 않은 정상 상태
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!id && isLoggedIn, // 로그인 상태일 때만 활성화
    retry: false, // 재시도 비활성화
    retryOnMount: false, // 마운트 시 재시도 비활성화
    staleTime: Infinity, // 페이지 새로고침 전까지 캐시 유지
    gcTime: 30 * 60 * 1000, // 30분간 메모리 유지
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
    }) => submitQuizAnswer(id, answerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
};

// 10. 퀴즈 통계 조회
export const useQuizStats = () => {
  return useQuery({
    queryKey: ["quiz", "stats"],
    queryFn: () => getQuizStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 11. 최근 활동 내역 조회 (최근 일주일간의 퀴즈 중 푼 것 최대 3개)
export const useRecentQuizActivity = () => {
  return useQuery({
    queryKey: ["quiz", "recentActivity"],
    queryFn: async () => {
      // 일주일 전부터 현재까지의 기간 설정
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // 일주일간의 모든 퀴즈 조회
      const quizzesResponse = await getAllQuizzes({
        scope: "period",
        from: formatKST(weekAgo),
        to: formatKST(now),
      });

      if (!quizzesResponse.data || quizzesResponse.data.length === 0) {
        return [];
      }

      // 각 퀴즈의 결과 확인 (병렬 처리)
      const quizResults = await Promise.all(
        quizzesResponse.data.map(async (quiz) => {
          try {
            const resultResponse = await getQuizResult(quiz.id);

            // 결과가 있으면 (= 퀴즈를 푼 경우)
            if (resultResponse && resultResponse.data) {
              return {
                quizId: quiz.id,
                title: quiz.title,
                startAt: quiz.startAt,
                isCorrect: resultResponse.data.correct > 0, // correct가 1이면 정답, 0이면 오답
                submittedAt: resultResponse.timestamp, // 제출 시간
              };
            }
            return null;
          } catch (error: any) {
            // 404 에러는 퀴즈를 풀지 않은 것이므로 null 반환
            if (error?.response?.status === 404) {
              return null;
            }
            // 다른 에러는 무시
            return null;
          }
        })
      );

      // null이 아닌 것만 필터링 (= 퀴즈를 푼 것만)
      const solvedQuizzes = quizResults.filter((result) => result !== null);

      // 제출 시간 기준으로 정렬 (최신순)
      solvedQuizzes.sort(
        (a, b) =>
          new Date(b!.submittedAt).getTime() - new Date(a!.submittedAt).getTime()
      );

      // 최대 3개만 반환
      return solvedQuizzes.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 12. 퀴즈 정답 조회 (퀴즈 풀고 난 후 정답 확인용)
export const useQuizAnswers = (id: number) => {
  return useQuery({
    queryKey: ["quiz", "answers", id],
    queryFn: () => getQuizAnswers(id),
    enabled: !!id,
    staleTime: Infinity, // 정답은 변하지 않으므로 무한 캐시
  });
};
