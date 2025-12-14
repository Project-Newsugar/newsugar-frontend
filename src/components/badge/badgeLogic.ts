import { BADGE_IDS, type BadgeId } from "./badgeIds";

export interface UserStats {
  quizCount: number;
  wrongCount: number;
  totalScore: number;
  isMember: boolean;
}

// 기자 등급 뱃지 ID 목록 (카운트 제외용 Set)
const DERIVED_JOURNALIST_BADGES = new Set<BadgeId>([
  BADGE_IDS.JOURNALIST_INTERN,
  BADGE_IDS.JOURNALIST_PROBATION,
  BADGE_IDS.JOURNALIST_PASSION,
  BADGE_IDS.JOURNALIST_SCOOP,
  BADGE_IDS.JOURNALIST_BREAKING,
  BADGE_IDS.JOURNALIST_AWARD,
  BADGE_IDS.EDITOR_IN_CHIEF,
]);

function addIf(set: Set<BadgeId>, condition: boolean, id: BadgeId) {
  if (condition) set.add(id);
}

export function getEarnedBadges(stats: UserStats): BadgeId[] {
  const earned = new Set<BadgeId>();

  // 1. 활동 뱃지 (퀴즈풀이, 오답, 점수) 체크
  addIf(earned, stats.quizCount >= 1, BADGE_IDS.OWL_BABY);
  addIf(earned, stats.quizCount >= 5, BADGE_IDS.OWL_CURIOUS);
  addIf(earned, stats.quizCount >= 10, BADGE_IDS.OWL_STUDENT);
  addIf(earned, stats.quizCount >= 50, BADGE_IDS.OWL_KNOWLEDGE);
  addIf(earned, stats.quizCount >= 100, BADGE_IDS.OWL_SAGE);

  addIf(earned, stats.wrongCount >= 5, BADGE_IDS.MISS_ANSWERS);
  addIf(earned, stats.wrongCount >= 10, BADGE_IDS.RANDOM_GUESS);
  addIf(earned, stats.wrongCount >= 20, BADGE_IDS.HUMAN_TOUCH);
  addIf(earned, stats.wrongCount >= 30, BADGE_IDS.MISUNDERSTANDING);
  addIf(earned, stats.wrongCount >= 50, BADGE_IDS.NOT_READING_NEWS);

  addIf(earned, stats.totalScore >= 10, BADGE_IDS.SPROUT);
  addIf(earned, stats.totalScore >= 50, BADGE_IDS.READS_NEWS);
  addIf(earned, stats.totalScore >= 100, BADGE_IDS.MAJOR);
  addIf(earned, stats.totalScore >= 150, BADGE_IDS.WALKING_WIKI);
  addIf(earned, stats.totalScore >= 300, BADGE_IDS.ISSUE_AI);

  // 2. 기본 자격 뱃지 (기자 준비생)
  if (stats.isMember) {
    earned.add(BADGE_IDS.JOURNALIST_TRAINEE);
  }

  // 3. 기자 등급 산정용 '베이스 카운트' 계산
  let baseCount = 0;
  earned.forEach((id) => {
    if (!DERIVED_JOURNALIST_BADGES.has(id)) {
      baseCount++;
    }
  });

  // 4. 기자 등급 부여
  addIf(earned, baseCount >= 2, BADGE_IDS.JOURNALIST_INTERN);
  addIf(earned, baseCount >= 4, BADGE_IDS.JOURNALIST_PROBATION);
  addIf(earned, baseCount >= 6, BADGE_IDS.JOURNALIST_PASSION);
  addIf(earned, baseCount >= 8, BADGE_IDS.JOURNALIST_SCOOP);
  addIf(earned, baseCount >= 10, BADGE_IDS.JOURNALIST_BREAKING);
  addIf(earned, baseCount >= 12, BADGE_IDS.JOURNALIST_AWARD);
  addIf(earned, baseCount >= 15, BADGE_IDS.EDITOR_IN_CHIEF);

  return Array.from(earned);
}