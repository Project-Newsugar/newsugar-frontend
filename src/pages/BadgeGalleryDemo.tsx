import React from 'react';
import { BADGE_META, BadgeCard, BadgeSprite } from '../components/badge';

export default function BadgeGalleryDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* App.tsx에 이미 <BadgeSprite />가 있다면 이 줄은 지우셔도 됩니다.
         혹시 몰라서 여기에도 넣어둡니다. (중복되어도 기능상 큰 문제는 없습니다)
      */}
      <div className="hidden"><BadgeSprite /></div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          🧪 뱃지 디자인 테스트 (Badge Gallery)
        </h1>
        <p className="mb-8 text-gray-500">
          SVG 아이콘, 호버 애니메이션, 잠금 상태가 제대로 보이는지 확인하는 임시 페이지입니다.
        </p>

        {/* --- 섹션 1: 획득했을 때 (Earned) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-green-600 border-b pb-2 flex items-center">
            ✅ 획득 완료 상태 (Earned)
            <span className="ml-2 text-sm font-normal text-gray-400">
              - 마우스를 올려서 호버 효과와 S급 후광을 확인하세요.
            </span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {BADGE_META.map((badge) => (
              <BadgeCard
                key={`earned-${badge.id}`}
                id={badge.id}
                earned={true} // 강제로 획득 상태로 표시
                size="md"
              />
            ))}
          </div>
        </div>

        {/* --- 섹션 2: 못 얻었을 때 (Locked) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 text-red-500 border-b pb-2 flex items-center">
            🔒 미획득 잠금 상태 (Locked)
            <span className="ml-2 text-sm font-normal text-gray-400">
              - 회색조 처리와 자물쇠 아이콘을 확인하세요.
            </span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {BADGE_META.map((badge) => (
              <BadgeCard
                key={`locked-${badge.id}`}
                id={badge.id}
                earned={false} // 강제로 미획득 상태로 표시
                size="md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}