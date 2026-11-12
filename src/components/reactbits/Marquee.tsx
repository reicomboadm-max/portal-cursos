"use client";

import React, { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: string;
  reverse?: boolean;
}

export function Marquee({
  children,
  className = "",
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  gap = "4rem",
  reverse = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const childWidth = contentRef.current.offsetWidth;
      setContentWidth(childWidth);
      setShouldAnimate(childWidth > containerWidth);
    }
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !contentRef.current) return;

    positionRef.current = direction === "left" ? 0 : contentWidth;
    const content = contentRef.current;
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const gapPx = parseFloat(gap.replace("rem", "")) * 16;
    const totalWidth = contentWidth + gapPx;

    const animate = () => {
      if (direction === "left") {
        positionRef.current -= speed / 60;
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current = 0;
        }
      } else {
        positionRef.current += speed / 60;
        if (positionRef.current >= totalWidth) {
          positionRef.current = -totalWidth;
        }
      }
      content.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldAnimate, speed, direction, contentWidth, gap]);

  const handleMouseEnter = () => {
    if (pauseOnHover && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && shouldAnimate) {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const gapPx = parseFloat(gap.replace("rem", "")) * 16;
      const totalWidth = contentWidth + gapPx;

      const animate = () => {
        if (direction === "left") {
          positionRef.current -= speed / 60;
          if (Math.abs(positionRef.current) >= totalWidth) {
            positionRef.current = 0;
          }
        } else {
          positionRef.current += speed / 60;
          if (positionRef.current >= totalWidth) {
            positionRef.current = -totalWidth;
          }
        }
        if (content) {
          content.style.transform = `translateX(${positionRef.current}px)`;
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{
          display: "flex",
          animation: shouldAnimate ? "none" : undefined,
        }}
      >
        <span style={{ paddingRight: gap }}>{children}</span>
        <span style={{ paddingRight: gap }}>{children}</span>
        <span style={{ paddingRight: gap }}>{children}</span>
      </div>
    </div>
  );
}

// Marquee vertical para depoimentos
interface VerticalMarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  gap?: number;
}

export function VerticalMarquee({
  children,
  className = "",
  speed = 30,
  pauseOnHover = true,
  gap = 2,
}: VerticalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const childHeight = contentRef.current.offsetHeight;
      setContentHeight(childHeight);
      setShouldAnimate(childHeight > containerHeight);
    }
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !contentRef.current) return;

    positionRef.current = 0;
    const content = contentRef.current;
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight;
    const gapPx = gap * 16;
    const totalHeight = contentHeight + gapPx;

    const animate = () => {
      positionRef.current -= speed / 60;
      if (Math.abs(positionRef.current) >= totalHeight) {
        positionRef.current = 0;
      }
      content.style.transform = `translateY(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldAnimate, speed, contentHeight, gap]);

  const handleMouseEnter = () => {
    if (pauseOnHover && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && shouldAnimate) {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.offsetHeight;
      const gapPx = gap * 16;
      const totalHeight = contentHeight + gapPx;

      const animate = () => {
        positionRef.current -= speed / 60;
        if (Math.abs(positionRef.current) >= totalHeight) {
          positionRef.current = 0;
        }
        if (content) {
          content.style.transform = `translateY(${positionRef.current}px)`;
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className="flex flex-col whitespace-nowrap will-change-transform"
        style={{
          display: "flex",
          animation: shouldAnimate ? "none" : undefined,
        }}
      >
        <div style={{ paddingBottom: `${gap}rem` }}>{children}</div>
        <div style={{ paddingBottom: `${gap}rem` }}>{children}</div>
        <div style={{ paddingBottom: `${gap}rem` }}>{children}</div>
      </div>
    </div>
  );
}