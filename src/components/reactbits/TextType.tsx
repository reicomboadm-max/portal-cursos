"use client";

import React, { useState, useEffect, useRef } from "react";

interface TextTypeProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
  loop?: boolean;
  onComplete?: () => void;
}

export function TextType({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1800,
  className = "",
  cursorClassName = "",
  loop = true,
  onComplete,
}: TextTypeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[currentWordIndex % words.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            // Finished typing, pause then start deleting
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentWord.slice(0, currentText.length - 1));
          } else {
            // Finished deleting, move to next word
            setIsDeleting(false);
            const nextIndex = (currentWordIndex + 1) % words.length;
            setCurrentWordIndex(nextIndex);
            
            if (!loop && nextIndex === 0) {
              setCompleted(true);
              onComplete?.();
            }
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span>{currentText}</span>
      <span
        className={`inline-block w-[3px] h-[1em] ml-1 bg-current align-middle animate-pulse ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
}

// Novo componente: Typewriter mais avançado estilo reactbits
interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
  onComplete?: () => void;
}

export function Typewriter({ 
  text, 
  speed = 30, 
  className = "", 
  startDelay = 0,
  onComplete 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || index >= text.length) {
      if (index >= text.length && onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, index + 1));
      setIndex(index + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [index, text, speed, started]);

  return <span className={className}>{displayText}</span>;
}

// Componente de texto com efeito "scramble" / desembaralhar
interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  charset?: string;
  delay?: number;
}

export function ScrambleText({ 
  text, 
  className = "", 
  speed = 30, 
  charset = "!<>-_\\/[]{}—=+*^?#________",
  delay = 0
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      frameRef.current = 0;
      animate();
    }, delay);

    return () => setIsAnimating(false);
  }, [text, delay]);

  const animate = () => {
    if (!isAnimating) return;
    
    const progress = frameRef.current / (text.length * 3);
    if (progress >= 1) {
      setDisplayText(text);
      return;
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charProgress = (frameRef.current - i * 3) / (text.length * 3);
      if (charProgress > 1) {
        result += text[i];
      } else if (charProgress > 0) {
        result += text[i];
      } else {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    
    setDisplayText(result);
    frameRef.current++;
    requestAnimationFrame(animate);
  };

  return <span className={className}>{displayText}</span>;
}

// Componente GradientText melhorado
interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
}

export function GradientText({ 
  children, 
  colors = ["#6366f1", "#06b6d4", "#a855f7", "#f43f5e", "#22c55e"], 
  speed = 3,
  className = ""
}: GradientTextProps) {
  const gradient = colors.join(", ");
  
  return (
    <span
      className={`bg-gradient-to-r ${className} bg-clip-text text-transparent animate-gradient`}
      style={{
        background: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: "300% 300%",
        animationDuration: `${speed}s`,
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

// Componente de texto que aparece letra por letra com efeito wave
interface WaveTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function WaveText({ 
  text, 
  className = "", 
  speed = 0.1,
  delay = 0
}: WaveTextProps) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-wave"
          style={{
            animationDelay: `${delay + i * speed}s`,
            animationDuration: "1.5s",
          } as React.CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Componente de contagem animada (números)
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 2000, 
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ","
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector(`.${className.split(" ")[0] || "countup"}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [className]);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * eased;
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [started, start, end, duration]);

  const formatted = count.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}