"use client";

import React, { useState } from "react";
import { getStateFullName } from "@/lib/utils";

interface BrazilMapProps {
  salesByState: Record<string, { count: number; revenue: number; percentage: number }>;
  activeMetric: "revenue" | "sales";
  onSelectState?: (uf: string) => void;
}

// Coordinates calibrated for a 500x500 Brazil map viewBox
const STATE_POINTS: Record<string, { x: number; y: number; label: string }> = {
  RR: { x: 170, y: 55, label: "Roraima" },
  AP: { x: 300, y: 70, label: "Amapá" },
  AM: { x: 120, y: 130, label: "Amazonas" },
  PA: { x: 270, y: 135, label: "Pará" },
  MA: { x: 345, y: 145, label: "Maranhão" },
  PI: { x: 370, y: 180, label: "Piauí" },
  CE: { x: 415, y: 145, label: "Ceará" },
  RN: { x: 445, y: 165, label: "Rio Grande do Norte" },
  PB: { x: 440, y: 180, label: "Paraíba" },
  PE: { x: 425, y: 200, label: "Pernambuco" },
  AL: { x: 440, y: 220, label: "Alagoas" },
  SE: { x: 430, y: 235, label: "Sergipe" },
  BA: { x: 385, y: 240, label: "Bahia" },
  TO: { x: 305, y: 215, label: "Tocantins" },
  MT: { x: 215, y: 240, label: "Mato Grosso" },
  RO: { x: 130, y: 230, label: "Rondônia" },
  AC: { x: 60, y: 230, label: "Acre" },
  GO: { x: 285, y: 290, label: "Goiás" },
  DF: { x: 305, y: 285, label: "Distrito Federal" }, // Highlight central
  MG: { x: 345, y: 325, label: "Minas Gerais" },
  ES: { x: 400, y: 325, label: "Espírito Santo" },
  MS: { x: 235, y: 335, label: "Mato Grosso do Sul" },
  SP: { x: 310, y: 370, label: "São Paulo" },
  RJ: { x: 375, y: 365, label: "Rio de Janeiro" },
  PR: { x: 275, y: 405, label: "Paraná" },
  SC: { x: 290, y: 435, label: "Santa Catarina" },
  RS: { x: 265, y: 465, label: "Rio Grande do Sul" },
};

// Simplified stylized Brazil polygon outline for dark tech dashboards
const BRAZIL_OUTLINE_PATH = 
  "M 150 45 " +
  "Q 220 30 290 60 " +
  "Q 350 90 410 135 " +
  "Q 455 160 460 190 " +
  "Q 450 230 420 270 " +
  "Q 410 320 395 350 " +
  "Q 375 380 330 395 " +
  "Q 310 430 280 485 " +
  "Q 240 480 230 440 " +
  "Q 235 390 205 345 " +
  "Q 185 305 160 270 " +
  "Q 100 260 50 240 " +
  "Q 40 210 85 180 " +
  "Q 100 130 150 45 Z";

export function BrazilMap({ salesByState, activeMetric, onSelectState }: BrazilMapProps) {
  const [hoveredUf, setHoveredUf] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] max-w-[340px] mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      >
        {/* Glow behind the map */}
        <path
          d={BRAZIL_OUTLINE_PATH}
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeOpacity="0.08"
          className="blur-md"
        />

        {/* Brazil Base Silhouette */}
        <path
          d={BRAZIL_OUTLINE_PATH}
          fill="#111624"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
          className="transition-colors duration-300"
        />

        {/* State nodes and connection lines */}
        {Object.entries(STATE_POINTS).map(([uf, pt]) => {
          const stateData = salesByState[uf];
          const hasSales = stateData && (activeMetric === "revenue" ? stateData.revenue > 0 : stateData.count > 0);
          const isHovered = hoveredUf === uf;

          return (
            <g
              key={uf}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredUf(uf)}
              onMouseLeave={() => setHoveredUf(null)}
              onClick={() => onSelectState && onSelectState(uf)}
            >
              {/* Radar pulse effect for active purchasing states */}
              {hasSales && (
                <>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 18 : 12}
                    fill="#10b981"
                    opacity="0.25"
                    className="animate-ping origin-center"
                    style={{ animationDuration: "2.5s" }}
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 10 : 7}
                    fill="#10b981"
                    opacity="0.4"
                  />
                </>
              )}

              {/* State dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hasSales ? (isHovered ? 6 : 4.5) : (isHovered ? 4 : 2.5)}
                fill={hasSales ? "#10b981" : isHovered ? "#ffffff" : "#4b5563"}
                stroke={hasSales ? "#ffffff" : "transparent"}
                strokeWidth={hasSales ? "1.5" : "0"}
                className="transition-all duration-200"
              />

              {/* State abbreviation for active or hovered states */}
              {(hasSales || isHovered) && (
                <text
                  x={pt.x + 8}
                  y={pt.y + 3.5}
                  fontSize={hasSales ? "11" : "9"}
                  fontWeight={hasSales ? "800" : "500"}
                  fill={hasSales ? "#ffffff" : "#9ca3af"}
                  className="pointer-events-none select-none tracking-tight font-mono"
                >
                  {uf}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredUf && (
        <div 
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-[#0b0e17]/95 border border-white/20 text-white shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-2 whitespace-nowrap animate-fade-slide"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold">{getStateFullName(hoveredUf)} ({hoveredUf})</span>
          <span className="text-[11px] text-gray-400 font-mono">
            {salesByState[hoveredUf]
              ? activeMetric === "revenue"
                ? `R$ ${salesByState[hoveredUf].revenue.toFixed(2)} (${salesByState[hoveredUf].percentage}%)`
                : `${salesByState[hoveredUf].count} pedidos (${salesByState[hoveredUf].percentage}%)`
              : "Sem vendas no período"}
          </span>
        </div>
      )}
    </div>
  );
}

