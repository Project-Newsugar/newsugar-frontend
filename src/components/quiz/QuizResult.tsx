import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfettiEffect from "../effects/ConfettiEffect";

interface QuizResultProps {
  correctAnswer: string;
  userAnswer?: number; // 사용자가 선택한 답안 인덱스 (1-based)
  isCorrect: boolean; // 정답 여부
  explanation?: string; // 해설
  isRevealed: boolean;
  justSubmitted: boolean; // 방금 제출했는지 여부
}

export default function QuizResult({
  correctAnswer,
  userAnswer,
  isCorrect,
  explanation,
  isRevealed,
  justSubmitted,
}: QuizResultProps) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  // 방금 제출했고 정답인 경우에만 컨페티 실행
  useEffect(() => {
    if (justSubmitted && isCorrect) {
      setShowConfetti(true);

      // 5초 후 컨페티 효과 종료
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [justSubmitted, isCorrect]);

  const handleNavigateToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <>
      {/* Confetti 효과 - 정답일 때 처음 한 번만 */}
      <ConfettiEffect isActive={showConfetti} duration={5000} />

      <div className="space-y-6">
        {/* 정답/오답 결과 */}
        <div
          className={`p-5 rounded-lg border ${
            isCorrect
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p
            className={`mb-2 font-medium ${
              isCorrect ? "text-green-900" : "text-red-900"
            }`}
          >
            {isCorrect ? "✓ 정답입니다!" : "✗ 틀렸습니다"}
          </p>

          {isRevealed && (
            <div className="space-y-2">
              {userAnswer !== undefined && (
                <p className="text-sm text-gray-700">내 답안: {userAnswer}번</p>
              )}
              <p className="text-sm text-gray-700">정답: {correctAnswer}번</p>
              {explanation && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-1">해설</p>
                  <p className="text-sm text-gray-700">{explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleNavigateToMyPage}
          className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          현재 총점수는? 마이페이지로 이동
        </button>
      </div>
    </>
  );
}
