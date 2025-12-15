import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizForm from "./QuizForm";
import QuizResult from "./QuizResult";
import QuizStatic from "./QuizStatic";
import type { QuizData, SubmitQuizAnswerResponse } from '../../types/quiz';
import type { GetUserInfoResponseData } from '../../types/user';

interface QuizFeedProps {
  quiz: QuizData | undefined;
  quizResult: SubmitQuizAnswerResponse["data"] | null;
  submitAnswer: any; // react-query mutation
  isSolved: boolean;
  setIsSolved: React.Dispatch<React.SetStateAction<boolean>>;
  setQuizResults: React.Dispatch<React.SetStateAction<SubmitQuizAnswerResponse["data"] | null>>;
  userProfile: GetUserInfoResponseData | undefined;
  isPastTimeSlot: boolean;
}

export default function QuizFeed({
  quiz,
  quizResult,
  submitAnswer,
  isSolved,
  setIsSolved,
  setQuizResults,
  userProfile,
  isPastTimeSlot,
}: QuizFeedProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  if (!quiz) return <p>퀴즈를 불러오는 중...</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSubmit = async (answer: string, resetForm: () => void) => {
    const answerIndex = parseInt(answer) - 1;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);

    // 마지막 문제 아니면 다음 문제로 이동
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetForm();
      return;
    }

    // 마지막 문제라면 답안 제출
    try {
      const result = await submitAnswer.mutateAsync({
        id: quiz.id,
        answerData: {
          userId: userProfile?.id || 1,
          answers: newAnswers,
        },
      });

      setQuizResults(result.data);
      setIsSolved(true);
    } catch (error) {
      console.error("답안 제출 실패", error);
      alert("답안 제출 실패");
    }
  };

  // 현재 문제 정답 표시 여부
  const isRevealed = isSolved || isPastTimeSlot;

  return (
    <div className="space-y-6">
      {/* 퀴즈 진행 중 */}
      {!isSolved && !isPastTimeSlot && (
        <>
          <QuizQuestion question={currentQuestion.text} />
          <QuizForm onSubmit={handleSubmit} />
        </>
      )}

      {/* 과거 시간대 - 정답 공개 */}
      {isPastTimeSlot && (
        <div className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <QuizStatic
              key={idx}
              correctAnswer={(q.correctIndex + 1).toString()}
              explanation={q.explanation}
              isRevealed={isRevealed}
            />
          ))}
        </div>
      )}

      {/* 퀴즈 완료 시 결과 */}
      {isSolved && quizResult && (
        <div className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const userAnswerIndex = userAnswers[idx];
            const isCorrect = quizResult.results[idx] === true;

            return (
              <QuizResult
                key={idx}
                correctAnswer={(q.correctIndex + 1).toString()}
                userAnswer={userAnswerIndex}
                isCorrect={isCorrect}
                explanation={q.explanation}
                isRevealed={isRevealed}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}