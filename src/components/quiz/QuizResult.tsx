import { useNavigate } from "react-router-dom";

interface QuizResultProps {
  correctAnswer: string;
  explanation: string;
}

export default function QuizResult({ explanation }: QuizResultProps) {
  const navigate = useNavigate();

  const handleNavigateToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border bg-green-50 border-green-200">
        <p className="mb-2 font-medium text-green-900">✓ 정답입니다!</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
      </div>

      <button
        onClick={handleNavigateToMyPage}
        className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        현재 총점수는? 마이페이지로 이동
      </button>
    </div>
  );
}
