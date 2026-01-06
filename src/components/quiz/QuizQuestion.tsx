interface QuizQuestionProps {
  question: string;
}

export default function QuizQuestion({ question }: QuizQuestionProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-400 mb-2">문제</p>
      <h3 className="text-gray-900 mb-6 text-lg font-medium leading-relaxed">
        {question}
      </h3>
    </div>
  );
}
