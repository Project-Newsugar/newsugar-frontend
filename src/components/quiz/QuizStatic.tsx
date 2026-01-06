import { useNavigate } from "react-router-dom";

interface QuizStaticProps {
  correctAnswer: string;
  explanation?: string; // 해설
  isRevealed: boolean;
  showMyPageButton?: boolean; // 마이페이지 버튼 표시 여부
}

export default function QuizStatic({ correctAnswer, explanation, isRevealed, showMyPageButton = false }: QuizStaticProps) {
  const navigate = useNavigate();

  const handleNavigateToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="space-y-6">
      {/* 정답 표시 */}
      {isRevealed ? (
        <div className="p-5 rounded-lg border bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">정답</p>
          <p className="font-medium text-gray-900 mb-2">{correctAnswer}번</p>

          {explanation && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm font-medium text-gray-800 mb-1">해설</p>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg border bg-gray-100 border-gray-300">
          <p className="text-sm text-gray-600 mb-1">정답</p>
          <p className="font-medium text-gray-500">아직 공개되지 않았습니다</p>
        </div>
      )}

      {/* 마이페이지 버튼 */}
      {showMyPageButton && (
        <button
          onClick={handleNavigateToMyPage}
          className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          현재 총점수는? 마이페이지로 이동
        </button>
      )}
    </div>
  );
}
