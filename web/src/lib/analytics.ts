export const analyticsEvents = [
  "project_planner_started",
  "project_type_selected",
  "project_planner_step_completed",
  "project_planner_completed",
  "lead_form_submitted",
  "phone_clicked",
  "email_clicked",
  "consultation_clicked",
  "project_viewed",
  "service_viewed",
  "guide_downloaded",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

export function track(event: AnalyticsEvent, payload?: Record<string, string | undefined>) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });

  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (gaId && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
