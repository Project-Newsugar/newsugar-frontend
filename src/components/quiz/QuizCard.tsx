import type { ReactNode } from 'react';

interface QuizCardProps {
  children: ReactNode;
}

export default function QuizCard({ children }: QuizCardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        {children}
      </div>
    </div>
  );
}
