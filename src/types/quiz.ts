// ========== API 명세에 맞춘 타입 ==========

// 퀴즈 문제 구조
export interface QuizQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// 퀴즈 데이터 구조
export interface QuizData {
  id: number;
  title: string;
  questions: QuizQuestion[];
  startAt: string;
  endAt: string;
}

// GET /api/v1/quizzes - 퀴즈 전체 조회 Response
export interface GetAllQuizzesResponse {
  success: boolean;
  code: string;
  message: string;
  data: QuizData[];
  timestamp: string;
}

// GET /api/v1/quizzes/{id} - 단일 퀴즈 조회 Response
export interface GetQuizResponse {
  success: boolean;
  code: string;
  message: string;
  data: QuizData;
  timestamp: string;
}

// GET /api/v1/quizzes/{id}/result - 퀴즈 결과 조회 Response
// total: 어차피 1 (해당 시간의 주요 뉴스에 생성된 퀴즈의 총개수)
// correct: 맞추면 1, 틀리면 0
// results: 맞추면 true, 틀리면 false
export interface GetQuizResultResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    total: number;          // 어차피 1 (해당 시간의 주요 뉴스에 생성된 퀴즈의 총개수)
    correct: number;        // 맞추면 1, 틀리면 0
    results: boolean[];     // 맞추면 true, 틀리면 false
    userId: number;
  };
  timestamp: string;
}

// POST /api/v1/quizzes/summary/{summaryId}/generate - 퀴즈 생성 Request
// Request Body 없음 (summaryId는 URL 파라미터)

// POST /api/v1/quizzes/summary/{summaryId}/generate - 퀴즈 생성 Response
export interface GenerateQuizResponse {
  success: boolean;
  code: string;
  message: string;
  data: QuizData;
  timestamp: string;
}

// POST /api/v1/quizzes/{id}/submit - 답안 제출 Request
export interface SubmitQuizAnswerRequest {
  userId: number;
  answers: number[];
}

// POST /api/v1/quizzes/{id}/submit - 답안 제출 Response
// total: 유저가 푼 전체 퀴즈 개수 (누적)
// correct: 맞춘 문제 개수 (누적)
// results: 각 퀴즈별 정답 여부 배열 (total 개수만큼 존재, true 개수 = correct)
export interface SubmitQuizAnswerResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    total: number;          // 유저가 푼 전체 퀴즈 개수 (누적)
    correct: number;        // 맞춘 문제 개수 (누적)
    results: boolean[];     // 각 퀴즈별 정답 여부 배열
    userId: number;
  };
  timestamp: string;
}

// ========== 기존 타입 (하위 호환용) ==========
// export interface Quiz {
//   id: number;
//   question: string;
//   options: string[];
//   correctAnswer: string;
//   explanation: string;
// }

// export interface QuizSubmission {
//   quizId: number;
//   userAnswer: string;
// }

// export interface QuizResult {
//   isCorrect: boolean;
//   correctAnswer: string;
//   explanation: string;
// }
