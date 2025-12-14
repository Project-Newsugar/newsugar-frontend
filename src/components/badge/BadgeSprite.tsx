import React from "react";
// @ts-ignore
import Sprite from "../../assets/badges.svg?react";

export function BadgeSprite() {
  return (
    <div aria-hidden="true" style={{ width: 0, height: 0, overflow: "hidden", position: "absolute" }}>
      <Sprite />
    </div>
  );
}