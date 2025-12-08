import type { ReactNode } from 'react';

interface QuizCardProps {
  children: ReactNode;
}

export default function QuizCard({ children }: QuizCardProps) {
  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        {children}
      </div>
    </div>
  );
}
