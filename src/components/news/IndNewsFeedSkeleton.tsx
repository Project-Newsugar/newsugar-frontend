const IndNewsFeedSkeleton: React.FC = () => {
  return (
    <article className="bg-white border border-gray-200 rounded p-4 flex gap-4 animate-pulse">
      {/* 왼쪽 이미지 스켈레톤 */}
      <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0"></div>

      {/* 오른쪽 텍스트 영역 스켈레톤 */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        {/* 제목 */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded w-5/6"></div>

        {/* 요약 */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>

        {/* 하단 정보 */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-6 bg-gray-200 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </article>
  );
};

export default IndNewsFeedSkeleton;