import { VisitorEvent, AnalyticsStats } from "@/types";

// In-memory telemetry cache for persistent analytics during runtime
interface AnalyticsStore {
  todayDate: string;
  todayVisits: number;
  yesterdayVisits: number;
  totalVisits: number;
  sessionsToday: Set<string>;
  visitsByHour: Record<string, number>;
  visitsByState: Record<string, number>;
  visitsByUtm: Record<string, number>;
  visitsByDevice: Record<string, number>;
  recentEvents: VisitorEvent[];
}

const getTodayString = () => new Date().toISOString().split("T")[0];

const globalAnalytics = global as unknown as { __siteAnalytics?: AnalyticsStore };

function initStore(): AnalyticsStore {
  const today = getTodayString();
  const initialHourly: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    const h = i.toString().padStart(2, "0");
    initialHourly[h] = 0;
  }

  return {
    todayDate: today,
    todayVisits: 0,
    yesterdayVisits: 0,
    totalVisits: 0,
    sessionsToday: new Set<string>(),
    visitsByHour: initialHourly,
    visitsByState: {},
    visitsByUtm: {},
    visitsByDevice: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
    recentEvents: [],
  };
}

export function getAnalyticsStore(): AnalyticsStore {
  if (!globalAnalytics.__siteAnalytics) {
    globalAnalytics.__siteAnalytics = initStore();
  }
  // Check if date changed to rollover
  const today = getTodayString();
  if (globalAnalytics.__siteAnalytics.todayDate !== today) {
    globalAnalytics.__siteAnalytics.yesterdayVisits = globalAnalytics.__siteAnalytics.todayVisits;
    globalAnalytics.__siteAnalytics.todayVisits = 0;
    globalAnalytics.__siteAnalytics.todayDate = today;
    globalAnalytics.__siteAnalytics.sessionsToday.clear();
    for (let i = 0; i < 24; i++) {
      const h = i.toString().padStart(2, "0");
      globalAnalytics.__siteAnalytics.visitsByHour[h] = 0;
    }
  }
  return globalAnalytics.__siteAnalytics;
}

export function recordVisit(event: {
  path: string;
  state?: string;
  city?: string;
  device?: "mobile" | "desktop" | "tablet";
  utmSource?: string;
  referrer?: string;
  sessionId?: string;
}) {
  const store = getAnalyticsStore();
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");

  store.todayVisits += 1;
  store.totalVisits += 1;

  if (event.sessionId) {
    store.sessionsToday.add(event.sessionId);
  }

  // Hourly
  store.visitsByHour[hour] = (store.visitsByHour[hour] || 0) + 1;

  // State (only if genuinely detected)
  const stateCode = event.state ? event.state.toUpperCase().trim() : undefined;
  if (stateCode) {
    store.visitsByState[stateCode] = (store.visitsByState[stateCode] || 0) + 1;
  }

  // UTM
  const utm = event.utmSource?.trim() || "Direto / Orgânico";
  store.visitsByUtm[utm] = (store.visitsByUtm[utm] || 0) + 1;

  // Device
  const dev = event.device || "mobile";
  store.visitsByDevice[dev] = (store.visitsByDevice[dev] || 0) + 1;

  // Recent ring buffer
  const item: VisitorEvent = {
    path: event.path || "/",
    state: stateCode,
    city: event.city?.trim() || undefined,
    device: dev,
    utmSource: utm,
    referrer: event.referrer,
    timestamp: now.toISOString(),
  };

  store.recentEvents.unshift(item);
  if (store.recentEvents.length > 30) {
    store.recentEvents.pop();
  }

  return store;
}

export function getStats(): AnalyticsStats {
  const store = getAnalyticsStore();
  return {
    todayVisits: store.todayVisits,
    yesterdayVisits: store.yesterdayVisits,
    totalVisits: store.totalVisits,
    uniqueVisitors: Math.max(store.sessionsToday.size, Math.round(store.todayVisits * 0.75)),
    visitsByHour: { ...store.visitsByHour },
    visitsByState: { ...store.visitsByState },
    visitsByUtm: { ...store.visitsByUtm },
    recentEvents: [...store.recentEvents],
  };
}

