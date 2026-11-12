"use client";

import React, { useEffect, useRef, useState } from "react";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  gradientColors?: string[];
  shimmerWidth?: number;
}

export function ShinyText({
  text,
  className = "",
  speed = 3,
  gradientColors = ["#6366f1", "#06b6d4", "#a855f7", "#f43f5e", "#22c55e"],
  shimmerWidth = 100,
}: ShinyTextProps) {
  const [position, setPosition] = useState(-shimmerWidth);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const animate = () => {
    const duration = (speed * 1000) / 3; // 3 cycles per speed unit
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = (elapsed % duration) / duration;
      setPosition(-shimmerWidth + progress * (100 + shimmerWidth));
      requestAnimationFrame(tick);
    };
    tick();
  };

  const gradient = gradientColors.join(", ");

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      style={{
        background: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: `${shimmerWidth}% 100%`,
        backgroundPosition: `${position}% 0`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      } as React.CSSProperties}
    >
      {text}
    </span>
  );
}

// Texto com brilho que segue o mouse
interface MagneticTextProps {
  text: string;
  className?: string;
  strength?: number;
  gradientColors?: string[];
}

export function MagneticText({
  text,
  className = "",
  strength = 30,
  gradientColors = ["#6366f1", "#06b6d4", "#a855f7"],
}: MagneticTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.1, y: y * 0.1 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const gradient = gradientColors.join(", ");

  return (
    <span
      ref={ref}
      className={`relative inline-block transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        background: `linear-gradient(135deg, ${gradient})`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
    >
      {text}
    </span>
  );
}

// Texto com efeito de "glitch"
interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: number;
  color?: string;
  glitchColor?: string;
}

export function GlitchText({
  text,
  className = "",
  intensity = 2,
  color = "#ffffff",
  glitchColor = "#06b6d4",
}: GlitchTextProps) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`} style={{ color }}>
      {text}
      {glitch && (
        <>
          <span
            className="absolute inset-0"
            style={{
              color: glitchColor,
              clipPath: "inset(0 0 80% 0)",
              transform: `translateX(${intensity}px)`,
              opacity: 0.8,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute inset-0"
            style={{
              color: glitchColor,
              clipPath: "inset(80% 0 0 0)",
              transform: `translateX(-${intensity}px)`,
              opacity: 0.8,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

// Texto que muda de cor gradualmente
interface ColorShiftTextProps {
  text: string;
  className?: string;
  colors?: string[];
  speed?: number;
}

export function ColorShiftText({
  text,
  className = "",
  colors = ["#6366f1", "#06b6d4", "#a855f7", "#f43f5e", "#22c55e", "#eab308"],
  speed = 4,
}: ColorShiftTextProps) {
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHue((prev) => (prev + 1) % 360);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  const colorIndex = Math.floor((hue / 360) * colors.length) % colors.length;
  const nextColorIndex = (colorIndex + 1) % colors.length;
  const progress = (hue / 360) * colors.length - colorIndex;

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return color1;
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentColor = interpolateColor(colors[colorIndex], colors[nextColorIndex], progress);

  return <span className={className} style={{ color: currentColor }}>{text}</span>;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}