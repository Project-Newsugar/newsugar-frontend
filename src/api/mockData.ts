import type { NewsListResponse } from "../types/news";
import type { Quiz } from "../types/quiz";

// 백엔드 API 형식에 맞춘 Mock 뉴스 데이터
export const MOCK_NEWS_LIST: NewsListResponse = {
  content: [
    {
      id: 1,
      title: "오늘의 주요 정치 뉴스",
      summary: "국회에서 중요 법안들이 논의되고 있으며, 여야 간 협상이 활발히 진행되고 있습니다.",
      url: "https://example.com/news/1",
      category: "politics",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "경제 회복세 지속",
      summary: "소비자 신뢰지수가 상승하며 경제 회복세가 가시화되고 있습니다.",
      url: "https://example.com/news/2",
      category: "economy",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "과학기술 분야 혁신",
      summary: "국내 연구진이 차세대 AI 알고리즘을 개발하여 업계의 주목을 받고 있습니다.",
      url: "https://example.com/news/3",
      category: "science-tech",
      publishedAt: new Date().toISOString(),
    },
  ],
  page: 0,
  size: 20,
  totalElements: 3,
};

export const MOCK_QUIZ: Quiz = {
  id: 1,
  question: "오늘의 주요 뉴스를 요약한 서비스의 이름은 무엇일까요?",
  options: ["뉴슈가", "뉴스톡", "데일리뉴스", "뉴스요약"],
  correctAnswer: "뉴슈가",
  explanation:
    '뉴슈가(NewSugar)는 "당신의 뉴스를 더 달콤하게"라는 슬로건으로 주요 뉴스를 간결하게 요약하여 제공하는 서비스입니다. 바쁜 현대인들이 핵심 뉴스를 빠르게 파악할 수 있도록 돕습니다.',
};
