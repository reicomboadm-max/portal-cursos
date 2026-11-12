import type { Course, Order, StudentUser, SiteSettings, SegmentType } from "@/types";
import { initialCourses, initialOrders, initialSiteSettings } from "@/data/courses";

export const SITE_SETTINGS: SiteSettings = initialSiteSettings;
export const SEGMENTS: { key: SegmentType; label: string; icon: string }[] = [
  { key: "fiscal", label: "Fiscal & Tributário", icon: "🏛️" },
  { key: "policial", label: "Carreiras Policiais", icon: "🛡️" },
  { key: "tribunais", label: "Tribunais & MP", icon: "⚖️" },
  { key: "administrativo", label: "Administrativo & Bancos", icon: "🏢" },
  { key: "disciplinas", label: "Professores & Isoladas", icon: "📚" },
];

export const COURSES: Course[] = initialCourses;

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getCoursesBySegment(segment: string): Course[] {
  return COURSES.filter((c) => c.segment === segment);
}

export function getActiveCourses(): Course[] {
  return COURSES.filter((c) => c.active);
}

export const MOCK_STUDENTS: StudentUser[] = [];

export const MOCK_ORDERS: Order[] = initialOrders;
