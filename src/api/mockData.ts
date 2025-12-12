import type { NewsListResponse } from "../types/news";
import type { GetQuizResponse } from "../types/quiz";

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

// API 응답 형식에 맞춘 Mock 퀴즈 데이터
export const MOCK_QUIZ: GetQuizResponse = {
  success: true,
  code: "200",
  message: "퀴즈 조회 성공",
  data: {
    id: 1,
    title: "오늘의 뉴스 퀴즈",
    questions: [
      {
        text: "오늘의 주요 뉴스를 요약한 서비스의 이름은 무엇일까요?",
        options: ["뉴스플러스", "뉴슈가", "뉴스타임", "데일리뉴스"],
        correctIndex: 1,
        explanation: "뉴슈가는 일일 뉴스를 요약해주는 서비스입니다.",
      },
    ],
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  timestamp: new Date().toISOString(),
};

// 여러 퀴즈 ID를 위한 Mock 데이터
export const MOCK_QUIZZES: Record<number, GetQuizResponse> = {
  1: MOCK_QUIZ,
  2: {
    success: true,
    code: "200",
    message: "퀴즈 조회 성공",
    data: {
      id: 2,
      title: "경제 뉴스 퀴즈",
      questions: [
        {
          text: "경제 뉴스에서 소비자 신뢰지수가 상승한다는 것은 무엇을 의미할까요?",
          options: [
            "물가 하락",
            "소비 심리 개선",
            "실업률 증가",
            "금리 인상",
          ],
          correctIndex: 1,
          explanation: "소비자 신뢰지수 상승은 소비 심리가 개선되었음을 의미합니다.",
        },
      ],
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    timestamp: new Date().toISOString(),
  },
  3: {
    success: true,
    code: "200",
    message: "퀴즈 조회 성공",
    data: {
      id: 3,
      title: "과학기술 뉴스 퀴즈",
      questions: [
        {
          text: "AI 알고리즘 개발은 어느 분야의 뉴스일까요?",
          options: ["정치", "경제", "과학기술", "사회"],
          correctIndex: 2,
          explanation: "AI 알고리즘은 과학기술 분야에 속합니다.",
        },
      ],
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    timestamp: new Date().toISOString(),
  },
  4: {
    success: true,
    code: "200",
    message: "퀴즈 조회 성공",
    data: {
      id: 4,
      title: "오늘의 종합 뉴스 퀴즈",
      questions: [
        {
          text: "오늘 하루 동안 가장 주목받은 뉴스 분야는?",
          options: ["정치", "경제", "과학기술", "모두 해당"],
          correctIndex: 3,
          explanation: "다양한 분야의 뉴스가 고르게 주목받았습니다.",
        },
      ],
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    timestamp: new Date().toISOString(),
  },
};
