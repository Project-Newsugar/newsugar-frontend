import { useState } from 'react';

interface QuizFormProps {
  onSubmit: (answer: string) => void;
  isSubmitting?: boolean;
}

export default function QuizForm({ onSubmit, isSubmitting = false }: QuizFormProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          답안 (단답형)
        </label>
        <input
          type="text"
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="정답을 입력하세요"
          className="w-full px-5 py-4 border border-gray-200 rounded-lg
                   focus:outline-none focus:border-gray-400
                   transition-colors"
          required
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white py-3 px-6 rounded-lg
                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:opacity-90"
        style={{
          backgroundColor: !isSubmitting ? '#5277F1' : undefined
        }}
      >
        {isSubmitting ? '제출 중...' : '정답 확인'}
      </button>
    </form>
  );
}
