import { useState } from "react";

interface QuizFormProps {
  onSubmit: (answer: string, resetForm: () => void) => void;
  isSubmitting?: boolean;
  isLoggedIn?: boolean;
  options: string[];
}

export default function QuizForm({
  onSubmit,
  isSubmitting = false,
  isLoggedIn = true,
  options,
}: QuizFormProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const resetForm = () => {
    setSelectedAnswer("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedAnswer, resetForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">
          답안 (객관식)
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                ${
                  selectedAnswer === option
                    ? "border-[#5277F1] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }
                ${!isLoggedIn || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isSubmitting || !isLoggedIn}
                className="w-4 h-4 text-[#5277F1] focus:ring-[#5277F1]"
                required
              />
              <span className="ml-3 text-gray-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isLoggedIn || !selectedAnswer}
        className={`w-full text-white py-3 px-6 rounded-lg transition-all hover:opacity-90
                 ${!isSubmitting && isLoggedIn && selectedAnswer
                   ? "bg-blue-500"
                   : "bg-gray-300 cursor-not-allowed"}`}
      >
        {!isLoggedIn
          ? "로그인 시 이용할 수 있습니다"
          : isSubmitting
          ? "제출 중..."
          : "정답 확인"}
      </button>
    </form>
  );
}
