import type { GetQuizResultResponse } from "../../types/quiz";
import type { UserStats } from "./badgeLogic";

/**
 * API 응답을 뱃지 로직에 맞는 통계 객체로 변환
 * @param resultData - API에서 받은 data 객체 (total, correct 포함)
 * @param opts - 추가 옵션 (회원 여부 등)
 */
export function toUserStatsFromQuizResult(
  resultData: GetQuizResultResponse["data"] | undefined,
  opts: { isMember: boolean }
): UserStats {
  if (!resultData) {
    return { quizCount: 0, wrongCount: 0, totalScore: 0, isMember: opts.isMember };
  }

  // API의 total, correct가 '누적' 데이터라고 가정
  const total = Number(resultData.total ?? 0);
  const correct = Number(resultData.correct ?? 0);
  const wrong = Math.max(0, total - correct);
  
  // 점수 정책: 1문제 정답 = 1점이라고 가정 (백엔드 로직에 따라 수정 가능)
  const score = correct; 

  return {
    quizCount: total,
    wrongCount: wrong,
    totalScore: score,
    isMember: opts.isMember,
  };
}