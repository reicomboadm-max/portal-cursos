import type { Course, Order, StudentUser, SiteSettings } from "@/types";
import { initialCourses, initialOrders, initialSiteSettings } from "@/data/courses";

export const SITE_SETTINGS: SiteSettings = initialSiteSettings;
export const SEGMENTS: { key: string; label: string; color: string }[] = [
  { key: "fiscal", label: "Fiscal", color: "text-brand-500 border-brand-500/30" },
  { key: "tribunais", label: "Tribunais", color: "text-accent-cyan border-accent-cyan/30" },
  { key: "combos", label: "Combos VIP", color: "text-amber-400 border-amber-500/30" },
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
