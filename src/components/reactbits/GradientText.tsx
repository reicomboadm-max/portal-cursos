"use client";

import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
  angle?: number;
}

export function GradientText({
  children,
  className = "",
  colors = ["#6366f1", "#06b6d4", "#a855f7", "#ec4899"],
  speed = 3,
  angle = 135,
}: GradientTextProps) {
  const colorStops = colors
    .map((color, i) => `${color} ${(i / (colors.length - 1)) * 100}%`)
    .join(", ");

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(${angle}deg, ${colorStops})`,
    backgroundSize: "300% 300%",
    animationDuration: `${speed}s`,
  };

  return React.createElement(
    "span",
    { className: `inline-block bg-clip-text text-transparent animate-gradient ${className}`, style },
    children
  );
}