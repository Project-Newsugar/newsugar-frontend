import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestion";
import QuizForm from "./QuizForm";
import QuizResult from "./QuizResult";
import QuizStatic from "./QuizStatic";
import Modal from "../Modal";
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
  isLoggedIn: boolean;
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
  isLoggedIn,
}: QuizFeedProps) {
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  if (!quiz) return <p>퀴즈를 불러오는 중...</p>;

  // 첫 번째 문제만 사용
  const currentQuestion = quiz.questions[0];

  const handleSubmit = async (answer: string, resetForm: () => void) => {
    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const answerNumber = parseInt(answer); // 1, 2, 3, 4 등 그대로 사용
    const answerIndex = answerNumber - 1; // UI 표시용 인덱스 (0-based)

    // 답안 제출
    try {
      const result = await submitAnswer.mutateAsync({
        id: quiz.id,
        answerData: {
          userId: userProfile?.id || 1,
          answers: [answerNumber], // 1번 선택 시 1을 그대로 전송
        },
      });

      setQuizResults(result.data);
      setIsSolved(true);
      setUserAnswers([answerIndex]); // UI 표시용으로는 인덱스 저장
    } catch (error) {
      console.error("답안 제출 실패", error);
      alert("답안 제출 실패");
    }
  };

  // 현재 문제 정답 표시 여부
  const isRevealed = isSolved || isPastTimeSlot;

  return (
    <>
      <div className="space-y-6">
        {/* 퀴즈 진행 중 */}
        {!isSolved && !isPastTimeSlot && (
          <>
            <QuizQuestion question={currentQuestion.text} />
            <QuizForm onSubmit={handleSubmit} options={currentQuestion.options} />
          </>
        )}

        {/* 과거 시간대 - 정답 공개 */}
        {isPastTimeSlot && (
          <QuizStatic
            correctAnswer={(currentQuestion.correctIndex + 1).toString()}
            explanation={currentQuestion.explanation}
            isRevealed={isRevealed}
          />
        )}

        {/* 퀴즈 완료 시 결과 */}
        {isSolved && quizResult && (
          <QuizResult
            correctAnswer={(currentQuestion.correctIndex + 1).toString()}
            userAnswer={userAnswers[0]}
            isCorrect={quizResult.results[quizResult.results.length - 1] === true}
            explanation={currentQuestion.explanation}
            isRevealed={isRevealed}
          />
        )}
      </div>

      {/* 로그인 필요 모달 */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="로그인 필요"
        content="퀴즈를 풀기 위해서는 로그인이 필요합니다"
        type="alert"
        showActionButton={true}
        actionButtonText="로그인 페이지로 이동"
        onActionButtonClick={() => navigate("/login")}
      />
    </>
  );
}