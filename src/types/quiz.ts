export interface Quiz {
  id: number;
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuizSubmission {
  quizId: number;
  userAnswer: string;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}
