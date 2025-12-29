import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestion";
import QuizForm from "./QuizForm";
import QuizResult from "./QuizResult";
import QuizStatic from "./QuizStatic";
import Modal from "../Modal";
import type { QuizData, SubmitQuizAnswerResponse } from "../../types/quiz";
import type { GetUserInfoResponseData } from "../../types/user";
import { useQuizAnswers } from "../../hooks/useQuizQuery";

interface QuizFeedProps {
  quiz: QuizData | undefined;
  quizResult: SubmitQuizAnswerResponse["data"] | null;
  submitAnswer: any; // react-query mutation
  isSolved: boolean;
  setIsSolved: React.Dispatch<React.SetStateAction<boolean>>;
  setQuizResults: React.Dispatch<
    React.SetStateAction<SubmitQuizAnswerResponse["data"] | null>
  >;
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
  const [justSubmitted, setJustSubmitted] = useState(false);
  const navigate = useNavigate();

  // 정답 조회 (퀴즈를 풀었거나 과거 시간대일 때만)
  const shouldFetchAnswers = isSolved || isPastTimeSlot;
  const { data: answersData } = useQuizAnswers(
    shouldFetchAnswers && quiz ? quiz.id : 0
  );

  if (!quiz) return <p>퀴즈를 불러오는 중...</p>;

  // 첫 번째 문제만 사용
  const currentQuestion = quiz.questions[0];

  // 정답 데이터에서 해설 가져오기
  const answerQuestion = answersData?.data?.questions?.[0];

  const handleSubmit = async (answer: string, resetForm: () => void) => {
    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const answerNumber = parseInt(answer); // 1, 2, 3, 4 사용자 입력 (1-base)

    // 답안 제출
    try {
      const result = await submitAnswer.mutateAsync({
        id: quiz.id,
        answerData: {
          userId: userProfile?.id || 1,
          answers: [answerNumber], // 1-base 그대로 전송
        },
      });

      setQuizResults(result.data);
      setIsSolved(true);
      setUserAnswers([answerNumber]); // 1-base 그대로 저장
      setJustSubmitted(true); // 방금 제출했음을 표시
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
            <QuizForm
              onSubmit={handleSubmit}
              options={currentQuestion.options}
            />
          </>
        )}

        {/* 과거 시간대 - 정답 공개 */}
        {isPastTimeSlot && (
          <QuizStatic
            correctAnswer={
              answerQuestion ? answerQuestion.correctIndex.toString() : ""
            }
            explanation={answerQuestion?.explanation}
            isRevealed={isRevealed}
          />
        )}

        {/* 퀴즈 완료 시 결과 */}
        {isSolved && quizResult && (
          <QuizResult
            correctAnswer={
              answerQuestion ? answerQuestion.correctIndex.toString() : ""
            }
            userAnswer={userAnswers[0]}
            isCorrect={
              quizResult.results[quizResult.results.length - 1] === true
            }
            explanation={answerQuestion?.explanation}
            isRevealed={isRevealed}
            justSubmitted={justSubmitted}
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
