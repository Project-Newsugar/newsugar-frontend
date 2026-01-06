export const BADGE_IDS = {
  // 퀴즈 풀이 (부엉이)
  OWL_BABY: "badge-owl-baby",
  OWL_CURIOUS: "badge-owl-curious",
  OWL_STUDENT: "badge-owl-student",
  OWL_KNOWLEDGE: "badge-owl-knowledge",
  OWL_SAGE: "badge-owl-sage",
  
  // 오답 (실수)
  MISS_ANSWERS: "badge-miss-answers",
  RANDOM_GUESS: "badge-random-guess",
  HUMAN_TOUCH: "badge-human-touch",
  MISUNDERSTANDING: "badge-was-it-misunderstanding",
  NOT_READING_NEWS: "badge-not-reading-news",
  
  // 점수 (성장)
  SPROUT: "badge-sprout",
  READS_NEWS: "badge-reads-news",
  MAJOR: "badge-major",
  WALKING_WIKI: "badge-walking-wiki",
  ISSUE_AI: "badge-issue-ai",
  
  // 기자 등급 (랭크)
  JOURNALIST_TRAINEE: "badge-journalist-trainee",
  JOURNALIST_INTERN: "badge-journalist-intern",
  JOURNALIST_PROBATION: "badge-journalist-probation",
  JOURNALIST_PASSION: "badge-journalist-passion",
  JOURNALIST_SCOOP: "badge-journalist-scoop",
  JOURNALIST_BREAKING: "badge-journalist-breaking",
  JOURNALIST_AWARD: "badge-journalist-award",
  EDITOR_IN_CHIEF: "badge-editor-in-chief",
} as const;

export type BadgeId = (typeof BADGE_IDS)[keyof typeof BADGE_IDS];