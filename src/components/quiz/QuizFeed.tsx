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

  // 정답 조회 (로그인 유저만 API 호출)
  // 로그인 유저: 퀴즈를 풀었거나 과거 시간대일 때 해설 포함된 정답 조회
  // 비로그인 유저: quiz 데이터의 correctIndex만 사용 (API 호출 안 함)
  const shouldFetchAnswers = isLoggedIn && (isSolved || isPastTimeSlot);
  const { data: answersData } = useQuizAnswers(
    shouldFetchAnswers && quiz ? quiz.id : 0,
    shouldFetchAnswers
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

        {/* 과거 시간대 - 비로그인 사용자: 문제와 정답 선택지 표시 (해설은 로그인 필요) */}
        {isPastTimeSlot && !isLoggedIn && (
          <>
            <QuizQuestion question={currentQuestion.text} />
            <QuizForm
              onSubmit={() => {}}
              options={currentQuestion.options}
              readOnly={true}
              preSelectedAnswer={currentQuestion.correctIndex}
            />
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                해설은 로그인 후 확인할 수 있습니다
              </p>
            </div>
          </>
        )}

        {/* 과거 시간대 - 로그인 사용자: 문제, 정답 선택지, 해설 표시 */}
        {isPastTimeSlot && isLoggedIn && (
          <>
            <QuizQuestion question={currentQuestion.text} />
            <QuizForm
              onSubmit={() => {}}
              options={currentQuestion.options}
              readOnly={true}
              preSelectedAnswer={currentQuestion.correctIndex}
            />
            {/* 정답 데이터가 있을 때만 QuizStatic 표시 */}
            {answerQuestion ? (
              <QuizStatic
                correctAnswer={answerQuestion.correctIndex.toString()}
                explanation={answerQuestion?.explanation}
                isRevealed={isRevealed}
                showMyPageButton={true}
              />
            ) : (
              // 정답 데이터가 없을 때는 마이페이지 버튼만 표시
              <button
                onClick={() => navigate("/mypage")}
                className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                현재 총점수는? 마이페이지로 이동
              </button>
            )}
          </>
        )}

        {/* 퀴즈 완료 시 결과 (과거 시간대가 아닐 때만 표시) */}
        {isSolved && quizResult && !isPastTimeSlot && (
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
