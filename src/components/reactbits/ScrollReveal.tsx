"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: string;
  origin?: "top" | "bottom" | "left" | "right";
  opacity?: number;
  scale?: number;
  once?: boolean;
  easing?: string;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 800,
  distance = "40px",
  origin = "bottom",
  opacity = 0,
  scale = 1,
  once = true,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasAnimated(true);
            if (once) observer.unobserve(element);
          } else if (!once && hasAnimated) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, hasAnimated]);

  const distanceValue = parseInt(distance.replace("px", ""), 10);
  const transformOrigin = {
    top: `translateY(-${distanceValue}px)`,
    bottom: `translateY(${distanceValue}px)`,
    left: `translateX(-${distanceValue}px)`,
    right: `translateX(${distanceValue}px)`,
  }[origin];

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : opacity,
    transform: isVisible ? `scale(${scale})` : `${transformOrigin} scale(${scale})`,
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

// Staggered reveal para listas
interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  distance?: string;
  origin?: "top" | "bottom" | "left" | "right";
}

export function StaggerReveal({
  children,
  className = "",
  delay = 0,
  stagger = 100,
  duration = 600,
  distance = "30px",
  origin = "bottom",
}: StaggerRevealProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal
          key={index}
          delay={delay + index * stagger}
          duration={duration}
          distance={distance}
          origin={origin}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

// Reveal com efeito de máscara/clip-path
interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "top" | "bottom";
}

export function ClipReveal({
  children,
  className = "",
  delay = 0,
  duration = 1000,
  direction = "left",
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const clipPath = isVisible
    ? "inset(0 0 0 0)"
    : direction === "left"
    ? "inset(0 100% 0 0)"
    : direction === "right"
    ? "inset(0 0 0 100%)"
    : direction === "top"
    ? "inset(100% 0 0 0)"
    : "inset(0 0 100% 0)";

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          clipPath,
          transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}