import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Header-based geo detection (Vercel automatic geolocation)
    const vercelRegion = req.headers.get("x-vercel-ip-country-region") || "";
    const vercelCity = req.headers.get("x-vercel-ip-city") || "";
    const userAgent = req.headers.get("user-agent") || "";

    const isMobile = /mobile|iphone|ipod|android/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

    const state = (body.state || vercelRegion || "").toUpperCase().trim() || undefined;
    const rawCity = body.city || (vercelCity ? decodeURIComponent(vercelCity) : "");
    const city = rawCity.trim() || undefined;

    recordVisit({
      path: body.path || "/",
      state,
      city,
      device: body.device || device,
      utmSource: body.utmSource,
      referrer: body.referrer,
      sessionId: body.sessionId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

