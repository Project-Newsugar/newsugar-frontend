interface QuizHeaderProps {
  onBack: () => void;
}

export default function QuizHeader({ onBack }: QuizHeaderProps) {
  return (
    <>
      <div className="text-center py-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          NewsQuiz
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          뉴스를 읽었다면 퀴즈를 풀어봅시다!
        </p>
      </div>

      <button
        onClick={onBack}
        className="px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-300
                 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm"
      >
        ← 메인으로 돌아가기
      </button>
    </>
  );
}
