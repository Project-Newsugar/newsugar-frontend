// ========== API 명세에 맞춘 타입 ==========

// POST /api/v1/quizzes - 퀴즈 생성 Request
export interface CreateQuizRequest {
  summary_id: number;
  question: string;
  correct_answer: string;
  expires_at?: string; // DATETIME (선택)
  is_revealed: boolean;
}

// POST /api/v1/quizzes - 퀴즈 생성 Response
export interface CreateQuizResponse {
  code: number;
  message: string;
  data: {
    id: number;
    created_at: string;
  };
}

// GET /api/v1/quizzes/{id} - 퀴즈 조회 Response
export interface GetQuizResponse {
  code: number;
  message: string;
  data: {
    id: number;
    question: string;
    correct_answer: string;
    created_at: string;
    expires_at: string;
    is_revealed: boolean;
  };
}

// POST /api/v1/quiz-answers - 답안 제출 Request
export interface SubmitQuizAnswerRequest {
  quiz_id: number;
  user_id: number;
  user_answer: number;
}

// POST /api/v1/quiz-answers - 답안 제출 Response
export interface SubmitQuizAnswerResponse {
  code: number;
  message: string;
  data: {
    id: number;
    quiz_id: number;
    user_id: number;
    user_answer: number;
    is_correct: boolean;
    answered_at: string;
  };
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
