interface QuizStaticProps {
  correctAnswer: string;
  explanation: string;
}

export default function QuizStatic({ correctAnswer, explanation }: QuizStaticProps) {
  return (
    <div className="space-y-4">
      {/* 정답 표시 */}
      <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
        <p className="text-sm text-gray-600 mb-1">정답</p>
        <p className="font-medium text-gray-900">{correctAnswer}</p>
      </div>

      {/* 해설 표시 */}
      <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">해설</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
