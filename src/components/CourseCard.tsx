"use client";

import { ChevronRight, Folder, FileText, Play, Download } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const getBadgeStyle = (segment: string) => {
    switch (segment) {
      case "fiscal":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "policial":
        return "text-sky-400 border-sky-500/30 bg-sky-500/10";
      case "tribunais":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "administrativo":
        return "text-purple-400 border-purple-500/30 bg-purple-500/10";
      case "disciplinas":
        return "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
      default:
        return "text-slate-300 border-slate-700 bg-slate-800";
    }
  };

  const getAreaLabel = (segment: string) => {
    switch (segment) {
      case "fiscal":
        return "Área Fiscal";
      case "policial":
        return "Carreira Policial";
      case "tribunais":
        return "Tribunais & MP";
      case "administrativo":
        return "Admin & Bancos";
      case "disciplinas":
        return "Professor VIP";
      default:
        return "Concurso";
    }
  };

  return (
    <article
      className="group relative rounded-2xl border border-slate-800 bg-[#111827] p-6 hover:border-slate-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getBadgeStyle(course.segment)}`}>
            {getAreaLabel(course.segment)}
          </span>
          {course.badge && (
            <span className="ml-auto px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
              {course.badge}
            </span>
          )}
        </div>

        <Link
          href={`/cursos/${course.slug}`}
          className="group-hover:text-emerald-400 transition-colors"
        >
          <h3 className="text-lg font-bold text-white mb-1.5 leading-snug group-hover:underline">{course.title}</h3>
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
        </Link>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-white">R$ {course.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            {course.originalPrice > course.price && (
              <span className="text-xs text-slate-500 line-through">R$ {course.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>{course.totalFiles}</span>
          </div>
          <Link
            href={`/checkout?course=${course.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Comprar Acesso no Drive
          </Link>
        </div>
      </div>
    </article>
  );
}
