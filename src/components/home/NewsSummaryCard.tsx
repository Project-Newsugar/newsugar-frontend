interface NewsSummaryCardProps {
  summary: string;
  isLoading?: boolean;
}

export default function NewsSummaryCard({
  summary,
  isLoading = false,
}: NewsSummaryCardProps) {
  return (
    <div className="bg-white border-l-4 pl-6 py-6" style={{ borderColor: '#5277F1' }}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Brief</h2>
      <p className="text-sm text-gray-500 mb-3">AI 요약</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
      )}
    </div>
  );
}
