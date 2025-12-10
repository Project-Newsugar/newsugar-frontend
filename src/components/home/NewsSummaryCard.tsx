interface NewsSummaryCardProps {
  summary: string;
  isLoading?: boolean;
  quizSection?: React.ReactNode;
}

export default function NewsSummaryCard({
  summary,
  isLoading = false,
  quizSection,
}: NewsSummaryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Brief</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {summary}
          </p>

          {quizSection && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              {quizSection}
            </div>
          )}
        </>
      )}
    </div>
  );
}
