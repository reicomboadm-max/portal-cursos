"use client";

import { ChevronRight, Folder, FileText, Play, Download } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const isCombo = course.segment === "combos";
  const isFiscal = course.segment === "fiscal";

  return (
    <article
      className="group relative rounded-2xl border border-white/10 bg-surface-200 p-6 hover:border-white/30 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
            isCombo 
              ? "text-amber-400 border-amber-500/30 bg-amber-500/10" 
              : isFiscal 
                ? "text-brand-400 border-brand-500/30 bg-brand-500/10" 
                : "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10"
          }`}>
            {isCombo ? "Combo VIP" : isFiscal ? "Fiscal" : "Tribunais"}
          </span>
          {course.badge && (
            <span className="ml-auto px-2 py-1 rounded bg-brand-600/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              {course.badge}
            </span>
          )}
        </div>

        <Link
          href={`/cursos/${course.slug}`}
          className="group-hover:text-brand-400 transition-colors"
        >
          <h3 className="text-xl font-bold text-white mb-1 group-hover:underline">{course.title}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
        </Link>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-white">R$ {course.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            {course.originalPrice > course.price && (
              <span className="text-sm text-gray-500 line-through">R$ {course.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Folder className="w-3 h-3" />
            <span>{course.folderSize}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <FileText className="w-3 h-3" />
            <span>{course.totalFiles}</span>
          </div>
          <Link
            href={`/checkout?course=${course.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-neon"
          >
            <Play className="w-4 h-4" />
            Comprar Agora
          </Link>
        </div>
      </div>
    </article>
  );
}
