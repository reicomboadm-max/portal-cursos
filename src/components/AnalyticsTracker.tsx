"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { useStore } from "@/context/StoreContext";

export function AnalyticsTracker() {
  const { settings } = useStore();

  const gaId = settings.googleAnalyticsId?.trim();
  const pixelId = settings.facebookPixelId?.trim();

  // Internal real-time visitor telemetry
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      let sessionId = sessionStorage.getItem("_cda_sid");
      if (!sessionId) {
        sessionId = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        sessionStorage.setItem("_cda_sid", sessionId);
      }

      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source") || (document.referrer.includes("t.me") ? "Telegram" : document.referrer.includes("google") ? "Google Search" : document.referrer ? "Referrer Externo" : "Direto / Orgânico");

      const payload = {
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        utmSource,
        sessionId,
      };

      // Use sendBeacon if available, otherwise fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", JSON.stringify(payload));
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignora silenciosamente se o navegador bloquear cookies/armazenamento
    }
  }, []);

  return (
    <>
      {/* Google Analytics 4 (GA4) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}

export default AnalyticsTracker;

