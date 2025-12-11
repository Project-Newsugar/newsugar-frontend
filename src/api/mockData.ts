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
  code: 200,
  message: "퀴즈 조회 성공",
  data: {
    id: 1,
    question: "오늘의 주요 뉴스를 요약한 서비스의 이름은 무엇일까요?",
    correct_answer: "1",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_revealed: true,
  },
};

// 여러 퀴즈 ID를 위한 Mock 데이터
export const MOCK_QUIZZES: Record<number, GetQuizResponse> = {
  1: MOCK_QUIZ,
  2: {
    code: 200,
    message: "퀴즈 조회 성공",
    data: {
      id: 2,
      question: "경제 뉴스에서 소비자 신뢰지수가 상승한다는 것은 무엇을 의미할까요?",
      correct_answer: "2",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_revealed: true,
    },
  },
  3: {
    code: 200,
    message: "퀴즈 조회 성공",
    data: {
      id: 3,
      question: "AI 알고리즘 개발은 어느 분야의 뉴스일까요?",
      correct_answer: "3",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_revealed: true,
    },
  },
  4: {
    code: 200,
    message: "퀴즈 조회 성공",
    data: {
      id: 4,
      question: "뉴스를 정기적으로 확인하는 것의 장점은 무엇일까요?",
      correct_answer: "2",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_revealed: true,
    },
  },
};
