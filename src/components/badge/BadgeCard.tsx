import clsx from "clsx";
import { BadgeIcon } from "./BadgeIcon";
import { BADGE_META } from "./badgeMeta";
import type { BadgeId } from "./badgeIds";

interface BadgeCardProps {
  id: BadgeId;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 64, text: "text-xs", gap: "gap-1" },
  md: { icon: 96, text: "text-sm", gap: "gap-2" },
  lg: { icon: 120, text: "text-base", gap: "gap-3" },
};

// S급(전설) 뱃지 리스트: 획득 시 후광 효과를 줄 뱃지들의 ID.
const LEGENDARY_BADGES = [
  "badge-editor-in-chief",   // 편집 국장
  "badge-issue-ai",          // 시사 AI
  "badge-owl-sage",          // 현자 부엉이
  "badge-journalist-award"   // 이달의 기자상
];

export function BadgeCard({ id, earned = false, size = "md", className }: BadgeCardProps) {
  const meta = BADGE_META.find((b) => b.id === id);
  const name = meta?.name ?? "알 수 없음";
  const condition = meta?.condition ?? "";
  const styles = SIZE_MAP[size];
  const isLegendary = LEGENDARY_BADGES.includes(id);

  return (
    <div
      className={clsx(
        "flex flex-col items-center text-center cursor-default select-none group",
        styles.gap,
        className
      )}
      // 툴팁에 획득 여부와 조건을 함께 표시하여 UX 개선
      title={`${name}\n${earned ? "✅ 획득 완료" : `🔒 조건: ${condition}`}`}
    >
      <div className="relative">
        {/* [NEW] S급 뱃지 후광 효과 (획득 시에만 작동) */}
        {earned && isLegendary && (
          <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
        )}

        <BadgeIcon
          id={id}
          size={styles.icon}
          className={clsx(
            "transition-all duration-300 ease-out transform",
            // [NEW] 호버 애니메이션: 둥둥 뜨기 + 그림자 + 확대 효과 적용
            earned 
              ? "group-hover:-translate-y-2 group-hover:scale-105 group-hover:drop-shadow-2xl drop-shadow-md" 
              : "grayscale opacity-50 contrast-75 filter"
          )}
        />
        
        {/* 미획득 시 잠금 아이콘 오버레이 */}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-900/60 text-white rounded-full p-1.5 text-sm backdrop-blur-[2px] shadow-sm">
              🔒
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col z-10">
        <span 
          className={clsx(
            "font-bold leading-tight transition-colors duration-300", 
            styles.text, 
            // 획득 시 호버하면 텍스트 색상도 변경되어 인터랙션 강화
            earned ? "text-gray-800 group-hover:text-indigo-600" : "text-gray-400"
          )}
        >
          {name}
        </span>
        {!earned && (
          <span className="text-[10px] mt-1 font-medium text-gray-400">
            {condition}
          </span>
        )}
      </div>
    </div>
  );
}