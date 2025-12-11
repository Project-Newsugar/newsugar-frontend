interface QuizStaticProps {
  correctAnswer: string;
  isRevealed: boolean;
}

export default function QuizStatic({ correctAnswer, isRevealed }: QuizStaticProps) {
  return (
    <div className="space-y-4">
      {/* 정답 표시 */}
      {isRevealed ? (
        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">정답</p>
          <p className="font-medium text-gray-900">{correctAnswer}번</p>
        </div>
      ) : (
        <div className="p-4 rounded-lg border bg-gray-100 border-gray-300">
          <p className="text-sm text-gray-600 mb-1">정답</p>
          <p className="font-medium text-gray-500">아직 공개되지 않았습니다</p>
        </div>
      )}
    </div>
  );
}
