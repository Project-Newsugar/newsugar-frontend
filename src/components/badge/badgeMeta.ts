import { BADGE_IDS, type BadgeId } from "./badgeIds";

export type BadgeGroup = "기자등급" | "퀴즈풀이" | "오답" | "점수" ;

export interface BadgeMeta {
  id: BadgeId;
  name: string;
  condition: string;
  group: BadgeGroup;
}

export const BADGE_META: BadgeMeta[] = [
  // 기자 등급 시리즈
  { id: BADGE_IDS.JOURNALIST_TRAINEE, name: "기자 준비생", condition: "회원 가입시", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_INTERN, name: "인턴 기자", condition: "보유 뱃지 2개 이상", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_PROBATION, name: "수습 기자", condition: "보유 뱃지 4개 이상", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_PASSION, name: "열혈 기자", condition: "보유 뱃지 6개 이상", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_SCOOP, name: "단독보도 기자", condition: "보유 뱃지 8개 이상", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_BREAKING, name: "특종 기자", condition: "보유 뱃지 10개 이상", group: "기자등급" },
  { id: BADGE_IDS.JOURNALIST_AWARD, name: "이달의 기자상", condition: "보유 뱃지 12개 이상", group: "기자등급" },
  { id: BADGE_IDS.EDITOR_IN_CHIEF, name: "편집 국장", condition: "보유 뱃지 15개 이상", group: "기자등급" },
  
  // 부엉이 시리즈
  { id: BADGE_IDS.OWL_BABY, name: "아기 부엉이", condition: "첫 문제 풀기", group: "퀴즈풀이" },
  { id: BADGE_IDS.OWL_CURIOUS, name: "호기심 부엉이", condition: "5문제 이상 풀기", group: "퀴즈풀이" },
  { id: BADGE_IDS.OWL_STUDENT, name: "학생 부엉이", condition: "10문제 이상 풀기", group: "퀴즈풀이" },
  { id: BADGE_IDS.OWL_KNOWLEDGE, name: "지식 부엉이", condition: "50문제 이상 풀기", group: "퀴즈풀이" },
  { id: BADGE_IDS.OWL_SAGE, name: "현자 부엉이", condition: "100문제 이상 풀기", group: "퀴즈풀이" },

  // 오답 시리즈
  { id: BADGE_IDS.MISS_ANSWERS, name: "정답만 피해감", condition: "오답 5개 이상", group: "오답" },
  { id: BADGE_IDS.RANDOM_GUESS, name: "찍기실력무엇", condition: "오답 10개 이상", group: "오답" },
  { id: BADGE_IDS.HUMAN_TOUCH, name: "인간미", condition: "오답 20개 이상", group: "오답" },
  { id: BADGE_IDS.MISUNDERSTANDING, name: "오해였나?", condition: "오답 30개 이상", group: "오답" },
  { id: BADGE_IDS.NOT_READING_NEWS, name: "뉴스를 안보나?", condition: "오답 50개 이상", group: "오답" },

  // 점수 시리즈
  { id: BADGE_IDS.SPROUT, name: "남다른 떡잎", condition: "퀴즈 점수 누적 10점 이상", group: "점수" },
  { id: BADGE_IDS.READS_NEWS, name: "뉴스 좀 보는편", condition: "퀴즈 점수 누적 50점 이상", group: "점수" },
  { id: BADGE_IDS.MAJOR, name: "시사 전공자", condition: "퀴즈 점수 누적 100점 이상", group: "점수" },
  { id: BADGE_IDS.WALKING_WIKI, name: "걸어다니는 위키", condition: "퀴즈 점수 누적 150점 이상", group: "점수" },
  { id: BADGE_IDS.ISSUE_AI, name: "시사 AI", condition: "퀴즈 점수 누적 300점 이상", group: "점수" },

];