interface NewsQuizButtonProps {
  onClick: () => void;
}

export default function NewsQuizButton({ onClick }: NewsQuizButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
               text-white font-bold text-xl py-6 rounded-2xl shadow-lg
               transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      NewsQuiz
    </button>
  );
}
