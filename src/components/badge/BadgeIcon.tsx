import React from "react";
import clsx from "clsx";
import type { BadgeId } from "./badgeIds";

interface BadgeIconProps extends React.SVGProps<SVGSVGElement> {
  id: BadgeId;
  size?: number;
  className?: string;
}

export function BadgeIcon({ id, size = 96, className, ...props }: BadgeIconProps) {
  // SVG Sprite ID 참조 (#badge-owl-baby 등)
  const href = `#${id}`;
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={clsx("block", className)} role="img" {...props}>
      <use href={href} xlinkHref={href} />
    </svg>
  );
}