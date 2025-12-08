interface QuizResultProps {
  correctAnswer: string;
  explanation: string;
}

export default function QuizResult({ explanation }: QuizResultProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border bg-green-50 border-green-200">
        <p className="mb-2 font-medium text-green-900">✓ 정답입니다!</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
